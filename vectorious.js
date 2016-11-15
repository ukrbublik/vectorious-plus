(function () {
  'use strict';

  var Vector = require('./vector'),
      Matrix = require('./matrix');
  try {
    var nblas = require('nblas-plus');
  } catch (error) {
    module.exports.Vector = Vector;
    module.exports.Matrix = Matrix;
    return;
  }

  // BLAS optimizations
  Vector.prototype.add =
  Matrix.prototype.add = function (data) {
    var l1 = this instanceof Vector ? this.length : this.shape[0] * this.shape[1],
        l2 = data instanceof Vector ? data.length : data.shape[0] * data.shape[1];
    if (l1 !== l2)
      throw new Error('sizes do not match!');
    if (!l1 && !l2)
      return this;

    nblas.axpy(data.data, this.data);
    return this;
  };

  Vector.prototype.subtract =
  Matrix.prototype.subtract = function (data) {
    var l1 = this instanceof Vector ? this.length : this.shape[0] * this.shape[1],
        l2 = data instanceof Vector ? data.length : data.shape[0] * data.shape[1];
    if (l1 !== l2)
      throw new Error('sizes do not match!');
    if (!l1 && !l2)
      return this;

    nblas.axpy(data.data, this.data, -1);
    return this;
  };

  Vector.prototype.scale =
  Matrix.prototype.scale = function (scalar) {
    nblas.scal(this.data, scalar);
    return this;
  };

  Vector.prototype.dot = function (vector) {
    if (this.length !== vector.length)
      throw new Error('sizes do not match!');

    return nblas.dot(this.data, vector.data);
  };

  Vector.prototype.magnitude = function () {
    if (!this.length)
      return 0;

    return nblas.nrm2(this.data);
  };

  Vector.prototype.max = function() {
    return this.data[nblas.idamax(this.length, this.data, 1)];
  };

  Matrix.prototype.multiply = function(matrix, res) {
    var r1 = this.shape[0],
        c1 = this.shape[1],
        r2 = matrix.shape[0],
        c2 = matrix.shape[1];
    if (res === undefined)
      res = Matrix.fromTypedArray(new this.type(r1 * c2), [r1, c2]);

    if (c1 !== r2)
      throw new Error('sizes do not match');

    nblas.gemm(this.data, matrix.data, res.data, r1, c2, c1);
    return res;
  };

  Vector.prototype.solvedSquare = Matrix.prototype.solvedSquare = function (a) {
    var r1 = a.shape[0],
        c1 = a.shape[1];
    var r2 = this instanceof Vector ? this.length : this.shape[0],
        c2 = this instanceof Vector ? 1 : this.shape[1];
    if (c1 !== r2)
      throw new Error('shapes are not aligned');
    if (r1 != c1)
      throw new Error('input matrix should be square');
    nblas.gesv(a.data, this.data, r1, c2);
    return this;
  }

  /*
  Matrix.prototype.transpose = function () {
    var r = this.shape[0],
        c = this.shape[1];
    var b = Matrix.fromTypedArray(new this.type(c * r), [c, r]);
    nblas.TrTo(this.data, b.data, r, c);
    return b;
  };
  */

  Matrix.prototype.transposed = function () {
    var r = this.shape[0],
        c = this.shape[1];
    nblas.TrIp(this.data, r, c);
    this.shape = [c, r];
    return this;
  };

  module.exports.Vector = Vector;
  module.exports.Matrix = Matrix;
  module.exports.BLAS = nblas;
}());
