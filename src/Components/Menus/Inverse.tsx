import React, { FC, useEffect, useMemo, useRef, useState } from 'react'
import MatrixDimensionsInput from '../Atoms/MatrixDimensionsInput'
import MatrixTable from '../Atoms/MatrixTable'
import ScrollWithSVGs from '../Atoms/ScrollWithSVGs'
import useRecalculate from '../../hooks/useRecalculate'
import useResetParams from '../../hooks/useResetParams'
import useUpdateExplanations from '../../hooks/useUpdateExplanations'
import useToggleShowSolution from '../../hooks/useToggleShowSolution'
import useGetHighlightFunc from '../../hooks/useGetHighlightFunc'
import getInverse from '../../lib/getInverse'
import { getCalcTime } from '../../lib/utils'
import { useMatrixStore, useModalStore } from '../../store/zustandStore'
import Matrix, { Step } from '../../interfaces/Matrix'
import { HighlightCells } from '../../interfaces/MatrixTableProps'
import OriginalMatrix from '../Atoms/OriginalMatrix'

const Inverse: FC = () => {
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
  const [C, setC] = useState<Matrix>([])

  const { recalculate } = useRecalculate({ setTime, setShow: setToShowSolution, setSteps })

  const { resetParams } = useResetParams({ descriptionAndInputRef })

  const { toggleShowSolution } = useToggleShowSolution({ solutionStepsRef, toShowSolution, setToShowSolution })

  const { updateExplanations } = useUpdateExplanations({ steps, isEquation: true })

  const { getHighlightFunc } = useGetHighlightFunc({ steps, aDim })

  const tableRef = useRef<HTMLTableElement | null>(null)

  const calculateResult = () => {
    // It will go to this function again when `A` changes with `updateValuesForMatrix`
    if (!A.length || !A.flat().every(x => typeof (x) !== 'string')) {
      return
    }

    console.log('A in calculate:', A)
    const { time, funcResult: result } = getCalcTime(() => getInverse(A))
    console.log('Result:', result);
    const { A: newC, steps, determinant: newDeterminant } = result

    if (newC !== null) {
      setC(newC)
      console.log(`Setting C to ${newC?.length} X ${newC[0]?.length}`);
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

    const tableElements = Array.from(document.getElementsByTagName('table'))

    for (const table of tableElements) {
      const headers = Array.from(table.getElementsByTagName('th'))
      // Get table elements where header count is larger than `aDim[1]`
      // First `th` is empty so `+1`
      if (headers.length === aDim[1] + 1) {
        continue
      }

      headers.slice(Math.floor(headers.length / 2) + 1).forEach((th, index) => {
        th.innerHTML = `B<span class='subindex'>${index + 1}</span>`
      })
    }
  }, [steps.length, toShowSolution, aDim, solutionStepsRef.current?.getElementsByTagName('table').length])

  useEffect(() => {
    const originalMatrixHeaders = document.getElementById('step-1')?.getElementsByTagName('th')
    if (!originalMatrixHeaders?.length) {
      return
    }

    console.log('original headers:', originalMatrixHeaders);
    //originalMatrixHeaders[originalMatrixHeaders.length - 1].innerHTML = 'b'
  }, [])

  useEffect(() => {
    if (A) {
      setCalculate(calculateResult)
      if (aIsFilled && !isOpen && time === -1) {
        calculateResult()
      }
    }
  }, [A, aIsFilled, isOpen, time]);

  useEffect(() => {
    resetParams()
  }, [])

  useEffect(() => {
    console.log('New steps:', steps);

    if (steps.length) {
      updateExplanations()
    }
  }, [steps.length, toShowSolution])

  useEffect(() => {
    console.log('A changed:', A)
  }, [A])

  return (
    <div className='col-h'>
      {aIsFilled && !isOpen && (
        <div ref={solutionStepsRef}>
          {toShowSolution && (
            <div className='solution-items-container mb-7'>
              <OriginalMatrix A={A} steps={steps} />
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
                  <div className="flex flex-col space-y-1.5 pt-2 pb-2.5">
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
          <h3 className='mb-4 text-lg bold'>Inverse</h3>
          <ol>
            <li>If a determinant of the matrix (which must be square) is zero, inverse doesn't exist.</li>
            <li>Matrix has the identity matrix of the same dimension appended to it.</li>
            <li>Reduce the <span className='bold'>left</span> matrix to row echelon form using elementary row operations for the whole matrix (including the right one).</li>
            <li>As a result you will get the inverse calculated on the right.</li>
          </ol>
          <span>To understand inverse calculation better input any example and examine the solution.</span>
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
              {steps.length
                ? (
                  <>
                    <h3 className='bold mb-2'>Result</h3>
                    <MatrixTable
                      nRows={C.length}
                      nCols={C[0].length}
                      A={C}
                      ref={tableRef}
                    />
                  </>)
                : (
                  <div>
                    Determinant is 0, so this matrix has no inverse.
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

export default Inverse
