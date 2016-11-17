(function() {
  'use strict';

  var assert = require('assert'),
      Vectorious = require('../vectorious'),
      Vector = Vectorious.Vector,
      Matrix = Vectorious.Matrix,
      SpVector = Vectorious.SpVector;


  describe('SpVector.prototype', function() {
    describe('.add(a)', function() {
        it('should work as expected', function() {
          var a = new SpVector([5], [1], {length: 3});
          var b = new Vector([1, 2, 3], {type: a.type});
          var ans = new Vector([1, 7, 3], {type: a.type});

          assert.deepEqual(ans, a.add(b));
        });
    });
    describe('.dot(a)', function() {
        it('should work as expected', function() {
          var a = new SpVector([5], [1], {length: 3});
          var b = new Vector([1, 2, 3], {type: a.type});
          var ans = 10;

          assert.equal(ans, a.dot(b));
        });
    });
    describe('.toVector()', function() {
        it('should work as expected', function() {
          var a = new SpVector([5], [1], {length: 3});
          var ans = new Vector([0, 5, 0], {type: a.type});

          assert.deepEqual(ans, a.toVector());
        });
    });
  });

})();
