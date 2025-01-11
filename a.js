const getStrValuesOfMainDiagonal = (
  A,
  toPutInBrackets=false
) => {
  const upperDiagonalValues = A.flatMap((row, i) => row.filter((_, j) => i === j))

  const strValues = upperDiagonalValues.map(x => {
    if (typeof (x) === 'string') {
      x = parseFloat(x)
    }

    if (typeof (x) === 'undefined') {
      x = 0
    }

    const value = Number.isInteger(x) ? x : Math.round(x * 1000) / 1000
    return toPutInBrackets
      ? value >= 0 ? String(value) : `(${value})`
      : String(value)
  })

  return strValues
}

const A1 = [[2, 9], [3, 8], [4, 7], [5, 6]]
const A2 = [[1, 2, 3, 4], [5, 6, 7, 8]]
const A3 = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]

console.log(getStrValuesOfMainDiagonal(A1))
console.log(getStrValuesOfMainDiagonal(A2))
console.log(getStrValuesOfMainDiagonal(A3))
