import React, { FC, useEffect, useState } from 'react'
import MatrixDimensionsInput from '../Atoms/MatrixDimensionsInput'
import { useMatrixStore, useModalStore } from '../../store/zustandStore';
import Matrix from '../../interfaces/Matrix';

const Transpose: FC = () => {
  const { setCalculate, aDim, setADim, A, setA, aIsFilled, setAIsFilled, setBIsFilled } = useMatrixStore()
  const { isOpen, setIsOpen } = useModalStore()
  const [C, setC] = useState<Matrix>(A)
  const [aRows, aCols] = aDim
  const [cRows, cCols] = [aDim[1], aDim[0]]
  const [time, setTime] = useState<number>(-1)
  const [showOriginalMatrix, setShowOriginalMatrix] = useState<boolean>(false)

  const calculateResult = () => {
    console.log('A in calculate', A);

    const startTime = performance.now();
    const transposed = Array.from({ length: aCols },
      (_, row) => Array.from(
        { length: aRows },
        (_, col) => A[col][row]
      ))

    const endTime = performance.now();
    console.log('calc time:', endTime - startTime);
    const calcTime = ((endTime - startTime) / 1000).toFixed(3) as unknown as number
    // If it is lower than `0.001s`, set is to `0.001s`
    setTime(Math.max(calcTime, 0.001))
    setC(transposed)
  }

  useEffect(() => {
    console.log('recalculating function');
    if (A) {
      setC(A)
      setCalculate(calculateResult)
    }
  }, [aIsFilled])

  useEffect(() => {
    setAIsFilled(false)
    setBIsFilled(false)
  }, [])

  const recalculate = () => {
    setTime(-1)
    setADim([0, 0])
    setA([])
    setAIsFilled(false)
  }

  useEffect(() => {
    console.log('new A dim:', aDim);
  }, [aDim[0], aDim[1]])

  return (
    <div>
      {showOriginalMatrix && !isOpen && (
        <table className='matrix-table mt-5 mb-6 mx-auto overflow-scroll md:overflow-auto text-center'>
          <thead>
            <tr>
              {/* First element is empty */}
              <th>&nbsp;</th>
              {Array.from({ length: aCols }).map((_, col) => (
                <th key={col}>A<span className='subindex'>{col + 1}</span></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: aRows }).map((_, row) => (
              <tr key={row}>
                <td>{row + 1}</td>
                {Array.from({ length: aCols }).map((_, col) => (
                  <td className='' key={col}>
                    <div className='matrix-table-input-cell focus:bg-primary'>
                      {A[row][col]}
                    </div>
                  </td>
                ))}
              </tr>
            ))
            }
          </tbody>
        </table>
      )}
      {aIsFilled && (
        <div className='row text-white space-x-5'>
          <button className='btn' onClick={() => setShowOriginalMatrix(!showOriginalMatrix)}>
            {!showOriginalMatrix ? 'Show' : 'Hide'} matrix
          </button>
          <button onClick={() => recalculate()} className='btn'>Recalculate</button>
        </div>
      )}
      <MatrixDimensionsInput />
      <div>
        <h3 className='bold'>About the method</h3>
        The algorithm of matrix transpose is pretty simple.
        <ul>
          <li>A new matrix is obtained the following way: each [i, j] element of the new matrix gets the value of the [j, i] element of the original one.</li>
          <li>Dimension also changes to the opposite. For example if you transpose a 'n' x 'm' size matrix you'll get a new one of 'm' x 'n' dimension.</li>
        </ul>
        To understand transpose calculation better input any example and examine the solution.
        {!isOpen && C.length && (
          <section className='py-5'>
            <h3 className='bold'>Result</h3>
            <table className='matrix-table mt-7 mx-auto overflow-scroll md:overflow-auto text-center'>
              <thead>
                <tr>
                  {/* First element is empty */}
                  <th>&nbsp;</th>
                  {Array.from({ length: cCols }).map((_, col) => (
                    <th key={col}>C<span className='subindex'>{col + 1}</span></th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: cRows }).map((_, row) => (
                  <tr key={row}>
                    <td>{row + 1}</td>
                    {Array.from({ length: cCols }).map((_, col) => (
                      <td className='' key={col}>
                        <div className='matrix-table-input-cell focus:bg-primary'>
                          {C[row][col]}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))
                }
              </tbody>
            </table>
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
