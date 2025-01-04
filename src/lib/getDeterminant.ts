import Matrix from "../interfaces/Matrix";

interface DeterminantSolution {
  steps: Matrix[]
  result: number
}

/**
 * Gaussian elimination to get upper triangular form.
 * 
 * Every step n should pick Ann as pivot and turn nRows - n elements on row n into 0.
 * 
 * Example matrix:
 * 
 *    1    3      7      8
 * 
 *    4    2      5      4
 * 
 *    5    8      1      6
 * 
 *    6    7      2      3
 *
 * The pivot element is the first element of the first row: 1
 * To eliminate the elements below 1 1 in the first column (i.e., 4, 5, 6),
 * we subtract multiples of the first row from the other rows:
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
  const steps = []

  // Make copy of `A` to avoid directly mutating state
  const B = A.map(row => [...row])

  console.log(A)
  console.log('original matrix in get d:', B)
  console.log(Number.isNaN(A[1][0]))
  console.log(Number.isNaN(B[1][0]))

  // Implementation of Gaussian elimination steps
  for (let i = 0; i < n - 1; i++) {
    console.log('Row:', i)
    steps.push(eliminateCol(B, i))
  }

  let D = 1

  // Multiply upper diagonal
  for (let i = 0; i < n; i++) {
    D *= B[i][i]!
  }

  // Format
  const result = Number.isInteger(D) ? D : parseFloat(D.toFixed(3))

  return { steps, result }
}

const eliminateCol = (A: Matrix, col:number): Matrix => {
  const pivot = A[col][col]
  console.log('Pivot for row', col, ':', pivot)
  console.log('Received matrix', A)
  for (let i = col + 1; i < A.length; i++) {
    console.log('Row:', i);
    // If it is already 0, skip that row
    if (A[i][col] === 0) {
      continue
    }
    // Divide current row with pivot row
    console.log('shall divide', A[i][col], 'with', A[col][col]);
    const coef = A[i][col]! / A[col][col]!
    console.log('coef:', coef)
    //const updatedRow = [...A[i]]

    for (let j = 0; j < A.length; j++) {
      //updatedRow[j]! -= A[col][j]! * coef
    }

    //A[i] = updatedRow
  }
  console.log('updated matrix:', A)

  return A
}

export default getDeterminant
