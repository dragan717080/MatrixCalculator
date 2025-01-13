import Matrix, { Step, TwoNumbers } from '../interfaces/Matrix'
import DotProduct from '../interfaces/Multiplication'

/**
 * Matrix `A` must have same number of columns as matrix `B` has rows.
 *
 * As in, `MxN` and `NxQ` must hold.
 *
 * Product of `MxN` and `NxQ` matrix will be matrix `MxQ`.
 *
 * Example: 5x2 matrix and 2x3 matrix (will give 5x3 matrix).
 *
 * A
 *
 *  5 -2
 *
 *  0 7
 *
 * -3 5
 *
 *  6 1
 *
 *  6 5
 *
 * B
 *
 *  7 3 1
 *
 * -5 0 4
 *
 * Multiplication is dot product of rows of A and cols of B.
 *
 * Result value Cmn will be product of mth row of A and nth col of B.
 *
 * C11 = 5 * 7 + (-2 * -5) = 35 + 10 = 45
 *
 * C12 = 5 * 3 + (-2 * 0) = 15 - 0 = 15
 *
 * C13 = (5 * 1) + (-2 * 4) = 5 - 8 = -3
 *
 * C21 = 0 * 7 + (7 * -5) = -35
 *
 * C22 = 0 * 3 + 7 * 0 = 0
 *
 * C23 = 0 * 1 + 7 * 4 = 28
 *
 * C31 = (-3 * 7) + (5 * -5) = -46
 *
 * C32 = -3 * 3 + 5 * 0 = -9
 *
 * C33 = -3 * 1 + 5*4 = 17
 *
 * C41 = 6 * 7 + (1 * -5) = 37
 *
 * C42 = 6 * 3 + 1 * 0 = 18
 *
 * C43 = 6 * 1 + 1 * 4 = 10
 *
 * C51 = 6 * 7 + (5 * -5) = 17
 *
 * C52 = 6 * 3 + 5 * 0 = 18
 *
 * C53 = 6 * 1 + 5 * 4 = 26
  
 *
 * Result matrix
 *
 *  45   15   -3
 *
 * -35    0   28
 *
 * -46   -9   17
 *
 *  37   18   10
 *
 *  17   18   26
 *
 * Not commutative AB =/= BA (but dot product between two vectors is commutative xTy = yTx
 *
 * Distributive    A(B + C) = AB + AC
 *
 * Associative     A(BC) = (AB)C
 *
 * With transpose (AB)T = BTAT (but not ATBT)
 */
const getMultiplication = (A: Matrix, B: Matrix): Step[] => {
  /** Captures the state of the matrix after each dot product. */
  const solution = [];
  // console.log('start A:', JSON.parse(JSON.stringify(A)));
  console.log('%cstart A:', 'color:red;font-size:22px', JSON.parse(JSON.stringify(A)));
  console.log('start B:', JSON.parse(JSON.stringify(B)));

  // Create a deep copy of A to avoid mutating the original matrix
  let C = Array.from({ length: A.length }, () =>
    Array((B[0].length)))

  console.log('Start C:', JSON.parse(JSON.stringify(C)));

  for (let i = 0; i < A.length; i++) {
    let explanationRow = []
    let indicesRow: TwoNumbers[] = []

    for (let j = 0; j < B[0].length; j++) {
      console.log(`A[${i}][${j}] will be product of ${i}th row of A and ${j}th col of B`);
      const { value, explanation, indices } = getDotProduct(A, B, i, j)  // Calculate the dot product
      C[i][j] = value
      explanationRow.push(explanation)
      indicesRow.push(indices)
    }

    console.log('New C:', JSON.parse(JSON.stringify(C)));
    // Log the row before pushing it to the solution array
    console.log('Updated row', i, ':', JSON.parse(JSON.stringify(C))[i]);
    // console.log('%cWill push to solution:', 'color:red;font-size:22px;', JSON.parse(JSON.stringify(C)));

    solution.push({
      A: JSON.parse(JSON.stringify(C)),
      explanation: explanationRow,
      indices: indicesRow
    });
    console.log('New solution:', solution)
  }

  return solution
};

export default getMultiplication;

/** Get dot product of i-th row and j-th column. */
const getDotProduct = (
  A: Matrix,
  B: Matrix,
  i: number,
  j: number,
): DotProduct => {
  let sum = 0;

  /** Explanation display will be changed in the `Multiplication` component,
   * that will add the `subindex` span to display row/col. */
  let explanation = ''
  //let explanation = `A[${i}][${j}] = `

  for (let k = 0; k < A[i].length; k++) {
    console.log('k:', k)
    const value = (A[i][k] as number) * (B[k][j]! as number)
    console.log('A value:', A[i][k], 'B value:', B[k][j], 'value:', (A[i][k] as number) * (B[k][j]! as number));
    sum += value;
    explanation += `${A[i][k]!} * ${B[k][j]!}`

    if (k !== A[i].length - 1) {
      // console.log('adding plus to explanation');
      explanation += ' + '
    }
  }

  explanation += ` = ${Math.round(sum * 1000) / 1000}`

  console.log('\nvalue of element at row', i, 'col', j, ':', sum, '\n')
  console.log(`Explanation for ${i} ${j}: ${explanation}`);
  return {
    value: Math.round(sum * 1000) / 1000,
    explanation,
    // One based indices
    indices: [i + 1, j + 1]
  }
}
