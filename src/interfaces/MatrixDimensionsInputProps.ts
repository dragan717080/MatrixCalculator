import { Dispatch, SetStateAction } from 'react';
import Matrix from './Matrix';

/**
 * @property {boolean} isSingle - Default to true.
 * @property {(value: number|Array<number>) => void} setDimensions
 */
export default interface MatrixDimensionsInputProps {
  setADim: Dispatch<SetStateAction<number>>;
  setA: Dispatch<SetStateAction<Matrix>>;
  setBDim?: Dispatch<SetStateAction<number>>;
  setB?: Dispatch<SetStateAction<Matrix>>;
}
