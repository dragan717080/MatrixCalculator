import React, { FC, useEffect } from 'react'
import MatrixDimensionsInput from '../Atoms/MatrixDimensionsInput'
import { useMatrixStore } from '../../store/zustandStore';

const Multiplication: FC = () => {
  const { isOnlyA, setIsOnlyA, aDim, bDim, A, setA, B, setB, setCalculate } = useMatrixStore();

  const calculateResult = () => {
    console.log('calculating multiplication');
    const updatedMatrices = getUpdatedValues();
    const newA = updatedMatrices[0];
    let newB = updatedMatrices[1] ?? undefined;

    console.log('A:', newA);
    console.log('B:', newB);
  }

  const updateValuesForMatrix = (isA=true) => {
    const matrix = isA ? A : B!
    const func = isA ? setA : setB
    // Make a shallow copy of the previous matrix
    const newMatrix = [...matrix];

    for (const row in newMatrix) {
      for (const col in newMatrix[0]) {
        // To do: remove (check will be done in modal)
        if (typeof(matrix[row][col]) === 'undefined') {
          continue
        }

        // @ts-ignore:next-line
        if (matrix[row][col][matrix[row][col].length - 1] === '.') {
          // @ts-ignore:next-line
          matrix[row][col] = matrix[row][col] + '0'
        }

        // @ts-ignore:next-line
        if (matrix[row][col][matrix[row][col].length - 1] === '-') {
          // @ts-ignore:next-line
          matrix[row][col] = '0'
        }

        matrix[row][col] = parseFloat(matrix[row][col] as unknown as string)
      }
    }

    func!(newMatrix)

    return newMatrix
  }

  /** Turns matrices from input element strings to floats and returns them. */
  const getUpdatedValues = () => {
    const newA = updateValuesForMatrix()

    if (!isOnlyA) {
      const newB = updateValuesForMatrix(false)

      return [newA, newB]
    }

    return [newA]
  };

  useEffect(() => {
    setIsOnlyA(false);
  }, [])

  useEffect(() => {
    console.log('recalculating function');
    if (A && B || A && isOnlyA) {
      //calculateResult(); // Recalculate whenever A or B changes
      setCalculate(calculateResult)
    }
  }, [A, B]);

  return (
    <div className=''>
      <section>
        <MatrixDimensionsInput />
        <div className=''>
          <h3 className='bold'>About the method</h3>
          <ol>
            <li>The main condition of matrix multiplication is that the number of columns of the 1st matrix must equal to the number of rows of the 2nd one.</li>
            <li>As a result of multiplication you will get a new matrix that has the same quantity of rows as the 1st one has and the same quantity of columns as the 2nd one.</li>
            <li>For example if you multiply a matrix of 'n' x 'k' by 'k' x 'm' size you'll get a new one of 'n' x 'm' dimension.</li>
          </ol>
          To understand matrix multiplication better input any example and examine the solution.
        </div>
      </section>
      <p>Your dimensions A: {aDim[0]}, {aDim[1]}</p>
      <p>Your dimensions B: {!isOnlyA ? bDim[0] : 0}, {!isOnlyA ? bDim[1] : 0}</p>
    </div>
  )
}

export default Multiplication
