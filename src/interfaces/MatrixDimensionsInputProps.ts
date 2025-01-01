import { Dispatch, SetStateAction } from 'react';
import Matrix from './Matrix';
import { TwoNumbers } from './MatrixModalProps';
// TO DO: REMOVE
/**
 * @property {boolean} isSingle - Default to true.
 * @property {(value: number|Array<number>) => void} setDimensions
 */
export default interface MatrixDimensionsInputProps {
  setADim: Dispatch<SetStateAction<TwoNumbers>>;
  setA: Dispatch<SetStateAction<Matrix>>;
  setBDim?: Dispatch<SetStateAction<TwoNumbers>>;
  setB?: Dispatch<SetStateAction<Matrix>>;
}
