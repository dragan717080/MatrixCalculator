import React, { FC } from 'react'
import MatrixDimensionsInput from '../Atoms/MatrixDimensionsInput'
import { useMatrixStore } from '../../store/zustandStore'

const Rank: FC = () => {

  const { A } = useMatrixStore()

  return (
    <div>
      Rank
      <MatrixDimensionsInput />
    </div>
  )
}

export default Rank
