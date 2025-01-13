import getInverse from './getInverse'
import getMultiplication from './getMultiplication'
import Matrix, { InverseMethodSolution } from '../interfaces/Matrix'

/**
 * Solution of simultaneous linear equations using Inverse Matrix Method.
 *
 * Initial matrix
 * 
 *     X1     X2     X3     b
 *
 *     1      2      3      15
 *
 *     4      5      6      22
 *
 *     8      7      1      4
 *
 * Use Gauss-Jordan elimination to get the inverse matrix.
 *
 * Find determinant, if is zero, it means that the system of linear equations
 * is either inconsistent or has infinitely many solutions.
 *
 * Δ = 15
 *
 * Determinant is not zero, therefore inverse matrix exists.
 *
 * ```
 *     X1          X2          X3
 *
 *     -2.465      1.265	   -0.2
 *
 *     2.931      -1.531       0.4
 *
 *     -0.799      0.599      -0.2
 * ```
 *
 * Multiply the inverse matrix by the solution vector.
 *
 * The result vector is a solution of the matrix equation.
 */
const getInverseMethod = (A: Matrix, equationCoefs: number[]): InverseMethodSolution => {
  const { A: inverseMatrix, steps, determinant } = getInverse(A)

  if (determinant === 0) {
    return {
      solution: null,
      steps,
      determinant
    }
  }

  // Turn equation coefs to `Matrix` type so they can be multiplied with inverse matrix
  const coefsMatrix = equationCoefs.map(x => [x])

  const multiplicationSteps = getMultiplication(inverseMatrix!, coefsMatrix)
  const resultMatrix = multiplicationSteps[multiplicationSteps.length - 1].A

  console.log('Result matrix:', resultMatrix);

  steps.push({
    A: resultMatrix,
    explanation: 'Multiply the inverse matrix by the initial coefficients vector'
  })

  return {
    solution: resultMatrix,
    steps,
    determinant
  }
}

export default getInverseMethod;
