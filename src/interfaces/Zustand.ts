import { TwoNumbers } from "./MatrixModalProps";
import Matrix from "./Matrix";

export interface NavbarPortalStore {
  isNavbarPortalOpen: boolean;
  setIsNavbarPortalOpen: (value: boolean) => void;
  activeIndex: number;
  setActiveIndex: (value: number) => void;
}

export interface MatrixStore {
  // Whether only `A` matrix is active or both `A` and `B`
  isOnlyA: boolean;
  setIsOnlyA: (value: boolean) => void;
  aDim: TwoNumbers;
  setADim: (value: TwoNumbers) => void;
  A: Matrix;
  setA: (value: Matrix) => void;
  aIsFilled: boolean;
  setAIsFilled: (value: boolean) => void;
  bDim: TwoNumbers;
  setBDim: (value: TwoNumbers) => void;
  B: Matrix;
  setB: (value: Matrix) => void;
  bIsFilled: boolean;
  setBIsFilled: (value: boolean) => void;
  calculate: any;
  setCalculate: (value: any) => any;
}
