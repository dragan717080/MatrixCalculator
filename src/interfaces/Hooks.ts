import { Dispatch, RefObject, SetStateAction } from "react";
import Matrix from './Matrix';

/**
 * @type {UseRecalculateProps}
 *
 * @property {Dispatch<SetStateAction<number>>} setTime - Function to set time, typically used to reset time to `-1`.
 * @property {Dispatch<SetStateAction<Matrix>>} [setC] - Optional function to clear the result matrix by setting it to an empty array.
 * @property {Dispatch<SetStateAction<boolean>>} [setShow] - Optional function to hide/show an element by setting it to `false`.
 * @property {RefObject<HTMLElement>} [stepsRef] - Optional reference to the DOM element representing previous steps, to hide when recalculated.
 */
export interface UseRecalculateProps {
  setTime: Dispatch<SetStateAction<number>>
  setC?: Dispatch<SetStateAction<Matrix>>
  setShow?: Dispatch<SetStateAction<boolean>>
  stepsRef?: RefObject<HTMLElement>
}
