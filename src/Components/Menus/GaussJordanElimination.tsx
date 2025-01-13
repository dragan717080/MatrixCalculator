import React, { FC, useEffect, useMemo, useRef, useState } from 'react'
import MatrixDimensionsInput from '../Atoms/MatrixDimensionsInput'
import MatrixTable from '../Atoms/MatrixTable'
import ScrollWithSVGs from '../Atoms/ScrollWithSVGs'
import useRecalculate from '../../hooks/useRecalculate'
import useResetParams from '../../hooks/useResetParams'
import useToggleShowSolution from '../../hooks/useToggleShowSolution'
import getInverse from '../../lib/getInverse'
import getGaussJordanElimination from '../../lib/getGaussJordanElimination'
import { getCalcTime } from '../../lib/utils'
import { useLinearEquationsStore, useMatrixStore, useModalStore } from '../../store/zustandStore'
import Matrix, { Step } from '../../interfaces/Matrix'
import { HighlightCells } from '../../interfaces/MatrixTableProps'

const GaussJordanElimination: FC = () => {
  const { equationCoefs } = useLinearEquationsStore()
  const {
    setCalculate,
    aDim, A, aIsFilled
  } = useMatrixStore()
  const { isOpen } = useModalStore()

  const solutionStepsRef = useRef<HTMLDivElement | null>(null)

  const descriptionAndInputRef = useRef<HTMLDivElement | null>(null)

  const [determinant, setDeterminant] = useState<number | undefined>(undefined)
  const [time, setTime] = useState<number>(-1)
  const [steps, setSteps] = useState<Step[]>([])
  const [toShowSolution, setToShowSolution] = useState<boolean>(false)
  const [equationSolution, setEquationSolution] = useState<string[] | null>([])

  const { recalculate } = useRecalculate({ setTime, setShow: setToShowSolution, setSteps })

  const { resetParams } = useResetParams({ descriptionAndInputRef })

  const { toggleShowSolution } = useToggleShowSolution({ solutionStepsRef, toShowSolution, setToShowSolution })

  /**
   * @param {number} index - Step index.
   * 
   * @returns {HighlightCells}
   */
  const getHighlightFunc = (index: number): HighlightCells | undefined => {
    const { A, explanation } = steps[index]
    const [m, n] = [A.length, A[0].length]
    const isAugmented = !Array.isArray(explanation) && explanation.includes('Write the augmented')
    const isInversionStep = Array.isArray(explanation) && explanation.some(x => x.includes('matrix is inversed'))

    if (isAugmented || isInversionStep) {
      return (_, col) => col >= aDim[1]
    }

    const isPivot = !Array.isArray(explanation) && explanation.includes('Make the pivot in the')

    if (isPivot) {
      const [i, j] = explanation.split(/\D/).filter(Boolean).slice(0, 2).map(x => parseInt(x) - 1)

      return (row, col) => row === i && col === j
    }

    const areRows = Array.isArray(explanation) && explanation.length && explanation[0].includes(' = ') && explanation[0][0] === 'R'

    if (areRows) {
      // Don't highlight only the pivoted row
      let pivotedRow = parseInt((explanation[0] as string).split(/\s/).slice(-1)[0].split(/\D/).slice(-1)[0])
      // Text explanation uses 1-based indexing
      pivotedRow -= 1

      return (row, col) => row !== pivotedRow
    }

    const columnIsAlreadyOne = !Array.isArray(explanation) && explanation.includes('is already 1, so no need to eliminate this column')
    if (columnIsAlreadyOne) {
      // console.log('step to highlight:', explanation);
      const index = explanation.split('is already 1, so no need to eliminate this column')[0]
      // console.log(index);
      // Text explanation uses 1-based indexing
      const [i, j] = index.split(/\D/).filter(Boolean).map(x => parseInt(x) - 1)
      // console.log('i:', i, 'j:', j);

      return (row, col) => row === i && col === j
    }
  }

  const calculateResult = () => {
    // It will go to this function again when `A` changes with `updateValuesForMatrix`
    if (!A.length || !A.flat().every(x => typeof (x) !== 'string')) {
      return
    }

    if (!equationCoefs.length || !equationCoefs.flat().every(x => typeof (x) !== 'string')) {
      return
    }

    console.log('A in calculate:', A)
    const { time, funcResult: result } = getCalcTime(() => getGaussJordanElimination(A, equationCoefs as number[]))
    console.log('Result:', result);
    const { solution: newSolution, steps, determinant: newDeterminant } = result

    setSteps(steps)
    setDeterminant(newDeterminant)
    setEquationSolution(newSolution)
    setTime(time)
  }

  // Since identity matrix will be appended to the right, fix display indexes,
  // e.g. `A1 A2 A3 A4` -> `A1 A2 B1 B2`
  useEffect(() => {
    if (!toShowSolution) {
      return
    }

    const tableElements = Array.from(document.getElementsByTagName('table'))

    for (const table of tableElements) {
      const headers = table.getElementsByTagName('th')

      headers[headers.length - 1].innerHTML = 'b'
      headers[headers.length - 1].classList.add('border-l-orange')

      const tableRows = Array.from(table.getElementsByTagName('tbody')[0].getElementsByTagName('tr'))
      for (const row of tableRows) {
        const cells = row.getElementsByTagName('td')
        console.log('Cells:', cells);
        const lastCell = cells[cells.length - 1]
        console.log('last cell:', lastCell);
        lastCell.classList.add('border-l-orange')
      }
    }
  }, [steps.length, aDim, solutionStepsRef.current?.getElementsByTagName('table').length, toShowSolution])

  useEffect(() => {
    const originalMatrixHeaders = document.getElementById('step-1')?.getElementsByTagName('th')
    if (!originalMatrixHeaders?.length) {
      return
    }

    console.log('original headers:', originalMatrixHeaders);
    //originalMatrixHeaders[originalMatrixHeaders.length - 1].innerHTML = 'b'
  }, [])

  useEffect(() => {
    if (A) {
      setCalculate(calculateResult)
      if (aIsFilled && equationCoefs.length && !isOpen && time === -1) {
        calculateResult()
      }
    }
  }, [A, aIsFilled, isOpen, time]);

  useEffect(() => {
    resetParams()
  }, [])

  useEffect(() => {
    console.log('new steps:', steps);
  }, [steps.length])

  useEffect(() => {
    console.log('A changed:', A)
  }, [A])

  useEffect(() => {
    const solutionExplanations = Array.from(document.getElementsByClassName('solution-explanation'))

    console.log(equationSolution);
    const lastElements = equationSolution

    console.log(lastElements);
    solutionExplanations.forEach((explanation, index) => {
      explanation.innerHTML = equationSolution![index]
    })
  }, [steps.length, equationSolution])
  

  return (
    <div className='col-h'>
      {aIsFilled && !isOpen && (
        <div ref={solutionStepsRef}>
          {toShowSolution && (
            <div className='solution-items-container mb-7'>
              <h3 className='mb-4 text-center bold leading-4'>Original matrix</h3>
              {A.length === 1 && (
                <div className='w-full row overflow-hidden'>
                  <span>
                    A has only one row so Δ =
                    A<span className='subindex'>1</span><span className='subindex'>1</span> = {A[0][0]}
                  </span>
                </div>
              )}
              <div id='step-1' className='row-v px-3 border-b-darkgray'>
                {steps.length > 1 && (
                  <ScrollWithSVGs aCols={aDim[1]} isFirst />
                )}
                <MatrixTable
                  nRows={aDim[0]}
                  nCols={aDim[1]}
                  A={A}
                  isWithCoefs={true}
                  letter='X'
                  highlightFunc={
                    A.length === 1 || A[0].length === 1
                      ? (row, col) => row === 0 && col === 0
                      : undefined
                  }
                />
              </div>
              {typeof (determinant) !== 'undefined' && determinant !== 0 && (
                <div id='step-2' className='row-v py-4 px-3 border-b-darkgray'>
                  <ScrollWithSVGs aCols={aDim[1]} />
                  <div className='col-v space-y-1'>
                    <p>Δ = {determinant}</p>
                    <p>Determinant is not zero, therefore system is consistent</p>
                  </div>
                </div>
              )}
              {steps.map((step, index) => (
                <div id={`step-${index + 3}`} className='pt-2 pb-3 border-b-darkgray' key={index}>
                  {/* <p>{getStepText(step, index)}</p> */}
                  <div className='flex flex-col space-y-1.5 pt-2 pb-2.5'>
                    {Array.isArray(step.explanation)
                      ? step.explanation.map((explanation, index) => (
                        <p key={index}>{explanation}</p>))
                      : <p>{step.explanation}</p>
                    }
                  </div>
                  <p className={`${steps[index].swapRow && 'hidden'}`}></p>
                  <div className='row-v px-3'>
                    <ScrollWithSVGs aCols={aDim[1]} />
                    <MatrixTable
                      nRows={step.A.length}
                      nCols={step.A[0].length}
                      A={step.A}
                      letter='X'
                      highlightFunc={getHighlightFunc(index)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <div ref={descriptionAndInputRef} className='hidden'>
        <div className={`${isOpen || aIsFilled ? 'hidden' : 'block'}`}>
          <h3 className='mb-4 text-lg bold'>Gauss-Jordan Elimination</h3>
          <ol>
            <li>Change the matrix to reduced row echelon form (RREF).</li>
            <li>It is matrix with all zeros below the main diagonal, and all ones at the main diagonal.</li>
            <li>Pick the 1st element in the 1st column (pivot), if it is 0, swap it with the first non zero column under it.</li>
            <li>Divide that row by value of pivot so that pivot is 1.</li>
            <li>Eliminate all elements that both below and above the current one.</li>
            <li>This is different from the row echelon form (REF) where you would only eliminate the elements below.</li>
            <li>Pick the 2nd element in the 2nd column and do the same operations up to the end.</li>
            <li>Solution matrix will describe the corelation between the variables.</li>
          </ol>
          <span>To understand inverse calculation better input any example and examine the solution.</span>
          <MatrixDimensionsInput minValue={1} />
        </div>
        {aIsFilled && !isOpen && (
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
            <section className={!toShowSolution ? 'pt-6' : 'pt-2'}>
              {determinant
                ? (
                  <>
                    <h3 className='bold mb-2'>Result</h3>
                    <div className='flex flex-col'>
                      {equationSolution!.map((variableSolution, index) => (
                        <p className='solution-explanation' key={index}>{variableSolution}</p>
                      ))}
                    </div>
                  </>)
                : (
                  <div>
                    Determinant is 0, so this matrix has no inverse.
                  </div>
                )}
              <div className='w-full flex'>
                <span className='ml-auto pt-2'>
                  Computation time: <span>{time !== - 1 ? time : '0.001'}</span>sec.
                </span>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}

export default GaussJordanElimination
