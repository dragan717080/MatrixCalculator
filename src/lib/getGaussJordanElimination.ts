import { swapRows } from './matrixUtils'
import getDeterminant from './getDeterminant'
import { getOrderNumberToStr } from './utils'
import Matrix, { GaussJordanEliminationSolution, MatrixElement, Step, TwoNumbers } from '../interfaces/Matrix'
import { Sign } from '../interfaces/Determinant'

/**
 * Solution of simultaneous linear equations using Gauss-Jordan elimination.
 * 
 * Can be solved with rectangular matrices to see whether the system is consistent.
 * 
 * Initial matrix
 * 
 *     X1    X2     X3     X4     b
 *
 *     2      4      3      2     14
 *
 *     -3     12     5      6     30
 * 
 * Transform the matrix into reduced raw echelon form (RREF).
 * 
 * Make the pivot in the first column of the first row: 2
 * 
 * - R1 -> R1 / 2
 *   - R1 = [1, 2, 1.5, 1, 7]
 * 
 * Resulting matrix after step 1:
 * 
 *      X1    X2     X3     X4     b
 *
 *      1     2      1.5    1      7
 * 
 *      -3    12     5      6     30
 * 
 * - Subtract rows R2 -> R2 + 3R1 =
 *   - R2 = [-3 + 3, 12 + 6, 5 + 4.5, 6 + 3, 30 + 21] = [0, 18, 9.5, 9, 51]
 * 
 * Resulting matrix after step 2:
 * 
 *      X1    X2     X3     X4     b
 *
 *      1     2      1.5    1      7
 * 
 *      0    18      9.5    9     51
 * 
 * Next pivot element in the second element of the second row: 18
 * 
 * - R2 -> R2 / 18
 *   - R2 = [0, 1, 0.528, 0.5, 2.833]
 * 
 * Resulting matrix after step 3:
 * 
 *      X1    X2     X3     X4     b
 *
 *      1     2      1.5    1      7
 * 
 *      0     1     0.528   0.5    2.833
 * 
 *  In Gauss-Jordan elimination, we also visit the rows above to eliminate columns.
 * 
 * - R1 -> R1 - 2R2
 *   - R1 = [1 - 0, 2 - 2, 1.5 - 1.056, 1 - 1, 7 - 5.667] = [1, 0, 0.444, 0, 1.333]
 * 
 * Resulting matrix after step 4:
 * 
 *      X1    X2     X3       X4     b
 *
 *      1     0      0.444    0      1.333
 * 
 *      0     1      0.528    0.5    2.833
 * 
 * Solution set:
 * 
 * - X1 = 1.333 - 0.444 * X3
 *
 * - X2 = 2.833 - 0.528 * X3
 *
 * - X3, X4 - Free
 */
const getGaussJordanElimination = (A: Matrix, coefs: number[]): GaussJordanEliminationSolution => {
  let B = JSON.parse(JSON.stringify(A))

  const { result: determinant } = getDeterminant(B)

  const steps: Step[] = []

  if (determinant === 0) {
    return {
      steps,
      determinant,
      solution: null
    }
  }

  B = appendCoefsToMatrix(B, coefs)

  const m = B.length

  console.log('DETERMINANT:', determinant);

  const solution: string[] = []

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
    const eliminationResult = eliminateValues(B, i);
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

  /** Make the solution strings denoting variables linear dependencies from the final step.
   * Will make changes, therefore need deep copy.
   */
  const resultMatrix = JSON.parse(JSON.stringify(steps[steps.length - 1].A)) as Matrix

  console.log('Result matrix:', resultMatrix);

  resultMatrix.forEach((equation, index) => {
    // Since will round to 3 decimals, don't modify the original
    const newEquation = [...(equation as number[])].map(x => Math.round(x * 1000) / 1000)
    console.log('equation', newEquation);
    const rightSide = newEquation[newEquation.length - 1] as number
    let variableStr = `X<span class='subindex'>${index + 1}</span> = ${rightSide}`

    console.log('Will iterate to:', newEquation.slice(0, -1));

    // First variable is substracted 
    // Loop through other coefficients to find its relation with current variable
    for (let i = 0; i < newEquation.slice(0, -1).length; i++) {
      const coef = newEquation[i]

      // Skip the current one
      if (i === index) {
        continue
      }

      const xStr = `X${i + 1}`

      if (i < m) {
        console.log(`Variable X${i + 1} = ${coef}`);
      } else {
        console.log(`Variable X${i + 1} with value ${coef} is free`);

        if (coef) {
          /** Since it is substracted from solution it will have `-` sign. */
          const sign: Sign = coef < 0 ? '+' : '-'
          variableStr += ` ${sign} ${coef}${xStr}`
        }
      }
    }

    solution.push(variableStr)
  })

  const leftSideLength = resultMatrix[resultMatrix.length - 1].length - 1
  console.log('Start length:', m);
  console.log('Actual length:', leftSideLength);
  console.log('Free variables count:', leftSideLength - m);

  console.log(A.length);
  console.log(leftSideLength);
  let freeVariablesStr = ''

  for (let i = A.length; i < leftSideLength; i++) {
    freeVariablesStr += `X${i + 1}`

    if (i !== leftSideLength - 1) {
      freeVariablesStr += ', '
    }
  }

  freeVariablesStr += ' - Free'

  console.log('Free variables string:', freeVariablesStr);
  if (A.length < leftSideLength) {
    solution.push(freeVariablesStr)
  }

  console.log('%cResult:', 'color:red;font-size:22px;', {
    steps,
    determinant,
    solution
  });

  return {
    steps,
    determinant,
    solution
  }
}

/** Append coefs to the matrix. */
const appendCoefsToMatrix = (A: Matrix, coefs: number[]) => {
  if (A.length !== coefs.length) {
    throw new Error(`Wrong number of coefficients, expected ${A.length} but received ${coefs.length}`)
  }

  // Create a deep copy
  const newMatrix = JSON.parse(JSON.stringify(A))

  for (let i = 0; i < newMatrix.length; i++) {
    newMatrix[i].push(coefs[i])
  }

  return newMatrix
}

/** In Gauss-Jordan elimination, pivot is divided to be 1, and elements in the same row are also divided by that value. */
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

export default getGaussJordanElimination;
