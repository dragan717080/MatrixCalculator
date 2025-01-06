import React, { FC, ChangeEvent, MouseEvent, useRef, useState, useEffect } from 'react'
import MatrixDimensionsInputProps from '../../interfaces/MatrixDimensionsInputProps'
import { TwoNumbers } from '../../interfaces/Matrix'
import { useMatrixStore, useModalStore } from '../../store/zustandStore'

const MatrixDimensionsInput: FC<MatrixDimensionsInputProps> = ({
  minValue,
  isSquare = false
}) => {
  const { isOnlyA, aDim, setADim, setA, bDim, setBDim, setB } = useMatrixStore()
  const { isOpen, setIsOpen } = useModalStore()
  const aRows = useRef<HTMLInputElement | null>(null)
  const aCols = useRef<HTMLInputElement | null>(null)
  const bRows = useRef<HTMLInputElement | null>(null)
  const bCols = useRef<HTMLInputElement | null>(null)

  const validateRange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value as unknown as number
    if (value < 1) {
      e.target.value = '1'
    } else if (value > 25) {
      e.target.value = '25'
    }
  }

  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const newAValue = getNumericDimValue()

    // Only opet modal if all dimensions are set
    const aIsSet = newAValue[0] !== 0 && newAValue[1] !== 0
    setADim(newAValue)

    if (!isOnlyA) {
      const newBValue = getNumericDimValue(false)
      setBDim(newBValue)
      const bIsSet = newBValue[0] !== 0 && newBValue[1] !== 0

      if (aIsSet && bIsSet) {
        setIsOpen(true)
        
      }
    } else {
      console.log('a is set:', aIsSet);
      if (aIsSet) {
        console.log('opening modal');
        setIsOpen(true)
      }
    }
  }

  /** Set `aDim` and `bDim` values, or undefined if they are null. */
  const getNumericDimValue = (isA = true) => {
    if (isA) {
      const aRowsNum = parseInt(aRows.current?.value || '0')
      const aColsNum = !isSquare ? parseInt(aCols.current?.value || '0') : aRowsNum

      return [aRowsNum, aColsNum] as TwoNumbers
    }

    const bRowsNum = parseInt(bRows.current?.value || '0')
    const bColsNum = parseInt(bCols.current?.value || '0')

    return [bRowsNum, bColsNum] as TwoNumbers
  }

  useEffect(() => {
    console.log('new A dim in input:', aDim)
    if (aDim[0] === 0 && aRows.current) {
      aRows.current.value = ''
    }

    if (aDim[1] === 0 && aCols.current) {
      aCols.current!.value = ''
    }

    if (aDim[0] === 0 && bRows.current) {
      bRows.current!.value = ''
    }

    if (aDim[1] === 0 && bCols.current) {
      bCols.current!.value = ''
    }
  }, [aDim[0], aDim[1], bDim[0], bDim[1]])

  useEffect(() => {
    console.log('isOpen in input:', isOpen);
  }, [isOpen])
  return (
    <div className='row pt-7'>
      <form action=''>
        {/* Pick A */}
        <div className='row'>
          <span className='mr-2'>Matrix {!isOnlyA ? 'A ' : ''}dimension:</span>
          <input
            required
            ref={aRows}
            type='number'
            inputMode='numeric'
            onChange={validateRange}
            min='1'
            max='25'
            className='p-1.5 pr-0 pb-1.5 pl-2.5 w-[50px] text-sm pointer outline-none rounded-lg focus:bg-primary'
            value={4}
          />
          {!isSquare && (
            <>
              <span className='px-2'>X</span>
              <input
                required
                ref={aCols}
                type='number'
                inputMode='numeric'
                onChange={validateRange}
                min='1'
                max='25'
                className='p-1.5 pr-0 pb-1.5 pl-2.5 w-[50px] text-sm pointer outline-none rounded-lg focus:bg-primary'
                value={2}
              />
            </>
          )}
        </div>
        {/* Pick B */}
        {!isOnlyA && (
          <div className='row mt-5'>
            <span className='mr-2'>Matrix B dimension:</span>
            <input
              required
              ref={bRows}
              type='number'
              inputMode='numeric'
              onChange={validateRange}
              min='1'
              max='25'
              className='p-1.5 pr-0 pb-1.5 pl-2.5 w-[50px] text-sm pointer outline-none rounded-lg focus:bg-primary'
            /*               value={2} */
            />
            <span className='px-2'>X</span>
            <input
              required
              ref={bCols}
              type='number'
              inputMode='numeric'
              onChange={validateRange}
              min='1'
              max='25'
              className='p-1.5 pr-0 pb-1.5 pl-2.5 w-[50px] text-sm pointer outline-none rounded-lg focus:bg-primary'
            /*               value={4} */
            />
          </div>
        )}
        <button
          type='submit'
          onClick={(e) => handleSubmit(e)}
          className='row-h rounded-md mt-7 mb-5 lg:mt-10 lg:mb-8 mx-auto px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 bg-sky-500 hover:bg-sky-600 text-gray-300 focus-visible:outline-sky-600'
        >
          Set {!isOnlyA ? 'matrix' : 'matrices'}
        </button>
      </form>
    </div>
  )
}

export default MatrixDimensionsInput
