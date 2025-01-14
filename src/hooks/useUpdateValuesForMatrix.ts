import { useMatrixStore } from '../store/zustandStore'
import Matrix, { MatrixElement } from '../interfaces/Matrix'

const useUpdateValuesForMatrix = () => {
  const { A, B } = useMatrixStore()

  const updateValuesForArr = (arr: (string|number)[]) => {
    // Make a deep copy of the previous array
    const newArr = [...arr]

    for (const row in arr) {
      if (typeof arr[row] === 'undefined' || arr[row] === null) {
        newArr[row] = 0
        continue
      }

      if ((newArr[row] as string)[(newArr[row] as string).length - 1] === '.') {
        newArr[row] = newArr[row] + '0'
      }

      if ((newArr[row] as string)[(newArr[row] as string).length - 1] === '-') {
        newArr[row] = '0'
      }

      newArr[row] = parseFloat(newArr[row] as unknown as string)
    }

    return newArr
  }

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

    for (const row in newMatrix) {
      for (const col in newMatrix[0]) {
        if (typeof matrix[row][col] === 'undefined' || matrix[row][col] === null) {
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
      }
    }

    return newMatrix
  }

  return { updateValuesForArr, updateValuesForMatrix }
}

export default useUpdateValuesForMatrix
