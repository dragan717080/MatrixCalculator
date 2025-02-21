import React, { FC, useRef, useState, useEffect } from 'react'
import MatrixDimensionsInput from '../Atoms/MatrixDimensionsInput'
import MatrixTable from '../Atoms/MatrixTable'
import ScrollWithSVGs from '../Atoms/ScrollWithSVGs'
import SolutionRows from '../Atoms/SolutionRows'
import useGetHighlightFunc from '../../hooks/useGetHighlightFunc'
import useRecalculate from '../../hooks/useRecalculate'
import useResetParams from '../../hooks/useResetParams'
import useToggleShowSolution from '../../hooks/useToggleShowSolution'
import useUpdateExplanations from '../../hooks/useUpdateExplanations'
import getRank from '../../lib/getRank'
import { getCalcTime, getStrValuesOfMainDiagonal } from '../../lib/utils'
import { useMatrixStore, useModalStore } from '../../store/zustandStore'
import { Step } from '../../interfaces/Matrix'
import OriginalMatrix from '../Atoms/OriginalMatrix'

const Rank: FC = () => {
  const {
    setCalculate,
    aDim, aIsFilled, A,
  } = useMatrixStore()
  const { isOpen } = useModalStore()

  const solutionStepsRef = useRef<HTMLDivElement | null>(null)

  const descriptionAndInputRef = useRef<HTMLDivElement | null>(null)

  const [rank, setRank] = useState<number | undefined>(undefined)
  const [toShowSolution, setToShowSolution] = useState<boolean>(false)
  const [steps, setSteps] = useState<Step[]>([])
  const [time, setTime] = useState<number>(-1)

  const { recalculate } = useRecalculate({ setTime, setShow: setToShowSolution, setSteps, stepsRef: solutionStepsRef, isPower: true })

  const { resetParams } = useResetParams({ descriptionAndInputRef })

  const { toggleShowSolution } = useToggleShowSolution({ solutionStepsRef, toShowSolution, setToShowSolution })

  const { updateExplanations } = useUpdateExplanations({ steps, needsDeterminant: false })

  const { getHighlightFunc } = useGetHighlightFunc({ steps, aDim })

  const calculateResult = () => {
    const aIsFilled = A.length && A.flat().every(x => typeof (x) !== 'string')

    if (!aIsFilled) {
      return
    }

    const { time, funcResult } = getCalcTime(() => getRank(A))

    const { steps, result } = funcResult

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
    if (A) {
      setCalculate(calculateResult)
      if (aIsFilled && !isOpen && time === -1) {
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

  useEffect(() => {
    setTime(-1)
  }, [A])

  return (
    <div className='col-h'>
      {aIsFilled && !isOpen && (
        <div ref={solutionStepsRef}>
          {toShowSolution && (
            <>
              <div className='solution-items-container mb-7'>
                <OriginalMatrix A={A} steps={steps} needsDeterminant={false} isRank={true} />
                {steps.map((step, index) => (
                  <div id={`step-${index + 2}`} className='pt-2 pb-3 border-b-darkgray' key={index}>
                    <div>
                      <div className='flex flex-col space-y-1.5 pt-2 pb-2.5'>
                        {(step.explanation as string[]).map((explanation, index) => (
                          <p className='step-explanation' key={index}>{explanation}</p>
                        ))}
                      </div>
                      <div className='row-v px-3'>
                        <ScrollWithSVGs aCols={aDim[1]} />
                        <MatrixTable
                          nRows={step.A.length}
                          nCols={step.A[0].length}
                          A={step.A}
                          highlightFunc={getHighlightFunc(index)}
                          index={index}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {steps.length > 0 && A[0].length > 1 && (
                  <div id={`step-${steps.length + 2}`} className='pt-2'>
                    <p>Count non zero main diagonal elements</p>
                    <div className='row-v px-3'>
                      <ScrollWithSVGs aCols={aDim[1]} isLast />
                      <MatrixTable nRows={aDim[0]} nCols={aDim[1]} A={steps[steps.length - 1].A} highlightFunc={(row, col) => row === col && steps[steps.length - 1].A[row][col] != 0} />
                    </div>
                    <p>Rank = <span className='code-block'> {getRankEquation()}</span></p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
      <div ref={descriptionAndInputRef} className='hidden'>
        <div className={`${isOpen || aIsFilled ? 'hidden' : 'block'}`}>
          <h3 className='mb-4 text-lg bold'>Rank</h3>
          <ol>
            <li>Change the matrix to row echelon form (REF).</li>
            <li>It is matrix with all zeros below the main diagonal.</li>
            <li>Pick the 1st element in the 1st column (pivot) and eliminate all elements that are below the current one.</li>
            <li>If pivot is 0, swap it with the first non zero column under it.</li>
            <li>Pick the 2nd element in the 2nd column and do the same operations up to the end.</li>
            <li>Rank is equal to the number of non zero elements on the main diagonal.</li>
          </ol>
          To understand rank better input any example and examine the solution.
          <MatrixDimensionsInput minValue={1} />
        </div>
        {aIsFilled && !isOpen && (
          <SolutionRows
            toShowSolution={toShowSolution}
            time={time}
            toggleShowSolution={toggleShowSolution}
            recalculate={recalculate}
          >
            {typeof (rank) !== 'undefined' && (
              <>
                <h3 className='bold mb-2'>Result</h3>
                <p>{rank}</p>
              </>
            )}
          </SolutionRows>
        )}
      </div>
    </div>
  )
}

export default Rank
