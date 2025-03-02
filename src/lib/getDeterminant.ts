import { DeterminantSolution, Sign, Step } from '../interfaces/Determinant'
import Matrix from '../interfaces/Matrix'
import { eliminateRowsBelow, swapRows } from './matrixUtils'

/**
 * Gaussian elimination to get upper triangular form.
 * 
 * Every step n should pick Ann as pivot and turn nRows - n elements on row n into 0.
 * 
 * Example matrix:
 * 
 *    1    3    7    8
 * 
 *    4    2    5    4
 * 
 *    5    8    1    6
 * 
 *    6    7    2    3
 *
 * Transform matrix into `row echelon form (REF)`.
 * 
 * The pivot element is the first element of the first row: 1
 * To eliminate the elements below 1 1 in the first column (i.e., 4, 5, 6),
 * we subtract multiples of the first row from the other rows.
 * 
 * - Subtract rows R2 -> R2 - 4R1
 *   - R2 = [4 - 4, 2 - 12, 5 - 28, 4 - 32] = [0, -10, -23, -28]
 * 
 * - Subtract rows R3 -> R3 - 5R1
 *   - R3 = [5 - 5, 8 - 15, 1 - 35, 6 - 40] = [0, -7, -34, -34]
 * 
 * - Subtract rows R4 -> R4 - 6R1
 *   - R4 = [6 - 6, 7 - 18, 2 - 42, 3 - 48] = [0, -11, -40, -45]
 * 
 * Resulting matrix after step 1:
 * 
 *    1    3      7      8
 * 
 *    0    -10    -23    -28
 * 
 *    0    -7     -34    -34
 * 
 *    0    -11    -40    -45
 *
 * Next pivot element is the second element of the second row: -10.
 * 
 * - Subtract rows R3 -> R3 - (-7/-10) R2
 *   - R3 = [0 - 7/10*0, -7 - (7/10) * -10, -34 - 7/10 * (-23), -34 - 7/10 * (-28)] = [0, 0, -17.9, -14.4]
 * 
 * - Subtract rows R4 -> R4 - (-11/-10)R2
 *   - R4 = [0 - 11/10 * 0, -11 - (11/10 * 11), -40 - (11/10 * (-23)), -45 - (11/10 * (-28))] = [0, 0, -14.7, -14.2]
 * 
 * Resulting matrix after step 2:
 * 
 *    1    3    7      8
 * 
 *    0    -10  -23    -28
 * 
 *    0    0    -17.9  -14.4
 * 
 *    0    0    -14.7  -14.2
 *
 * Next pivot element is the third element of the third row: -17.9.
 * 
 * - Subtract rows R4 -> R4 - (-14.7/-17.9)R3
 *   - R4 = [0, 0, 0, -14.2 - 0.821*(-14.4)] = [0, 0, 0, -2.38]
 * 
 * Resulting matrix after step 3:
 * 
 *    1    3    7      8
 * 
 *    0    -10  -23    -28
 * 
 *    0    0    -17.9  -14.4
 * 
 *    0    0    0      -2.38
 * 
 * To get determinant, multiply elements on the upper diagonal:
 * 
 * Δ = 1 * (-10) * (-17.9) * (-2.38) = -425
 */
const getDeterminant = (A: Matrix): DeterminantSolution => {
  const n = A.length
  const steps: Step[] = []
  let sign: Sign = '+'

  // Make a copy of `A` to avoid directly mutating state
  const B = JSON.parse(JSON.stringify(A))

  // Gaussian elimination steps
  for (let i = 0; i < n - 1; i++) {
    // Handle row swapping
    const swapResult = swapRows(B, i, sign)
    if (swapResult.swapRow) {
      steps.push({
        A: JSON.parse(JSON.stringify(B)),
        swapRow: swapResult.swapRow,
        sign: swapResult.sign!,
        explanation: [`Swapping rows ${swapResult.swapRow[0] + 1} and ${swapResult.swapRow[1] + 1}, changing the sign to ${swapResult.sign}`]
      })

      sign = swapResult.sign!
    }

    // Handle row elimination
    const eliminationResult = eliminateRowsBelow(B, i)

    steps.push({
      A: JSON.parse(JSON.stringify(B)),
      swapRow: undefined,
      sign,
      explanation: eliminationResult.explanations
    })

    if (eliminationResult.toReturnEarly) {
      break
    }
  }

  // Multiply diagonal elements
  let D = 1
  for (let i = 0; i < n; i++) {
    D *= B[i][i] as number
  }

  // Adjust sign
  let result = Number.isInteger(D) ? D : parseFloat(D.toFixed(3))
  if (sign !== '+') {
    result = -result
  }

  return { steps, result }
}

export default getDeterminant
