(function () {
  'use strict';

  var Vector = require('./vector'),
      Matrix = require('./matrix');
  try {
    var nblas = require('../nblas-plus'); //todo
  } catch (error) {
    return;
  }

  /**
   * @method constructor
   * @desc Creates a `SpMatrix` from the supplied arguments.
   **/
  function SpMatrix (options) {
    this.type = Matrix.defaultType;
    this.shape = [];
    this.handle = 0;
    this.nz = 0;
  }

  /**
   * Default type for data
   **/
  SpMatrix.defaultType = Float64Array;

  /**
   * 
   **/
  SpMatrix.prototype.beginConstruction = function (options) {
    if (this.handle)
      throw new Error("Handle is already created");
    if (!options.shape)
      throw new Error("No shape specified");
    this.shape = options.shape;
    if (options.type)
      this.type = options.type;
    this.handle = nblas.uscr_begin(this.type == Float64Array, shape[0], shape[1]);
  };

  /**
   * 
   **/
  SpMatrix.prototype.addEntry = function (val, i, j) {
    nblas.uscr_insert_entry(this.handle, val, i, j);
  };

  /**
   * 
   **/
  SpMatrix.prototype.addEntries = function (vals, indx, jndx) {
    var nz = vals.length;
    if (!(vals.length == indx.length == jndx.length))
      throw new Error("Sizes of input arrays diesn't match");
    if (!(vals instanceof this.type))
      throw new Error("Incorrect type of vals array, should match one specified at construction");
    nblas.uscr_insert_entries(this.handle, nz, vals, indx, jndx);
  };

  /**
   * 
   **/
  SpMatrix.prototype.endConstruction = function () {
    nblas.uscr_end(this.handle);
  };

  /**
   * Multiplies sparse matrix `a` and dense matrix/vector `b` of aligned dimensions.
   * this - sparse matrix, size m x n
   * @param {Matrix/Vector} dense matrix n x k or vector with length n
   * @param {Matrix/Vector} res optional, dense matrix with size m x k or 
   *   vector with length m to hold result of product of `a` and `b`
   *    If not present, will be created
   * @returns {Matrix/Vector} dense matrix with size m x k or vector with length m
   *   containing the matrix product of `a` and `b`
   **/
  SpMatrix.prototype.multiply = function (b, res) {
    if (b instanceof Matrix)
      return this.multiplyMatrix(b, res);
    else if (b instanceof Vector)
      return this.multiplyVector(b, res);
    else
      throw new Error("Unsupported type of b");
  }

  /**
   * Multiplies sparse matrix `a` and dense matrix `b` of aligned dimensions.
   * this - sparse matrix, size m x n
   * @param {Matrix} dense matrix, size n x k
   * @param {Matrix} res optional, dense matrix with size m x k 
   *  to hold result of product of `a` and `b`
   *    If not present, will be created
   * @returns {Matrix} resultant dense matrix with size m x k 
   *  containing the matrix product of `a` and `b`
   **/
  SpMatrix.prototype.multiplyMatrix = function (matrix, res) {
    var r1 = this.shape[0],   // rows in this matrix
        c1 = this.shape[1],   // columns in this matrix
        r2 = matrix.shape[0], // rows in multiplicand
        c2 = matrix.shape[1]; // columns in multiplicand
    if (c1 !== r2)
      throw new Error('sizes are not aligned');

    if (res === undefined)
      res = Matrix.fromTypedArray(new this.type(r1 * c2), [r1, c2]);
    nblas.usmm(this.handle, matrix.data, res.data, c2);

    return res;
  };

  /**
   * Multiplies sparse matrix `a` and dense vector `b` of aligned dimensions.
   * this - sparse matrix, size m x n
   * @param {Vector} dense vector, length n
   * @param {Vector} res optional, dense vector with length m 
   *  to hold result of product of `a` and `b`
   *    If not present, will be created
   * @returns {Vector} resultant dense vector with length m 
   *  containing the matrix product of `a` and `b`
   **/
  SpMatrix.prototype.multiplyVector = function (vector, res) {
    var r = this.shape[0],   // rows in this matrix
        c = this.shape[1],   // columns in this matrix
        l = matrix.length;   // length of vector
    if (c !== l)
      throw new Error('sizes are not aligned');

    if (res === undefined)
      res = Vector.fromTypedArray(new this.type(l), l);
    nblas.usmv(this.handle, matrix.data, res.data);

    return res;
  };

  /**
   * 
   **/
  SpMatrix.prototype.destroy = function () {
    nblas.usds(this.handle);
    this.handle = 0;
    this.nz = 0;
    this.shape = [];
  };

  module.exports = SpMatrix;
  try {
    window.SpMatrix = SpMatrix;
  } catch (e) {}
}());
