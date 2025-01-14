import React, { FC, MouseEvent, useState, useRef } from 'react'
import ArrowIcon from '../assets/ArrowIcon'
import NavbarPortal from './NavbarPortal'
import { useNavbarPortalStore } from '../store/zustandStore'

interface NavbarMenuItemProps {
  ComponentToRender: React.ComponentType
  index: number
}

const NavbarMenuItem: FC<NavbarMenuItemProps> = ({ ComponentToRender, index }) => {
  const { isNavbarPortalOpen, setIsNavbarPortalOpen, activeIndex, setActiveIndex } = useNavbarPortalStore()
  let newDisplayName = ComponentToRender.displayName!.split("Toolbar")[0]
  newDisplayName = newDisplayName.replace(/([a-z])([A-Z])/g, '$1 $2')

  // Local state to manage the portal for this specific toolbar
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const navbarMenuItemRef = useRef<HTMLDivElement | null>(null)

  const toolbarRef = useRef<HTMLDivElement | null>(null!)

  const getNavbarPortalStyling = () => {
    if (!navbarMenuItemRef.current) {
      return
    }

    const rect = navbarMenuItemRef.current?.getBoundingClientRect()
    // Decrease margin left by `12px`
    return rect.left - 12 + window.scrollX
  }

  const navbarPortalStyling = getNavbarPortalStyling()
  if (!ComponentToRender.displayName)
    ComponentToRender.displayName = 'Add display name to this component'

  const content = (
    <div className="">
      <h2 className='semibold'>{ComponentToRender.displayName.split("Toolbar")[0].replace(/([a-z])([A-Z])/g, '$1 $2')}</h2>
      <div className="w-4 h-4 transform transition-transform duration-300 group-hover:rotate-180 group-hover:text-primary">
        {/* <ArrowIcon /> */}
      </div>
    </div>
  )

  const handleMouseLeave = (e: MouseEvent<HTMLDivElement>) => {
    if (!toolbarRef.current) {
      return
    }

    // If mouse leave is directly within X axis of toolbar but under, don't close navbar
    console.log('Toolbar ref rect:', toolbarRef.current!.getBoundingClientRect());
  }

  return (
    <div ref={navbarMenuItemRef} className="relative">
      <div
        className={`parent-container px-4 md:px-1.5 xl:px-4 pointer`}
        onMouseEnter={() => {
          setIsHovered(true)
          setIsNavbarPortalOpen(true)
          setActiveIndex(index)
        }}
        onMouseLeave={(e) => handleMouseLeave(e)}
      >
        <h2 className='semibold'>{newDisplayName}</h2>
        <NavbarPortal>
          {activeIndex === index && isNavbarPortalOpen && (
            <div ref={toolbarRef} className='navbar-portal-content' style={{ left: `${navbarPortalStyling}px` }}>
              <ComponentToRender />
            </div>
          )}
        </NavbarPortal>
      </div>
    </div>
  )
}

export default NavbarMenuItem
