export type TwoNumbers = [number, number];

/** Also allows strings, for input values. */
export type MatrixElement = string|number|undefined

type Matrix = Array<MatrixElement[]>

export default Matrix

export interface Step {
  A: Matrix,
  swapRow?: TwoNumbers
  explanation: string|string[]|(string|string[])[]
}

export interface SolutionWithNumericResult {
  result: number|undefined,
  steps: Step[]
}
