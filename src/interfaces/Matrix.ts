export type TwoNumbers = [number, number];

export type MatrixElement = number|undefined

type Matrix = Array<MatrixElement[]>

export default Matrix

export interface Step {
  A: Matrix,
  explanation: string|string[]|(string|string[])[]
}
