import { Sign } from './Determinant'
import Matrix, { TwoNumbers } from './Matrix'

export interface NavbarPortalStore {
  isNavbarPortalOpen: boolean
  setIsNavbarPortalOpen: (value: boolean) => void
  activeIndex: number
  setActiveIndex: (value: number) => void
}

export interface ModalStore {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
}

export interface MatrixStore {
  // Whether only `A` matrix is active or both `A` and `B`
  isOnlyA: boolean
  setIsOnlyA: (value: boolean) => void
  calculate: any
  setCalculate: (value: any) => any
  aDim: TwoNumbers
  setADim: (value: TwoNumbers) => void
  A: Matrix
  setA: (value: Matrix) => void
  aIsFilled: boolean
  setAIsFilled: (value: boolean) => void
  bDim: TwoNumbers
  setBDim: (value: TwoNumbers) => void
  B: Matrix
  setB: (value: Matrix) => void
  bIsFilled: boolean
  setBIsFilled: (value: boolean) => void
  power: number
  setPower: (value: number) => void
  isMultiplication: boolean
  setIsMultiplication: (value: boolean) => void
  sign: Sign
  setSign: (value: Sign) => void
}

export interface LinearEquationStore {
  equationCoefs: (string|number)[]
  setEquationCoefs: (equationCoefs: (string|number)[]) => void
}
