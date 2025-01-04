import React, { FC, useEffect, useState } from 'react'
import MatrixDimensionsInput from '../Atoms/MatrixDimensionsInput'
import getDeterminant from '../../lib/getDeterminant'
import { useMatrixStore, useModalStore } from '../../store/zustandStore'

const Determinant: FC = () => {
  const {
    setIsOnlyA,
    setCalculate,
    aDim, setADim, A, setA, aIsFilled, setAIsFilled,
    bIsFilled, setBIsFilled
  } = useMatrixStore()
  const { isOpen } = useModalStore()
  const [determinant, setDeterminant] = useState<number | undefined>(undefined)
  const [time, setTime] = useState<number>(-1)

  const calculateResult = () => {
    console.log('A in calculate:', A)
    const startTime = performance.now()

    setDeterminant(getDeterminant(A))

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

  useEffect(() => {
    console.log('recalculating function');
    if (A) {
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
        <div className='row text-white space-x-5 mb-5'>
          <button onClick={() => recalculate()} className='btn'>Recalculate</button>
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
            <span className='ml-auto'>
              Computation time: <span>{time}</span>sec.
            </span>
          </div>
        )}
      </section>
    </div>
  )
}

export default Determinant
