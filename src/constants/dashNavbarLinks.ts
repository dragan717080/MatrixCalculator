import { DashNavbarLink } from "../interfaces/Constants"

const DASH_NAVBAR_LINKS: DashNavbarLink[] = [
  {
    name: 'Matrix Operations',
    subroutes: [
      { name: 'Multiplication', href: 'multiplication' },
      { name: 'Addition and substraction', href: 'addition-substraction' },
      { name: 'Transpose', href: 'transpose' }
    ]
  },
  {
    name: 'Advanced Properties',
    subroutes: [
      { name: 'Rank', href: 'rank' },
      { name: 'Determinant', href: 'determinant' },
      { name: 'Power', href: 'power' }
    ]
  },
  {
    name: 'Inversions',
    subroutes: [
      { name: 'Inverse', href: 'inverse' },
      { name: 'Inverse Method', href: 'inverse-method' }
    ]
  },
  {
    name: 'Linear Equations Systems',
    subroutes: [
      { name: 'Gauss Jordan Elimination', href: 'gauss-jordan-elimination' },
      { name: 'Cramer\'s Rule', href: 'cramer-rule' },
    ]
  }
]

export default DASH_NAVBAR_LINKS
