import { FC } from 'react';

const InversionsToolbar: FC = () => {
  return (
    <div>
      <ul className='bg-deepazure'>
        <li><a href='/inverse'>Inverse Matrix</a></li>
        <li><a href='/inverse-method'>Inverse Matrix Method</a></li>
      </ul>
    </div>
  )
}

InversionsToolbar.displayName = 'InversionsToolbar';

export default InversionsToolbar;
