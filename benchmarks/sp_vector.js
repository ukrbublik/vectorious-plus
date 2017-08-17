(function() {
  'use strict';

  var Benchmark = require('benchmark'),
      Vectorious = require('../vectorious'),
      nblas = Vectorious.BLAS,
      Vector = Vectorious.Vector,
      Matrix = Vectorious.Matrix,
      SpVector = Vectorious.SpVector,
      suite = new Benchmark.Suite();

  var N = 1024,
      nz = 128,
      d = Vector.random(N),
      s = new SpVector(new Float64Array(nz), new Int32Array(nz), {length: N}),
      sd;

  var val, i, tmp = {};
  for (var x = 0 ; x < nz ; x++) {
    val = Math.random();
    do {
      i = Math.floor(Math.random() * N);
    } while(tmp[i] !== undefined);
    s.data[x] = val;
    s.indx[x] = i;
    tmp[i] = x;
  }
  sd = s.toVector();
  
  console.log('d = Vector.random(' + N + ')');
  console.log('s - SpVector with ' + nz + ' nonzeros');
  console.log('sd - Vector (dense), has same values as s');

  suite
    .add('s.dot(d)', function() { s.dot(d); })
    .add('sd.dot(d)', function() { sd.dot(d); })

    .on('cycle', function (event) { console.log(String(event.target)); })
    .on('complete', function() {
    })
    .run();

}());
