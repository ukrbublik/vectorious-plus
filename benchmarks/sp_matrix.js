(function() {
  'use strict';

  var Benchmark = require('benchmark'),
      Vectorious = require('../vectorious'),
      Vector = Vectorious.Vector,
      Matrix = Vectorious.Matrix,
      SpMatrix = Vectorious.SpMatrix,
      suite = new Benchmark.Suite();

  var N = 512,
      nz = 128,
      d = Matrix.random(N, N),
      s = new SpMatrix(),
      s1 = new SpMatrix(),
      sd = new Matrix(new Float64Array(N*N), {shape: [N, N]});

  s.beginConstruction({shape: [N, N]});
  var val, i, j, tmp = {};
  for (var x = 0 ; x < nz ; x++) {
    val = Math.random();
    do {
      i = Math.floor(Math.random() * N);
      j = Math.floor(Math.random() * N);
    } while(tmp[i+','+j] !== undefined);
    s.addEntry(val, i, j);
    sd.set(i, j, val);
    tmp[i+','+j] = x;
  }
  s.endConstruction();

  console.log('d = Matrix.random(' + N + ', ' + N + ')');
  console.log('s - SpMatrix ' + N + ' x ' + N + ' with ' + nz + ' nonzeros');
  console.log('sd - Matrix (dense), has same values as s');

  suite
    .add('SpMatrix creation one-by-one', function() {
      s1.beginConstruction({shape: [N, N]});
      var val, i, j;
      for (var x = 0 ; x < nz ; x++) {
        val = Math.random();
        i = Math.random() * N;
        j = Math.random() * N;
        s1.addEntry(val, i, j);
      }
      s1.endConstruction();
      s1.destroy();
    })
    .add('SpMatrix creation from array of entries', function() {
      s1.beginConstruction({shape: [N, N]});
      var vals = new Float64Array(nz),
        indx = new Int32Array(nz),
        jndx = new Int32Array(nz);
      var val, i, j;
      for (var x = 0 ; x < nz ; x++) {
        val = Math.random();
        i = Math.random() * N;
        j = Math.random() * N;
        vals[x] = val;
        indx[x] = i;
        jndx[x] = j;
      }
      s1.addEntries(vals, indx, jndx);
      s1.endConstruction();
      s1.destroy();
    })
    .add('SpMatrix creation by rows', function() {
      s1.beginConstruction({shape: [N, N]});
      var rows = 8;
      var vals = new Float64Array(nz / rows),
        jndx = new Int32Array(nz / rows);
      var val, j;
      for (var r = 0 ; r < rows ; r++) {
        for (var x = 0 ; x < nz / rows ; x++) {
          val = Math.random();
          j = Math.random() * N;
          vals[x] = val;
          jndx[x] = j;
        }
        s1.addRow(r, vals, jndx);
      }
      s1.endConstruction();
      s1.destroy();
    })
    .add('s.multiply(d)', function() { s.multiply(d); }) //faster
    .add('sd.multiply(d)', function() { sd.multiply(d); })

    .on('cycle', function (event) { console.log(String(event.target)); })
    .on('complete', function() {
      s.destroy();
    })
    .run();

}());
