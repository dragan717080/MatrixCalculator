import React, { FC, useCallback, useRef, useState, useEffect } from 'react'
import MatrixDimensionsInput from '../Atoms/MatrixDimensionsInput'
import MatrixTable from '../Atoms/MatrixTable'
import ScrollWithSVGs from '../Atoms/ScrollWithSVGs'
import useRecalculate from '../../hooks/useRecalculate'
import useResetParams from '../../hooks/useResetParams'
import useToggleShowSolution from '../../hooks/useToggleShowSolution'
import getPower from '../../lib/getPower'
import { getCalcTime, wait } from '../../lib/utils'
import { useMatrixStore, useModalStore } from '../../store/zustandStore'
import Matrix, { Step } from '../../interfaces/Matrix'

const Power: FC = () => {
  const {
    setCalculate,
    aDim, setADim, aIsFilled, A, setA, setAIsFilled,
    power, setPower
  } = useMatrixStore()
  const { isOpen } = useModalStore()

  const solutionStepsRef = useRef<HTMLDivElement | null>(null)

  const descriptionAndInputRef = useRef<HTMLDivElement | null>(null)

  const [toShowSolution, setToShowSolution] = useState<boolean>(false)
  const [steps, setSteps] = useState<Step[]>([])
  const [time, setTime] = useState<number>(-1)

  const { recalculate } = useRecalculate({ setTime, setShow: setToShowSolution, setSteps, stepsRef: solutionStepsRef, isPower: true })

  const { resetParams } = useResetParams({ descriptionAndInputRef })

  const { toggleShowSolution } = useToggleShowSolution({ solutionStepsRef, toShowSolution, setToShowSolution })

  const calculateResult = () => {
    const aIsFilled = A.length && A.flat().every(x => typeof (x) !== 'string')
    if (!aIsFilled) {
      return
    }

    console.log('Power before calculate', power);
    console.log('A before calculate', A);

    const { time, funcResult: result } = getCalcTime(() => getPower(A, power))

    console.log('STEPS:', result);
    setSteps(result)
    setTime(time)
  }

  useEffect(() => {
    console.log('recalculating function');
    console.log('A:', A);
    if (A) {
      console.log('shall set calculate');
      setCalculate(calculateResult)
      if (aIsFilled && !isOpen && time === -1) {
        calculateResult()
      }
    }
  }, [A, aIsFilled, isOpen, time]);

  useEffect(() => {
    resetParams()
  }, [])

  useEffect(() => {
    console.log('new power value:', power);
  }, [power])

  return (
    <div className='col-h'>
      {aIsFilled && !isOpen && (
        <div ref={solutionStepsRef}>
          {toShowSolution && (
            <>
              {steps.length > 0 && (
                <h3 className='mb-1 text-center bold leading-4'>Original matrix</h3>
              )}
              <div className='solution-items-container mb-7'>
                <div id='step-1' className='row-v px-3 border-b-darkgray'>
                  <ScrollWithSVGs aCols={aDim[1]} isFirst />
                  <MatrixTable nRows={aDim[0]} nCols={aDim[1]} A={A} />
                </div>
                {power !== 1 && steps.slice(0, -1).map((step, index) => (
                  <div id={`step-${index + 2}`} className='pt-2 pb-3 border-b-darkgray' key={index}>
                    <div>
                      <div className='mt-2 w-full text-center'>
                        <span>
                          A<span className='superindex'>{index + 2}</span> = A{
                            index > 0 && <span className='superindex'>{index + 1}</span>
                          } * A
                        </span>
                      </div>
                      <div className='row-v px-3'>
                        <ScrollWithSVGs aCols={aDim[1]} isLast={index === steps.length - 1} />
                        <MatrixTable
                          nRows={step.A.length}
                          nCols={step.A[0].length}
                          A={step.A}
                          className='!my-4'
                          index={index}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
      <div ref={descriptionAndInputRef} className='hidden'>
        <div className={`${isOpen || aIsFilled ? 'hidden' : 'block'}`}>
          <h3 className='mb-4 text-lg bold'>Power</h3>
          <p className='flex flex-col space-y-2'>
            <span className='leading-5'>Here you can raise a matrix to a power with complex numbers online for free. You can examine multiplication apart that was used to get the current power on every step.</span>
            <span className='leading-5'>Matrix to the power of 0 gives an identity matrix.</span>
            <span className='leading-5'>Matrix raised to the power 'n' is matrix multiplied by itself 'n' times, same as in algebra.</span>
          </p>
          <MatrixDimensionsInput minValue={1} isSquare={true} isPower={true} />
        </div>
        {aIsFilled && !isOpen && (
          <>
            <div className={`
              ${toShowSolution
                ? 'mt-1 md:mt-2 mb-7 md:mb-10'
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
                <div className='w-full text-center'>
                  {power === 0 && (
                    <p className='mt-6'>A raised to the power of 0 gives an identity matrix</p>
                  )}
                  {power === 1 && (
                    <p className='mt-6'>A raised to the power of 1 gives the same matrix</p>
                  )}
                  {power > 1 && (
                    <span>
                      A<span className='superindex'>{power}</span> = A{
                        power > 2 && <span className='superindex'>{power - 1}</span>
                      } * A
                    </span>
                  )}
                </div>
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
      </div>
    </div>
  )
}

export default Power
