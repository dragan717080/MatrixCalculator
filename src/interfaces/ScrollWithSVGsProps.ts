import React, { MouseEvent } from 'react'

export default interface ScrollWithSVGsProps {
  aCols: number
  isFirst?: boolean
  isLast?: boolean
  // Whether both `A` and `B` are in current solution step
  areBoth?: boolean
}
