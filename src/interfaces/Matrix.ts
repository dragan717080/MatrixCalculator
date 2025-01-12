import { HighlightCells } from './MatrixTableProps';

export type TwoNumbers = [number, number];

/** Also allows strings, for input values. */
export type MatrixElement = string|number|undefined

type Matrix = Array<MatrixElement[]>

export default Matrix

/**
 * Represents a step in a matrix calculation process.
 * 
 * @type {Step}
 * 
 * @property {Matrix} A
 * @property {string[]} explanations - In cases where there is elimination,
 * each intermediate solution will have an explanation e.g.
 * 
 * `R2 = 3R1`
 * 
 * `R3 = 2R1`
 * 
 * @property {TwoNumbers} [swapRow] - (Optional) - In case rows were swapped
 * during pivot calculations, returns which rows were swapped.
 * 
 * @property {TwoNumbers[]} [indices] - (Optional) - In case current
 * element is processed and need its indices in explanation. It is only for
 * visual effect to render in component with `subindex` class.
 * 
 * @property {HighlightCells} [highlightFunc] - (Optional) - Control how to highlight tables
 * based on whether condition in function is met.
 */
export interface Step {
  A: Matrix,
  swapRow?: TwoNumbers
  explanation: string|string[]|(string|string[])[]
  indices?: TwoNumbers[]
  highlightFunc?: HighlightCells
}

/**
 * Represents solution in operations with numeric result (e.g. `Rank`).
 * 
 * @type {SolutionWithNumericResult}
 * 
 * @property {number|undefined} result
 * @property {Step[]} step
 */
export interface SolutionWithNumericResult {
  result: number|undefined,
  steps: Step[]
}

/**
 * @type {InverseSolution}
 * 
 * @property {Matrix|null} result - Can also be null.
 * @property {Step[]} steps - Each step also has 
 * @property {number} determinant - If it is 0, inverse will be null.
 */
export interface InverseSolution {
  A: Matrix|null
  steps: Step[]
  determinant: number
}
