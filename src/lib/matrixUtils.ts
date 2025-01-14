import { getOrderNumberToStr } from './utils';
import { Sign } from '../interfaces/Determinant';
import Matrix from '../interfaces/Matrix'
import { EliminateValues, SwapRows } from '../interfaces/MatrixUtils';

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

/** In Gauss-Jordan elimination, pivot is divided to be 1, and elements in the same row are also divided by that value. */
export const updateValuesInPivotRow = (A: Matrix, row: number) => {
  const pivot = A[row][row] as number

  // If pivot is 0, the system is inconsistent
  if (pivot === 0) {
    console.log('%cThe system is incosistent', 'color:red;font-size:22px;');
    return {
      A,
      explanation: `Attempting to divide ${row + 1}${getOrderNumberToStr(row)} row by 0, therefore, the system is inconsistent`,
      toReturnEarly: true
    }
  }

  // Early return if pivot is 1, no need to process row
  if (pivot === 1) {
    const explanation = `A<span class='subindex'>${row + 1}</span><span class='subindex'>${row + 1}</span> is already 1, so no need to eliminate this column`
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

/** Handles value changes to eliminate values below the pivot. */
export const eliminateRowsBelow = (
  A: Matrix,
  col: number
): { A: Matrix; toReturnEarly: boolean, explanations: string[] } => {
  const pivot = A[col][col] as number;
  if (pivot === 0) {
    return {
      A,
      toReturnEarly: true,
      explanations: [
        `R<span class='subindex'>${col + 1}</span> early return because A<span class='subindex'>${col + 1}</span><span class='subindex'>${col + 1}</span> is 0`
      ]
    };
  }

  const explanations = []

  for (let i = col + 1; i < A.length; i++) {
    if (A[i][col] === 0) {
      explanations.push(
        `R<span class='subindex'>${i + 1}</span> at column ${col + 1} is already 0, so this step is skipped.`
      )
      continue
    };

    const coef = (A[i][col] as number) / pivot!;
    if (Number.isNaN(coef)) {
      continue;
    }

    explanations.push(
      `R<span class='subindex'>${i + 1}</span> = R<span class='subindex'>${i + 1}</span> ${coef < 0 ? '+' : '-'} ${![-1, 1].includes(coef) ? Math.abs(Number.isInteger(coef) ? coef : parseFloat(coef?.toFixed(3).replace(/(\.\d*?[1-9])0+$|\.0+$/, '$1'))) : ''}R<span class='subindex'>${col + 1}</span>`
    )

    for (let j = col; j < A.length; j++) {
      (A[i][j] as number) -= (A[col][j] as number) * coef;
    }
  }

  return { A, toReturnEarly: false, explanations };
};

/**
 * Handles value changes to eliminate values both above and below the pivot.
 * 
 * Unlike Gauss elimination, this iterates from 0 to last.
 */
export const eliminateRowsGaussJordan = (
  A: Matrix,
  col: number,
): EliminateValues => {
  const pivot = A[col][col] as number;
  console.log('received matrix:', JSON.parse(JSON.stringify(A)));
  console.log('col:', col, 'pivot:', pivot);
  if (pivot === 0) {
    return {
      A,
      toReturnEarly: true,
      explanations: [
        `R<span class='subindex'>${col + 1}</span> early return because A<span class='subindex'>${col + 1}</span><span class='subindex'>${col + 1}</span> is 0`
      ]
    };
  }

  const explanations = []

  for (let i = 0; i < A.length; i++) {
    // Only skip the current row
    if (i === col) {
      continue;
    }

    if (A[i][col] === 0) {
      explanations.push(
        `R<span class='subindex'>${i + 1}</span> at column ${col + 1} is already 0, so this step is skipped.`
      )

      continue
    };

    const coef = (A[i][col] as number) / pivot!;
    if (Number.isNaN(coef)) {
      continue;
    }

    explanations.push(
      `R<span class='subindex'>${i + 1}</span> = R<span class='subindex'>${i + 1}</span> ${coef < 0 ? '+' : '-'} ${![-1, 1].includes(coef) ? Math.abs(Number.isInteger(coef) ? coef : parseFloat(coef?.toFixed(3).replace(/(\.\d*?[1-9])0+$|\.0+$/, '$1'))) : ''}R<span class='subindex'>${col + 1}</span>`
    )

    for (let j = col; j < A[0].length; j++) {
      (A[i][j] as number) -= (A[col][j] as number) * coef;
    }
  }

  console.log('Shall return after eliminate values:', JSON.parse(JSON.stringify(A)));

  return { A, toReturnEarly: false, explanations };
}
