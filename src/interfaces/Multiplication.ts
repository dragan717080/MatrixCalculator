import { TwoNumbers } from './Matrix'

/**
 * @type {DotProduct}
 *
 * @property {number} value
 * @property {string} explanation - Explanation of how each element's
 * value was conceived by explaining each row/col multiplication.
 * @property {TwoNumbers} indices - Only for visual effect,
 * to give it `subindex` class in component.
 */
export default interface DotProduct {
  value: number,
  explanation: string
  indices: TwoNumbers
}
