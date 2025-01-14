import { FC, ChangeEvent, MouseEvent, memo, useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { addError, clearErrors, errorsReducer, removeError } from '../lib/matrixTextInsertReducer'
import useUpdateValuesForMatrix from '../hooks/useUpdateValuesForMatrix'
import { isStringNumeric } from '../lib/utils'
import { useLinearEquationsStore, useMatrixStore, useModalStore } from '../store/zustandStore'
import MatrixTextInsertProps from '../interfaces/MatrixTextInsertProps'
import Matrix from '../interfaces/Matrix'

const MatrixTextInsert: FC<MatrixTextInsertProps> = ({
  setIsInserting,
  isA = true,
  isEquation,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const { aDim, A, setA, setAIsFilled, bDim, B, setB, setBIsFilled } = useMatrixStore()
  const { equationCoefs, setEquationCoefs } = useLinearEquationsStore()

  const { updateValuesForArr, updateValuesForMatrix } = useUpdateValuesForMatrix()

  const [errors, dispatch] = useReducer(errorsReducer, {})

  const [wrongRowsCountError, setWrongRowsCountError] = useState<string>('')
  const [wrongColsCountError, setWrongColsCountError] = useState<string>('')

  const handleContinue = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      let nRows = isA ? aDim[0] : bDim[0]
      let nCols = isA ? aDim[1] : bDim[1]

      if (isEquation) {
        nCols += 1
      }

      e.preventDefault()
      clearErrors(dispatch)

      // Trim each row
      const rows = textareaRef.current!.value.split('\n').map(row => row.trim())
      let hasWrongNumbers = false

      // If the last row is empty, delete it
      if (rows[rows.length - 1] === '') {
        rows.pop()
      }

      /** These variables are needed, if it had error previously, to not hang if the new input is ok. */
      let newWrongColsCountError = ''
      let newWrongRowsCountError = ''

      // Will be changed later if errors
      setWrongColsCountError('')

      if (rows.length !== nRows) {
        newWrongRowsCountError = `Matrix ${isA ? 'A' : 'B'} has ${nRows} rows but your input has ${rows.length}`
        setWrongRowsCountError(`Matrix ${isA ? 'A' : 'B'} has ${nRows} rows but your input has ${rows.length}`)

        return
      } else {
        setWrongRowsCountError('')
      }

      let newMatrix: Matrix = []
      let newEquationCoefs = []

      for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        const row = rows[rowIndex]
        const wordsInRow = row.split(/\s+/)

        if (wordsInRow.length !== nCols) {
          setWrongColsCountError(`Matrix ${isA ? 'A' : 'B'} has ${nCols} columns but your row ${rowIndex + 1} has ${wordsInRow.length}`)
          return
        }

        newMatrix.push([])

        for (const [index, word] of Object.entries(wordsInRow)) {
          if (!isStringNumeric(word)) {
            addError(dispatch, rowIndex, word)
            hasWrongNumbers = true
          } else {
            if (!isEquation) {
              newMatrix[rowIndex].push(word)
              continue
            }

            const isLastWord = Number(index) + 1 === wordsInRow.length

            !isLastWord
              ? newMatrix[rowIndex].push(word)
              : newEquationCoefs.push(word)
          }
        }
      }

      newWrongColsCountError = ''
      setWrongColsCountError('')
      if (!newWrongRowsCountError && !newWrongColsCountError && !hasWrongNumbers) {
        newMatrix = updateValuesForMatrix(isA, newMatrix)
        newEquationCoefs = updateValuesForArr(newEquationCoefs)
        const fillFunc = isA ? setAIsFilled : setBIsFilled

        const setMatrixFunc = isA ? setA : setB
        setMatrixFunc(newMatrix)
        setEquationCoefs(newEquationCoefs)
        fillFunc(true)
        setIsInserting(false)
      }
    }, [aDim, bDim, errors])

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
