import React, { FC, useState } from 'react'
import MatrixDimensionsInput from '../Atoms/MatrixDimensionsInput'
import Matrix from '../../interfaces/Matrix';

const Multiplication: FC = () => {
  const [aDim, setADim] = useState<number>(0);
  const [bDim, setBDim] = useState<number>(0);
  const [A, setA] = useState<Matrix>([] as Matrix);
  const [B, setB] = useState<Matrix>([] as Matrix);

  return (
    <div className=''>
      <section>
        <MatrixDimensionsInput setADim={setADim} setA={setA} setBDim = {setBDim} setB={setB} />
        <div className=''>
          <h3 className='bold'>About the method</h3>
          <ol>
            <li>The main condition of matrix multiplication is that the number of columns of the 1st matrix must equal to the number of rows of the 2nd one.</li>
            <li> As a result of multiplication you will get a new matrix that has the same quantity of rows as the 1st one has and the same quantity of columns as the 2nd one.</li>
            <li>For example if you multiply a matrix of 'n' x 'k' by 'k' x 'm' size you'll get a new one of 'n' x 'm' dimension.</li>
          </ol>
          To understand matrix multiplication better input any example and examine the solution.
        </div>
      </section>
      <p>Your dimensions: {aDim}, {bDim}</p>
    </div>
  )
}

export default Multiplication
