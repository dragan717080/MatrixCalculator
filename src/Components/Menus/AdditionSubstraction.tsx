import React, { FC, useCallback, useRef, useState, useEffect } from 'react'
import MatrixDimensionsInput from '../Atoms/MatrixDimensionsInput'
import MatrixTable from '../Atoms/MatrixTable'
import ScrollWithSVGs from '../Atoms/ScrollWithSVGs'
import useRecalculate from '../../hooks/useRecalculate'
import useResetParams from '../../hooks/useResetParams'
import { getCalcTime, wait } from '../../lib/utils'
import { useMatrixStore, useModalStore } from '../../store/zustandStore'
import Matrix, { Step } from '../../interfaces/Matrix'
import getAS from '../../lib/getAS'

const AdditionSubstraction: FC = () => {
  const {
    setCalculate,
    aDim, setADim, aIsFilled, A, setA, setAIsFilled,
    bDim, setBDim, B, setB, bIsFilled, setBIsFilled,
    sign
  } = useMatrixStore()
  const { isOpen, setIsOpen } = useModalStore()

  const solutionStepsRef = useRef<HTMLDivElement | null>(null)

  const [C, setC] = useState<Matrix>(A)
  const [time, setTime] = useState<number>(-1)
  const [toShowSolution, setToShowSolution] = useState<boolean>(false)

  const { recalculate } = useRecalculate({ setTime, setC, setShow: setToShowSolution, stepsRef: solutionStepsRef, isSign: true })

  const { resetParams } = useResetParams({ onlyHasA: false, isSign: true, })

  const calculateResult = () => {
    // It will go to this function again when `A` or `B` change with `updateValuesForMatrix`
    if (!A.length || !A.flat().every(x => typeof (x) !== 'string') || !B.length || !B.flat().every(x => typeof (x) !== 'string')) {
      return
    }
    console.log('A:', A)
    console.log('B:', B);
    console.log('sign:', sign);
    const { time, funcResult: result } = getCalcTime(() => getAS(A, B, sign))
    console.log(`Result of ${sign === '+' ? 'addition' : 'substraction'}`)
    console.log(result)
    setC(result)
    setTime(time)
  }

  const toggleShowSolution = useCallback(async () => {
    if (!toShowSolution) {
      solutionStepsRef.current!.classList.remove('hidden')
      solutionStepsRef.current!.classList.add('fade-in-table')
      solutionStepsRef.current!.classList.remove('fade-out-table')
    } else {
      solutionStepsRef.current!.classList.remove('fade-in-table')
      solutionStepsRef.current!.classList.add('fade-out-table')
      await wait(700)
      solutionStepsRef.current!.classList.add('hidden')
    }

    setToShowSolution(!toShowSolution)
  }, [toShowSolution])

  useEffect(() => {
    console.log('recalculating function');
    console.log(A);
    console.log(B);
    if (A && B) {
      setCalculate(calculateResult)
      if (aIsFilled && bIsFilled) {
        calculateResult()
      }
    }
  }, [A, B, aIsFilled, bIsFilled])

  useEffect(() => {
    resetParams()
  }, [])

  return (
    <div className='col-h'>
      {aIsFilled && bIsFilled && !isOpen && (
        <div ref={solutionStepsRef}>
          {toShowSolution && (
            <>
              <h3 className='bold leading-4'>Original matrices</h3>
              <div className='mb-7'>
                <div id='step-1' className='row-v px-3 border-b-darkgray'>
                  <div className='row flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 pb-6 md:pb-0'>
                    <MatrixTable nRows={aDim[0]} nCols={aDim[1]} A={A} />
                    <MatrixTable nRows={bDim[0]} nCols={bDim[1]} A={B} letter='B' />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
      <div>
        <div className={`${isOpen || aIsFilled && bIsFilled ? 'hidden' : 'block'}`}>
          <h3 className='mb-4 text-lg bold'>Addition and Substraction</h3>
          <p>
            Matrix addition or subtraction is calculated by addition or subtraction of corresponding elements.<br/>
            As a result you get a new matrix with the same dimension.<br/>
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
