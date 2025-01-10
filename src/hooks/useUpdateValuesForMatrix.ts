import { useMatrixStore } from '../store/zustandStore'
import Matrix from '../interfaces/Matrix'

const useUpdateValuesForMatrix = () => {
  const { A, B } = useMatrixStore()

  /**
   * Turn string matrix values to numeric.
   * 
   * It has access to `A` and `B` from store thanks to closure.
   * 
   * @param {boolean} isA - Defaults to true.
   * @param {boolean} newA - Whether to ignore store
   * and instead use optional value of `newA` that was provided.
   */
  const updateValuesForMatrix = (
    isA = true,
    newA?: Matrix
  ): Matrix => {
    const matrix = newA ? newA : isA ? A : B!;

    // Make a deep copy of the previous matrix
    const newMatrix: (string | undefined | number)[][] = matrix.map(row =>
      row.map(element => (element !== undefined ? String(element) : element))
    )
    // console.log('updating values');

    for (const row in newMatrix) {
      for (const col in newMatrix[0]) {
        if (typeof matrix[row][col] === 'undefined' || matrix[row][col] === null) {
          console.log('%cMET UNDEFINED', 'color:red;font-size:40px', matrix[row][col]);
          newMatrix[row][col] = 0
          continue
        }

        if ((newMatrix[row][col] as string)[(newMatrix[row][col] as string).length - 1] === '.') {
          newMatrix[row][col] = newMatrix[row][col] + '0'
        }

        if ((newMatrix[row][col] as string)[(newMatrix[row][col] as string).length - 1] === '-') {
          newMatrix[row][col] = '0'
        }

        newMatrix[row][col] = parseFloat(newMatrix[row][col] as unknown as string)
        // console.log('shall push value:', parseFloat(newMatrix[row][col] as unknown as string));
      }
    }

    console.log('Shall return updated matrix:', newMatrix);
    return newMatrix
  }

  return { updateValuesForMatrix }
}

export default useUpdateValuesForMatrix
