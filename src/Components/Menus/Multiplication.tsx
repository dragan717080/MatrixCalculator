import React, { FC, useEffect } from 'react'
import MatrixDimensionsInput from '../Atoms/MatrixDimensionsInput'
import useUpdateValuesForMatrix from '../../lib/updateValuesForMatrix'
import { useMatrixStore } from '../../store/zustandStore'

const Multiplication: FC = () => {
  const { isOnlyA, setIsOnlyA, aDim, bDim, A, setA, setAIsFilled, B, setB, setBIsFilled, setCalculate } = useMatrixStore();

  const calculateResult = () => {

    console.log('A:', A);
    console.log('B:', B);
  }

  useEffect(() => {
    setAIsFilled(false)
    setBIsFilled(false)
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
        <MatrixDimensionsInput minValue={2} />
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
