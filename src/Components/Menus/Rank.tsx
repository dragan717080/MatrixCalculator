import React, { FC, useEffect } from 'react'
import MatrixDimensionsInput from '../Atoms/MatrixDimensionsInput'
import { useMatrixStore } from '../../store/zustandStore'

const Rank: FC = () => {

  const { setCalculate, setIsOnlyA, A, setAIsFilled, setBIsFilled } = useMatrixStore()

  useEffect(() => {
    setAIsFilled(false)
    setBIsFilled(false)
    setIsOnlyA(true);
  }, [])

  return (
    <div>
      Rank
      <MatrixDimensionsInput minValue={2} />
    </div>
  )
}

export default Rank
