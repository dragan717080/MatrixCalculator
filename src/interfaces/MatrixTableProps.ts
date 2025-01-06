import Matrix from "./Matrix"

type HighlightCells = {
  (row: number, col: number): boolean
};

export default interface MatrixTableProps {
  nRows: number
  nCols: number
  A: Matrix,
  toHighlight? : HighlightCells
  className?: string
}
