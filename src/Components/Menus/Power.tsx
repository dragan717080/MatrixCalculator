import React, { FC, useCallback, useState, useEffect } from 'react'
import MatrixDimensionsInput from '../Atoms/MatrixDimensionsInput'
import getPower from '../../lib/getPower'
import { useMatrixStore, useModalStore } from '../../store/zustandStore'
import Matrix from '../../interfaces/Matrix'

const Power: FC = () => {
  const {
    setIsOnlyA,
    setCalculate,
    aDim, setADim, aIsFilled, A, setA, setAIsFilled,
    setBIsFilled, setB,
    power
  } = useMatrixStore()
  const { isOpen } = useModalStore()
  const [C, setC] = useState<Matrix>([])
  const [time, setTime] = useState<number>(-1)
  console.log('%cRERENDER', 'color:red;font-size:16px');

  const calculateResult = useCallback(() => {
    console.log('A in calculate:', A);
    console.log('power in calculate:', power);
  
    const startTime = performance.now();
    const result = getPower(A, aDim[0], power);
    const endTime = performance.now();
  
    console.log('calc time:', endTime - startTime);
    let calcTime = (endTime - startTime) / 1000;
    calcTime = Number.isInteger(calcTime) 
      ? calcTime 
      : parseFloat(calcTime.toFixed(3));
  
    // If it is lower than `0.001s`, set is to `0.001s`
    setTime(Math.max(calcTime, 0.001));
  }, [A, aDim, power, getPower]);

  const recalculate = useCallback(() => {
    console.log('in recalculate');
    setTime(-1);
    setADim([0, 0]);
    setA([]);
    setAIsFilled(false);
  }, [setTime, setADim, setA, setAIsFilled]);

  useEffect(() => {
    console.log('recalculating function');
    if (A) {
      console.log('received A:', A);
      setCalculate(calculateResult)
    }
  }, [A, aIsFilled]);

  useEffect(() => {
    setIsOnlyA(true)
    setAIsFilled(false)
    setB([])
    setBIsFilled(false)
  }, [])

  return (
    <div className=''>
      {aIsFilled && !isOpen && (
        <div className=''>
          Power
        </div>
      )}
      <div className={`${isOpen || aIsFilled ? 'hidden' : 'block'}`}>
        <p>
        Here you can raise a matrix to a power with complex numbers online for free. You can examine multiplication apart that was used to get the current power on every step.
        </p>
        <MatrixDimensionsInput minValue={2} isSquare={true} isPower={true} />
      </div>
      <section className='pt-6'>
        {C.length && (
          <>
            <h3 className='bold mb-2'>Result</h3>
            {/* Insert result matrix */}
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

export default Power
