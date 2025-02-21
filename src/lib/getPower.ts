import getMultiplication from './getMultiplication'
import Matrix, { Step } from '../interfaces/Matrix'

/** Identity matrix has only `1` on main diagonal, and `0` elsewhere. */
export const getIdentityMatrix = (n: number): Matrix =>
  Array.from(
    { length: n },
    (_, row) => Array.from({ length: n }, (_, col) => row === col ? 1 : 0)
  )

/**
 * A to the exponent `n` is same as in algebra, A multiplied by itself `n` times.
 * 
 * If power is 0, return identity matrix.
 * 
 * If power is 1, return starting matrix.
 * 
 * If power is 2, return `AxA` etc.
 */
const getPower = (A: Matrix, power: number): Step[] => {
  const n = A.length

  if (power === 0) {

    return [
      {
        A: getIdentityMatrix(n),
        explanation: 'A raised to the power of 0 gives an identity matrix'
      }
    ]
  }

  if (power === 1) {
    return [
      {
        A,
        explanation: 'A raised to the power of 1 gives the same matrix'
      }
    ]
  }

  let result = JSON.parse(JSON.stringify(A))

  // It shall track starting with level 2 since level 1 is simply original matrix
  const steps: Step[] = []

  for (let currentExponent = 1; currentExponent < power; currentExponent++) {
    const multSteps = getMultiplication(result, A)
    const { A: newResult } = multSteps[multSteps.length - 1]
    result = JSON.parse(JSON.stringify(newResult))

    const explanation = `Result of multiplying A${currentExponent} and A`
    steps.push({ A: newResult, explanation })
  }

  return steps
}

export default getPower
