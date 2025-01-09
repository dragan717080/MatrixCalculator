import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import MatrixDimensionsInput from '../Atoms/MatrixDimensionsInput'
import MatrixTable from '../Atoms/MatrixTable'
import ScrollWithSVGs from '../Atoms/ScrollWithSVGs'
import getMultiplication from '../../lib/getMultiplication'
import { getCalcTime, wait } from '../../lib/utils'
import { useMatrixStore } from '../../store/zustandStore'
import { useModalStore } from '../../store/zustandStore'
import { Step } from '../../interfaces/Matrix'

const Multiplication: FC = () => {
  const {
    isOnlyA, setIsOnlyA,
    aDim, setADim, A, setA, aIsFilled, setAIsFilled,
    bDim, setBDim, B, setB, bIsFilled, setBIsFilled,
    setCalculate
  } = useMatrixStore()
  const { isOpen, setIsOpen } = useModalStore()
  const [toShowSolution, setToShowSolution] = useState<boolean>(false)
  const [steps, setSteps] = useState<Step[]>([])
  const [time, setTime] = useState<number>(-1)

  const solutionStepsRef = useRef<HTMLDivElement | null>(null)

  const calculateResult = () => {
    console.log('A:', A)
    console.log('B:', B);
    const { time, funcResult: result } = getCalcTime(() => getMultiplication(A, B))
    setSteps(result)
    setTime(time)
  }

  const toggleShowSolution = useCallback(async () => {
    console.log('before toggle:', solutionStepsRef.current!)
    console.log('show original before toggle:', toShowSolution)
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
    console.log('after toggle:', solutionStepsRef.current!)
    setToShowSolution(!toShowSolution)
  }, [toShowSolution])

  const recalculate = () => {
    setTime(-1)
    setADim([0, 0])
    setA([])
    setAIsFilled(false)
    setBDim([0, 0])
    setB([])
    setBIsFilled(false)
    setSteps([])
    setToShowSolution(false)
    setIsOpen(false)
  }

  useEffect(() => {
    console.log('recalculating function');
    if (A && B || A && isOnlyA) {
      setCalculate(calculateResult)
    }
  }, [A, B, aIsFilled, bIsFilled]);

  useEffect(() => {
    setIsOnlyA(false)
    setADim([0, 0])
    setA([])
    setAIsFilled(false)
    setBDim([0, 0])
    setB([])
    setBIsFilled(false)
  }, [])

  return (
    <div className='col-h'>
      {aIsFilled && bIsFilled && !isOpen && (
        <div ref={solutionStepsRef}>
          {toShowSolution && (
            <>
              {steps.length > 0 && (
                <h3 className='bold leading-4'>Original matrices</h3>
              )}
              <div className='mb-7'>
                <div id='step-1' className='row-v px-3 border-b-darkgray'>
                  <ScrollWithSVGs aCols={aDim[1]} isFirst areBoth />
                  <div className='row flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 pb-6 md:pb-0'>
                    <MatrixTable nRows={aDim[0]} nCols={aDim[1]} A={A} />
                    <MatrixTable nRows={bDim[0]} nCols={bDim[1]} A={B} letter='B' />
                  </div>
                </div>
                {steps.map((step, index) => (
                  <div id={`step-${index + 2}`} className='pt-2 pb-3 border-b-darkgray' key={index}>
                    <div>
                      <div className="flex flex-col space-y-1.5 pt-2 pb-2.5">
                        {(step.explanation as string[]).map((explanation, index) => (
                          <p key={index}>{explanation}</p>
                        ))}
                      </div>
                      <div className='row-v px-3'>
                        <ScrollWithSVGs aCols={aDim[1]} isLast={index === steps.length - 1} />
                        <MatrixTable
                          nRows={step.A.length}
                          nCols={step.A[0].length}
                          A={step.A}
                          toHighlight={(row: number, col: number, index: number | undefined) => row === index}
                          index={index}
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
      <div>
        <div className={`${isOpen || aIsFilled && bIsFilled ? 'hidden' : 'block'}`}><h3 className='bold'>Multiplication</h3>
          <ol>
            <li>The main condition of matrix multiplication is that the number of columns of the 1st matrix must equal to the number of rows of the 2nd one.</li>
            <li className='text-red-500'>A cols = B rows</li>
            <li>As a result of multiplication you will get a new matrix that has the same quantity of rows as the 1st one has and the same quantity of columns as the 2nd one.</li>
            <li>For example if you multiply a matrix of 'n' x 'k' by 'k' x 'm' size you'll get a new one of 'n' x 'm' dimension.</li>
          </ol>
          To understand matrix multiplication better input any example and examine the solution.
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
                <MatrixTable nRows={aDim[0]} nCols={aDim[1]} A={steps[steps.length - 1].A} />
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
