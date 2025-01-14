import { Dispatch, RefObject, SetStateAction } from 'react'
import Matrix, { Step, TwoNumbers } from './Matrix'
import { Step as DeterminantStep } from './Determinant'

/**
 * @type {UseRecalculateProps}
 *
 * @property {Dispatch<SetStateAction<number>>} setTime - Function to set time, typically used to reset time to `-1`.
 * @property {Dispatch<SetStateAction<Matrix>>} [setC] - (Optional) - To clear the result matrix by setting it to an empty array.
 * @property {Dispatch<SetStateAction<boolean>>} [setShow] - (Optional) - To hide/show an element by setting it to `false`.
 * @property {Dispatch<SetStateAction<Step[]>> | Dispatch<SetStateAction<DeterminantStep[]|>>} [setSteps] - (Optional) - To set updated steps.
 * @property {RefObject<HTMLElement>} [stepsRef] - (Optional) - Reference to the DOM element representing previous steps, to hide when recalculated.
 * @property {boolean} [isPower] (Optional) - Defaults to false.
 * @property {boolean} [isSign] (Optional) - Defaults to false.
 */
export interface UseRecalculateProps {
  setTime: Dispatch<SetStateAction<number>>
  setC?: Dispatch<SetStateAction<Matrix>>
  setShow?: Dispatch<SetStateAction<boolean>>
  setSteps?: Dispatch<SetStateAction<Step[]>> | Dispatch<SetStateAction<DeterminantStep[]>>
  stepsRef?: RefObject<HTMLElement>
  isPower?: boolean
  isSign?: boolean
}

/**
 * @type {UseResetParamsProps}
 *
 * @property {boolean} [onlyHasA] - Defaults to true.
 * @property {boolean} [isPower] - Defaults to false.
 * @property {boolean} [isSign] - Defaults to false.
 * @property {RefObject<HTMLElement>} [descriptionAndInputRef] - (Optional),
 * ref holding description and input, unhide it once loaded.
 */
export interface UseResetParamsProps {
  onlyHasA?: boolean
  isPower?: boolean
  isSign?: boolean
  descriptionAndInputRef?: RefObject<HTMLElement>
}

/**
 * @type {useToggleShowSolutionProps}
 *
 * @property {RefObject<HTMLElement>} solutionStepsRef - Reference to the solution element.
 * @property {boolean} toShowSolution - Current state of the visibility.
 * @property {Dispatch<SetStateAction<boolean>>} setToShowSolution - Function to update visibility state.
 */
export interface useToggleShowSolutionProps {
  solutionStepsRef: RefObject<HTMLElement>
  toShowSolution: boolean
  setToShowSolution: Dispatch<SetStateAction<boolean>>
}

/**
 * @type {useUpdateExplanationsProps}
 * 
 * @property {Step[]} steps - Solution steps.
 * @property {boolean} [isEquation] - (Optional) - Whether it is related to the linear equations system.
 * If it is, it will have one additional step which will provide info on whether
 * the system is consistent based on the value of the determinant.
 * 
 * Defaults to false.
 * 
 * @property {boolean} [needsDeterminant] - (Optional) - Whether the component
 * has one additional step to describe whether it needs determinant.
 * 
 * Defaults to true.
 */
export interface UseUpdateExplanationsProps {
  steps: Step[]|DeterminantStep[],
  isEquation?: boolean
  needsDeterminant?: boolean
}

/**
 * @type {UseUpdateTableOnDefaultValuesProps}
 * 
 * @property {Step[]} steps - Solution steps.
 * @property {TwoNumbers} aDim - Dimensions of `A`.
 */
export interface UseUpdateTableOnDefaultValuesProps {
  steps: Step[]
  aDim: TwoNumbers
}
