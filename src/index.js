const R = require("ramda");
const { log } = console;
const { compose, map, equals } = R;

class Functor {
  static of(value) {
    return new Functor(value);
  }
  constructor(value) {
    this.value = value;
  }
  fmap(f) {
    return new Functor(f(this.value));
  }
}

const gt0 = num => num > 0;
const fNum10 = new Functor(10);
const fNum10AfterGt = fNum10.fmap(gt0);
const fNum10AfterGtR = R.map(gt0, fNum10);

// Functor {value:10}
// Functor {value: true}
// {value:true}
log(fNum10, fNum10AfterGt, fNum10AfterGtR);

log(R.map(gt0, [10])); // [true]

log(new Functor(10).fmap(gt0));

//
const id = x => x;
const f = price => price * 1.05 + 10;
const g = total => total + 100;
const fg = compose(
  g,
  f
);

const f90 = Functor.of(90);
// Identity
log(equals(f90.fmap(id), Functor.of(id(90))));
// Compose
log(f90.fmap(f).fmap(g));
log(f90.fmap(fg));
log(
  map(
    compose(
      g,
      f
    ),
    f90
  )
);
