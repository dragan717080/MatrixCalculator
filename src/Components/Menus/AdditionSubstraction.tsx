import React, { FC, useCallback, useRef, useState, useEffect } from 'react'
import MatrixDimensionsInput from '../Atoms/MatrixDimensionsInput'
import MatrixTable from '../Atoms/MatrixTable'
import ScrollWithSVGs from '../Atoms/ScrollWithSVGs'
import getPower from '../../lib/getPower'
import { getCalcTime, wait } from '../../lib/utils'
import { useMatrixStore, useModalStore } from '../../store/zustandStore'
import Matrix, { Step } from '../../interfaces/Matrix'

const AdditionSubstraction: FC = () => {
  const {
    setIsOnlyA,
    setCalculate,
    aDim, setADim, aIsFilled, A, setA, setAIsFilled,
    setBDim, setB, setBIsFilled,
    power
  } = useMatrixStore()
  const { isOpen, setIsOpen } = useModalStore()

  const solutionStepsRef = useRef<HTMLDivElement | null>(null)

  const [toShowSolution, setToShowSolution] = useState<boolean>(false)
  const [steps, setSteps] = useState<Step[]>([])
  const [time, setTime] = useState<number>(-1)
  console.log('%cRERENDER', 'color:red;font-size:16px');

  return (
    <div className='col-h'>
      <div>AdditionSubstraction</div>
      {aIsFilled && !isOpen && (
        <div ref={solutionStepsRef}>
        </div>
      )}
      <div>
        <div className={`${isOpen || aIsFilled ? 'hidden' : 'block'}`}>
          <h3 className='mb-4 text-lg bold'>Power</h3>
          <p className='flex flex-col space-y-2'>
            Here you can perform matrix addition and subtraction with complex numbers online for free.
          </p>
          <MatrixDimensionsInput minValue={1} isSquare={true} isPower={true} />
        </div>
        {aIsFilled && !isOpen && (
          <>
            1
          </>
        )}
      </div>
    </div>
  )
}

export default AdditionSubstraction
