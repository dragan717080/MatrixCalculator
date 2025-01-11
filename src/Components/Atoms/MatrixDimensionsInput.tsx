import React, { FC, ChangeEvent, MouseEvent, memo, useCallback, useRef, useEffect, useState } from 'react'
import MatrixDimensionsInputProps from '../../interfaces/MatrixDimensionsInputProps'
import { TwoNumbers } from '../../interfaces/Matrix'
import { useMatrixStore, useModalStore } from '../../store/zustandStore'

const MatrixDimensionsInput: FC<MatrixDimensionsInputProps> = ({
  minValue,
  isSquare = false,
  isPower = false,
  isMultiplication = false,
  isAS = false,
}) => {
  const {
    isOnlyA,
    aDim, setADim, A, setA, aIsFilled,
    bDim, setBDim, setB,
    power, setPower,
    sign, setSign,
  } = useMatrixStore()
  const { isOpen, setIsOpen } = useModalStore()
  // console.log('%cRERENDER', 'color:red;font-size:16px');

  const aRows = useRef<HTMLInputElement | null>(null)
  const aCols = useRef<HTMLInputElement | null>(null)
  const bRows = useRef<HTMLInputElement | null>(null)
  const bCols = useRef<HTMLInputElement | null>(null)
  const powerRef = useRef<HTMLInputElement | null>(null)
  const signRef = useRef<HTMLSelectElement | null>(null)

  const submitRef = useRef<HTMLButtonElement | null>(null)

  const [allIsFilled, setAllIsFilled] = useState<boolean>(false)

  // Track for sign changes, if it is changed in last setup, return it to `+`
  const [isFirstLoaded, setIsFirstLoaded] = useState<boolean>(false)

  /** For matrix inputs compare with `minValue` from props, for other take argument in func. */
  const validateRange = useCallback((
    e: ChangeEvent<HTMLInputElement>,
    min: number = minValue,
    max: number = 25
  ) => {
    // console.log('in validate range, last char:', e.target.value[e.target.value.length - 1]);
    if (!Number.isInteger(parseInt(e.target.value[e.target.value.length - 1]))) {
      // console.log('wrote non int');
      e.target.value = e.target.value.slice(0, -1)
    }

    let value = Number(e.target.value); // Directly parse as number
    if (value < parseFloat(min as unknown as string)) {
      e.target.value = min as unknown as string;
    } else if (value > max) {
      e.target.value = max as unknown as string;
    }

    const aIsFilled = isSquare
      ? aRows.current!.value.length
      : aRows.current!.value.length && aCols.current!.value.length

    // console.log('only A:', isOnlyA);
    const bIsFilled = !isOnlyA && !isAS
      ? isSquare
        ? bRows.current?.value.length || 0
        : (bRows.current!.value.length || 0) && (bCols.current!.value.length || 0)
      : true

    const powerIsFilled = isPower
      ? powerRef.current!.value.length : true
    // console.log(powerIsFilled);

    /** If multiplication is passed, `A` cols must be same as `B` rows. */
    const multiplicationIsOk = isMultiplication
      ? aCols.current!.value.length && aCols.current!.value === bRows.current!.value
      : true
    const newAllIsFilled = Boolean(aIsFilled && bIsFilled && powerIsFilled && multiplicationIsOk)
/*     console.log('a is filled:', aIsFilled, 'b is filled:', bIsFilled, 'power is filled:', powerIsFilled,
      'multiplication is ok:', multiplicationIsOk
    );
    console.log(newAllIsFilled); */

    if (newAllIsFilled && powerRef.current) {
      setPower(parseInt(powerRef.current!.value))
    }

    setAllIsFilled(newAllIsFilled)

    submitRef.current!.disabled = !newAllIsFilled
  }, [minValue, isOnlyA])

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

  const handleSubmit = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      const newAValue = getNumericDimValue();

      // Only open modal if all dimensions are set
      const aIsSet = newAValue[0] !== 0 && newAValue[1] !== 0;
      setADim(newAValue);

      const powerIsSet = isPower ? powerRef.current!.value.length : true

      if (!powerIsSet) {
        return
      }

      if (!isOnlyA) {
        let bIsSet

        if (isAS) {
          bIsSet = aIsSet
          // console.log('setting bDim as:', [parseInt(aRows.current!.value), parseInt(aCols.current!.value)]);
          setBDim([parseInt(aRows.current!.value), parseInt(aCols.current!.value)])
        } else {
          const newBValue = getNumericDimValue(false);
          setBDim(newBValue);
          bIsSet = newBValue[0] !== 0 && newBValue[1] !== 0
        }

        if (aIsSet && bIsSet) {
          // console.log('opening modal, both matrices are set');
          setIsOpen(true);
        }
        // console.log('A is set:', aIsSet, 'B is set:', bIsSet);
      } else {
        // console.log('a is set:', aIsSet);
        if (aIsSet) {
          // console.log('opening modal');
          setIsOpen(true);
        }
      }
    },
    [getNumericDimValue, isOnlyA, setADim, setBDim, setIsOpen] // Dependencies
  )

  useEffect(() => {
    // console.log('new A dim in input:', aDim)
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
    // console.log('isOpen in input:', isOpen);
  }, [isOpen])

  useEffect(() => {
    if (power === -1 && powerRef.current) {
      // console.log('previous value:', powerRef.current!.value);
      // console.log('%cnew power value:', 'color:red;font-size:26px', power);
      powerRef.current.value = ''
    }
  }, [power])

  // If sign was reset after `recalculate`, reflect the change
  useEffect(() => {
    if (signRef.current && sign !== signRef.current!.value) {
      signRef.current!.selectedIndex = sign === '+' ? 0 : 1
    }
  }, [sign])

  useEffect(() => {
    setIsFirstLoaded(true)
  }, [])

  useEffect(() => {
    // console.log('%cNEW A:', 'color:red;font-size:26px', A);
    /** When sign is changed and was in `recalculate`, reset it to `+` */
    if (aIsFilled) {
      
    }
  }, [A, aIsFilled])

  return (
    <div className='row pt-7'>
      <form action=''>
        {/* Pick A */}
        <div className='row justify-start'>
          <span className='mr-2'>Matri{isAS ? 'ces' : 'x'} {!isOnlyA && !isAS ? 'A ' : ''}dimension{isAS ? 's' : ''}:</span>
          <div className='row'>
            <input
              required
              ref={aRows}
              type='text'
              inputMode='text'
              onChange={validateRange}
              className='p-1.5 pr-0 pb-1.5 pl-2.5 w-[50px] text-sm pointer outline-none rounded-lg focus:bg-primary'
            // value={2}
            />
            {(!isSquare || isAS) && (
              <>
                <span className='px-2'>X</span>
                <input
                  required
                  ref={aCols}
                  type='text'
                  inputMode='text'
                  onChange={validateRange}
                  className='p-1.5 pr-0 pb-1.5 pl-2.5 w-[50px] text-sm pointer outline-none rounded-lg focus:bg-primary'
                // value={2}
                />
              </>
            )}
            {isPower && (
              <>
                <span className='px-2'>Power:</span>
                <input
                  required
                  ref={powerRef}
                  type='text'
                  inputMode='text'
                  onChange={(e) => validateRange(e, 0, 10)}
                  className='p-1.5 pr-0 pb-1.5 pl-2.5 w-[50px] text-sm pointer outline-none rounded-lg focus:bg-primary'
                />
              </>
            )}
            {isAS && (
              <>
                <select
                  required
                  ref={signRef}
                  inputMode='text'
                  onChange={() => setSign(sign === '+' ? '-' : '+')}
                  className='ml-5 p-1.5 pr-0 pb-1.5 pl-2 w-[50px] text-sm pointer outline-none rounded-lg focus:bg-primary'
                >
                  <option>+</option>
                  <option>-</option>
                </select>
              </>
            )}
          </div>
        </div>
        {/* Pick B */}
        {!isOnlyA && !isAS && (
          <div className='row justify-start mt-5'>
            <span className='mr-2'>Matrix B dimension:</span>
            <div className='row'>
              <input
                required
                ref={bRows}
                type='text'
                inputMode='text'
                onChange={validateRange}
                className='p-1.5 pr-0 pb-1.5 pl-2.5 w-[50px] text-sm pointer outline-none rounded-lg focus:bg-primary'
              // value={2} 
              />
              <span className='px-2'>X</span>
              <input
                required
                ref={bCols}
                type='text'
                inputMode='text'
                onChange={validateRange}
                className='p-1.5 pr-0 pb-1.5 pl-2.5 w-[50px] text-sm pointer outline-none rounded-lg focus:bg-primary'
              // value={2} 
              />
            </div>
          </div>
        )}
        <button
          ref={submitRef}
/*           disabled={!allIsFilled}
 */          type='submit'
          onClick={(e) => handleSubmit(e)}
          className='row-h disabled:opacity-50 disabled:pointer-none rounded-md mt-7 mb-5 lg:mt-10 lg:mb-8 mx-auto px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 bg-sky-500 hover:bg-sky-600 text-gray-300 focus-visible:outline-sky-600'
        >
          Set {!isOnlyA ? 'matrix' : 'matrices'}
        </button>
      </form>
    </div>
  )
}

export default memo(MatrixDimensionsInput)
