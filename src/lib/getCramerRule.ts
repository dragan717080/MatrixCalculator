import getInverse from './getInverse'
import getDeterminant from './getDeterminant'
import Matrix, { InverseMethodSolution, Step } from '../interfaces/Matrix'
import { getOrderNumberToStr } from './utils'

/**
 * Solution of simultaneous linear equations using Cramer's rule.
 * 
 * Initial matrix must be square and its determinant must be non zero for the system
 * to be consistent.
 * 
 * Columns of solution vector are repeatedly put in place
 * of each column.
 * 
 * Then, determinant of that matrix is divided by original determinant
 * to get that column's solution (one of the system's variables).
 * 
 * After that, column is restored to the original and process is repeated
 * for the next column.
 *
 * Initial matrix
 *
 * ```
 *     X1      X2     X3     b
 *
 *     1       2      3      19
 *
 *    -4      -2      5      4
 *
 *     3       1     -1      7
 *
 * ```
 * 
 * Use Gauss-Jordan elimination to get the inverse matrix.
 *
 * Find determinant, if is zero, it means that the system of linear equations
 * is either inconsistent or has infinitely many solutions.
 *
 * Δ = 25
 *
 * Determinant is not zero, therefore system is consistent.
 * 
 * Replace the 1st column of the main matrix with the solution vector and find its determinant.
 *
 * ```
 *     X1      X2     X3
 *
 *    19       2      3
 *
 *    -4      -2      5
 *
 *     3       1     -1
 * ```
 * 
 * Δ1 = 75
 * 
 * Replace the 2nd column of the main matrix with the solution vector and find its determinant.
 *
 * ```
 *     X1      X2     X3
 *
 *     1       19     3
 *
 *    -4       4      5
 *
 *     3       7     -1
 * ```
 * 
 * Δ2 = 50
 * 
 * Replace the 3rd column of the main matrix with the solution vector and find its determinant.
 *
 * ```
 *     X1       X2      X3
 *
 *     1        2       19
 *
 *    -4       -2       4
 *
 *     3        1       7
 * ```
 *
 * Δ3 = 100
 * 
 * Divide determinants to get the solution.
 * 
 * X1 = Δ1 / Δ = 75 / 25 = 3
 * 
 * X2 = Δ2 / Δ = 50 / 25 = 2
 * 
 * X3 = Δ3 / Δ = 100 / 25 = 4
 * 
 * Solution set:
 * 
 * X1 = 3
 * 
 * X2 = 2
 * 
 * X3 = 4
 */
const getCramerRule = (A: Matrix, equationCoefs: number[]): InverseMethodSolution => {
  let B = JSON.parse(JSON.stringify(A))
  
  const { result: determinant } = getDeterminant(B)

  const steps: Step[] = []

  if (determinant === 0) {
    return {
      solution: null,
      steps,
      determinant
    }
  }

  const solution = [[]] as Matrix

  for (let col = 0; col < A[0].length; col++) {
    // Deep copy
    const newB = JSON.parse(JSON.stringify(B))

    swapColumnsOfMatrix(newB, col, equationCoefs)
    const { result: newRowDeterminant } = getDeterminant(newB)

    let colSolution = newRowDeterminant / determinant
    colSolution = Math.round(colSolution * 1000) / 1000

    solution[0].push(colSolution)

    steps.push({
      A: newB,
      explanation: [`
        <p>Swap ${col + 1}${getOrderNumberToStr(col)} column with the solution vector</p>
        <p>X<span class='subindex'>${col + 1}</span> = Δ<span class='subindex'>${col + 1}</span> / Δ = ${colSolution}</p>`
      ]
    })
  }

  return {
    solution,
    steps,
    determinant
  }
}

/** Will change matrix since it uses its reference. */
const swapColumnsOfMatrix = (A: Matrix, col: number, equationCoefs: number[]) => {
  for (let row = 0; row < A.length; row++) {
    A[row][col] = equationCoefs[row]
  }
}

export default getCramerRule
