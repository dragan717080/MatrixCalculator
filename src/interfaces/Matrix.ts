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
 */
export interface Step {
  A: Matrix,
  swapRow?: TwoNumbers
  explanation: string|string[]|(string|string[])[]
  indices?: TwoNumbers[]
}

/**
 * Represents solution in operations with numeric result (e.g. `Rank`).
 * 
 * @type {SolutionWithNumericResult}
 * 
 * @property {number|undefined} result
 * @property {Step[]}
 */
export interface SolutionWithNumericResult {
  result: number|undefined,
  steps: Step[]
}

/**
 * Solution of inverse matrix.
 *
 * @type {InverseSolution}
 * 
 * @property {Matrix|null} A - Result matrix. Can also be null.
 * @property {Step[]} steps - Steps for the solution.
 * @property {number} determinant - If it is 0, inverse matrix will be null.
 */
export interface InverseSolution {
  A: Matrix|null
  steps: Step[]
  determinant: number
}

/**
 * Represents the solution of simultaneous linear equations using Inverse Matrix Method.
 *
 * @type {InverseMethodSolution}
 *
 * @property {Step[]} steps - Solution steps.
 * @property {number} determinant - If it is 0, inverse matrix will be null.
 * It means that the system of linear equations
 * is either inconsistent or has infinitely many solutions.
 * @property {number[]|null} solution - Vector of solution e.g. `X1, X2, X3`.
 * It will be null if determinant is null. Will be converted to `Matrix` type
 * with only 1 row to display in `MatrixTable` component.
 */
export interface InverseMethodSolution {
  steps: Step[]
  determinant: number
  solution: Matrix|null
}

/**
 * Represents the solution of simultaneous linear equations using Gauss-Jordan elimination.
 * 
 * @type {GaussJordanEliminationSolution}
 * 
 * @property {Step[]} steps - Solution steps.
 * @property {string[]|null} solution - If system is consistent, each entry will represent variable 
 * relation with other variables e.g. `X2 = 2.833 - 0.528 * X3`
 */
export interface GaussJordanEliminationSolution {
  steps: Step[]
  determinant: number
  solution: string[]|null
}
