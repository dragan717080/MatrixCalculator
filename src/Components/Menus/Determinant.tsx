import React, { FC, useEffect, useRef, useState } from 'react'
import MatrixDimensionsInput from '../Atoms/MatrixDimensionsInput'
import MatrixTable from '../Atoms/MatrixTable'
import getDeterminant from '../../lib/getDeterminant'
import { useMatrixStore, useModalStore } from '../../store/zustandStore'
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
  const [steps, setSteps] = useState<Matrix[]>([])
  const [toShowSolution, setToShowSolution] = useState<boolean>(false)

  const calculateResult = () => {
    console.log('A in calculate:', A)
    const startTime = performance.now()

    const { steps, result } = getDeterminant(A)

    setSteps(steps)
    console.log('Steps:', steps);
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

  /** After completing all steps, get the equation for multiplying elements on upper (main) diagonal. */
  const getMultiplyEquation = () => {
    const upperDiagonalValues = steps[steps.length - 1].flatMap((row, i) => row.filter((_, j) => i === j));
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
                  <p>
                    Eliminate elements in the {index + 1}{index + 1 === 1 ? 'st' : index + 1 === 2 ? 'nd' : index + 1 === 3 ? 'rd' : 'th'} column under the 1st element
                  </p>
                  <MatrixTable nRows={A.length} nCols={A[0].length} A={A} toHighlight={(row = index, col = 0) => row > index && col === index} />
                </div>
              ))}
              <div className='pt-2'>
                Multiply the main diagonal elements
                <MatrixTable nRows={aDim[0]} nCols={aDim[1]} A={A} toHighlight={(row, col) => row === col} />
                <p>Δ = {getMultiplyEquation()}</p>
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
      <div>is open: {isOpen ? 'y' : 'n'} is filled: {aIsFilled ? 'y' : 'n'}</div>
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
