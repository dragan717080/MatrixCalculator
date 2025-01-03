import React, { FC, useEffect, useState } from 'react'
import MatrixDimensionsInput from '../Atoms/MatrixDimensionsInput'
import { useMatrixStore, useModalStore } from '../../store/zustandStore'

const Determinant: FC = () => {
  const { setCalculate, aDim, A, aIsFilled, setAIsFilled, bIsFilled, setBIsFilled } = useMatrixStore()
  const { isOpen } = useModalStore()
  const [determinant, setDeterminant] = useState<number|undefined>(undefined)

  const calculateResult = () => {
    console.log('A in calculate:',);
  }

  useEffect(() => {
    console.log('recalculating function');
    if (A) {
      setCalculate(calculateResult)
    }
  }, [aIsFilled]);

  useEffect(() => {
    setAIsFilled(false)
    setBIsFilled(false)
  }, [])

  return (
    <div className=''>
      <p>
        Here you can calculate a determinant of a matrix with complex numbers online for free with a very detailed solution. Determinant is calculated by reducing a matrix to row echelon form and multiplying its main diagonal elements.
      </p>
      <MatrixDimensionsInput isSquare={true} />
    </div>
  )
}

export default Determinant
