(function () {
  'use strict';

  var Vector = module.exports.Vector = require('./vector'),
      Matrix = module.exports.Matrix = require('./matrix');

  try {
    var nblas = module.exports.BLAS = require('nblas-plus');
    var SpVector = module.exports.SpVector = require('./sp_vector'),
        SpMatrix = module.exports.SpMatrix = require('./sp_matrix');
    var applyBlasOptimizations = require('./applyBlasOptimizations');
    applyBlasOptimizations(Vector, Matrix, nblas);
  } catch (error) {
    console.warn("nblas not included!");
  }
}());
