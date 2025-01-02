import React, { FC } from 'react'
import MatrixDimensionsInput from '../Atoms/MatrixDimensionsInput'

const Determinant: FC = () => {
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
