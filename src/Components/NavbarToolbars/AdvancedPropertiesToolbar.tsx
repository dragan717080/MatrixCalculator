import { FC } from 'react';

const AdvancedPropertiesToolbar: FC = () => {
  return (
    <div>Advanced Matrix Properties 🔥
      <ul>
        <li><a href='/rank'>Matrix Rank</a></li>
        <li><a href='/determinant'>Determinant</a></li>
        <li><a href='/power'>Matrix Power</a></li>
      </ul>
    </div>
  )
}

AdvancedPropertiesToolbar.displayName = 'AdvancedPropertiesToolbar';

export default AdvancedPropertiesToolbar;
