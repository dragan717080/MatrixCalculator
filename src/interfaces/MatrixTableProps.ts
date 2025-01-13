import Matrix from './Matrix'

export type HighlightCells = {
  (row: number, col: number, index?: number, A?: Matrix, additionalParam1?: number, additionalParam2?: number): boolean
};

export default interface MatrixTableProps {
  nRows: number
  nCols: number
  A: Matrix,
  highlightFunc? : HighlightCells
  className?: string
  index?: number
  letter?: string
  isWithCoefs?: boolean
}
