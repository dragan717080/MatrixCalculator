import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import MatrixDimensionsInput from '../Atoms/MatrixDimensionsInput'
import MatrixTable from '../Atoms/MatrixTable';
import useRecalculate from '../../hooks/useRecalculate';
import { getCalcTime, transpose, wait } from '../../lib/utils';
import { useMatrixStore, useModalStore } from '../../store/zustandStore'
import Matrix from '../../interfaces/Matrix';
import useResetParams from '../../hooks/useResetParams';

const Transpose: FC = () => {
  const { setIsOnlyA, setCalculate, aDim, setADim, A, setA, aIsFilled, setAIsFilled, setBIsFilled } = useMatrixStore()
  const { isOpen, setIsOpen } = useModalStore()

  const showOriginalRef = useRef<HTMLTableElement | null>(null)

  const [C, setC] = useState<Matrix>(A)
  const [aRows, aCols] = aDim
  const [cRows, cCols] = [aDim[1], aDim[0]]
  const [time, setTime] = useState<number>(-1)
  const [showOriginalMatrix, setShowOriginalMatrix] = useState<boolean>(false)

  const { recalculate } = useRecalculate({ setTime, setC, setShow: setShowOriginalMatrix, stepsRef: showOriginalRef })

  const { resetParams } = useResetParams({ onlyHasA: true })

  const calculateResult = () => {
    console.log('A in calculate', A);
    const { time, funcResult: transposed } = getCalcTime(() => transpose(A))
    setTime(time)
    setC(transposed)
  }

  const toggleShowOriginalMatrix = useCallback(async () => {
    console.log('before toggle:', showOriginalRef.current!)
    console.log('show original before toggle:', showOriginalMatrix)
    if (!showOriginalMatrix) {
      showOriginalRef.current!.classList.remove('hidden')
      showOriginalRef.current!.classList.add('fade-in-table')
      showOriginalRef.current!.classList.remove('fade-out-table')
    } else {
      showOriginalRef.current!.classList.remove('fade-in-table')
      showOriginalRef.current!.classList.add('fade-out-table')
      await wait(700)
      showOriginalRef.current!.classList.add('hidden')
    }
    console.log('after toggle:', showOriginalRef.current!)
    setShowOriginalMatrix(!showOriginalMatrix)
  }, [showOriginalMatrix])

  useEffect(() => {
    console.log('new A:', A);
    console.log('new A is filled:', aIsFilled);
    if (A && aIsFilled) {
      console.log('recalculating function');
      setC(A.length ? transpose(A) : [])
      setCalculate(calculateResult)
    }
  }, [A, aIsFilled])

  useEffect(() => {
    resetParams()
  }, [])

  return (
    <div className='col-h'>
      {aIsFilled && !isOpen && C.length && (
        <>
          <MatrixTable ref={showOriginalRef} nRows={aRows} nCols={aCols} A={A} className='hidden' />
          <div className='row text-white space-x-5'>
            <button
              onClick={() => toggleShowOriginalMatrix()}
              className='btn btn-brighter'
            >
              {!showOriginalMatrix ? 'Show' : 'Hide'} matrix
            </button>
            <button
              onClick={() => recalculate()}
              className='btn btn-brighter'
            >
              Recalculate
            </button>
          </div>
        </>
      )}
      <div>
        <div className={`${isOpen || aIsFilled ? 'hidden' : 'block'}`}>
          <h3 className='bold'>Transpose</h3>
          The algorithm of matrix transpose is pretty simple.
          <ul>
            <li>A new matrix is obtained the following way: each [i, j] element of the new matrix gets the value of the [j, i] element of the original one.</li>
            <li>Dimension also changes to the opposite. For example if you transpose a 'n' x 'm' size matrix you'll get a new one of 'm' x 'n' dimension.</li>
          </ul>
          To understand transpose calculation better input any example and examine the solution.
          <MatrixDimensionsInput minValue={2} />
        </div>
        {!isOpen && C.length > 0 && aIsFilled && (
          <section className='py-5'>
            <h3 className='bold mb-2'>Result</h3>
            <div className=''>
              <MatrixTable nRows={cRows} nCols={cCols} A={C} />
            </div>
            {time > -1 && (
              <div className='w-full pt-4 flex'>
                <span className='ml-auto'>
                  Computation time: <span>{time}</span>sec.
                </span>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  )
}

export default Transpose
