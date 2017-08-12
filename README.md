![vectorious](https://github.com/mateogianolio/vectorious/raw/master/logo.gif)

![version](https://img.shields.io/npm/v/vectorious-plus.svg?style=flat&label=version) ![travis](https://img.shields.io/travis/ukrbublik/vectorious-plus.svg?style=flat)
![climate](https://img.shields.io/codeclimate/github/mateogianolio/vectorious.svg?style=flat&label=climate) ![coverage](https://img.shields.io/codeclimate/coverage/github/mateogianolio/vectorious.svg?style=flat&label=coverage)

> A high performance linear algebra library, written in JavaScript and optimized with C++ bindings to [BLAS](http://www.netlib.org/blas/), [SPBLAS](http://math.nist.gov/spblas/), [LAPACK](https://software.intel.com/ru-ru/node/468874).<br>
> Forked from [mateogianolio/vectorious](https://github.com/mateogianolio/vectorious), added sparse matrix/vector support (by using SPBLAS, nodejs only) and boost of AX=B solve (by using LAPACK).<br>
<b>todo: documment new featues</b><br>
> Also see [nblas-plus](https://github.com/ukrbublik/nblas-plus)

### Usage

##### In node.js

First please read [**Preinstall section of nblas-plus**](https://github.com/ukrbublik/nblas-plus/blob/master/README.md#preinstall)

Windows is not tested.

```bash
$ npm install vectorious-plus
```

```javascript
var v = require('vectorious'),
    Matrix = v.Matrix,
    Vector = v.Vector,
    SpVector = v.SpVector,
    SpMatrix = v.Matrix,
    BLAS = v.BLAS; // access BLAS routines (and also SPBLAS, LAPACK)
```


##### In browser

Download a [**release**](https://github.com/mateogianolio/vectorious/releases) and use it like this:

```html
<script src="vectorious-4.x.x.min.js"></script>
```

```html
<script>
  var A = new Matrix([[1], [2], [3]]),
      B = new Matrix([[1, 3, 5]]),
      C = A.multiply(B);

  console.log('C:', C.toArray());
  /* C: [
    [1, 3, 5],
    [2, 6, 10],
    [3, 9, 15]
  ] */
</script>
```

### Examples

**Basic**

* [**Solving linear systems of equations**](https://github.com/mateogianolio/vectorious/tree/master/examples/solve.js)
* [**Using low-level BLAS routines**](https://github.com/mateogianolio/vectorious/tree/master/examples/blas.js)

**Machine learning**
* [**Neural network**](https://github.com/mateogianolio/vectorious/tree/master/examples/neural-network.js) (by [@lucidrains](https://github.com/lucidrains))
* [**Logistic regression**](https://github.com/mateogianolio/vectorious/tree/master/examples/logistic-regression.js)

### Documentation

The documentation is located in the wiki section of this repository.

[**Go to wiki.**](https://github.com/mateogianolio/vectorious/wiki)

### Benchmarks

Internal benchmarks are located in the wiki section of this repository.

[**Go to wiki.**](https://github.com/mateogianolio/vectorious/wiki)

#### Compared to other libraries

The following benchmarks compare **Vectorious 4.1.0** with three popular matrix/vector libraries:

* [Numeric.js](http://www.numericjs.com)
* [Sylvester](http://sylvester.jcoglan.com)
* [Math.js](http://mathjs.org)

The graphs show operations per second on the vertical (y) axis.

Below is a graph comparing the **vector operations** `add`, `angle`, `dot`, `magnitude` (aka `L2-norm`), `normalize` and `scale`.

The operations were performed on vectors generated with `Vector.random(1048576)`.

![Vector operations](https://github.com/mateogianolio/vectorious/raw/master/benchmarks/vector_ops.png)

Below is a graph comparing the **matrix operations** `add`, `scale` and `transpose`.

The operations were performed on matrices generated with `Matrix.random(512, 512)`.

![Matrix operations](https://github.com/mateogianolio/vectorious/raw/master/benchmarks/matrix_ops.png)
