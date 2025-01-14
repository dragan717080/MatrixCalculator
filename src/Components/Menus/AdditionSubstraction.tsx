import React, { FC, useRef, useState, useEffect } from 'react'
import MatrixDimensionsInput from '../Atoms/MatrixDimensionsInput'
import MatrixTable from '../Atoms/MatrixTable'
import useRecalculate from '../../hooks/useRecalculate'
import useResetParams from '../../hooks/useResetParams'
import useToggleShowSolution from '../../hooks/useToggleShowSolution'
import { getCalcTime } from '../../lib/utils'
import { useMatrixStore, useModalStore } from '../../store/zustandStore'
import Matrix from '../../interfaces/Matrix'
import getAS from '../../lib/getAS'
import OriginalMatrix from '../Atoms/OriginalMatrix'

const AdditionSubstraction: FC = () => {
  const {
    setCalculate,
    aDim,  aIsFilled, A,
    B, bIsFilled,
    sign
  } = useMatrixStore()
  const { isOpen } = useModalStore()

  const solutionStepsRef = useRef<HTMLDivElement | null>(null)
  const descriptionAndInputRef = useRef<HTMLDivElement | null>(null)

  const [C, setC] = useState<Matrix>(A)
  const [time, setTime] = useState<number>(-1)
  const [toShowSolution, setToShowSolution] = useState<boolean>(false)

  const { recalculate } = useRecalculate({ setTime, setC, setShow: setToShowSolution, stepsRef: solutionStepsRef, isSign: true })

  const { resetParams } = useResetParams({ onlyHasA: false, isSign: true, descriptionAndInputRef })

  const { toggleShowSolution } = useToggleShowSolution({ solutionStepsRef, toShowSolution, setToShowSolution })

  const calculateResult = () => {
    // It will go to this function again when `A` or `B` change with `updateValuesForMatrix`
    if (!A.length || !A.flat().every(x => typeof (x) !== 'string') || !B.length || !B.flat().every(x => typeof (x) !== 'string')) {
      return
    }

    const { time, funcResult: result } = getCalcTime(() => getAS(A, B, sign))

    setC(result)
    setTime(time)
  }

  useEffect(() => {
    if (A && B) {
      setCalculate(calculateResult)
      if (aIsFilled && bIsFilled && !isOpen && time === -1) {
        calculateResult()
      }
    }
  }, [A, B, aIsFilled, bIsFilled, isOpen, time])

  useEffect(() => {
    resetParams()
  }, [])

  return (
    <div className='col-h'>
      {aIsFilled && bIsFilled && !isOpen && (
        <div ref={solutionStepsRef}>
          {toShowSolution && (
              <div className='solution-items-container mb-7'>
                <OriginalMatrix A={A} steps={[]} B={B} needsDeterminant={false} /> 
              </div>
          )}
        </div>
      )}
      <div ref={descriptionAndInputRef} className='hidden'>
        <div className={`${isOpen || aIsFilled && bIsFilled ? 'hidden' : 'block'}`}>
          <h3 className='mb-4 text-lg bold'>Addition and Substraction</h3>
          <p>
            Matrix addition or subtraction is calculated by addition or subtraction of corresponding elements.<br />
            As a result you get a new matrix with the same dimension.<br />
            <span>
              For example, C<span className='subindex'>1</span><span className='subindex'>1</span> = A<span className='subindex'>1</span><span className='subindex'>1</span> {sign} B<span className='subindex'>1</span><span className='subindex'>1</span>
            </span>
          </p>
          <MatrixDimensionsInput minValue={1} isAS={true} />
        </div>
        {aIsFilled && bIsFilled && !isOpen && (
          <>
            <div className={`
              ${toShowSolution
                ? 'mt-1 md:mt-2 mb-4 md:mb-6'
                : 'mb-8 md:mb-12'
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
            {time > -1 && (
              <section>
                <h3 className='bold mb-2'>Result of {sign === '+' ? 'addition' : 'substraction'}</h3>
                <MatrixTable nRows={aDim[0]} nCols={aDim[1]} A={C} />
                <div className='w-full flex'>
                  <span className='ml-auto pt-2'>
                    Computation time: <span>{time}</span>sec.
                  </span>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default AdditionSubstraction
