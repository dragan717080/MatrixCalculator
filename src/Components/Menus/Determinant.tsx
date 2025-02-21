import React, { FC, useEffect, useMemo, useRef, useState } from 'react'
import MatrixDimensionsInput from '../Atoms/MatrixDimensionsInput'
import MatrixTable from '../Atoms/MatrixTable'
import OriginalMatrix from '../Atoms/OriginalMatrix'
import ScrollWithSVGs from '../Atoms/ScrollWithSVGs'
import SolutionRows from '../Atoms/SolutionRows'
import useRecalculate from '../../hooks/useRecalculate'
import useResetParams from '../../hooks/useResetParams'
import useToggleShowSolution from '../../hooks/useToggleShowSolution'
import useUpdateExplanations from '../../hooks/useUpdateExplanations'
import getDeterminant from '../../lib/getDeterminant'
import { getCalcTime, getOrderNumberToStr, getStrValuesOfMainDiagonal } from '../../lib/utils'
import { useMatrixStore, useModalStore } from '../../store/zustandStore'
import { Step } from '../../interfaces/Determinant'

const Determinant: FC = () => {
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
  const [actualCounts, setActualCounts] = useState<number[]>([])
  const [stepsSwapsIndices, setStepsSwapsIndices] = useState<{ [key: string]: number }>({} as { [key: string]: number })

  const { recalculate } = useRecalculate({ setTime, setShow: setToShowSolution, setSteps })

  const { resetParams } = useResetParams({ descriptionAndInputRef })

  const { toggleShowSolution } = useToggleShowSolution({ solutionStepsRef, toShowSolution, setToShowSolution })

  const { updateExplanations } = useUpdateExplanations({ steps, needsDeterminant: false })

  const calculateResult = () => {
    // It will go to this function again when `A` changes with `updateValuesForMatrix`
    if (!A.length || !A.flat().every(x => typeof (x) !== 'string')) {
      return
    }

    const { time, funcResult } = getCalcTime(() => getDeterminant(A))
    const { steps, result } = funcResult

    setDeterminant(result)
    setSteps(steps)
    setTime(time)
  }

  /** After completing all steps, get the equation for multiplying elements on upper (main) diagonal. */
  const getMultiplyEquation = () => {
    const strValues = getStrValuesOfMainDiagonal(steps, true)
    const equation = strValues.join(' X ')

    return `${equation} = ${determinant}`
  }

  const getStepText = useMemo(
    () =>
      (step: Step, index: number) => {
        let rowIndex

        const hasSwapRow = typeof (step.swapRow) !== 'undefined'
        if (hasSwapRow) {

        }
        
        return typeof (step.swapRow) !== 'undefined'
          ? `Swapping rows ${step.swapRow[0] + 1} and ${step.swapRow[1] + 1}, changing the sign to ${step.sign}`
          // Text will have 1-based indexing so need `+1`
          : `Eliminate elements in the ${stepsSwapsIndices[index] + 1}${getOrderNumberToStr(
            stepsSwapsIndices[index])} column under the ${stepsSwapsIndices[index] + 1}${getOrderNumberToStr(
              stepsSwapsIndices[index])} element`
      },
    [steps.length, actualCounts.length, Object.keys(stepsSwapsIndices).length])

  const getHighlight = (step: Step, index: number, row: number, col: number) =>
    step.swapRow
      ? step.swapRow?.includes(row)
      : row > stepsSwapsIndices[index] && col === stepsSwapsIndices[index]

  // Memoized function to calculate actual counts based on `steps.length`
  useMemo(() => {
    if (steps.length === 0) {
      setActualCounts([])
      return
    }

    const stepsWithoutSwaps = steps.filter(x => typeof (x.swapRow) === 'undefined')

    /** Track indices of `steps` in relation to filtered steps without swaps
     * e.g. if first 5 elements are 'swap, no swap, no swap, no swap, swap',
     * it should return `{ 1 -> 0, 2 -> 1, 3 -> 2 }`. */
    const d = {} as { [key: string]: number }

    for (let i = 0; i < steps.length; i++) {
      if (typeof (steps[i]).swapRow !== 'undefined') {
        continue
      }

      const step = steps[i]

      d[i as unknown as string] = stepsWithoutSwaps.indexOf(step)
    }

    setStepsSwapsIndices(d)
  }, [steps.length])

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
            <div className='solution-items-container mb-7'>
              <OriginalMatrix A={A} steps={steps} isEquation={false} />
              {steps.map((step, index) => (
                <div id={`step-${index + 2}`} className='pt-2 pb-3 border-b-darkgray' key={index}>
                  <p>{getStepText(step, index)}</p>
                  {!steps[index].swapRow && (
                    <div className='mt-3'>
                      {step.explanation.map((explanation, index) => (
                        <p className='step-explanation' key={index}>{explanation}</p>
                      ))}
                    </div>
                  )}
                  <p className={`${steps[index].swapRow && 'hidden'}`}></p>
                  <div className='row-v px-3'>
                    <ScrollWithSVGs aCols={aDim[1]} />
                    <MatrixTable
                      nRows={step.A.length}
                      nCols={step.A[0].length}
                      A={step.A}
                      highlightFunc={(row = index, col = 0) => getHighlight(step, index, row, col)}
                    />
                  </div>
                </div>
              ))}
              {steps.length > 0 && (
                <div id={`step-${steps.length + 2}`} className='pt-2'>
                  <p>Multiply the main diagonal elements</p>
                  <p>Sign: {steps[steps.length - 1].sign}</p>
                  <div className='row-v px-3'>
                    <ScrollWithSVGs aCols={aDim[1]} isLast />
                    <MatrixTable nRows={aDim[0]} nCols={aDim[1]} A={steps[steps.length - 1].A} highlightFunc={(row, col) => row === col} />
                  </div>
                  <p>Δ = {steps[steps.length - 1].sign === '-' && '-'}{getMultiplyEquation()}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      <div ref={descriptionAndInputRef} className='hidden'>
        <div className={`${isOpen || aIsFilled ? 'hidden' : 'block'}`}>
          <h3 className='mb-4 text-lg bold'>Determinant</h3>
          <ol>
            <li>Change the matrix to row echelon form (REF).</li>
            <li>It is matrix with all zeros below the main diagonal.</li>
            <li>Pick the 1st element in the 1st column (pivot) and eliminate all elements that are below the current one.</li>
            <li>If pivot is 0, swap it with the first non zero column under it.</li>
            <li>Pick the 2nd element in the 2nd column and do the same operations up to the end.</li>
            <li>Multiply the main diagonal elements of the matrix.</li>
          </ol>
          <MatrixDimensionsInput minValue={1} isSquare={true} />
        </div>
        {aIsFilled && !isOpen && (
          <SolutionRows
            toShowSolution={toShowSolution}
            time={time}
            toggleShowSolution={toggleShowSolution}
            recalculate={recalculate}
          >
            {typeof (determinant) !== 'undefined' && (
              <>
                <h3 className='bold mb-2'>Result</h3>
                <p>Δ = {determinant}</p>
              </>
            )}
          </SolutionRows>
        )}
      </div>
    </div>
  )
}

export default Determinant
