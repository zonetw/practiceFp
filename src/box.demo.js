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
