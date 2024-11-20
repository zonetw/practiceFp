import fs from 'fs'

const Right = (x) => ({
  chain: (f) => f(x),
  map: (f) => Right(f(x)),
  fold: (f, g) => g(x),
  toString: `Right(${x})`,
  log: (msg) => {
    console.log('right', msg, x)
    return Right(x)
  },
})
const Left = (x) => ({
  chain: (f) => Left(x),
  map: (f) => Left(x),
  fold: (f, g) => f(x),
  toString: `Left(${x})`,
})

// util functions
const fromNullable = (x) => (x != null ? Right(x) : Left())
const tryCatch = (f) => {
  try {
    return Right(f())
  } catch (e) {
    return Left(e)
  }
}

// ===============================
// example: findColor
// ===============================

const findColor = (name) =>
  fromNullable({ red: '#ff4444', blue: '#3b5998', yellow: '#fff68f' }[name])

const res = () =>
  findColor('red')
    .map((x) => x.toUpperCase())
    .map((x) => x.slice(1))
    .fold(
      () => 'no color',
      (color) => color
    )

console.log(res()) // #FF4444

// ===============================
// example: getPort
// ===============================
const readFileSync = (path) => tryCatch(() => fs.readFileSync(path))
const parseJSON = (content) => tryCatch(() => JSON.parse(content))

const getPort = () =>
  readFileSync('config.json') // Right()
    .chain((content) => parseJSON(content)) // Right(Right())
    .map((config) => config.port)
    .fold(
      () => 8080,
      (x) => x
    )

console.log(getPort())

// ===============================
// example: street
// ===============================
const street_ = (user) => {
  const address = user.address
  if (address) {
    return address.street
  } else {
    return 'no street'
  }
}

const street = (user) =>
  fromNullable(user.address)
    .map((address) => address.street)
    .fold(
      () => 'no street',
      (x) => x
    )

console.log(street({ address: { street: '1st' } }))

// ===============================
// example: streetName
// ===============================
const streetName_ = (user) => {
  const address = user.address

  if (address) {
    const street = address.street

    if (street) {
      return street.name
    }
  }

  return 'no street'
}

const streetName = (user) =>
  fromNullable(user)
    .chain((user) => fromNullable(user.address))
    .chain((address) => fromNullable(address.street))
    .map((street) => street.name)
    .fold(
      () => 'no street',
      (x) => x
    )
console.log(streetName({ address: { street: { name: '2nd' } } }))

const streetName2 = (user) =>
  fromNullable(user?.address?.street?.name).fold(
    () => 'empty value',
    (x) => x
  )
console.log(streetName2({ address: { street: { name: '3rd' } } }))
console.log(streetName2({}))

// ===============================
// example: parseDbUrl
// ===============================
const DB_REGEX = /postgres:\/\/([^:]+):([^@]+)@.*?\/(.+)$/i

const parseDbUrl_ = (cfg) => {
  try {
    const c = JSON.parse(cfg) // throws if it can't parse
    return c.url.match(DB_REGEX)
  } catch (e) {
    return null
  }
}

const parseDbUrl = (cfg) =>
  parseJSON(cfg)
    .map((c) => c.url)
    .map((url) => url.match(DB_REGEX))
    .fold(
      (e) => null,
      (x) => x
    )
console.log('parseDbUrl',
  parseDbUrl('{"url": "postgres://sally:muppets@localhost:5432/mydb"}')?.[1]
)
const parseDbUrl2 = (cfg) =>
  parseJSON(cfg)
    .map((c) => c.url?.match(DB_REGEX))
    .fold(
      () => null,
      (x) => x
    )
console.log('parseDbUrl2',
  parseDbUrl2('{"url": "postgres://sally:muppets@localhost:5432/mydb"}')?.[1]
)
console.log(
  parseDbUrl2('{"a": ""}')
)
