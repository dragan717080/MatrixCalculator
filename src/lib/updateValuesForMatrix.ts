// @ts-nocheck
import { useMatrixStore } from "../store/zustandStore";

const useUpdateValuesForMatrix = () => {
  const { aDim, A, setA, bDim, B, setB } = useMatrixStore();

  const updateValuesForMatrix = (isA = true): Matrix => {
    const inputCellsA = Array.from(document.getElementsByClassName('cell-a') as HTMLCollectionOf<HTMLInputElement>);
    const inputCellsB = Array.from(document.getElementsByClassName('cell-b') as HTMLCollectionOf<HTMLInputElement>);

    const inputCells = isA ? inputCellsA : inputCellsB;
    const matrix = isA ? A : B!;

    // Make a shallow copy of the previous matrix
    const newMatrix = [...matrix];

    const [aRows, aCols] = aDim;
    const [bRows, bCols] = bDim;

    for (const row in newMatrix) {
      for (const col in newMatrix[0]) {
        if (typeof matrix[row][col] === 'undefined') {
          continue;
        }

        if (matrix[row][col][matrix[row][col].length - 1] === '.') {
          matrix[row][col] = matrix[row][col] + '0';
        }

        if (matrix[row][col][matrix[row][col].length - 1] === '-') {
          matrix[row][col] = '0';
        }

        matrix[row][col] = parseFloat(matrix[row][col] as unknown as string);
      }
    }

    return newMatrix;
  };

  return { updateValuesForMatrix };
};

export default useUpdateValuesForMatrix;
