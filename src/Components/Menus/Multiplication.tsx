import React, { FC, useEffect, useRef, useState } from 'react'
import MatrixDimensionsInput from '../Atoms/MatrixDimensionsInput'
import MatrixTable from '../Atoms/MatrixTable'
import ScrollWithSVGs from '../Atoms/ScrollWithSVGs'
import useRecalculate from '../../hooks/useRecalculate'
import useResetParams from '../../hooks/useResetParams'
import useToggleShowSolution from '../../hooks/useToggleShowSolution'
import getMultiplication from '../../lib/getMultiplication'
import { getCalcTime } from '../../lib/utils'
import { useMatrixStore } from '../../store/zustandStore'
import { useModalStore } from '../../store/zustandStore'
import { Step } from '../../interfaces/Matrix'
import OriginalMatrix from '../Atoms/OriginalMatrix'

const Multiplication: FC = () => {
  const {
    aDim, A, aIsFilled,
    B, bIsFilled,
    setCalculate
  } = useMatrixStore()
  const { isOpen } = useModalStore()

  const solutionStepsRef = useRef<HTMLDivElement | null>(null)

  const descriptionAndInputRef = useRef<HTMLDivElement | null>(null)

  const [toShowSolution, setToShowSolution] = useState<boolean>(false)
  const [steps, setSteps] = useState<Step[]>([])
  const [time, setTime] = useState<number>(-1)

  const { recalculate } = useRecalculate({ setTime, setShow: setToShowSolution, setSteps, stepsRef: solutionStepsRef })

  const { resetParams } = useResetParams({ onlyHasA: false, descriptionAndInputRef })

  const { toggleShowSolution } = useToggleShowSolution({ solutionStepsRef, toShowSolution, setToShowSolution })

  const calculateResult = () => {
    // It will go to this function again when `A` or `B` change with `updateValuesForMatrix`
    if (!A.length || !A.flat().every(x => typeof (x) !== 'string') || !B.length || !B.flat().every(x => typeof (x) !== 'string')) {
      return
    }

    const { time, funcResult: result } = getCalcTime(() => getMultiplication(A, B))

    setSteps(result)
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
            <>
              <div className='solution-items-container mb-7'>
                <OriginalMatrix A={A} steps={steps} B={B} needsDeterminant={false} />
                {steps.map((step, index) => (
                  <div id={`step-${index + 2}`} className='pt-2 pb-3 border-b-darkgray' key={index}>
                    <div>
                      <div className='flex flex-col space-y-1.5 pt-2 pb-2.5'>
                        {(step.explanation as string[]).map((explanation, explanationIndex) => (
                          <div className='row w-full' key={explanationIndex}>
                            C
                            <span className="subindex">
                              {steps[index]?.indices?.[explanationIndex]?.[0] ?? ''}
                            </span>
                            <span className="subindex">
                              {steps[index]?.indices?.[explanationIndex]?.[1] ?? ''}
                            </span>
                            <span className='pl-1 pr-2'> = </span>
                            {steps[index].explanation[explanationIndex]}
                          </div>
                        ))}
                      </div>
                      <div className='row-v px-3'>
                        {steps.length > 1 && (
                          <ScrollWithSVGs aCols={aDim[1]} isLast={index === steps.length - 1} />
                        )}
                        <MatrixTable
                          nRows={step.A.length}
                          nCols={step.A[0].length}
                          A={step.A}
                          highlightFunc={(row: number, col: number, index: number | undefined) => row === index}
                          index={index}
                          letter='C'
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
      <div ref={descriptionAndInputRef} className='hidden'>
        <div className={`${isOpen || aIsFilled && bIsFilled ? 'hidden' : 'block'}`}>
          <h3 className='mb-4 text-lg bold'>Multiplication</h3>
          <ol>
            <li>The main condition of matrix multiplication is that the number of columns of the 1st matrix must equal to the number of rows of the 2nd one.</li>
            <li className='text-red-500'>A cols = B rows</li>
            <li>As a result of multiplication you will get a new matrix that has the same quantity of rows as the 1st one has and the same quantity of columns as the 2nd one.</li>
            <li>For example if you multiply a matrix of 'n' x 'k' by 'k' x 'm' size you'll get a new one of 'n' x 'm' dimension.</li>
          </ol>
          <span>To understand matrix multiplication better input any example and examine the solution.</span>
          <MatrixDimensionsInput minValue={1} isMultiplication={true} />
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
            {steps.length > 0 && (
              <section>
                <MatrixTable
                  nRows={steps[steps.length - 1].A.length}
                  nCols={steps[steps.length - 1].A[0].length}
                  A={steps[steps.length - 1].A}
                  letter='C'
                />
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

export default Multiplication
