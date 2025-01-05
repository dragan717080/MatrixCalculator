import React, { FC, useEffect, useMemo, useRef, useState } from 'react'
import MatrixDimensionsInput from '../Atoms/MatrixDimensionsInput'
import MatrixTable from '../Atoms/MatrixTable'
import getDeterminant from '../../lib/getDeterminant'
import { useMatrixStore, useModalStore } from '../../store/zustandStore'
import { Step } from '../../interfaces/Determinant'
import Matrix from '../../interfaces/Matrix'

const Determinant: FC = () => {
  const {
    setIsOnlyA,
    setCalculate,
    aDim, setADim, A, setA, aIsFilled, setAIsFilled,
    bIsFilled, setBIsFilled
  } = useMatrixStore()
  const { isOpen } = useModalStore()

  const solutionStepsRef = useRef<HTMLDivElement | null>(null)

  const [determinant, setDeterminant] = useState<number | undefined>(undefined)
  const [time, setTime] = useState<number>(-1)
  const [steps, setSteps] = useState<Step[]>([])
  const [toShowSolution, setToShowSolution] = useState<boolean>(false)

  const calculateResult = () => {
    console.log('A in calculate:', A)
    const startTime = performance.now()

    const { steps, result } = getDeterminant(A)

    setSteps(steps)
    console.log('%cSteps:', 'color:red', steps);
    setDeterminant(result)

    const endTime = performance.now()
    console.log('calc time:', endTime - startTime);
    let calcTime = (endTime - startTime) / 1000
    calcTime = Number.isInteger(calcTime) ? calcTime : parseFloat(calcTime.toFixed(3)) as unknown as number
    // If it is lower than `0.001s`, set is to `0.001s`
    setTime(Math.max(calcTime, 0.001))
  }

  const recalculate = () => {
    console.log('in recalculate');
    setTime(-1)
    setADim([0, 0])
    setA([])
    setAIsFilled(false)
  }

  /** In case there were multiple swaps, make proper row/col of pivot appear
   * 
   * (e.g. 'Eliminate elements in the 2nd column under the 2nd element').
  */
  const getOrderNumberToStr = (index: number) => {
    const actualIndex = getActualCount(index)

    return actualIndex === 1 ? 'st' : actualIndex === 2 ? 'nd' : actualIndex === 3 ? 'rd' : 'th'
  }

  /** After completing all steps, get the equation for multiplying elements on upper (main) diagonal. */
  const getMultiplyEquation = () => {
    const upperDiagonalValues = steps[steps.length - 1].A.flatMap((row, i) => row.filter((_, j) => i === j));
    console.log('upper diagonal:', upperDiagonalValues);
    const strValues = upperDiagonalValues.map(x => {
      console.log('Value:', x);
      const value = Number.isInteger(x) ? x : x!.toFixed(3)
      console.log('num value:', value);
      return (value as number)! >= 0 ? String(value) : `(${value})`
    })
    //console.log('str values:', strValues);
    const equation = strValues.join(' X ')
    //console.log('equation', equation);
    return `${equation} = ${determinant}`
  }

  const getStepText = useMemo(
    () =>
      (step: Step, index: number) => {
        console.log('step:', step);
        const eText =
          typeof step.swapRow !== 'undefined'
            ? `, changing the sign to ${step.sign}`
            : '';

        return typeof step.swapRow !== 'undefined'
          ? `Swapping rows ${step.swapRow[0] + 1} and ${step.swapRow[1] + 1}`
          : `Eliminate elements in the ${getActualCount(index)}${getOrderNumberToStr(
            index)} column under the ${getActualCount(index)}${getOrderNumberToStr(
            index)} element${eText}`;
      },
    [steps.length])

  const getHighlight = (step: Step, index: number, row: number, col: number) => {
    const d = step.swapRow
    ? step.swapRow?.includes(row)
    : row > getActualCount(index) && col === getActualCount(index)
      console.log('index:', index, 'row:', row, 'col:', col, 'shall highlight:', d);
      return d;
    }

  /** Count of non swap steps. */
  const getActualCount = (index: number) => {
    if (steps.length === 0) {
      return 0
    }

    const swapsCount = steps.slice(0, index + 1).reduce((acc, x) => acc + Number(Array.isArray(x.swapRow)), 0)
    console.log('slice:', steps.slice(0, index + 1), 'index:', index, 'swaps count:', swapsCount, 'actual count:', index - swapsCount);
    return index - swapsCount}

  useEffect(() => {
    console.log('recalculating function');
    if (A) {
      console.log('received A:', A);
      setCalculate(calculateResult)
    }
  }, [aIsFilled]);

  useEffect(() => {
    setAIsFilled(false)
    setBIsFilled(false)
    setIsOnlyA(true)
  }, [])

  useEffect(() => {
    console.log('is open in determinant:', isOpen);
  }, [isOpen])

  useEffect(() => {
    console.log('aIsFilled in determinant:', isOpen);
  }, [aIsFilled])

  useEffect(() => {
    console.log('new steps:', steps);
  }, [steps.length])

  return (
    <div className=''>
      {aIsFilled && !isOpen && (
        <div ref={solutionStepsRef}>
          {toShowSolution && (
            <div className='mb-7'>
              <div className='border-b-darkgray'>
                <MatrixTable nRows={aDim[0]} nCols={aDim[1]} A={A} />
              </div>
              {steps.map((step, index) => (
                <div className='pt-2 pb-3 border-b-darkgray' key={index}>
                  <p>{getStepText(step, index + 1)}</p>
                  <MatrixTable
                    nRows={step.A.length}
                    nCols={step.A[0].length}
                    A={step.A}
                    toHighlight={(row = index, col = 0) => getHighlight(step, index, row, col)}
                  />
                </div>
              ))}
              <div className='pt-2'>
                <p>Multiply the main diagonal elements</p>
                <p>Sign: {steps[steps.length - 1].sign}</p>
                <MatrixTable nRows={aDim[0]} nCols={aDim[1]} A={steps[steps.length - 1].A} toHighlight={(row, col) => row === col} />
                <p>Δ = {steps[steps.length - 1].sign === '-' && '-'}{getMultiplyEquation()}</p>
              </div>
            </div>
          )}
          <div className='row text-white space-x-5 mb-5'>
            <button onClick={() => setToShowSolution(!toShowSolution)} className='btn'>
              {toShowSolution ? 'Hide' : 'Show'} solution
            </button>
            <button onClick={() => recalculate()} className='btn'>Recalculate</button>
          </div>
        </div>
      )}
      <div className={`${isOpen || aIsFilled ? 'hidden' : 'block'}`}>
        <p>
          Here you can calculate a determinant of a matrix with complex numbers online for free with a very detailed solution. Determinant is calculated by reducing a matrix to row echelon form and multiplying its main diagonal elements.
        </p>
        <MatrixDimensionsInput minValue={2} isSquare={true} />
      </div>
      <section className='pt-6'>
        {typeof (determinant) !== 'undefined' && (
          <>
            <h3 className='bold'>Result</h3>
            <p>Δ = {determinant}</p>
          </>
        )}
        {time > -1 && (
          <div className='w-full flex'>
            <span className='mt-2 ml-auto'>
              Computation time: <span>{time}</span>sec.
            </span>
          </div>
        )}
      </section>
    </div>
  )
}

export default Determinant
