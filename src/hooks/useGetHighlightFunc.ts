import { UseUpdateTableOnDefaultValuesProps } from "../interfaces/Hooks"
import { Step } from "../interfaces/Matrix"
import { HighlightCells } from "../interfaces/MatrixTableProps"

/** Highlight `MatrixTable` cells based on row and col values of corresponding solution step. */
const useGetHighlightFunc = ({
  steps,
  aDim
}: UseUpdateTableOnDefaultValuesProps) => {
  const getHighlightFunc = (index: number): HighlightCells | undefined => {
    const { explanation } = steps[index]

    const isAugmented = !Array.isArray(explanation) && explanation.includes('Write the augmented')
    const isInversionStep = Array.isArray(explanation) && explanation.some(x => x.includes('matrix is inversed'))

    if (isAugmented || isInversionStep) {
      return (_, col) => col >= aDim[1]
    }

    const isPivot = !Array.isArray(explanation) && explanation.includes('Make the pivot in the')

    if (isPivot) {
      const [i, j] = explanation.split(/\D/).filter(Boolean).slice(0, 2).map(x => parseInt(x) - 1)

      return (row, col) => row === i && col === j
    }

    const areRows = Array.isArray(explanation) && explanation.length && explanation[0].includes(' = ') && explanation[0][0] === 'R'

    if (areRows) {
      // Don't highlight only the pivoted row
      let pivotedRow =
        (explanation[0] as string).match(/>(\d+)</g)!.map(x => x.replace(/[><]/g, '')).slice(-1)[0] as unknown as number - 1

      return (row, _) => row !== pivotedRow
    }

    const columnIsAlreadyOne = !Array.isArray(explanation) && explanation.includes('is already 1, so no need to eliminate this column')

    if (columnIsAlreadyOne) {
      const index = explanation.split('is already 1, so no need to eliminate this column')[0]

      // Text explanation uses 1-based indexing
      const [i, j] = index.split(/\D/).filter(Boolean).map(x => parseInt(x) - 1)

      return (row, col) => row === i && col === j
    }

    const columnIsAlreadyZero = Array.isArray(explanation) && explanation[0].includes('column 1 is already 0, so this step is skipped')

    if (columnIsAlreadyZero) {
      const index = (explanation as string[])[0].split('is already 1, so no need to eliminate this column')[0]

      // Text explanation uses 1-based indexing
      const [i, j] = index.split(/\D/).filter(Boolean).map(x => parseInt(x) - 1)

      return (row, col) => row === i && col === j
    }
  }

  return { getHighlightFunc }
}

export default useGetHighlightFunc
