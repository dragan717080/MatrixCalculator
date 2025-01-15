import React, { FC, useEffect, useRef, useState } from 'react'
import MatrixDimensionsInput from '../Atoms/MatrixDimensionsInput'
import MatrixTable from '../Atoms/MatrixTable'
import SolutionRows from '../Atoms/SolutionRows'
import OriginalMatrix from '../Atoms/OriginalMatrix'
import useRecalculate from '../../hooks/useRecalculate'
import useToggleShowSolution from '../../hooks/useToggleShowSolution'
import { getCalcTime, transpose } from '../../lib/utils'
import { useMatrixStore, useModalStore } from '../../store/zustandStore'
import Matrix from '../../interfaces/Matrix'
import useResetParams from '../../hooks/useResetParams'

const Transpose: FC = () => {
  const { setCalculate, aDim, A, aIsFilled } = useMatrixStore()
  const { isOpen } = useModalStore()

  const showOriginalRef = useRef<HTMLDivElement | null>(null)
  const descriptionAndInputRef = useRef<HTMLDivElement | null>(null)

  const [C, setC] = useState<Matrix>(A)
  const [cRows, cCols] = [aDim[1], aDim[0]]
  const [time, setTime] = useState<number>(-1)
  const [toShowOriginalMatrix, setToShowOriginalMatrix] = useState<boolean>(false)

  const { recalculate } = useRecalculate({ setTime, setC, setShow: setToShowOriginalMatrix, stepsRef: showOriginalRef })

  const { resetParams } = useResetParams({ descriptionAndInputRef, onlyHasA: true })

  const { toggleShowSolution: toggleShowOriginalMatrix } = useToggleShowSolution({ solutionStepsRef: showOriginalRef, toShowSolution: toShowOriginalMatrix, setToShowSolution: setToShowOriginalMatrix })

  /** Unlike other `calculate` functions, transpose doesn't need to wait for parsing number to floats. */
  const calculateResult = () => {
    const { time, funcResult: transposed } = getCalcTime(() => transpose(A))
    setTime(time)
    setC(transposed)
  }

  useEffect(() => {
    if (A && aIsFilled) {
      setC(A.length ? transpose(A) : [])
      setCalculate(calculateResult)
    }
  }, [A, aIsFilled])

  useEffect(() => {
    resetParams()
  }, [])

  useEffect(() => {
    setTime(-1)
  }, [A])

  return (
    <div className='col-h'>
      {aIsFilled && !isOpen && (
        <div ref={showOriginalRef}>
          {toShowOriginalMatrix && (
            <div className='solution-items-container mb-7'>
              <OriginalMatrix A={A} steps={[]} isEquation={false} />
            </div>
          )}
        </div>
      )}
      <div ref={descriptionAndInputRef} className='hidden'>
        <div className={`${isOpen || aIsFilled ? 'hidden' : 'block'}`}>
          <h3 className='mb-4 text-lg bold'>Transpose</h3>
          <p className='mb-2'>The algorithm of matrix transpose is pretty simple.</p>
          <ol>
            <li>A new matrix is obtained the following way: each [i, j] element of the new matrix gets the value of the [j, i] element of the original one.</li>
            <li>Dimension also changes to the opposite. For example if you transpose a 'n' x 'm' size matrix you'll get a new one of 'm' x 'n' dimension.</li>
          </ol>
          To understand transpose calculation better input any example and examine the solution.
          <MatrixDimensionsInput minValue={2} />
        </div>
        {!isOpen && C.length > 0 && aIsFilled && (
          <SolutionRows
            toShowSolution={toShowOriginalMatrix}
            time={time}
            toggleShowSolution={toggleShowOriginalMatrix}
            recalculate={recalculate}
            withMatrixText={true}
          >
            <MatrixTable nRows={cRows} nCols={cCols} A={C} />
          </SolutionRows>
        )}
      </div>
    </div>
  )
}

export default Transpose
