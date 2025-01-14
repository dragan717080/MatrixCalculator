import { FC, useRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import RenderProps from '../interfaces/RenderProps'

const NavbarPortal: FC<RenderProps> = ({ children }) => {

  const ref = useRef<Element | null>(null)
  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => {
    ref.current = document.getElementById('navbar-portal-root')
    setMounted(true);
  }, []);

  return (mounted && ref.current)
    ? createPortal(<div className='rounded-lg bg-white text-red-50 z-50'>{children}</div>, ref.current)
    : null
};

export default NavbarPortal
