export const Box = (x) => ({
  map: (f) => Box(f(x)),
  fold: (f) => f(x),
  inspect: `Box(${x})`,
  log: (msg) => {
    console.log(msg, x)
    return Box(x)
  },
})
