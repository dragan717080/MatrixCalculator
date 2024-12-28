import { Navigate, Outlet } from 'react-router-dom'
import DashNavbar from './DashNavbar'
import Footer from './Footer'

export default function PrivateRoutes() {
  return <div className='flex flex-col min-h-screen'>
    <DashNavbar />
    <div className='flex-1 max-w-7xl py-7 px-4 lg:px-8'>
      <Outlet />
    </div>
    <Footer />
  </div>
}
