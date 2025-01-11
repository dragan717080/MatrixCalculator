import { Step as DeterminantStep } from '../interfaces/Determinant'
import Matrix, { Step, TwoNumbers } from '../interfaces/Matrix'
import { CalcTimeResult } from '../interfaces/Utils'

export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Transpose with deep copy
export const transpose = (A: Matrix): Matrix =>
  A[0].map((_, colIndex) => A.map(row => row[colIndex]))

export const getCalcTime =
  <T = any>(func: (...args: any[]) => T): CalcTimeResult<T> => {
    const startTime = performance.now()

    const result = func()

    const endTime = performance.now()
    console.log('calc time:', endTime - startTime)
    let calcTime = (endTime - startTime) / 1000
    calcTime = Number.isInteger(calcTime) ? calcTime : parseFloat(calcTime.toFixed(3)) as unknown as number

    return {
      // If it is lower than `0.001s`, set is to `0.001s`
      time: Math.max(calcTime, 0.001),
      funcResult: result
    }
  }

/** Whether the input value is a valid number. */
export const isStringNumeric = (s: string) => {
  const pattern = /^[\+\-]?\d*\.?\d+(?:[Ee][\+\-]?\d+)?$/;

  return pattern.test(s);
}

/**
 * Get string values of main diagonal elements.
 *
 * @param {DeterminantStep[]|Step[]} steps
 * @param {boolean} [toPutInBrackets] - Optional parameter.
 * Whether to put number in brackets for better formatting,
 * e.g. for `determinant` -3 will become (-3).
 * Defaults to false.
 */
export const getStrValuesOfMainDiagonal = (
  steps: DeterminantStep[] | Step[],
  toPutInBrackets = false
): string[] => {
  const upperDiagonalValues = steps[steps.length - 1].A.flatMap((row, i) => row.filter((_, j) => i === j))

  const strValues = upperDiagonalValues.map(x => {
    if (typeof (x) === 'string') {
      x = parseFloat(x)
    }

    if (typeof (x) === 'undefined') {
      x = 0
    }

    const value = Number.isInteger(x) ? x : Math.round(x * 1000) / 1000
    return toPutInBrackets
      ? (value as number)! >= 0 ? String(value) : `(${value})`
      : String(value)
  })

  return strValues
}

/** Format text of given step index and explanation index with the `subindex` span class. */
export const getIndicesFromEquation = (
  explanation: string,
  withOneBasedIndex = false,
): [TwoNumbers, string] => {
  const splits = explanation.split(' = ')
  const [strIndices, equation] = [splits[0], splits.slice(1, explanation.length - 1).join(' = ')]
  let indices = strIndices.match(/\d+/g)!.map(num => parseInt(num, 10)) as TwoNumbers

  if (withOneBasedIndex) {
    indices = [indices[0] + 1, indices[1] + 1]
  }

  return [indices, equation]
}
