import React, { FC, ChangeEvent, MouseEvent, useRef } from 'react'
import MatrixDimensionsInputProps from '../../interfaces/MatrixDimensionsInputProps'

const MatrixDimensionsInput: FC<MatrixDimensionsInputProps> =
  ({ setADim, setA, setBDim, setB }) => {
    const aDim = useRef<HTMLInputElement | null>(null)
    const bDim = useRef<HTMLInputElement | null>(null)
    const v1 = parseInt(aDim.current?.value || '0')
    const v2 = parseInt(bDim.current?.value || '0')

    const validateRange = (e: ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value as unknown as number
      if (value < 1) {
        e.target.value = '1'
      } else if (value > 25) {
        e.target.value = '25'
      }
    }

    const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      setADim(v1)
      if (setBDim) {
        setBDim(v2)
      }
    }

    return (
      <div className='row'>
        <form action=''>
          <div className="row">
            <span className='mr-2'>Matrix dimension:</span>
            <input
              required
              ref={aDim}
              type='number'
              inputMode='numeric'
              onChange={validateRange}
              min='1'
              max='25'
              className='p-1.5 pr-0 pb-1.5 pl-2.5 w-[50px] text-sm pointer outline-none rounded-lg focus:bg-primary'
            />
            {setBDim && (
              <>
                <span className="px-2">X</span>
                <input
                  required
                  ref={bDim}
                  type='number'
                  inputMode='numeric'
                  onChange={validateRange}
                  min='1'
                  max='25'
                  className='p-1.5 pr-0 pb-1.5 pl-2.5 w-[50px] text-sm pointer outline-none rounded-lg focus:bg-primary'
                />
              </>
            )}
          </div>
          <button
            type='submit'
            onClick={(e) => handleSubmit(e)}
            className='row-h rounded-md my-4 mx-auto px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 bg-sky-500 hover:bg-sky-600 text-gray-300 focus-visible:outline-sky-600'
          >
            Set {setBDim ? 'matrix' : 'matrices'}
          </button>
        </form>
      </div>
    )
  }

export default MatrixDimensionsInput
