import Matrix from "./Matrix"

type HighlightCells = {
  (row: number, col: number, index?: number): boolean
};

export default interface MatrixTableProps {
  nRows: number
  nCols: number
  A: Matrix,
  toHighlight? : HighlightCells
  className?: string
  index?: number
  letter?: string
}
