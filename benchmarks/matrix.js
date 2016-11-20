(function() {
  'use strict';

  var Benchmark = require('benchmark'),
      Matrix = require('../vectorious').Matrix,
      Vector = require('../vectorious').Vector,
      suite = new Benchmark.Suite();

  var N = 128,
      a = Matrix.random(N, N),
      b = Matrix.random(N, N),
      rhs = Matrix.random(N, 1);

  var tmp = a.luSquare();
  var af = tmp[0],
    ipiv = tmp[1];
  var x = new Matrix(rhs);

  console.log('a, b = Matrix.random(' + N + ', ' + N + ')');

  suite
    .add('Matrix.random(' + N + ', ' + N + ')', function () { Matrix.random(N, N); })
    .add('Matrix.randomNormal(' + N + ', ' + N + ')', function () { Matrix.randomNormal(N, N); })
    .add('Matrix.identity(' + N + ')', function () { Matrix.identity(N); })
    .add('Matrix.magic(' + N + ')', function () { Matrix.magic(N); })
    .add('Matrix.zeros(' + N + ', ' + N + ')', function () { Matrix.zeros(N, N); })
    .add('Matrix.ones(' + N + ', ' + N + ')', function () { Matrix.ones(N, N); })
    .add('Matrix.plu(a)', function () { Matrix.plu(a); })
    .add('Matrix.augment(a, b)', function () { Matrix.augment(a, b); })
    .add('Matrix.add(a, b)', function () { Matrix.add(a, b); })
    .add('Matrix.subtract(a, b)', function () { Matrix.subtract(a, b); })
    .add('Matrix.scale(Math.random())', function () { Matrix.scale(a, Math.random()); })
    .add('Matrix.luSolveSquare(af, ipiv, a, rhs)', function () {
      Matrix.luSolveSquare(af, ipiv, a, rhs);
    })
    .add('Matrix.solveSquare(a, rhs)', function () { Matrix.solveSquare(a, rhs); })
    .add('Matrix.solveSquare(a, rhs, x)', function () { Matrix.solveSquare(a, rhs, x); })
    .add('a.add(b)', function () { a.add(b); })
    .add('a.subtract(b)', function () { a.subtract(b); })
    .add('a.scale(Math.random())', function () { a.scale(Math.random()); })
    .add('a.multiply(b)', function () { a.multiply(b); })
    .add('a.transpose()', function () { a.transpose(); })
    .add('a.transposed()', function () { a.transposed(); })
    .add('a.gauss()', function () { a.gauss(); })
    .add('a.lu()', function () { a.lu(); })
    .add('a.plu()', function () { a.plu(); })
    .add('a.solve(rhs)', function () { a.solve(rhs); })
    .add('a.trace()', function () { a.trace(); })
    .add('a.swap(i, j)', function () { a.swap(Math.floor(Math.random() * N), Math.floor(Math.random() * N)); })
    .on('cycle', function (event) { console.log(String(event.target)); })
    .run();
}());
