import { create } from 'zustand';
import {
  LinearEquationStore,
  MatrixStore,
  ModalStore,
  NavbarPortalStore
}
  from '../interfaces/Zustand'

export const useNavbarPortalStore = create<NavbarPortalStore>((set) => ({
  isNavbarPortalOpen: false,
  setIsNavbarPortalOpen: (value) => set((state) => ({ isNavbarPortalOpen: value })),
  activeIndex: 0,
  setActiveIndex: (value) => set((state) => ({ activeIndex: value })),
}))

export const useModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  setIsOpen: (value) => set((state) => ({ isOpen: value })),
}))

export const useMatrixStore = create<MatrixStore>((set) => ({
  isOnlyA: true,
  setIsOnlyA: (value) => set((state) => ({ isOnlyA: value })),
  aDim: [0, 0],
  setADim: (value) => set((state) => ({ aDim: value })),
  A: [],
  setA: (value) => set((state) => ({ A: value })),
  aIsFilled: true,
  setAIsFilled: (value) => set((state) => ({ aIsFilled: value })),
  bDim: [0, 0],
  setBDim: (value) => set((state) => ({ bDim: value })),
  B: [],
  setB: (value) => set((state) => ({ B: value })),
  bIsFilled: true,
  setBIsFilled: (value) => set((state) => ({ bIsFilled: value })),
  calculate: () => {},
  setCalculate: (value) => set((state) => ({ calculate: value })),
  power: 0,
  setPower: (value) => set((state) => ({ power: value })),
  isMultiplication: false,
  setIsMultiplication: (value) => set((state) => ({ isMultiplication: value })),
  sign: '+',
  setSign: (value) => set((state) => ({ sign: value })),
}))

export const useLinearEquationsStore = create<LinearEquationStore>((set) => ({
  equationCoefs: [],
  setEquationCoefs: (value) => set((state) => ({ equationCoefs: value })),
}))
