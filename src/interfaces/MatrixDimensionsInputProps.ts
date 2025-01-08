type MinValue = 1 | 2

/**
 * @property {number} minValue - 1 or 2.
 * @property {boolean} isSquare - Default to true.
 */
export default interface MatrixDimensionsInputProps {
  minValue: MinValue
  isSquare?: boolean
  isPower?: boolean
  isMultiplication?: boolean
}
