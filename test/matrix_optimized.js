(function() {
  'use strict';

  var vectorious = require('../vectorious'),
      assert = require('assert'),
      Matrix = vectorious.Matrix,
      Vector = vectorious.Vector;

  describe('Matrix (optimized)', function() {
    describe('Matrix.add(a, b)', function() {
      it('should work as the static equivalent of a.add(b)', function() {
        var a = new Matrix([[1, 1, 1]]);
        var b = new Matrix([[1, 2, 3]]);

        assert.deepEqual(new Matrix(a).add(b), Matrix.add(a, b));
      });
    });

    describe('Matrix.subtract(a, b)', function() {
      it('should work as the static equivalent of a.subtract(b)', function() {
        var a = new Matrix([[1, 1, 1]]);
        var b = new Matrix([[1, 2, 3]]);

        assert.deepEqual(new Matrix(a).subtract(b), Matrix.subtract(a, b));
      });
    });

    describe('Matrix.multiply(a, b)', function() {
      it('should work as the static equivalent of a.multiply(b)', function() {
        var a = new Matrix([[1], [2], [3]]);
        var b = new Matrix([[1, 1, 1]]);

        assert.deepEqual(new Matrix(a).multiply(b), Matrix.multiply(a, b));
      });
    });

    describe('Matrix.solveSquare(a, b)', function() {
      it('should work as expected for b - Vector', function() {
        // 2*2 x 2*1 = 2*1
        var a = new Matrix([[1, 2], [3, 4]]);
        var ans = new Vector([5, 6], {type: a.type});
        var b = new Vector([17, 39], {type: a.type});
        var x = Matrix.solveSquare(a, b);
        for (var i = 0 ; i < x.data.length ; i++) {
          x.data[i] = x.data[i].toFixed(2);
        }
        assert.deepEqual(x, ans);
      });

      it('should work as expected for a,b - matrix', function() {
        // 2*2 x 2*2 = 2*2, A and B modified
        var a = new Matrix([[1, 2], [3, 4]]);
        var ans = new Matrix([[5, 6], [7, 8]]);
        var b = new Matrix([[19, 22], [43, 50]]);
        var a_copy = new Matrix(a);
        var b_copy = new Matrix(b);
        var x = b;
        Matrix.solveSquare(a, b, x, false);
        for (var i = 0 ; i < x.data.length ; i++) {
          x.data[i] = x.data[i].toFixed(2);
        }
        assert.deepEqual(x, ans);
        assert.notDeepEqual(a, a_copy);
        assert.notDeepEqual(b, b_copy);

        // 5*5 x 5*3 = 5*3, A and B not modified
        var a = new Float64Array([
          6.80,   -6.05,  -0.45,   8.32,  -9.67, 
          -2.11,  -3.30,   2.58,   2.71,  -5.14, 
          5.66,    5.36,  -2.70,   4.35,  -7.26,
          5.97,   -4.44,   0.27,  -7.17,   6.08,
          8.23,    1.08,   9.04,   2.14,  -6.87
        ]);
        var b = new Float64Array([
          4.02,   -1.56,   9.81,
          6.19,    4.00,  -4.09,
          -8.22,  -8.67,  -4.57,
          -7.57,   1.75,  -8.61,
          -3.03,   2.86,   8.99
        ]);
        var ans = new Float64Array([
          -0.80,  -0.39,   0.96,
          -0.70,  -0.55,   0.22,
          0.59,    0.84,   1.90,
          1.32,   -0.10,   5.36,
          0.57,    0.11,   4.04
        ]);
        var A = new Matrix(a, {shape: [5, 5]});
        var B = new Matrix(b, {shape: [5, 3]});
        var ANS = new Matrix(ans, {shape: [5, 3]});
        var A_copy = new Matrix(A);
        var B_copy = new Matrix(B);

        var X = Matrix.solveSquare(A, B);
        for (var i = 0 ; i < X.data.length ; i++) {
          X.data[i] = X.data[i].toFixed(2);
        }
        assert.deepEqual(X, ANS);
        assert.deepEqual(A, A_copy);
        assert.deepEqual(B, B_copy);
      });
    });

    describe('Matrix.pluSquare() + Matrix.luSolveSquare()', function() {
      it('should work same as solveSquare()', function() {
        // 5*5 x 5*3 = 5*3
        var a = new Float64Array([
          6.80,   -6.05,  -0.45,   8.32,  -9.67, 
          -2.11,  -3.30,   2.58,   2.71,  -5.14, 
          5.66,    5.36,  -2.70,   4.35,  -7.26,
          5.97,   -4.44,   0.27,  -7.17,   6.08,
          8.23,    1.08,   9.04,   2.14,  -6.87
        ]);
        var b = new Float64Array([
          4.02,   -1.56,   9.81,
          6.19,    4.00,  -4.09,
          -8.22,  -8.67,  -4.57,
          -7.57,   1.75,  -8.61,
          -3.03,   2.86,   8.99
        ]);
        var ans = new Float64Array([
          -0.80,  -0.39,   0.96,
          -0.70,  -0.55,   0.22,
          0.59,    0.84,   1.90,
          1.32,   -0.10,   5.36,
          0.57,    0.11,   4.04
        ]);
        var A = new Matrix(a, {shape: [5, 5]});
        var B = new Matrix(b, {shape: [5, 3]});
        var ANS = new Matrix(ans, {shape: [5, 3]});
        var A_copy = new Matrix(A);
        var B_copy = new Matrix(B);

        var plu = A.luSquare();
        var X = Matrix.luSolveSquare(plu[0], plu[1], A, B);
        for (var i = 0 ; i < X.data.length ; i++) {
          X.data[i] = X.data[i].toFixed(2);
        }
        assert.deepEqual(X, ANS);
        assert.deepEqual(A, A_copy);
        assert.deepEqual(B, B_copy);
      });
    });

    describe('Matrix.prototype', function() {
      describe('.add()', function() {
        it('should throw error when sizes do not match', function() {
          var a = new Matrix([[1, 2], [3, 4]]);
          var b = new Matrix([[1, 2]]);

          assert.throws(a.add.bind(a, b), Error);
        });

        it('should work as expected', function() {
          var a = new Matrix([[1, 2], [3, 4]]);
          var b = new Matrix([[5, 6], [7, 8]]);
          var c = new Matrix([[6, 8], [10, 12]]);

          assert.deepEqual(c, a.add(b));
        });
      });

      describe('.subtract()', function() {
        it('should throw error when sizes do not match', function() {
          var a = new Matrix([[1, 2], [3, 4]]);
          var b = new Matrix([[1, 2]]);

          assert.throws(a.subtract.bind(a, b), Error);
        });

        it('should work as expected', function() {
          var a = new Matrix([[1, 2], [3, 4]]);
          var b = new Matrix([[5, 6], [7, 8]]);
          var c = new Matrix([[-4, -4], [-4, -4]]);

          assert.deepEqual(c, a.subtract(b));
        });
      });

      describe('.scale()', function() {
        it('should work as expected', function() {
          var a = new Matrix([[1, 2], [3, 4]]);
          var b = new Matrix([[2, 4], [6, 8]]);

          assert.deepEqual(b, a.scale(2));
        });
      });

      describe('.multiply()', function() {
        it('should throw error if sizes do not match', function() {
          var a = new Matrix([[1, 2], [3, 4]]);
          var b = new Matrix([[1, 2]]);

          assert.throws(a.multiply.bind(a, b), Error);
        });

        it('should work as expected', function() {
          var a = new Matrix([[1, 2]]);
          var b = new Matrix([[1], [2]]);
          var c = new Matrix([[5]]);
          var d = new Matrix([[1, 2], [2, 4]]);

          var e = new Matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
          var f = new Matrix([[ 30,  36,  42], [ 66,  81,  96], [102, 126, 150]]);

          var g = new Matrix([[0,1,0], [1,0,0], [0,0,1]]);
          var h = new Matrix([[1,3,5], [2,4,7], [1,1,0]]);
          var i = new Matrix([[2, 4, 7], [1, 3, 5], [1, 1, 0]]);

          assert.deepEqual(c, a.multiply(b));
          assert.deepEqual(d, b.multiply(a));
          assert.deepEqual(f, e.multiply(e));
          assert.deepEqual(i, g.multiply(h));
        });
      });

      describe('.plu()', function() {
        it('should work as expected', function() {
          var a = new Matrix([[1, 3, 5], [2, 4, 7], [1, 1, 0]]);
          var b = new Matrix([[2, 4, 7], [0.5, 1, 1.5], [0.5, -1, -2]]);
          var ipiv = new Int32Array([1, 1, 2]);

          var plu = a.plu();
          assert.deepEqual(ipiv, plu.pop());
          assert.deepEqual(b, plu.pop());
        });
      });

      describe('.lusolve()', function() {
        it('should work as expected', function() {
          var a = new Matrix([[1, 3, 5], [2, 4, 7], [1, 1, 0]]);
          var rhs = new Matrix([[1], [3], [5]]);
          var x = new Matrix([[3.25], [1.75], [-1.5]]);

          var plu = a.plu(),
              lu = plu[0],
              ipiv = plu[1];

          lu.lusolve(rhs, ipiv);
          assert.deepEqual(x, rhs);
        });
      });

      describe('.transpose()', function() {
        var a = new Matrix([[1, 2]]);
        var b = new Matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
        var c = new Matrix([[1], [2]]);
        var d = new Matrix([[1, 4, 7], [2, 5, 8], [3, 6, 9]]);
        var e = new Matrix.random(20, 20);

        it('should work as expected', function() {

          assert.deepEqual(a, c.T);
          assert.deepEqual(c, a.T);

          assert.deepEqual(b, d.T);
          assert.deepEqual(d, b.T);

          assert.deepEqual(e, e.T.T);
        });
      });

      describe('.transposed()', function() {
        var a = new Matrix([[1, 2]]);
        var b = new Matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
        var c = new Matrix([[1], [2]]);
        var d = new Matrix([[1, 4, 7], [2, 5, 8], [3, 6, 9]]);
        var e = new Matrix.random(20, 20);

        it('should work as expected', function() {

          assert.deepEqual(a, c.transposed());
          assert.deepEqual(c, c.transposed().transposed());

          assert.deepEqual(b, d.transposed());
          assert.deepEqual(d, b.transposed().transposed());

          assert.deepEqual(e, e.transposed().transposed());
        });
      });

    });
  });
})();
