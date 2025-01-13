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
