import React, { FC, useEffect, useMemo, useRef, useState } from 'react'
import MatrixDimensionsInput from '../Atoms/MatrixDimensionsInput'
import MatrixTable from '../Atoms/MatrixTable'
import ScrollWithSVGs from '../Atoms/ScrollWithSVGs'
import useRecalculate from '../../hooks/useRecalculate'
import useResetParams from '../../hooks/useResetParams'
import useToggleShowSolution from '../../hooks/useToggleShowSolution'
import getInverse from '../../lib/getInverse'
import { getCalcTime, getStrValuesOfMainDiagonal } from '../../lib/utils'
import { useMatrixStore, useModalStore } from '../../store/zustandStore'
import Matrix, { Step } from '../../interfaces/Matrix'

const Inverse: FC = () => {
  const {
    setIsOnlyA,
    setCalculate,
    aDim, setADim, A, setA, aIsFilled, setAIsFilled,
    setBDim, setB, setBIsFilled
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

  const tableRef = useRef<HTMLTableElement | null>(null)

  useEffect(() => {
    console.log(steps.length);
    console.log(tableRef.current);
  }, [steps.length])
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

  useEffect(() => {
    console.log('recalculating function');
    if (A) {
      console.log('received A:', A);
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
    console.log('new steps:', steps);
  }, [steps.length])

  useEffect(() => {
    console.log('A changed:', A)
  }, [A])

  return (
    <div className='col-h'>
      {aIsFilled && !isOpen && (
        <div ref={solutionStepsRef}>
          {toShowSolution && (
            <div className='solution-items-container mb-7'>
              {steps.length > 0 && (
                <h3 className='mb-4 text-center bold leading-4'>Original matrix</h3>
              )}
              {A.length === 1 && (
                <div className="w-full row">
                  <span>
                    A has only one row so Δ =
                    A<span className="subindex">1</span><span className="subindex">1</span> = {A[0][0]}
                  </span>
                </div>
              )}
              <div id='step-1' className='row-v px-3 border-b-darkgray'>
                {steps.length > 1 && (
                  <ScrollWithSVGs aCols={aDim[1]} isFirst />
                )}
                <MatrixTable
                  nRows={aDim[0]}
                  nCols={aDim[1]}
                  A={A}
                  highlightFunc={
                    A.length === 1 || A[0].length === 1
                      ? (row, col) => row === 0 && col === 0
                      : undefined
                  }
                />
              </div>
              {steps.map((step, index) => (
                <div id={`step-${index + 2}`} className='pt-2 pb-3 border-b-darkgray' key={index}>
                  {/* <p>{getStepText(step, index)}</p> */}
                  {!steps[index].swapRow && (
                    <div className="flex flex-col space-y-1.5 pt-2 pb-2.5">
                      {Array.isArray(step.explanation)
                        ? step.explanation.map((explanation, index) => (
                          <p key={index}>{explanation}</p>))
                        : <p>{step.explanation}</p>
                      }
                    </div>
                  )}
                  <p className={`${steps[index].swapRow && 'hidden'}`}></p>
                  <div className='row-v px-3'>
                    <ScrollWithSVGs aCols={aDim[1]} />
                    <MatrixTable
                      nRows={step.A.length}
                      nCols={step.A[0].length}
                      A={step.A}
                      highlightFunc={step.highlightFunc}
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
            <li>If a determinant of the matrix (which must be square) is zero, inverse doesn't exist</li>
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
