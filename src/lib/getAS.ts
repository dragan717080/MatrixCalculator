import { Sign } from '../interfaces/Determinant';
import Matrix from '../interfaces/Matrix';

const getAS = (A: Matrix, B: Matrix, sign: Sign): Matrix => {
  return Array.from(
    { length: A.length },
    (_, row) =>
      Array.from(
        { length: A[0].length },
        ((_, col) => sign === '+'
          ? (A[row][col] as unknown as number) + (B[row][col] as unknown as number)
          : (A[row][col] as unknown as number) - (B[row][col] as unknown as number)
        )
      )
  )
}

export default getAS;
