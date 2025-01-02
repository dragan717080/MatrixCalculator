import React, { FC, useEffect, useState } from 'react'
import MatrixDimensionsInput from '../Atoms/MatrixDimensionsInput'
import { useMatrixStore } from '../../store/zustandStore';
import Matrix from '../../interfaces/Matrix';

const Transpose: FC = () => {
  const calculateResult = () => {
    console.log('A in calculate', A);

    const startTime = performance.now();
    const transposed = Array.from({ length: aCols },
      (_, row) => Array.from(
        { length: aRows },
        (_, col) => A[col][row]
      ))
    console.log('Transposed matrix:', transposed);
    const endTime = performance.now();
    setTime((endTime - startTime).toFixed(3) as unknown as number)
    setC(transposed);
  }

  const { setCalculate, aDim, A, aIsFilled, setAIsFilled } = useMatrixStore()
  const [C, setC] = useState<Matrix>(A)
  const [aRows, aCols] = aDim
  const [cRows, cCols] = [aDim[1], aDim[0]]
  const [time, setTime] = useState<number>(-1)

  useEffect(() => {
    console.log('recalculating function');
    if (A) {
      setC(A)
      setCalculate(calculateResult)
    }
  }, [aIsFilled]);

  useEffect(() => {
    setAIsFilled(false)
  }, []);

  const recalculate = () => {
    setTime(-1)
  }

  return (
    <div>
      {aIsFilled && (
        <div className='row'>
          <button onClick={() => recalculate()} className='btn text-white'>Recalculate</button>
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
        {time > -1 && (
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
            <div className='w-full pt-4 flex'>
              <span className='ml-auto'>
                Computation time: <span>{time}</span>sec.
              </span>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default Transpose
