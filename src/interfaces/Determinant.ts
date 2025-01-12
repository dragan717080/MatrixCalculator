import Matrix from './Matrix'

export interface Step {
  A: Matrix
  swapRow: number[] | undefined
  sign: Sign
  explanations: string[]
}

export interface DeterminantSolution {
  steps: Step[]
  result: number
}

export type Sign = '+' | '-'
