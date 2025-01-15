import { ReactNode } from 'react'

/**
 * Represents props for the higher order component `SolutionRows`.
 * 
 * @type {SolutionRowsProps}
 * 
 * @property {ReactNode} children - What will be rendered under result
 * (e.g. value for `Determinant` or matrix for `Multiplication`).
 * @property {boolean} toShowSolution - Whether the text should be of button
 * should be `Show` or `Hide`.
 * @property {number} time - Time that it took to execute matrix operation,
 * will be displayed.
 * @property {() => Promise<void>} toggleShowSolution - When the button `Show/Hide solution`
 * is clicked, it will trigger the animation, this `Promise<void>`.
 * @property {() => void} recalculate - On recalculate, reset state e.g. `time`,
 * `aDim`, `A`, `isOpen` and other params are all reset.
 * @property {boolean} withMatrixText - What text to display in `Hide/Show` button.
 * If omitted, will be `solution`, otherwise `matrix`.
 * 
 * Defaults to false.
 */
export default interface SolutionRowsProps {
  children: ReactNode,
  toShowSolution: boolean
  time: number
  toggleShowSolution: () => Promise<void>
  recalculate: () => void
  withMatrixText?: boolean
}
