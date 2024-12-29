import { Dispatch, SetStateAction } from "react";
import Matrix from "./Matrix";

export default interface MatrixModalProps {
  isOpen?: boolean;
  setMatrixA: Dispatch<SetStateAction<Matrix>>;
  setMatrixB?: Dispatch<SetStateAction<Matrix>>;
}
