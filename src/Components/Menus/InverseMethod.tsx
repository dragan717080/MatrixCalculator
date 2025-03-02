import React, { FC, useEffect, useRef, useState } from 'react'
import MatrixDimensionsInput from '../Atoms/MatrixDimensionsInput'
import MatrixTable from '../Atoms/MatrixTable'
import ScrollWithSVGs from '../Atoms/ScrollWithSVGs'
import SolutionRows from '../Atoms/SolutionRows'
import useGetHighlightFunc from '../../hooks/useGetHighlightFunc'
import useRecalculate from '../../hooks/useRecalculate'
import useResetParams from '../../hooks/useResetParams'
import useToggleShowSolution from '../../hooks/useToggleShowSolution'
import getInverseMethod from '../../lib/getInverseMethod'
import { getCalcTime } from '../../lib/utils'
import { useLinearEquationsStore, useMatrixStore, useModalStore } from '../../store/zustandStore'
import Matrix, { Step } from '../../interfaces/Matrix'
import OriginalMatrix from '../Atoms/OriginalMatrix'
import useUpdateExplanations from '../../hooks/useUpdateExplanations'

const InverseMethod: FC = () => {
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

  const { getHighlightFunc } = useGetHighlightFunc({ steps, aDim })

  const calculateResult = () => {
    // It will go to this function again when `A` changes with `updateValuesForMatrix`
    if (!A.length || !A.flat().every(x => typeof (x) !== 'string')) {
      return
    }

    if (!equationCoefs.length || !equationCoefs.flat().every(x => typeof (x) !== 'string')) {
      return
    }

    const { time, funcResult: result } = getCalcTime(() => getInverseMethod(A, equationCoefs as number[]))
    const { solution: newC, steps, determinant: newDeterminant } = result

    if (newC !== null) {
      setC(newC)
    }

    setSteps(steps)
    setDeterminant(newDeterminant)
    setTime(time)
  }

  // Since identity matrix will be appended to the right, fix display indexes,
  // e.g. `X1 X2 X3 X4` -> `X1 X2 B1 B2`
  useEffect(() => {
    if (!toShowSolution) {
      return
    }

    const tableElements = Array.from(document.getElementsByTagName('table'))

    for (const table of tableElements) {
      const headers = Array.from(table.getElementsByTagName('th'))

      // On the original table display differently
      const stepId = (table.parentNode as HTMLElement).id
      if (stepId === 'step-1') {
        continue
      }

      // Get table elements where header count is larger than `aDim[1]`
      // First `th` is empty so `+1`
      if (headers.length === aDim[1] + 1) {
        continue
      }

      headers.slice(Math.floor(headers.length / 2) + 1).forEach((th, index) => {
        th.innerHTML = `B<span class='subindex'>${index + 1}</span>`
      })
    }
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
  }, [steps.length, toShowSolution])

  useEffect(() => {
    setTime(-1)
  }, [A])

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
                    <p>Determinant is not zero, therefore inverse matrix exists</p>
                  </div>
                </div>
              )}
              {steps.map((step, index) => (
                <div id={`step-${index + 3}`} className='pt-2 pb-3 border-b-darkgray' key={index}>
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
          <h3 className='mb-4 text-lg bold'>Inverse Method</h3>
          <ol>
            <li>If a determinant of the matrix (which must be square) is zero, inverse doesn't exist</li>
            <li>Matrix has the identity matrix of the same dimension appended to it.</li>
            <li>Reduce the left matrix to row echelon form using elementary row operations for the whole matrix (including the right one).</li>
            <li>As a result you will get the inverse calculated on the right.</li>
            <li>Multiply the inverse matrix by the solution vector.</li>
            <li>The result vector is a solution of the matrix equation.</li>
          </ol>
          <span>To understand inverse matrix method better input any example and examine the solution.</span>
          <MatrixDimensionsInput minValue={1} isSquare={true} />
        </div>
        {aIsFilled && !isOpen && (
          <SolutionRows
            toShowSolution={toShowSolution}
            time={time}
            toggleShowSolution={toggleShowSolution}
            recalculate={recalculate}
          >
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
          </SolutionRows>
        )}
      </div>
    </div>
  )
}

export default InverseMethod
