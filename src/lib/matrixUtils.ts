import { Sign } from '../interfaces/Determinant';
import Matrix from '../interfaces/Matrix'
import { SwapRows } from '../interfaces/MatrixUtils';

/**
 * Handles swapping rows if needed.
 *
 * @param {Matrix} A
 * @param {number} col - Under which column to check for non zero rows.
 * @param {Sign} [sign] - (Optional) - If it is determinant, swap signs.
 *
 * @returns 
 */
export const swapRows = (
  A: Matrix,
  col: number,
  sign?: Sign
): SwapRows => {
  const pivot = A[col][col]
  let swapRow

  if (pivot === 0) {
    for (let i = col + 1; i < A.length; i++) {
      if (A[i][col]! !== 0) {
        [A[col], A[i]] = [A[i], A[col]]
        swapRow = [col, i]

        if (sign) {
          sign = sign === '+' ? '-' : '+'
        }

        break;
      }
    }
  }

  return { A, swapRow, sign }
};
