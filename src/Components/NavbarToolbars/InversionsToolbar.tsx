import { FC } from 'react'
import { Link } from 'react-router-dom'

const InversionsToolbar: FC = () => {
  return (
    <div>
      <ul className='bg-deepazure'>
        <li><Link to='/inverse'>Inverse Matrix</Link></li>
        <li><Link to='/inverse-method'>Inverse Matrix Method</Link></li>
      </ul>
    </div>
  )
}

InversionsToolbar.displayName = 'InversionsToolbar';

export default InversionsToolbar;
