import { Dispatch, RefObject, SetStateAction } from 'react';
import Matrix, { Step } from './Matrix';
import { Step as DeterminantStep } from './Determinant';

/**
 * @type {UseRecalculateProps}
 *
 * @property {Dispatch<SetStateAction<number>>} setTime - Function to set time, typically used to reset time to `-1`.
 * @property {Dispatch<SetStateAction<Matrix>>} [setC] - Optional function to clear the result matrix by setting it to an empty array.
 * @property {Dispatch<SetStateAction<boolean>>} [setShow] - Optional function to hide/show an element by setting it to `false`.
 * @property {Dispatch<SetStateAction<Step[]>> | Dispatch<SetStateAction<DeterminantStep[]|>>} [setSteps] - Optional parameter, defaults to false.
 * @property {RefObject<HTMLElement>} [stepsRef] - Optional reference to the DOM element representing previous steps, to hide when recalculated.
 * @property {boolean} [isPower] - Defaults to false.
 */
export interface UseRecalculateProps {
  setTime: Dispatch<SetStateAction<number>>
  setC?: Dispatch<SetStateAction<Matrix>>
  setShow?: Dispatch<SetStateAction<boolean>>
  setSteps?: Dispatch<SetStateAction<Step[]>> | Dispatch<SetStateAction<DeterminantStep[]>>
  stepsRef?: RefObject<HTMLElement>
  isPower?: boolean
}

/**
 * @type {UseResetParamsProps}
 *
 * @property {boolean} [onlyHasA] - Defaults to true.
 */
export interface UseResetParamsProps {
  onlyHasA?: boolean
  isPower?: boolean
}
