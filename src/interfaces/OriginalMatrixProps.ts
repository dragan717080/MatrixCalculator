import { Step as DeterminantStep } from './Determinant'
import Matrix, { Step } from './Matrix'

/**
 * @type {OriginalMatrixProps}
 * 
 * @property {Matrix} A
 * @property {Step[]|DeterminantStep[]} steps
 * @property {Matrix} [B]
 * @property {boolean} [needsDeterminant] - (Optional) - Whether the component
 * needs determinant (e.g. linear equations systems). Defaults to true.
 * @property {boolean} [isEquation] - (Optional) - Defaults to false.
 * @property {boolean} [isRank] - (Optional) - Defaults to false.
 */
export default interface OriginalMatrixProps {
  A: Matrix
  steps: Step[]|DeterminantStep[]
  B?: Matrix
  needsDeterminant?: boolean
  isEquation?: boolean
  isRank?: boolean
}
