import React, { FC, MouseEvent } from 'react'
import ScrollWithSVGsProps from '../../interfaces/ScrollWithSVGsProps'

const ScrollWithSVGs: FC<ScrollWithSVGsProps> = ({
  handleClickUp,
  handleClickDown,
  aCols,
  isFirst,
  isLast
}) => {
  return (
    <div className={`${aCols > 5 ? 'mr-7' : ''}`}>
      <svg onClick={(e) => handleClickUp(e)} className={`svg-up ${isFirst && 'opacity-0'}`} width='30px' height='30px' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg' fill='#006CBC'><g id='SVGRepo_bgCarrier' strokeWidth='0'></g><g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g><g id='SVGRepo_iconCarrier'> <path d='M0 0h48v48H0z' fill='none'></path> <g id='Shopicon'> <polygon points='6.586,30.586 9.414,33.414 24,18.828 38.586,33.414 41.414,30.586 24,13.172 '></polygon> </g> </g></svg>
      <svg onClick={(e) => handleClickDown(e)} className={`svg-down ${isLast && 'opacity-0'}`} width='30px' height='30px' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg' fill='#006CBC'><g id='SVGRepo_bgCarrier' strokeWidth='0'></g><g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g><g id='SVGRepo_iconCarrier'> <path d='M0 0h48v48H0z' fill='none'></path> <g id='Shopicon'> <g> <polygon points='24,29.171 9.414,14.585 6.586,17.413 24,34.827 41.414,17.413 38.586,14.585 '></polygon> </g> </g> </g></svg>
    </div>
  )
}

export default ScrollWithSVGs
