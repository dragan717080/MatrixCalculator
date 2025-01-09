export type TwoNumbers = [number, number];

/** Also allows strings, for input values. */
export type MatrixElement = string|number|undefined

type Matrix = Array<MatrixElement[]>

export default Matrix

export interface Step {
  A: Matrix,
  explanation: string|string[]|(string|string[])[]
}
