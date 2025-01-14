import { FC } from 'react'
import { Link } from 'react-router-dom'

const AdvancedPropertiesToolbar: FC = () => {
  return (
    <div>
      <ul className='bg-deepazure'>
        <li><Link to='/rank'>Matrix Rank</Link></li>
        <li><Link to='/determinant'>Matrix Determinant</Link></li>
        <li><Link to='/power'>Matrix Power</Link></li>
      </ul>
    </div>
  )
}

AdvancedPropertiesToolbar.displayName = 'AdvancedPropertiesToolbar'

export default AdvancedPropertiesToolbar
