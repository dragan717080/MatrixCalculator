import Matrix from '../interfaces/Matrix'
import getDeterminant from './getDeterminant'

/**
 * Gauss-Jordan elimination to get the inverse matrix.
 *
 * Inverse is only defined if determinant is defined.
 */
const getInverse = (A: Matrix) => {
  const n = A.length

  const { result: determinant } = getDeterminant(A)
  
  if (determinant === 0) {
    console.log('Determinant is 0 so inverse is undefined');
  }

  console.log('Determinant:', determinant);
}

export default getInverse;
