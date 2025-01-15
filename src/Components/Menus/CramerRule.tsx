import React, { FC, useEffect, useRef, useState } from 'react'
import MatrixDimensionsInput from '../Atoms/MatrixDimensionsInput'
import MatrixTable from '../Atoms/MatrixTable'
import ScrollWithSVGs from '../Atoms/ScrollWithSVGs'
import useRecalculate from '../../hooks/useRecalculate'
import useResetParams from '../../hooks/useResetParams'
import useUpdateExplanations from '../../hooks/useUpdateExplanations'
import useToggleShowSolution from '../../hooks/useToggleShowSolution'
import getCramerRule from '../../lib/getCramerRule'
import { getCalcTime } from '../../lib/utils'
import { useLinearEquationsStore, useMatrixStore, useModalStore } from '../../store/zustandStore'
import Matrix, { Step } from '../../interfaces/Matrix'
import OriginalMatrix from '../Atoms/OriginalMatrix'

const CramerRule: FC = () => {
  const { equationCoefs } = useLinearEquationsStore()
  const {
    setCalculate,
    aDim, A, aIsFilled,
  } = useMatrixStore()
  const { isOpen } = useModalStore()

  const solutionStepsRef = useRef<HTMLDivElement | null>(null)
  const descriptionAndInputRef = useRef<HTMLDivElement | null>(null)

  const [determinant, setDeterminant] = useState<number | undefined>(undefined)
  const [time, setTime] = useState<number>(-1)
  const [steps, setSteps] = useState<Step[]>([])
  const [toShowSolution, setToShowSolution] = useState<boolean>(false)
  const [C, setC] = useState<Matrix>([])

  const { recalculate } = useRecalculate({ setTime, setShow: setToShowSolution, setSteps })

  const { resetParams } = useResetParams({ descriptionAndInputRef })

  const { toggleShowSolution } = useToggleShowSolution({ solutionStepsRef, toShowSolution, setToShowSolution })

  const { updateExplanations } = useUpdateExplanations({ steps, isEquation: true })

  const calculateResult = () => {
    // It will go to this function again when `A` changes with `updateValuesForMatrix`
    if (!A.length || !A.flat().every(x => typeof (x) !== 'string')) {
      return
    }

    if (!equationCoefs.length || !equationCoefs.flat().every(x => typeof (x) !== 'string')) {
      return
    }

    const { time, funcResult: result } = getCalcTime(() => getCramerRule(A, equationCoefs as number[]))
    const { solution: newC, steps, determinant: newDeterminant } = result

    if (newC !== null) {
      setC(newC)
    }

    setSteps(steps)
    setDeterminant(newDeterminant)
    setTime(time)
  }

  // Since identity matrix will be appended to the right, fix display indexes,
  // e.g. `A1 A2 A3 A4` -> `A1 A2 B1 B2`
  useEffect(() => {
    if (!toShowSolution) {
      return
    }
    const solutionExplanations = Array.from(document.getElementsByClassName('solution-explanation'))

    const lastElements = steps.slice(steps.length - solutionExplanations.length)

    solutionExplanations.forEach((explanation, index) => {
      explanation.innerHTML = lastElements[index].explanation as string
    })
  }, [steps.length, aDim, solutionStepsRef.current?.getElementsByTagName('table').length, toShowSolution])

  useEffect(() => {
    if (A) {
      setCalculate(calculateResult)
      if (aIsFilled && equationCoefs.length && !isOpen && time === -1) {
        calculateResult()
      }
    }
  }, [A, aIsFilled, isOpen, time])

  useEffect(() => {
    resetParams()
  }, [])

  useEffect(() => {
    if (steps.length) {
      updateExplanations()
    }
  }, [steps.length, toShowSolution, A])

  return (
    <div className='col-h'>
      {aIsFilled && !isOpen && (
        <div ref={solutionStepsRef}>
          {toShowSolution && (
            <div className='solution-items-container mb-7'>
              <OriginalMatrix A={A} steps={steps} isEquation={true} />
              {typeof (determinant) !== 'undefined' && determinant !== 0 && (
                <div id='step-2' className='row-v py-4 px-3 border-b-darkgray'>
                  <ScrollWithSVGs aCols={aDim[1]} />
                  <div className='col-v space-y-1'>
                    <p>Δ = {determinant}</p>
                    <p>Determinant is not zero, therefore system is consistent</p>
                  </div>
                </div>
              )}
              {steps.map((step, index) => (
                <div id={`step-${index + 3}`} className='pt-2 pb-3 border-b-darkgray' key={index}>
                  {/* <p>{getStepText(step, index)}</p> */}
                  <div className="flex flex-col space-y-1.5 pt-2 pb-2.5">
                    {Array.isArray(step.explanation)
                      ? step.explanation.map((_, index) => (
                        <p className='solution-explanation' key={index}></p>))
                      : <p className='solution-explanation'></p>
                    }
                  </div>
                  <p className={`${steps[index].swapRow && 'hidden'}`}></p>
                  <div className='row-v px-3'>
                    <ScrollWithSVGs aCols={aDim[1]} />
                    <MatrixTable
                      nRows={step.A.length}
                      nCols={step.A[0].length}
                      A={step.A}
                      letter='X'
                      highlightFunc={(row, col) => col === index}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <div ref={descriptionAndInputRef} className='hidden'>
        <div className={`${isOpen || aIsFilled ? 'hidden' : 'block'}`}>
          <h3 className='mb-4 text-lg bold'>Cramer's rule</h3>
          <ol>
            <li>If a determinant of the matrix (which must be square) is zero, inverse doesn't exist</li>
            <li>Columns of solution vector are repeatedly put in place of each column.</li>
            <li>Then, determinant of that matrix is divided by original determinant to get that column's solution (one of the system's variables).</li>
            <li>After that, column is restored to the original and process is repeated for the next column..</li>
          </ol>
          <span>To understand Cramer's rule better input any example and examine the solution.</span>
          <MatrixDimensionsInput minValue={1} isSquare={true} />
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
              {steps.length > 0 && C.length > 0
                ? (
                  <>
                    <h3 className='bold mb-2'>Result</h3>
                    <MatrixTable
                      nRows={C.length}
                      nCols={C[0].length}
                      A={C}
                      letter='X'
                    />
                  </>)
                : (
                  <div>
                    Determinant of the main matrix is zero. This means that the system of linear equations is either inconsistent or has infinitely many solutions.
                  </div>
                )}
              <div className='w-full flex'>
                <span className='ml-auto pt-2'>
                  Computation time: <span>{time !== - 1 ? time : '0.001'}</span>sec.
                </span>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}

export default CramerRule
