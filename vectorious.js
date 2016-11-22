(function () {
  'use strict';

  var Vector = require('./vector'),
      Matrix = require('./matrix');
  try {
    var nblas = require('nblas-plus');
    var SpVector = require('./sp_vector'),
        SpMatrix = require('./sp_matrix');
  } catch (error) {
    console.warn("nblas not included!");
    module.exports.Vector = Vector;
    module.exports.Matrix = Matrix;
    return;
  }

  // BLAS optimizations
  Vector.prototype.add =
  Matrix.prototype.add = function (data) {
    if (data.type != this.type)
      throw new Error('types are different');
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
    if (data.type != this.type)
      throw new Error('types are different');
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
    if (vector.type != this.type)
      throw new Error('types are different');
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
    return this.data[nblas.iamax(this.data)];
  };

  Matrix.prototype.multiply = function(matrix, res) {
    if (matrix.type != this.type)
      throw new Error('types are different');
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

  // LAPACK optimizations
  Matrix.solveSquare = function (a, b, x, keepA, ipiv) {
    var isBVector = (b instanceof Vector);
    if (keepA === undefined)
      keepA = true;
    if (a.type != b.type)
      throw new Error('types are different');
    var r1 = a.shape[0],
        c1 = a.shape[1];
    var r2 = isBVector ? b.length : b.shape[0],
        c2 = isBVector ? 1 : b.shape[1];
    if (c1 !== r2)
      throw new Error('shapes are not aligned');
    if (r1 != c1)
      throw new Error('input matrix should be square');

    if (x === undefined)
      x = isBVector ? new Vector(b) : new Matrix(b);
    else if (b != x)
      nblas.BufCopy(x.data, b.data, x.data.byteLength);
    if (ipiv === undefined)
      ipiv = new Int32Array(r1);
    var af = keepA ? new Matrix(a) : a;

    nblas.gesv(af.data, x.data, r1, c2, ipiv);
    return x;
  }

  // luSquare() + luSolveSquare() is slower than solveSquare() by some reason.. (see benchmark)
  Matrix.prototype.luSquare = function (af) {
    var m = this.shape[0],
        n = this.shape[1];
    var ipiv = new Int32Array(Math.min(m, n));
    if (af === undefined)
      af = new Matrix(this);
    nblas.getrf(af.data, ipiv, m, n);
    return [af, ipiv];
  }

  Matrix.luSolveSquare = function (af, ipiv, a, b, x, r, c) {
    var isBVector = (b instanceof Vector);
    var r1 = a.shape[0],
        c1 = a.shape[1];
    var r2 = isBVector ? b.length : b.shape[0],
        c2 = isBVector ? 1 : b.shape[1];
    if (c1 !== r2)
      throw new Error('shapes are not aligned');
    if (r1 != c1)
      throw new Error('input matrix should be square');
    if (x === undefined)
      x = isBVector ? new Vector(null, {type: b.type, length: b.length}) 
        : new Matrix(null, {type: b.type, shape: b.shape});

    nblas.gesvx(a.data, b.data, x.data, r1, c2, af.data, ipiv, 
      nblas.Lapack.Fact.F, undefined, undefined, r, c);
    return x;
  }

  // Other optimizations
  Matrix.prototype.transpose = function (res) {
    var r = this.shape[0],
        c = this.shape[1];
    if (res === undefined)
      res = Matrix.fromTypedArray(new this.type(c * r), [c, r]);
    nblas.TrTo(this.data, res.data, r, c);
    return res;
  };

  Matrix.prototype.transposed = function () {
    var r = this.shape[0],
        c = this.shape[1];
    nblas.TrIp(this.data, r, c);
    this.shape = [c, r];
    return this;
  };

  module.exports.Vector = Vector;
  module.exports.Matrix = Matrix;
  module.exports.SpVector = SpVector;
  module.exports.SpMatrix = SpMatrix;
  module.exports.BLAS = nblas;
}());
