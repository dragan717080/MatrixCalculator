export interface NavbarPortalStore {
  isNavbarPortalOpen: boolean;
  setIsNavbarPortalOpen: (value: boolean) => void;
  activeIndex: number;
  setActiveIndex: (value: number) => void;
}
