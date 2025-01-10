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
    bDim, setBDim, B, setB, bIsFilled, setBIsFilled,
    power,
    sign
  } = useMatrixStore()
  const { isOpen, setIsOpen } = useModalStore()

  const solutionStepsRef = useRef<HTMLDivElement | null>(null)

  const [toShowSolution, setToShowSolution] = useState<boolean>(false)
  const [steps, setSteps] = useState<Step[]>([])
  const [time, setTime] = useState<number>(-1)
  console.log('%cRERENDER', 'color:red;font-size:16px');


  const toggleShowSolution = useCallback(async () => {
    console.log('before toggle:', solutionStepsRef.current!)
    console.log('show original before toggle:', toShowSolution)
    if (!toShowSolution) {
      solutionStepsRef.current!.classList.remove('hidden')
      solutionStepsRef.current!.classList.add('fade-in-table')
      solutionStepsRef.current!.classList.remove('fade-out-table')
    } else {
      solutionStepsRef.current!.classList.remove('fade-in-table')
      solutionStepsRef.current!.classList.add('fade-out-table')
      await wait(700)
      solutionStepsRef.current!.classList.add('hidden')
    }
    console.log('after toggle:', solutionStepsRef.current!)
    setToShowSolution(!toShowSolution)
  }, [toShowSolution])

  const recalculate = () => {
    setTime(-1)
    setADim([0, 0])
    setA([])
    setAIsFilled(false)
    setBDim([0, 0])
    setB([])
    setBIsFilled(false)
    setSteps([])
    setToShowSolution(false)
    setIsOpen(false)
  }

  return (
    <div className='col-h'>
      {aIsFilled && !isOpen && (
        <div ref={solutionStepsRef}>
          {toShowSolution && (
            <div className='mb-7'>
              <h3 className='bold leading-4'>Original matrices</h3>
              <div className='row flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 pb-6 md:pb-0'>
                <MatrixTable nRows={aDim[0]} nCols={aDim[1]} A={A} />
                <MatrixTable nRows={bDim[0]} nCols={bDim[1]} A={B} letter='B' />
              </div>
            </div>
          )}
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
        {aIsFilled && bIsFilled && !isOpen && (
          <>
            {aIsFilled && bIsFilled && !isOpen && (
              <>
                <div className={`
                  ${toShowSolution
                    ? 'mt-1 md:mt-2 mb-4 md:mb-6'
                    : 'mb-8 md:mb-12'
                  }
                  row text-white space-x-5
                `}>
                  <button
                    onClick={() => toggleShowSolution()}
                    className='btn btn-brighter'
                  >
                    {!toShowSolution ? 'Show' : 'Hide'} solution
                  </button>
                  <button
                    onClick={() => recalculate()}
                    className='btn btn-brighter'
                  >
                    Recalculate
                  </button>
                </div>
                {steps.length > 0 && (
                  <section>
                    <MatrixTable nRows={aDim[0]} nCols={aDim[1]} A={steps[steps.length - 1].A} />
                    <div className='w-full flex'>
                      <span className='ml-auto pt-2'>
                        Computation time: <span>{time}</span>sec.
                      </span>
                    </div>
                  </section>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default AdditionSubstraction
