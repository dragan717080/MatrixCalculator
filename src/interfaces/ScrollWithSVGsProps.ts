import React, { MouseEvent } from 'react'

export default interface ScrollWithSVGsProps {
  handleClickUp: (e: MouseEvent<SVGSVGElement>) => void
  handleClickDown: (e: MouseEvent<SVGSVGElement>) => void
  aCols: number
  isFirst?: boolean
  isLast?: boolean
}
