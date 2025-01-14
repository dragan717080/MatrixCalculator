import { FC } from 'react'
import { Link } from 'react-router-dom'

const LinearEquationsToolbar: FC = () => {
  return (
    <div>
      <ul className='bg-deepazure'>
        <li><Link to='/gauss-jordan-elimination'>Gauss Jordan Elimination</Link></li>
        <li><Link to='/cramer-rule'>Cramer's Rule</Link></li>
      </ul>
    </div>
  )
}

LinearEquationsToolbar.displayName = 'LinearEquationsToolbar';

export default LinearEquationsToolbar;
