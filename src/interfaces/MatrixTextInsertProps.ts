export type ErrorsState = { [rowIndex: number]: string[] }

export type ErrorsAction =
| { type: 'addError'
 rowIndex: number; word: string }
| { type: 'removeError'; rowIndex: number }
| { type: 'clearErrors' }

interface MatrixTextInsertProps {
  setIsInserting: (value: boolean) => void
  isA?: boolean
  isEquation?: boolean
}

export default MatrixTextInsertProps
