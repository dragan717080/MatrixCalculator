import React, { FC, useEffect, useMemo, useRef, useState } from 'react'
import MatrixDimensionsInput from '../Atoms/MatrixDimensionsInput'
import MatrixTable from '../Atoms/MatrixTable'
import ScrollWithSVGs from '../Atoms/ScrollWithSVGs'
import useRecalculate from '../../hooks/useRecalculate'
import useResetParams from '../../hooks/useResetParams'
import useToggleShowSolution from '../../hooks/useToggleShowSolution'
import getDeterminant from '../../lib/getDeterminant'
import { getCalcTime, getOrderNumberToStr, getStrValuesOfMainDiagonal } from '../../lib/utils'
import { useMatrixStore, useModalStore } from '../../store/zustandStore'
import { Step } from '../../interfaces/Determinant'

const Determinant: FC = () => {
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
  const [actualCounts, setActualCounts] = useState<number[]>([])
  const [stepsSwapsIndices, setStepsSwapsIndices] = useState<{ [key: string]: number }>({} as { [key: string]: number })

  const { recalculate } = useRecalculate({ setTime, setShow: setToShowSolution, setSteps })

  const { resetParams } = useResetParams({ descriptionAndInputRef })

  const { toggleShowSolution } = useToggleShowSolution({ solutionStepsRef, toShowSolution, setToShowSolution })

  const calculateResult = () => {
    // It will go to this function again when `A` changes with `updateValuesForMatrix`
    if (!A.length || !A.flat().every(x => typeof (x) !== 'string')) {
      return
    }

    console.log('A in calculate:', A)
    const { time, funcResult } = getCalcTime(() => getDeterminant(A))
    const { steps, result } = funcResult

    setDeterminant(result)
    console.log('%cDETERMINANT:', 'color:red;font-size:40', result);
    setSteps(steps)
    console.log('%cSteps:', 'color:red;font-size:22px', steps);
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
        return typeof (step.swapRow) !== 'undefined'
          ? `Swapping rows ${step.swapRow[0] + 1} and ${step.swapRow[1] + 1}, changing the sign to ${step.sign}`
          // Text will have 1-based indexing so need `+1`
          : `Eliminate elements in the ${stepsSwapsIndices[index] + 1}${getOrderNumberToStr(
            stepsSwapsIndices[index])} column under the ${stepsSwapsIndices[index] + 1}${getOrderNumberToStr(
              stepsSwapsIndices[index])} element`;
      },
    [steps.length, actualCounts.length, Object.keys(stepsSwapsIndices).length])

  const getHighlight = (step: Step, index: number, row: number, col: number) =>
    step.swapRow
      ? step.swapRow?.includes(row)
      : row > stepsSwapsIndices[index] && col === stepsSwapsIndices[index]

  // Memoized function to calculate actual counts based on `steps.length`
  useMemo(() => {
    if (steps.length === 0) {
      setActualCounts([]);
      return;
    }

    const stepsWithoutSwaps = steps.filter(x => typeof (x.swapRow) === 'undefined')

    // Track indices of `steps` in relation to filtered steps without swaps
    // e.g. if first 5 elements are 'swap, no swap, no swap, no swap, swap',
    // it should return '{ 1 -> 0, 2 -> 1, 3 -> 2 }
    const d = {} as { [key: string]: number }

    for (let i = 0; i < steps.length; i++) {
      if (typeof (steps[i]).swapRow !== 'undefined') {
        continue;
      }

      const step = steps[i]

      d[i as unknown as string] = stepsWithoutSwaps.indexOf(step)
    }
    console.log('%cStep indices to indices without swaps:', 'color:red;font-size:30px;', d);
    setStepsSwapsIndices(d);
  }, [steps.length]);

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
    console.log('%cnew actual counts:', 'color:green', actualCounts);
  }, [actualCounts.length])

  useEffect(() => {
    console.log('new steps:', steps);
  }, [steps.length])

  useEffect(() => {
    console.log('A changed in determinant:', A)
  }, [A])

  return (
    <div className='col-h'>
      {aIsFilled && !isOpen && (
        <div ref={solutionStepsRef}>
          {toShowSolution && (
            <div className='solution-items-container mb-7'>
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
                <div id={`step-${index + 1}`} className='pt-2 pb-3 border-b-darkgray' key={index}>
                  <p>{getStepText(step, index)}</p>
                  {!steps[index].swapRow && (
                    <div className='mt-3'>
                      {step.explanations.map((explanation, index) => (
                        <p key={index}>{explanation}</p>
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
          <p>
            Here you can calculate a determinant of a matrix with complex numbers online for free with a very detailed solution. Determinant is calculated by reducing a matrix to row echelon form and multiplying its main diagonal elements.
          </p>
          <MatrixDimensionsInput minValue={1} isSquare={true} />
        </div>
        {aIsFilled && !isOpen && (
          <>
            <div className={`
            ${toShowSolution
                ? 'mt-6 md:mt-4 mb-7 md:mb-8'
                : 'mt-3 mb-1'
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
              {typeof (determinant) !== 'undefined' && (
                <>
                  <h3 className='bold mb-2'>Result</h3>
                  <p>Δ = {determinant}</p>
                </>
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

export default Determinant
