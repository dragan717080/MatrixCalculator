import { Navigate, Outlet } from 'react-router-dom'
import DashNavbar from './DashNavbar'
import Footer from './Footer'
import MatrixModal from './MatrixModal'

export default function PrivateRoutes() {
  return <div className='flex flex-col min-h-screen'>
    <DashNavbar />
    <div className='relative'>
      <div id='navbar-portal-root' className='mt-[-6px]'></div>
      <div id='__next'></div>
    </div>
    <main className='flex-1 max-w-screen md:max-w-5xl lg:max-w-7xl mx-auto py-7 px-4 lg:px-8'>
      <Outlet />
      <MatrixModal />
    </main>
    <Footer />
  </div>
}
