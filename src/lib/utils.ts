import Matrix from '../interfaces/Matrix'
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
