import Matrix from './Matrix'
import { Sign } from './Determinant';

/**
 * Describes `swapRows` function which checks for elements same column
 * under the given row and swaps with the first row with non zero value.
 * 
 * @type {SwapRows}
 * 
 * @property {Matrix} A
 * @property {number[] | undefined} swapRow - If found value in one of rows
 * under current one, in the same column, return those indices.
 * @property {Sign} [sign] - (Optional) - If it is determinant, return the swapped sign.
 */
export interface SwapRows {
  A: Matrix
  swapRow?: number[]
  sign?: Sign
}

/**
 * Describes function to eliminate values either in the same column under current row
 * in the Gauss elimination, or values in the same column in all rows except the current one.
 * 
 * @type {EliminateValues}
 * 
 * @property {Matrix} A
 * @property {number} col
 * @property {string[]} explanations - For each row processed, if the pivot (the element at the
 * current row and column) is not already 0, says by which divisor to divide the current row. Otherwise,
 * say that the current row is already eliminated.
 */
export interface EliminateValues {
  A: Matrix
  toReturnEarly: boolean
  explanations: string[]
}
