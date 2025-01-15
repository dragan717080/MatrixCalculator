import React, { FC, useEffect, useRef, useState } from 'react'
import MatrixDimensionsInput from '../Atoms/MatrixDimensionsInput'
import MatrixTable from '../Atoms/MatrixTable'
import ScrollWithSVGs from '../Atoms/ScrollWithSVGs'
import useRecalculate from '../../hooks/useRecalculate'
import useResetParams from '../../hooks/useResetParams'
import useToggleShowSolution from '../../hooks/useToggleShowSolution'
import useGetHighlightFunc from '../../hooks/useGetHighlightFunc'
import getGaussJordanElimination from '../../lib/getGaussJordanElimination'
import { getCalcTime } from '../../lib/utils'
import { useLinearEquationsStore, useMatrixStore, useModalStore } from '../../store/zustandStore'
import { Step } from '../../interfaces/Matrix'
import useUpdateExplanations from '../../hooks/useUpdateExplanations'
import OriginalMatrix from '../Atoms/OriginalMatrix'

const GaussJordanElimination: FC = () => {
  const { equationCoefs } = useLinearEquationsStore()
  const {
    setCalculate,
    aDim, A, aIsFilled
  } = useMatrixStore()
  const { isOpen } = useModalStore()

  const solutionStepsRef = useRef<HTMLDivElement | null>(null)
  const descriptionAndInputRef = useRef<HTMLDivElement | null>(null)

  const [determinant, setDeterminant] = useState<number | undefined>(undefined)
  const [time, setTime] = useState<number>(-1)
  const [steps, setSteps] = useState<Step[]>([])
  const [toShowSolution, setToShowSolution] = useState<boolean>(false)
  const [equationSolution, setEquationSolution] = useState<string[] | null>([])

  const { recalculate } = useRecalculate({ setTime, setShow: setToShowSolution, setSteps })

  const { resetParams } = useResetParams({ descriptionAndInputRef })

  const { toggleShowSolution } = useToggleShowSolution({ solutionStepsRef, toShowSolution, setToShowSolution })

  const { updateExplanations } = useUpdateExplanations({ steps })

  const { getHighlightFunc } = useGetHighlightFunc({ steps, aDim })

  const calculateResult = () => {
    // It will go to this function again when `A` changes with `updateValuesForMatrix`
    if (!A.length || !A.flat().every(x => typeof (x) !== 'string')) {
      return
    }

    if (!equationCoefs.length || !equationCoefs.flat().every(x => typeof (x) !== 'string')) {
      return
    }

    const { time, funcResult: result } = getCalcTime(() => getGaussJordanElimination(A, equationCoefs as number[]))

    const { solution: newSolution, steps, determinant: newDeterminant } = result

    setSteps(steps)
    setDeterminant(newDeterminant)
    setEquationSolution(newSolution)
    setTime(time)
  }

  // Since identity matrix will be appended to the right, fix display indexes,
  // e.g. `A1 A2 A3 A4` -> `A1 A2 B1 B2`
  useEffect(() => {
    if (!toShowSolution) {
      return
    }

    const tableElements = Array.from(document.getElementsByTagName('table'))

    for (const table of tableElements) {
      const headers = table.getElementsByTagName('th')

      headers[headers.length - 1].innerHTML = 'b'
      headers[headers.length - 1].classList.add('border-l-orange')

      const tableRows = Array.from(table.getElementsByTagName('tbody')[0].getElementsByTagName('tr'))
      for (const row of tableRows) {
        const cells = row.getElementsByTagName('td')
        const lastCell = cells[cells.length - 1]
        lastCell.classList.add('border-l-orange')
      }
    }
  }, [steps.length, aDim, solutionStepsRef.current?.getElementsByTagName('table').length, toShowSolution])

  useEffect(() => {
    const originalMatrixHeaders = document.getElementById('step-1')?.getElementsByTagName('th')
    if (!originalMatrixHeaders?.length) {
      return
    }
  }, [])

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

  // Updated only solutions unlike `updateExplanations` function
  useEffect(() => {
    const solutionExplanations = Array.from(document.getElementsByClassName('solution-explanation'))

    solutionExplanations.forEach((explanation, index) => {
      explanation.innerHTML = equationSolution![index]
    })
  }, [steps.length, equationSolution])

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
              <OriginalMatrix A={A} steps={steps} needsDeterminant={false} isEquation={true} />
              {/* This empty paragraph with no opacity and number of `step-explanation` classes expected in `useUpdateExplanations` */}
              {/* <p className='step-explanation h-[1px] w-[1px] opacity-0'></p> */}
              {steps.map((step, index) => (
                <div id={`step-${index + 2}`} className='pt-2 pb-3 border-b-darkgray' key={index}>
                  {/* <p>{getStepText(step, index)}</p> */}
                  <div className='flex flex-col space-y-1.5 pt-2 pb-2.5'>
                    {Array.isArray(step.explanation)
                      ? step.explanation.map((explanation, index) => (
                        <p className='step-explanation' key={index}>{explanation}</p>))
                      : <p className='step-explanation'>{step.explanation}</p>
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
                      highlightFunc={getHighlightFunc(index)}
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
          <h3 className='mb-4 text-lg bold'>Gauss-Jordan Elimination</h3>
          <ol>
            <li>The main condition for the Gauss-Jordan Elimination is that the number of rows must be <span className="text-red-500">not greater than as the number of
              unknown variables.</span></li>
            <li><span className="text-red-500">A rows &lt;= A cols</span></li>
            <li>Change the matrix to reduced row echelon form (RREF).</li>
            <li>It is matrix with all zeros below the main diagonal, and all ones at the main diagonal.</li>
            <li>Pick the 1st element in the 1st column (pivot), if it is 0, swap it with the first non zero column under it.</li>
            <li>Divide that row by value of pivot so that pivot is 1.</li>
            <li>Eliminate all elements that both below and above the current one.</li>
            <li>This is different from the row echelon form (REF) where you would only eliminate the elements below.</li>
            <li>Pick the 2nd element in the 2nd column and do the same operations up to the end.</li>
            <li>Solution matrix will describe the corelation between the variables.</li>
          </ol>
          <span>To understand inverse calculation better input any example and examine the solution.</span>
          <MatrixDimensionsInput minValue={1} isGaussJordan={true} />
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
              {determinant
                ? (
                  <>
                    <h3 className='bold mb-2'>Result</h3>
                    <div className='flex flex-col'>
                      {equationSolution!.map((variableSolution, index) => (
                        <p className='solution-explanation' key={index}>{variableSolution}</p>
                      ))}
                    </div>
                  </>)
                : (
                  <div>
                    The linear equations system is inconsistent.
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

export default GaussJordanElimination
