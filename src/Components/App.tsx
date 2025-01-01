import { useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import PrivateRoutes from './PrivateRoutes'
import {
  AdditionSubstraction,
  CramerRule,
  Determinant,
  GaussJordanElimination,
  Inverse,
  InverseMethod,
  Multiplication,
  Power,
  Rank,
  Transpose
} from './Menus'
import About from './About'
import { useNavbarPortalStore } from '../store/zustandStore'
import { ToastProvider } from '../contexts/ToastContext'
import 'react-toastify/dist/ReactToastify.min.css'
import AppContextProviders from '../contexts/AppContextProvider'
import '../styles/animations.css'
import '../styles/globals.css'
import '../styles/modal.css'

function App() {
  const providers = [ToastProvider]
  const { isNavbarPortalOpen, setIsNavbarPortalOpen, setActiveIndex } = useNavbarPortalStore()

  /** Close submenu portals. */
  useEffect(() => {
    document.addEventListener('mouseover', (e) => {
    const toolbarElements = Array.from(document.getElementsByClassName('parent-container'))
    const target = (e.target as unknown as HTMLDivElement)
    const hoveredToolbar = toolbarElements.some(x => x.contains(target))
    const navbarPortalContents = Array.from(document.getElementsByClassName('navbar-portal-content'))
    const hoveredPortalContent = navbarPortalContents.some(x => x.contains(target))
    //console.log('Hover toolbar:', hoveredToolbar, 'Hover portal content:', hoveredPortalContent);
    // If hovered directly under toolbar, don't close portal
    const navbarItemContainers = Array.from(document.getElementsByClassName('navbar-item-container'));

    // Check if any of the 'navbar-item-container' elements are contained within the target element
    let hoveredParentNode = false;
    navbarItemContainers.forEach((navItem, index) => {
      if (navItem.contains(target)) {
        setActiveIndex(index);
        hoveredParentNode = true;
      }
    })

    if (!hoveredToolbar && !hoveredPortalContent && !hoveredParentNode) {
      setIsNavbarPortalOpen(false)
    }

    // If hovered directly under toolbar, don't close portal
    for (const toolbarElement of toolbarElements) {
      const { width: toolbarWidth, height: toolbarHeight } = toolbarElement.getBoundingClientRect()

      const [mouseX, mouseY] = [e.clientX, e.clientY];

      //console.log(`Mouse position: ${mouseX} ${mouseY}, Toolbar dimensions: width=${toolbarWidth}, height=${toolbarHeight}`);
    }
  })
  }, [])

  return (
    <Router>
      <AppContextProviders components={providers}>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route path='/' element={<About />} />
            <Route path='addition-substraction' element={<AdditionSubstraction />} />
            <Route path='cramer-rule' element={<CramerRule />} />
            <Route path='gauss-jordan-elimination' element={<GaussJordanElimination />} />
            <Route path='determinant' element={<Determinant />} />
            <Route path='inverse' element={<Inverse />} />
            <Route path='inverse-method' element={<InverseMethod />} />
            <Route path='multiplication' element={<Multiplication />} />
            <Route path='power' element={<Power />} />
            <Route path='rank' element={<Rank />} />
            <Route path='transpose' element={<Transpose />} />
          </Route>
        </Routes>
      </AppContextProviders>
    </Router>
  )
}

export default App
