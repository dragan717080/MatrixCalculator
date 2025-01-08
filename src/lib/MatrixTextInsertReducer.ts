import { Dispatch } from 'react'
import { ErrorsAction, ErrorsState } from '../interfaces/MatrixTextInsertProps'

export const errorsReducer = (state: ErrorsState, action: ErrorsAction): ErrorsState => {
  switch (action.type) {
    case 'addError': {
      const { rowIndex, word } = action
      return {
        ...state,
        [rowIndex]: rowIndex in state ? [...state[rowIndex], word] : [word],
      }
    }
    case 'removeError': {
      const { rowIndex } = action
      const { [rowIndex]: _, ...rest } = state // Remove the specific rowIndex
      return rest
    }
    case 'clearErrors':
      return {}
    default:
      return state
  }
}

export const addError = (dispatch: Dispatch<ErrorsAction>, rowIndex: number, word: string) => {
  dispatch({
    type: 'addError',
    rowIndex,
    word,
  })
}

export const removeError = (dispatch: Dispatch<ErrorsAction>, rowIndex: number) => {
  dispatch({
    type: 'removeError',
    rowIndex,
  })
}

export const clearErrors = (dispatch: Dispatch<ErrorsAction>) => {
  dispatch({ type: 'clearErrors' })
}
