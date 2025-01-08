import { FC, ChangeEvent, MouseEvent, memo, useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { addError, clearErrors, errorsReducer, removeError } from '../lib/MatrixTextInsertReducer';
import useUpdateValuesForMatrix from '../lib/updateValuesForMatrix';
import { isInputNumeric } from '../lib/utils';
import { useMatrixStore, useModalStore } from '../store/zustandStore';
import MatrixTextInsertProps, { ErrorsAction, ErrorsState } from '../interfaces/MatrixTextInsertProps';

const MatrixTextInsert: FC<MatrixTextInsertProps> = ({
  setIsInserting,
  isA = true
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const { aDim, A, setA, bDim, B, setB } = useMatrixStore()

  const [errors, dispatch] = useReducer(errorsReducer, {});

  const [wrongRowsCountError, setWrongRowsCountError] = useState<string>('')
  const [wrongColsCountError, setWrongColsCountError] = useState<string>('')
  console.log('%cIN INSERT', 'font-size:40px');

  const nRows = isA ? aDim[0] : bDim[0]
  const nCols = isA ? aDim[1] : bDim[1]

  const handleContinue = useCallback(
    async (e: MouseEvent<HTMLButtonElement>, isA = true) => {
      e.preventDefault()
      console.log('expected rows:', nRows, 'expected cols:', nCols);
      clearErrors(dispatch)

      // Trim each row
      const rows = textareaRef.current!.value.split('\n').map(row => row.trim())
      console.log('rows:', rows);

      // Will be changed later if errors
      setWrongColsCountError('')

      if (rows.length !== nRows) {
        console.log(`Matrix ${isA ? 'A' : 'B'} has ${nRows} rows but your input has ${rows.length}`);
        setWrongRowsCountError(`Matrix ${isA ? 'A' : 'B'} has ${nRows} rows but your input has ${rows.length}`)
        return
      } else {
        setWrongRowsCountError('')
      }

      for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        const row = rows[rowIndex];
        console.log('Text row:', row, 'index:', rowIndex);
        const wordsInRow = row.split(/\s+/)

        if (wordsInRow.length !== nCols) {
          console.log(`Matrix ${isA ? 'A' : 'B'} has ${nCols} columns but your input has ${wordsInRow.length}`)
          setWrongColsCountError(`Matrix ${isA ? 'A' : 'B'} has ${nCols} columns but your row ${rowIndex + 1} has ${wordsInRow.length}`)
          return
        }
        console.log('Words in row:', wordsInRow);
        for (const word of wordsInRow) {
          console.log('Row:', rowIndex, 'word:', word);

          if (!isInputNumeric(word)) {
            console.log('word is not numeric');
            console.log(rowIndex in errors);
            console.log(errors);
            addError(dispatch, rowIndex, word)
            console.log('new errors:', errors);
          }
        }
      }
      console.log('still');
      setWrongColsCountError('')
      console.log('NEW ERRORS:', errors);
      if (!wrongRowsCountError && !wrongColsCountError && !Object.keys(errors).length) {
        console.log('ALL IS OK!');
        //setIsInsertingA(false)
      }
    }, [aDim, bDim, errors])

  useEffect(() => {
    console.log('new errors:', errors);
  }, [Object.keys(errors).length])

  return (
    <div className='px-3'>
      <div className='pt-5 pb-3 space-x-3 text-sm md:text-md bold rounded-xl'>
        <button onClick={() => setIsInserting(false)} className='btn'>Cancel</button>
      </div>
      <p className='max-w-64 ml-1 mb-3'>
        You can copy and paste the entire matrix right here. Elements must be separated by a space. Each row must begin with a new line.
      </p>
      <form action=''>
        <div className='col-h space-y-3 ml-1 mb-4'>
          <textarea
            ref={textareaRef}
            className='w-full min-h-24 !outline-none focus:!outline-none border-none focus:ring-0 focus:bg-primary text-gray-800'
          >
          </textarea>
          <div className="py-3 text-red-500">
            <span>{wrongRowsCountError}</span>
            <span>{wrongColsCountError}</span>
            {!wrongRowsCountError && !wrongColsCountError && Object.entries(errors).map(([rowIndex, errorArray]) => (
              <div className="py-3 text-red-500" key={rowIndex}>
                Row {parseInt(rowIndex) + 1}: {errorArray.length} error{errorArray.length !== 1 ? 's' : ''}
                <ul>
                  {errorArray.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <button
            type='submit'
            onClick={(e) => handleContinue(e)}
            className='btn'
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  )
}

export default memo(MatrixTextInsert)
