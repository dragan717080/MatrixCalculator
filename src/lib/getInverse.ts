import getDeterminant from './getDeterminant'
import { getIdentityMatrix } from './getPower'
import { eliminateRowsGaussJordan, swapRows, updateValuesInPivotRow } from './matrixUtils'
import { getOrderNumberToStr } from './utils'
import Matrix, { InverseSolution, Step, TwoNumbers } from '../interfaces/Matrix'
import { EliminateValues } from '../interfaces/MatrixUtils'

/**
 * Gauss-Jordan elimination to get the inverse matrix.
 *
 * Inverse is only defined if determinant is defined.
 *
 * Example matrix:
 * 
 * 5     7     8     12
 * 
 * 15    22    17    -3
 * 
 * -2    -4    6     11
 * 
 * 10    23    30    26
 * 
 * Δ = 13 347
 * 
 * Determinant is not zero, therefore inverse matrix exists.
 * 
 * Write the augmented matrix by appending identity matrix
 * same dimensions to the right of it.
 * 
 * https://prnt.sc/p7Zv7-r2aHvA
 * 
 * Then pivots are made differently than in Gauss elimination.
 * 
 * Transform matrix to `reduced raw echelon form (RREF)`.
 * 
 * Choose existing element at position `i i`, and make it 1,
 * and divide all elements in that row accordingly.
 * 
 * This is different from Gaussian elimination which does not make it 1.
 * 
 * Another important difference: in Gauss Jordan Elimination it also makes rows ABOVE pivot row 0,
 * and not just under it.
 * 
 * This makes original matrix (left part of new matrix) identity matrix.
 * 
 * Make the pivot in the 1st column by dividing the 1st row by 5.
 * 
 * https://prnt.sc/1ol5twVceCDd
 * 
 * Eliminate the 1st column.
 * 
 * https://prnt.sc/MVwXS07AE7NO
 * 
 * Find the pivot in the 2nd column in the 2nd row.
 * 
 * https://prnt.sc/64Ntu69Nw803
 * 
 * Eliminate the 2nd column.
 * 
 * https://prnt.sc/FPrjEdje6-Fc
 * 
 * Make the pivot in the 3rd column by dividing the 3rd row by 4/5
 * 
 * https://prnt.sc/Oy41l4CI_1vf
 * 
 * Eliminate the 3rd column
 * 
 * https://prnt.sc/GGT66LqbjuLu
 * 
 * Make the pivot in the 4th column by dividing the 4th row by 13347/4
 * 
 * https://prnt.sc/egXL1aDSj9nT
 * 
 * Eliminate the 4th column
 * 
 * https://prnt.sc/-1K9osPrdhLR
 * 
 * There is the inverse matrix on the right
 * 
 * https://prnt.sc/BTC3TSjGVBwG
 * 
 * @param {Matrix} A
 * 
 * @returns {InverseSolution}
 */
const getInverse = (A: Matrix): InverseSolution => {
  const { result: determinant } = getDeterminant(A)

  const steps: Step[] = []

  if (determinant === 0) {
    return {
      A: null,
      steps,
      determinant
    }
  }

  const m = A.length

  let B = JSON.parse(JSON.stringify(A)) as Matrix;

  console.log('DETERMINANT:', determinant);

  const I = getIdentityMatrix(m)

  // Append identity matrix to the right of the existing one
  for (let i = 0; i < m; i++) {
    for (let j = m; j < 2 * m; j++) {
      B[i][j] = I[i][j - m]
    }
  }

  console.log('Matrix after identity append:', JSON.parse(JSON.stringify(B)));
  steps.push({
    A: JSON.parse(JSON.stringify(B)),
    explanation: 'Write the augmented matrix by appending identity matrix on right',
  })

  // Gauss-Jordan elimination steps
  for (let i = 0; i < m; i++) {
    // Handle row swapping
    const swapResult = swapRows(B, i);
    if (swapResult.swapRow) {
      steps.push({
        A: JSON.parse(JSON.stringify(B)),
        swapRow: swapResult.swapRow as TwoNumbers,
        explanation: [`Swapping rows ${swapResult.swapRow[0] + 1} and ${swapResult.swapRow[1] + 1}`]
      });
    }

    // Make values in pivot row to be 1
    const updateRowResult = updateValuesInPivotRow(B, i);

    B = updateRowResult.A
    const explanation = updateRowResult.explanation

    steps.push({
      A: JSON.parse(JSON.stringify(B)),
      explanation
    });

    // If pivot is already 1, no need to eliminate column
    if (updateRowResult.toReturnEarly) {
      continue;
    }

    // Handle row elimination
    const eliminationResult = eliminateRowsGaussJordan(B, i);
    B = eliminationResult.A
    const newB = JSON.parse(JSON.stringify(B))

    for (let i = 0; i < B.length; i++) {
      for (let j = 0; j < B[0].length; j++) {
        newB[i][j] = Math.round((newB[i][j] as number) * 1000) / 1000
      }
    }

    steps.push({
      A: JSON.parse(JSON.stringify(B)),
      explanation: eliminationResult.explanations
    });

    if (eliminationResult.toReturnEarly) {
      continue;
    }
  }

  const explanation = [
    'Now matrix is inversed',
    'Original matrix became identity matrix',
    'Identity matrix that was appended to right at start will become the solution'
  ]

  steps.push({
    A: JSON.parse(JSON.stringify(B)),
    explanation
  })

  // There will be inverse matrix on the right (on indices where identity matrix was initially appended)
  B = B.map(row => [...row.slice(m, 2 * m)])

  console.log(`Shall return matrix ${B.length} X ${B[0].length}`);

  if (m === 1) {
    return {
      A: JSON.parse(JSON.stringify(B)),
      steps: steps.slice(-1),
      determinant,
    }
  }

  return {
    A: JSON.parse(JSON.stringify(B)),
    steps,
    determinant,
  }
}

export default getInverse;
