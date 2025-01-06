import React, { FC, MouseEvent, useEffect, useMemo, useRef, useState } from 'react'
import MatrixDimensionsInput from '../Atoms/MatrixDimensionsInput'
import MatrixTable from '../Atoms/MatrixTable'
import getDeterminant from '../../lib/getDeterminant'
import { useMatrixStore, useModalStore } from '../../store/zustandStore'
import { Step } from '../../interfaces/Determinant'
import ScrollWithSVGs from '../Atoms/ScrollWithSVGs'

const Determinant: FC = () => {
  const {
    setIsOnlyA,
    setCalculate,
    aDim, setADim, A, setA, aIsFilled, setAIsFilled,
    setBIsFilled
  } = useMatrixStore()
  const { isOpen } = useModalStore()

  const solutionStepsRef = useRef<HTMLDivElement | null>(null)

  const [determinant, setDeterminant] = useState<number | undefined>(undefined)
  const [time, setTime] = useState<number>(-1)
  const [steps, setSteps] = useState<Step[]>([])
  const [toShowSolution, setToShowSolution] = useState<boolean>(false)
  const [actualCounts, setActualCounts] = useState<number[]>([])
  const [stepsSwapsIndexes, setStepsSwapsIndexes] = useState<{ [key: string]: number }>({} as { [key: string]: number })

  const calculateResult = () => {
    console.log('A in calculate:', A)
    const startTime = performance.now()

    const { steps, result } = getDeterminant(A)

    setSteps(steps)
    console.log('%cSteps:', 'color:red;font-size:22px', steps);
    setDeterminant(result)
    console.log('%cDETERMINANT:', 'color:red;font-size:40', result);

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

  /** 1-based indexing. */
  const getOrderNumberToStr = (index: number) =>
    index === 1 ? 'st' : index === 2 ? 'nd' : index === 3 ? 'rd' : 'th'

  /** After completing all steps, get the equation for multiplying elements on upper (main) diagonal. */
  const getMultiplyEquation = () => {
    const upperDiagonalValues = steps[steps.length - 1].A.flatMap((row, i) => row.filter((_, j) => i === j));

    const strValues = upperDiagonalValues.map(x => {
      if (typeof (x) === 'string') {
        x = parseFloat(x)
      }

      const value = Number.isInteger(x) ? x : x!.toFixed(3)
      return (value as number)! >= 0 ? String(value) : `(${value})`
      //
    })
    //console.log('str values:', strValues);
    const equation = strValues.join(' X ')
    //console.log('equation', equation);
    return `${equation} = ${determinant}`
  }

  const getStepText = useMemo(
    () =>
      (step: Step, index: number) => {
        return typeof (step.swapRow) !== 'undefined'
          ? `Swapping rows ${step.swapRow[0] + 1} and ${step.swapRow[1] + 1}, changing the sign to ${step.sign}`
          // Text will have 1-based indexing so need `+1`
          : `Eliminate elements in the ${stepsSwapsIndexes[index] + 1}${getOrderNumberToStr(
            stepsSwapsIndexes[index] + 1)} column under the ${stepsSwapsIndexes[index] + 1}${getOrderNumberToStr(
              stepsSwapsIndexes[index] + 1)} element`;
      },
    [steps.length, actualCounts.length, Object.keys(stepsSwapsIndexes).length])

  const getHighlight = (step: Step, index: number, row: number, col: number) =>
    step.swapRow
      ? step.swapRow?.includes(row)
      : row > stepsSwapsIndexes[index] && col === stepsSwapsIndexes[index]

  // Memoized function to calculate actual counts based on `steps.length`
  useMemo(() => {
    if (steps.length === 0) {
      setActualCounts([]);
      return;
    }

    const stepsWithoutSwaps = steps.filter(x => typeof (x.swapRow) === 'undefined')

    // Track indexes of `steps` in relation to filtered steps without swaps
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
    console.log('%cStep indexes to indexes without swaps:', 'color:red;font-size:30px;', d);
    const counts: number[] = [];
    let swapIndex = 0; // Tracks the i-th swap step

    setStepsSwapsIndexes(d);
  }, [steps.length]);

  const handleClickUp = (e: MouseEvent<SVGSVGElement>) => {
    const index = Array.from(document.getElementsByClassName('svg-up')).indexOf(e.target as HTMLElement) + 1
    document.getElementById(`step-${index - 1}`)?.scrollIntoView({ behavior: 'smooth' });
  }

  const handleClickDown = (e: MouseEvent<SVGSVGElement>) => {
    const index = Array.from(document.getElementsByClassName('svg-down')).indexOf(e.target as HTMLElement) + 1
    document.getElementById(`step-${index + 1}`)?.scrollIntoView({ behavior: 'smooth' });
  }

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
    console.log('%cnew actual counts:', 'color:green', actualCounts);
  }, [actualCounts.length])

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
              <div id='step-1' className='row-v px-3 border-b-darkgray'>
                <ScrollWithSVGs handleClickUp={handleClickUp} handleClickDown={handleClickDown} aCols={aDim[1]} isFirst />
                <MatrixTable nRows={aDim[0]} nCols={aDim[1]} A={A} />
              </div>
              {steps.map((step, index) => (
                <div id={`step-${index + 2}`} className='pt-2 pb-3 border-b-darkgray' key={index}>
                  <p>{getStepText(step, index)}</p>
                  {!steps[index].swapRow && (
                    <div className='mt-3'>
                      {step.stepsExplanations.map((explanation, index) => (
                        <p key={index}>{explanation}</p>
                      ))}
                    </div>
                  )}
                  <p className={`${steps[index].swapRow && 'hidden'}`}></p>
                  <div className='row-v px-3'>
                    <ScrollWithSVGs handleClickUp={handleClickUp} handleClickDown={handleClickDown} aCols={aDim[1]} />
                    <MatrixTable
                      nRows={step.A.length}
                      nCols={step.A[0].length}
                      A={step.A}
                      toHighlight={(row = index, col = 0) => getHighlight(step, index, row, col)}
                    />
                  </div>
                </div>
              ))}
              <div id={`step-${steps.length + 2}`} className='pt-2'>
                <p>Multiply the main diagonal elements</p>
                <p>Sign: {steps[steps.length - 1].sign}</p>
                <div className='row-v px-3'>
                  <ScrollWithSVGs handleClickUp={handleClickUp} handleClickDown={handleClickDown} aCols={aDim[1]} isLast />
                  <MatrixTable nRows={aDim[0]} nCols={aDim[1]} A={steps[steps.length - 1].A} toHighlight={(row, col) => row === col} />
                </div>
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
