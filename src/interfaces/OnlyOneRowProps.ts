import Matrix from "./Matrix"

/**
 * @type {OnlyOneRowProps}
 * 
 * @property {Matrix} A
 * @property {boolean} [isRank] - (Optional) - Whether it is `Rank` component. Defaults to false.
 */
export default interface OnlyOneRowProps {
  A: Matrix
  isRank?: boolean
}
