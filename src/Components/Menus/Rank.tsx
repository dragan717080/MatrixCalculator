import React, { FC, useRef, useState, useEffect } from 'react'
import MatrixDimensionsInput from '../Atoms/MatrixDimensionsInput'
import MatrixTable from '../Atoms/MatrixTable'
import ScrollWithSVGs from '../Atoms/ScrollWithSVGs'
import useRecalculate from '../../hooks/useRecalculate'
import useResetParams from '../../hooks/useResetParams'
import useToggleShowSolution from '../../hooks/useToggleShowSolution'
import getRank from '../../lib/getRank'
import { getCalcTime, getStrValuesOfMainDiagonal } from '../../lib/utils'
import { useMatrixStore, useModalStore } from '../../store/zustandStore'
import { Step } from '../../interfaces/Matrix'

const Rank: FC = () => {
  const {
    setCalculate,
    aDim, aIsFilled, A, setA, setAIsFilled,
  } = useMatrixStore()
  const { isOpen } = useModalStore()

  const solutionStepsRef = useRef<HTMLDivElement | null>(null)

  const [rank, setRank] = useState<number | undefined>(undefined)
  const [toShowSolution, setToShowSolution] = useState<boolean>(false)
  const [steps, setSteps] = useState<Step[]>([])
  const [time, setTime] = useState<number>(-1)

  const { recalculate } = useRecalculate({ setTime, setShow: setToShowSolution, setSteps, stepsRef: solutionStepsRef, isPower: true })

  const { resetParams } = useResetParams({})

  const { toggleShowSolution } = useToggleShowSolution({ solutionStepsRef, toShowSolution, setToShowSolution })

  const calculateResult = () => {
    const aIsFilled = A.length && A.flat().every(x => typeof (x) !== 'string')

    if (!aIsFilled) {
      return
    }

    console.log('A:', A);

    const { time, funcResult } = getCalcTime(() => getRank(A))

    const { steps, result } = funcResult

    console.log(funcResult);

    console.log('%cRank result:', 'font-size:22px;color:red;', result);

    setRank(result)
    setSteps(steps)
    setTime(time)
  }

  /** After completing all steps, get the equation for multiplying elements on upper (main) diagonal. */
  const getRankEquation = () => {
    const strValues = getStrValuesOfMainDiagonal(steps)
    const nonZeroElements = strValues.filter(s => parseFloat(s) !== 0)

    return nonZeroElements.length === 0
      ? '0, since all main diagonal elements are 0'
      : `|${nonZeroElements.join(', ')}| = ${rank}`
  }

  useEffect(() => {
    // console.log('recalculating function');
    // console.log('A:', A);
    if (A) {
      // console.log('shall set calculate');
      setCalculate(calculateResult)
      if (aIsFilled) {
        calculateResult()
      }
    }
  }, [A, aIsFilled]);

  useEffect(() => {
    resetParams()
  }, [])

  return (
    <div className='col-h'>
      {aIsFilled && !isOpen && (
        <div ref={solutionStepsRef}>
          {toShowSolution && (
            <>
              {steps.length > 0 && (
                <h3 className='bold leading-4 mb-3'>Original matrix</h3>
              )}
              <div className='mb-7'>
                {A.length === 1 && (
                  <div className="w-full row">
                    <span>
                      A has only one row so since A
                      <span className="subindex">1</span><span className="subindex">1</span> is {
                        A[0][0] === 0 ? '0' : 'not 0'
                      } it will be {Number(A[0][0] !== 0)}
                    </span>
                  </div>
                )}
                <div id='step-1' className='row-v px-3 border-b-darkgray'>
                  {steps.length > 0 && (
                    <ScrollWithSVGs aCols={aDim[1]} isFirst />
                  )}
                  <MatrixTable nRows={aDim[0]} nCols={aDim[1]} A={A} />
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
                        <ScrollWithSVGs aCols={aDim[1]} />
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
                {steps.length > 0 && (
                  <div id={`step-${steps.length + 2}`} className='pt-2'>
                    <p>Count non zero main diagonal elements</p>
                    <div className='row-v px-3'>
                      <ScrollWithSVGs aCols={aDim[1]} isLast />
                      <MatrixTable nRows={aDim[0]} nCols={aDim[1]} A={steps[steps.length - 1].A} toHighlight={(row, col) => row === col} />
                    </div>
                    <p>Rank = <span className='code-block'> {getRankEquation()}</span></p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
      <div>
        <div className={`${isOpen || aIsFilled ? 'hidden' : 'block'}`}>
          <h3 className='mb-4 text-lg bold'>Rank</h3>
          <ol>
            <li>The main condition of matrix multiplication is that the number of columns of the 1st matrix must equal to the number of rows of the 2nd one.</li>
            <li className='text-red-500'>A cols = B rows</li>
            <li>As a result of multiplication you will get a new matrix that has the same quantity of rows as the 1st one has and the same quantity of columns as the 2nd one.</li>
            <li>For example if you multiply a matrix of 'n' x 'k' by 'k' x 'm' size you'll get a new one of 'n' x 'm' dimension.</li>
          </ol>
          To understand matrix multiplication better input any example and examine the solution.
          <MatrixDimensionsInput minValue={1} />
        </div>
        {aIsFilled && !isOpen && (
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
            <section className={!toShowSolution ? 'pt-6' : 'pt-2'}>
              {typeof (rank) !== 'undefined' && (
                <>
                  <h3 className='bold mb-2'>Result</h3>
                  <p>{rank}</p>
                </>
              )}
              <div className='w-full flex'>
                <span className='ml-auto pt-2'>
                  Computation time: <span>{time !== - 1 ? time : '0.000'}</span>sec.
                </span>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}

export default Rank
