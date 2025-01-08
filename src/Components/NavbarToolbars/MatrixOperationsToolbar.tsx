import { FC } from 'react';

const MatrixOperationsToolbar: FC = () => {
  return (
    <div>
      <ul className='bg-deepazure'>
        <li><a href='/multiplication'>Matrix Multiplication</a></li>
        <li><a href='/addition-substraction'>Matrix Addition/Subtraction</a></li>
        <li><a href='/transpose'>Matrix Transpose</a></li>
      </ul>
    </div>
  )
}

MatrixOperationsToolbar.displayName = 'MatrixOperationsToolbar';

export default MatrixOperationsToolbar;
