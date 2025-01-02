import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  MatrixStore,
  NavbarPortalStore
}
  from '../interfaces/Zustand';

export const useNavbarPortalStore = create<NavbarPortalStore>((set) => ({
  isNavbarPortalOpen: false,
  setIsNavbarPortalOpen: (value) => set((state) => ({ isNavbarPortalOpen: value })),
  activeIndex: 0,
  setActiveIndex: (value) => set((state) => ({ activeIndex: value })),
}));

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
}));
