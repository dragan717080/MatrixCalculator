import { Dispatch, SetStateAction } from "react";

export type TwoNumbers = [number, number];

export default interface MatrixModalProps {
  isOpen?: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}
