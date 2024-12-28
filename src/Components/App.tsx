import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Dashboard from './Dashboard'
import PrivateRoutes from './PrivateRoutes'
import Projects from './Projects'
import { ToastProvider } from '../contexts/ToastContext'
import 'react-toastify/dist/ReactToastify.min.css'
import AppContextProviders from '../contexts/AppContextProvider'
import '../styles/globals.css'

function App() {
  const providers = [ToastProvider]
  return (
    <Router>
      <AppContextProviders components={providers}>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route element={<Dashboard />} path="/" />
            <Route path="projects" element={<Projects />} />
          </Route>
        </Routes>
      </AppContextProviders>
    </Router>
  )
}

export default App
