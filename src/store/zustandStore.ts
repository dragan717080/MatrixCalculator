import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  NavbarPortalStore
}
  from '../interfaces/Zustand';

export const useNavbarPortalStore = create<NavbarPortalStore>((set) => ({
  isNavbarPortalOpen: false,
  setIsNavbarPortalOpen: (value) => set((state) => ({ isNavbarPortalOpen: value })),
  activeIndex: 0,
  setActiveIndex: (value) => set((state) => ({ activeIndex: value })),
}));
