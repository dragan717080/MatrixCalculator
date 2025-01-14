type MinValue = 1 | 2

/**
 * @type {MatrixDimensionsInputProps}
 *
 * @property {number} minValue - 1 or 2.
 * @property {boolean} [isSquare] - (Optional) - Defaults to false.
 * @property {boolean} [iSPower] - (Optional) - Defaults to false.
 * @property {boolean} [isMultiplication] - (Optional) - Defaults to false.
 * @property {boolean} [isAs] - (Optional) - Whether it is `Addition/Substraction`. Defaults to false.
 * @property {boolean} [isGaussJordan] - (Optional) - Defaults to false.
 */
export default interface MatrixDimensionsInputProps {
  minValue: MinValue
  isSquare?: boolean
  isPower?: boolean
  isMultiplication?: boolean
  isAS?: boolean
  isGaussJordan?: boolean
}
