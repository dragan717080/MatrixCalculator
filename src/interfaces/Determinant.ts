import Matrix from "./Matrix"

export interface Step {
  A: Matrix
  swapRow: number[] | undefined
  sign: Sign
  stepsExplanations: string[]
}

export interface DeterminantSolution {
  steps: Step[]
  result: number
}

export interface EliminationStep {
  A: Matrix
  /**  If all columns at some row in and below pivot position have zeros, determinant is 0. */
  toReturnEarly: boolean
  sign?: Sign
  swapRow?: number[],
}

export type Sign = '+' | '-'
