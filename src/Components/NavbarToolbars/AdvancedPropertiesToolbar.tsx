import { FC } from 'react';

const AdvancedPropertiesToolbar: FC = () => {
  return (
    <div>
      <ul className='bg-deepazure'>
        <li><a href='/rank'>Matrix Rank</a></li>
        <li><a href='/determinant'>Matrix Determinant</a></li>
        <li><a href='/power'>Matrix Power</a></li>
      </ul>
    </div>
  )
}

AdvancedPropertiesToolbar.displayName = 'AdvancedPropertiesToolbar';

export default AdvancedPropertiesToolbar;
