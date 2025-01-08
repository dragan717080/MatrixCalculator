import { FC } from 'react';

const LinearEquationsToolbar: FC = () => {
  return (
    <div>
      <ul className='bg-deepazure'>
        <li><a href='/gauss-jordan-elimination'>Gauss Jordan Elimination</a></li>
        <li><a href='/cramer-rule'>Cramer's Rule</a></li>
      </ul>
    </div>
  )
}

LinearEquationsToolbar.displayName = 'LinearEquationsToolbar';

export default LinearEquationsToolbar;
