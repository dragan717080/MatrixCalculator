import React, { FC } from 'react'
import Matrix from '../../interfaces/Matrix'
import OnlyOneRowProps from '../../interfaces/OnlyOneRowProps'

/**
 * In case matrix has only 1 row/col, its determinant will be value of `A[0][0]`.
 *
 * In that case, if that element value is non zero, it will be 1. Otherwise, it will be 0.
*/
const OnlyOneRow: FC<OnlyOneRowProps> = ({
  A,
  isRank = false
}) => {
  return (
    <>
      {!isRank
        ? (
          A.length === 1 && (
            <div className='w-full row overflow-hidden'>
              <span>
                A has only one row so Δ =
                A<span className='subindex'>1</span><span className='subindex'>1</span> = {A[0][0]}
              </span>
            </div>
          )
        )
        : (
          <>
            {A.length === 1 && (
              <div className='w-full row overflow-hidden'>
                <span>
                  A has only one row so since A
                  <span className='subindex'>1</span><span className='subindex'>1</span> is {
                    A[0][0] === 0 ? '0' : 'not 0'
                  } it will be {Number(A[0][0] !== 0)}
                </span>
              </div>
            )}
            {A.length !== 1 && A[0].length === 1 && (
              <div className='w-full row overflow-hidden'>
                <span>
                  A has only one column so since A
                  <span className='subindex'>1</span><span className='subindex'>1</span> is {
                    A[0][0] === 0 ? '0' : 'not 0'
                  } it will be {Number(A[0][0] !== 0)}
                </span>
              </div>
            )}
          </>
        )
      }
    </>
  )
}

export default OnlyOneRow
