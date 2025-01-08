import Matrix from '../interfaces/Matrix'

/** Identity matrix has only `1` on main diagonal, and `0` elsewhere. */
const getIdentityMatrix = (n: number): Matrix =>
  Array.from(
    { length: n },
    (_, row) => Array.from({ length: n }, (_, col) => row === col ? 1 : 0)
  )

/**
 * If power is 0, return identity matrix.
 * 
 * If power is 1, return starting matrix.
 * 
 * 
 */
const getPower = (A: Matrix, n: number, power: number): Matrix => {
  if (power === 0) {
    return getIdentityMatrix(n)
  }

  if (power === 1) {
    return A
  }

  return getIdentityMatrix(n)
}

export default getPower
