(function() {
  'use strict';

  var assert = require('assert'),
      Vectorious = require('../vectorious'),
      Vector = Vectorious.Vector,
      Matrix = Vectorious.Matrix,
      SpMatrix = Vectorious.SpMatrix;

  if (SpMatrix !== undefined) {
    describe('SpMatrix.prototype', function() {
      describe('.multiply(Vector b)', function() {
        it('should work as expected', function() {
          var a = new SpMatrix();
          a.beginConstruction({shape: [5, 3]});
          a.addEntries(
          	[1.1, 2.2, 3.3, 4.4],
          	[0,   2,   2,   4],
          	[0,   1,   2,   2]
          );
          a.endConstruction();
          var b = new Vector([2, 3, 4], {type: a.type});
          var ans = new Vector([2.2, 0, 19.8, 0, 17.6], {type: a.type});
          var c = a.multiply(b);
      	  c.data = c.data.map(el => el.toFixed(2) );
          assert.deepEqual(ans, c);
          a.destroy();
        });
      });

      describe('.multiply(Matrix b)', function() {
        it('should work as expected', function() {
          var a = new SpMatrix();
          a.beginConstruction({shape: [5, 4]});
          a.addEntries(
          	[31.1, 42.2, 63.3, 74.4, 4.8],
          	[0,    2,    3,    4,    1],
          	[1,    1,    0,    2,    3]
          );
          a.endConstruction();
          var b = new Matrix([
  	        [13.4, 45.2, 82.2],
  	        [61.2, 25.6, 85.7],
  	        [25.9, 46.5, 13.6],
  	        [16.0, 84.3, 2.2]
          ], {type: a.type});
          var ans = new Matrix([
  	        [1903.32, 796.16,  2665.27],
  	        [76.8,    404.64,  10.56],
  	        [2582.64, 1080.32, 3616.54],
  	        [848.22,  2861.16, 5203.26],
  	        [1926.96, 3459.6,  1011.84]
          ], {type: a.type});
          var c = a.multiply(b);
      	  c.data = c.data.map(el => el.toFixed(2) );
          assert.deepEqual(ans, c);
          a.destroy();
        });
      });
    });
  }


})();
