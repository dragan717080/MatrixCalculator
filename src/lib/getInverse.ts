import Matrix, { InverseSolution, Step, TwoNumbers } from '../interfaces/Matrix'
import getDeterminant from './getDeterminant'
import { getIdentityMatrix } from './getPower'
import { swapRows } from './matrixUtils'
import { getOrderNumberToStr } from './utils'

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
  const n = A.length

  let B = A.map(row => [...row]);

  const { result: determinant } = getDeterminant(A)

  const steps: Step[] = []

  if (determinant === 0) {
    return {
      A: null,
      steps,
      determinant
    }
  }

  console.log('DETERMINANT:', determinant);

  const I = getIdentityMatrix(n)

  // Append identity matrix to the right of the existing one
  for (let i = 0; i < n; i++) {
    for (let j = n; j < 2 * n; j++) {
      B[i][j] = I[i][j - n]
    }
  }

  console.log('Matrix after identity append:', JSON.parse(JSON.stringify(B)));
  steps.push({
    A: [...B.map(row => [...row])],
    explanation: 'Write the augmented matrix by appending identity matrix on right',
  })

  // Gauss-Jordan elimination steps
  for (let i = 0; i < n; i++) {
    // Handle row swapping
    const swapResult = swapRows(B, i);
    if (swapResult.swapRow) {
      steps.push({
        A: [...B.map(row => [...row])],
        swapRow: swapResult.swapRow as TwoNumbers,
        explanation: [`Swapping rows ${swapResult.swapRow[0] + 1} and ${swapResult.swapRow[1] + 1}`]
      });
    }

    // Make values in pivot row to be 1
    const updateRowResult = updateValuesInPivotRow(B, i);

    B = updateRowResult.A
    const explanation = updateRowResult.explanation

    steps.push({
      A: [...B.map(row => [...row])],
      explanation
    });

    // If pivot is already 1, no need to eliminate column
    if (updateRowResult.toReturnEarly) {
      continue;
    }

    // Handle row elimination
    const eliminationResult = eliminateValues(B, i);
    B = eliminationResult.A
    const newB = structuredClone(B)
    for (let i = 0; i < B.length; i++) {
      for (let j = 0; j < B[0].length; j++) {
        newB[i][j] = Math.round((newB[i][j] as number) * 1000) / 1000
      }
    }

    steps.push({
      A: [...B.map(row => [...row])],
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
    A: [...B.map(row => [...row])],
    explanation
  })

  // There will be inverse matrix on the right (on indices where identity matrix was initially appended)
  B = B.map(row => [...row.slice(n, 2 * n)])

  console.log(`Shall return matrix ${B.length} X ${B[0].length}`);

  if (n === 1) {
    return {
      A: [...B.map(row => [...row])],
      steps: steps.slice(-1),
      determinant,
    }
  }

  return {
    A: [...B.map(row => [...row])],
    steps,
    determinant,
  }
}

// In Gauss-Jordan elimination, pivot is divided to be 1, and elements in the same row are also divided by that value
const updateValuesInPivotRow = (A: Matrix, row: number) => {
  const pivot = A[row][row] as number

  // Early return if pivot is 1, no need to process row
  if (pivot === 1) {
    const explanation = `A[${row + 1}][${row + 1}] is already 1, so no need to eliminate this column`
    return { explanation, A, toReturnEarly: false }
  }

  const strCoef = Math.round(pivot * 1000) / 1000

  for (let j = 0; j < A[0].length; j++) {
    A[row][j] = Math.round((A[row][j] as number / pivot as number) * 1000) / 1000
  }

  const explanation = `
    Make the pivot in the ${row + 1}${getOrderNumberToStr(row)}
    column by dividing the ${row + 1}${getOrderNumberToStr(row)}
    row by ${strCoef}
  `
  return { A, explanation, toReturnEarly: false }
}

/**
 * Handles value changes to eliminate values below the pivot.
 * 
 * Unlike Gauss elimination, this iterates from 0 to last.
 */
const eliminateValues = (
  A: Matrix,
  col: number,
  /** Whether to eliminate values above current column */
  toEliminateAbove = false,
): { A: Matrix; toReturnEarly: boolean, explanations: string[] } => {
  const pivot = A[col][col] as number;
  if (pivot === 0) {
    return { A, toReturnEarly: true, explanations: [`R${col + 1} early return because A[${col + 1}][${col + 1}] is 0`] };
  }

  const explanations = []

  for (let i = 0; i < A.length; i++) {
    // Only skip the current row
    if (i === col) {
      continue;
    }

    if (A[i][col] === 0) {
      explanations.push(`R${i + 1} at column ${col + 1} is already 0, so this step is skipped.`)
      continue
    };

    const coef = (A[i][col] as number) / pivot!;

    explanations.push(`R${i + 1} = R${i + 1} ${coef < 0 ? '+' : '-'} ${![-1, 1].includes(coef) ? Math.abs(Number.isInteger(coef) ? coef : parseFloat(coef?.toFixed(3).replace(/(\.\d*?[1-9])0+$|\.0+$/, '$1'))) : ''}R${col + 1}`)

    for (let j = col; j < A[0].length; j++) {
      (A[i][j] as number) -= (A[col][j] as number) * coef;
    }
  }

  return { A, toReturnEarly: false, explanations };
};

export default getInverse;
