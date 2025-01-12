import Matrix, { SolutionWithNumericResult, Step, TwoNumbers } from '../interfaces/Matrix';

/**
 * Gaussian elimination to get upper triangular form.
 *
 * Similar as determinant, with four differences.
 *
 * - It can take non square matrices.
 * - Always must iterate until the end (even if one row has all null values).
 * - It is always positive (doesn't swap sign when swapping elements).
 * - It counts non zero elements on main diagonal (and not multiply them).
 *
 * Every step n should pick Ann as pivot and turn nRows - n elements on row n into 0.
 *
 * Example matrix:
 *
 *    1     2     3
 *
 *    4     5     6
 *
 *    7     8     9
 *
 *    11    23    22
 *
 * The pivot element is the first element of the first row: 1
 * To eliminate the elements below 1 1 in the first column (i.e., 4, 5, 6),
 * we subtract multiples of the first row from the other rows:
 *
 * - Subtract rows R2 -> R2 - 4R1
 *   - R2 = [4 - 4, 5 - 8, 6 - 12] = [0, -3, -6]
 *
 * - Subtract rows R3 -> R3 - 7R1
 *   - R3 = [7 - 7, 8 - 14, 9 - 21] = [0, -6, -12]
 *
 * - Subtract rows R4 -> R4 - 11R1
 *   - R4 = [11 - 11, 23 - 22, 22 - 33] = [0, 1, -11]
 *
 * Resulting matrix after step 1:
 *
 *    1     2      3
 *
 *    0    -3     -6
 *
 *    0    -6     -12
 *
 *    0     1     -11
 *
 * Next pivot element is the second element of the second row: -3.
 *
 * - Subtract rows R3 -> R3 - 2R2
 *   - R3 = [0 - 2*0, -6 - 2 * (-3), -12 - 2 * (-6)] = [0, 0, 0]
 *
 * - Subtract rows R4 -> R4 + 1/3R2
 *   - R4 = [0 + 1/3 * 0, 1 + (1/3 * (-3)), -11 + (1/3 * (-6))] = [0, 0, -13]
 *
 * Resulting matrix after step 2:
 *
 *    1     3     7
 *
 *    0    -10   -23
 *
 *    0     0     0
 *
 *    0     0    -13
 *
 * Since third element of third row is 0, we swap rows 3 and 4.
 *
 *    1     3     7
 *
 *    0    -10   -23
 *
 *    0     0    -13
 *
 *    0     0     0
 *
 * Next pivot element is the third element of the third row: -13.
 *
 * Count number of non zero elements on main diagonal
 *
 * Matrix rank = `len([1, -10, -13])` = 3
 */
const getRank = (A: Matrix): SolutionWithNumericResult => {
  const [m, n] = [A.length, A[0].length]
  const steps: Step[] = [];

  // Make a copy of `A` to avoid directly mutating state
  const B: Matrix = JSON.parse(JSON.stringify(A))

  // Matrices with only one column will not need elimination steps
  if (n === 1) {
    const result = Number(Number(A[0][0]) !== 0)

    return { result, steps }
  }

  // Gaussian elimination steps
  for (let i = 0; i < m - 1; i++) {
    // Handle row swapping
    const swapResult = swapRows(B, i);
    if (swapResult.swapRow) {
      steps.push({
        A: [...B.map(row => [...row])],
        swapRow: swapResult.swapRow as TwoNumbers,
        explanation: [`Swapping rows ${swapResult.swapRow[0] + 1} and ${swapResult.swapRow[1] + 1}`]
      });
    }

    // Handle row elimination
    if (i >= n) {
      break
    }

    const eliminationResult = eliminateValues(B, i);
    console.log('Got result:', eliminationResult);
    steps.push({
      A: [...B.map(row => [...row])],
      explanation: eliminationResult.explanations
    });

    if (eliminationResult.toReturnEarly) {
      continue;
    }
  }

  // Count amount of non zero elements on maindiagonal

  if (m === 1) {
    return { result: Number(A[0][0] !== 0), steps }
  }

  const upperDiagonalValues = steps[steps.length - 1].A.flatMap((row, i) => row.filter((_, j) => i === j))
  console.log('Upper diag values:', upperDiagonalValues);
  const result = upperDiagonalValues.reduce((acc, x) => Number(acc) + Number(x !== 0), 0)

  return { result: result as number, steps };
};

/** Handles swapping rows if needed */
const swapRows = (
  A: Matrix,
  col: number,
): { A: Matrix; swapRow: number[] | undefined } => {
  const pivot = A[col][col];
  let swapRow;

  if (pivot === 0) {
    for (let i = col + 1; i < A.length; i++) {
      if (A[i][col]! !== 0) {
        [A[col], A[i]] = [A[i], A[col]];
        swapRow = [col, i];
        break;
      }
    }
  }

  return { A, swapRow };
};

/** Handles value changes to eliminate values below the pivot */
const eliminateValues = (
  A: Matrix,
  col: number
): { A: Matrix; toReturnEarly: boolean, explanations: string[] } => {
  const pivot = A[col][col] as number;

  if (pivot === 0) {
    return { A, toReturnEarly: true, explanations: [`R${col} early return because A[${col + 1}][${col + 1}] is 0`] };
  }

  const explanations = []

  for (let i = col + 1; i < A.length; i++) {
    if (A[i][col] === 0) {
      explanations.push(`R${i + 1} at column ${col + 1} is already 0, so this step is skipped.`)
      break
    };

    const coef = (A[i][col] as number) / pivot!;
    if (Number.isNaN(coef)) {
      continue
    }
    

    explanations.push(`R${i + 1} = R${i + 1} ${coef < 0 ? '+' : '-'} ${![-1, 1].includes(coef) ? Math.abs(Number.isInteger(coef) ? coef : parseFloat(coef?.toFixed(3).replace(/(\.\d*?[1-9])0+$|\.0+$/, '$1'))) : ''}R${col + 1}`)

    for (let j = col; j < A.length; j++) {
      if (j >= A[0].length) {
        break
      }

      (A[i][j] as number) -= (A[col][j] as number) * coef;
    }
  }

  return { A, toReturnEarly: false, explanations };
};

export default getRank
