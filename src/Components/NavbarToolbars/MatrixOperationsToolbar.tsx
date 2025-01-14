import { FC } from 'react'
import { Link } from 'react-router-dom'

const MatrixOperationsToolbar: FC = () => {
  return (
    <div>
      <ul className='bg-deepazure'>
        <li><Link to='/multiplication'>Matrix Multiplication</Link></li>
        <li><Link to='/addition-substraction'>Matrix Addition/Subtraction</Link></li>
        <li><Link to='/transpose'>Matrix Transpose</Link></li>
      </ul>
    </div>
  )
}

MatrixOperationsToolbar.displayName = 'MatrixOperationsToolbar'

export default MatrixOperationsToolbar
