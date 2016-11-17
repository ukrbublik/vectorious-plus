(function () {
  'use strict';

  var Vector = require('./vector'),
      Matrix = require('./matrix');
  try {
    var nblas = require('nblas-plus');
  } catch (error) {
    return;
  }  

  /**
   * @method constructor
   * @desc Creates a `SpVector` from the supplied arguments.
   **/
  function SpVector (data, indx, options) {
    this.type = SpVector.defaultType;
    if (options && options.type)
      this.type = options.type;
    this.length = 0;
    if (options && options.length > 0)
      this.length = options.length;
    this.data = null; //Float64Array or Float32Array
    this.indx = null; //Int32Array

    if (data instanceof SpVector) {
      //copy
      var v = data;
      this.data = new data.type(v.data);
      this.indx = new Int32Array(v.indx);
      this.type = v.type;
      this.length = v.length;
    } else if (data instanceof Array && indx instanceof Array) {
      //convert to typed array
      this.data = new this.type(data);
      this.indx = new Int32Array(indx);
    } else if (data && data.buffer && data.buffer instanceof ArrayBuffer) {
      //assign
      this.data = data;
      if (indx instanceof Array)
        this.indx = new Int32Array(indx);
      else
        this.indx = indx;
      this.type = data.constructor;
    } else if(!data && !indx && this.length > 0) {
      //create empty
      this.data = new this.type(this.length);
    }
  }

  /**
   * Default type for data
   **/
  SpVector.defaultType = Float64Array;

  /**
   * Performs dot multiplication with current sparse vector and dense `vector`
   * @param {Vector} vector, dense vector
   * @returns {Number} the dot product of the two vectors
   **/
  SpVector.prototype.dot = function (vector) {
    if (vector.type != this.type)
      throw new Error('types are different');
    var res = nblas.usdot(this.data, this.indx, vector.data);
    return res;
  };

  /**
   * Adds dense `vector` to the current sparse vector.
   * @param {Vector} vector, dense vector
   * @returns {Vector} updated dense vector
   **/
  SpVector.prototype.add = function (vector) {
    if (vector.type != this.type)
      throw new Error('types are different');
    nblas.usaxpy(this.data, this.indx, vector.data, +1);
    return vector;
  };

  /**
   * Subtracts dense `vector` from the current sparse vector.
   * @param {Vector} vector, dense vector
   * @returns {Vector} updated dense vector
   **/
  SpVector.prototype.subtract = function (vector) {
    if (vector.type != this.type)
      throw new Error('types are different');
    nblas.usaxpy(this.data, this.indx, vector.data, -1);
    return vector;
  };

  /**
   * Converts current sparse vector to dense vector
   * @returns {Vector} dense vector
   */
  SpVector.prototype.toVector = function() {
    if (this.length) {
      var dv = new Vector(new this.type(this.length));
      nblas.ussc(this.data, this.indx, dv.data);
      return dv;
    }
    return null;
  };

  module.exports = SpVector;
  try {
    window.SpVector = SpVector;
  } catch (e) {}
}());