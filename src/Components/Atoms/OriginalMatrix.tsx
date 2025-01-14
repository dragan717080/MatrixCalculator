import React, { FC, memo } from 'react'
import MatrixTable from './MatrixTable'
import OnlyOneRow from './OnlyOneRow'
import ScrollWithSVGs from './ScrollWithSVGs'
import Matrix from '../../interfaces/Matrix'
import OriginalMatrixProps from '../../interfaces/OriginalMatrixProps'

const OriginalMatrix: FC<OriginalMatrixProps> = ({ A, steps, B, needsDeterminant=true, isEquation=false }) => {
  return (
    <>
      <div id='step-1' className='row-v pb-2 px-3 border-b-darkgray'>
        {typeof (B) === 'undefined'
          ? (
            <>
              {steps.length > 1 && (
                <ScrollWithSVGs aCols={A[0].length} isFirst />
              )}
              <div className='flex-1'>
                {A.length > 0 && A[0].length > 0 && (
                  <h3 className='mb-6 text-center bold leading-4'>Original matrix</h3>
                )}
                <MatrixTable
                  nRows={A.length}
                  nCols={A[0].length}
                  A={A}
                  letter={isEquation ? 'X' : 'A'}
                  highlightFunc={
                    needsDeterminant && (A.length === 1 || A[0].length === 1)
                      ? (row, col) => row === 0 && col === 0
                      : undefined
                  }
                  isWithCoefs={isEquation}
                />
                {needsDeterminant && (
                  <OnlyOneRow A={A} />
                )}
              </div>
            </>
          )
          : (
            <>
              {steps.length > 1 && (
                <ScrollWithSVGs aCols={A[0].length} isFirst areBoth />
              )}
              <div>
                {(steps.length > 0 || !needsDeterminant) && (
                  <h3 className='mb-2 text-center bold leading-4'>Original matrices</h3>
                )}
                <div className='flex-1 row flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 pb-6 md:pb-0'>
                  <MatrixTable nRows={A.length} nCols={A[0].length} A={A} />
                  <MatrixTable nRows={B!.length} nCols={B![0].length} A={B!} letter='B' />
                </div>
              </div>
            </>
          )}
      </div>
    </>
  )
}

export default memo(OriginalMatrix)
