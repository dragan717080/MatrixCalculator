import React, { FC } from 'react'
import SolutionRowsProps from '../../interfaces/SolutionRowsProps'

const SolutionRows: FC<SolutionRowsProps> = ({
  children,
  toShowSolution,
  time,
  toggleShowSolution,
  recalculate,
  toShow = true
}) => {
  return (
    <>
      {toShow && (
        <>
          <div className={`
            ${toShowSolution
              ? 'mt-6 md:mt-4 mb-7 md:mb-8'
              : 'mt-3 mb-1'
            }
              row text-white space-x-5
            `}>
            <button
              onClick={() => toggleShowSolution()}
              className='btn btn-brighter'
            >
              {!toShowSolution ? 'Show' : 'Hide'} solution
            </button>
            <button
              onClick={() => recalculate()}
              className='btn btn-brighter'
            >
              Recalculate
            </button>
          </div>
          <section className={!toShowSolution ? 'pt-6' : 'pt-2'}>
            <>{children}</>
            <div className='w-full flex'>
              <span className='ml-auto pt-2'>
                Computation time: <span>{time !== - 1 ? time : '0.001'}</span>sec.
              </span>
            </div>
          </section>
        </>
      )}
    </>
  )
}

export default SolutionRows
