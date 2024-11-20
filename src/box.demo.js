import { Box } from './box.js'

// example: refactor using box
const nextCharForNumberString_ = (str) => {
  const trimmed = str.trim()
  const number = parseInt(trimmed)
  const nextNumber = new Number(number + 1)
  return String.fromCharCode(nextNumber)
}

const nextCharForNumberString = (str) =>
  Box(str)
    .map((x) => x.trim())
    .map((trimed) => parseInt(trimed))
    .map((num) => num + 1)
    .fold(String.fromCharCode)

console.log(nextCharForNumberString('  64  '))

// example: nested box
const percentToFloat = (percent) => parseFloat(percent.replace('%', '')) * 0.01

const applyDiscount_ = (price, discount) => {
  const cents = Number.parseFloat(price)
  const savings = percentToFloat(discount)
  return cents - cents * savings
}

const applyDiscount = (price, discount) =>
  Box(Number.parseFloat(price)).fold((cents) =>
    Box(discount)
      .map(percentToFloat)
      .fold((savings) => cents - cents * savings)
  )

console.log(applyDiscount('100', '10%'))
