import { useEffect, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import DropdownMenu, { IMenuOption } from './Atoms/DropdownMenu'
import { FiLogOut, FiEdit, FiEdit2 } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'
import { useToast, EToastTypes } from '../contexts/ToastContext'
import Logo from '../../public/logo.webp'
import AdvancedPropertiesToolbar from '../Components/NavbarToolbars/AdvancedPropertiesToolbar'
import InversionsToolbar from './NavbarToolbars/InversionsToolbar'
import LinearEquationsToolbar from './NavbarToolbars/LinearEquationsToolbar'
import MatrixOperationsToolbar from './NavbarToolbars/MatrixOperationsToolbar'
import NavbarMenuItem from './NavbarMenuItem'

function classNames(...classes: Array<string>) {
  return classes.filter(Boolean).join(' ')
}

export default function DashNavbar() {
  const { showError } = useToast()

  const [navigation, setNavigation] = useState([
    { name: 'Matrix Operations', href: '/', current: false, component: MatrixOperationsToolbar },
    { name: 'Advanced Properties', href: '/advanced-properties', current: false, component: AdvancedPropertiesToolbar },
    { name: 'Inversions', href: '/inversions', current: false, component: InversionsToolbar },
    { name: 'Linear Equations Systems', href: '/linear-equations-systems', current: false, component: LinearEquationsToolbar },
  ])

  const navigate = useNavigate()

  const toolbarComponents = [MatrixOperationsToolbar, AdvancedPropertiesToolbar, InversionsToolbar, LinearEquationsToolbar]

  return (
    <Disclosure as="nav" className="bg-gray-800 h-16">
      <>
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              {/* Mobile menu button*/}
              <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <span className="sr-only">Open main menu</span>
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              </Disclosure.Button>
            </div>
            <div className="flex flex-1 items-center justify-center max-h-full sm:justify-start">
              <Link to='/'>
              <div className="flex flex-shrink-0 items-center">
                <img
                  className="block h-8 w-auto lg:hidden"
                  src={Logo}
                  alt="Dragan Logo"
                />
                <img
                  className="hidden h-8 w-auto lg:block"
                  src={Logo}
                  alt="Dragan Logo"
                />
              </div>
              </Link>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4 h-16">
                  {navigation.map((toolbarComponent, index: number) => (
                    <div className='h-full row-v navbar-item-container' key={toolbarComponent.name}>
                      <div
                        className={classNames(
                          toolbarComponent.current
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:py-0 hover:text-white',
                          'row-v max-h-10 m-auto px-1.5 py-2 rounded-md text-sm font-medium'
                        )}
                        aria-current={toolbarComponent.current ? 'page' : undefined}
                      >
                        <NavbarMenuItem
                          ComponentToRender={toolbarComponent.component}
                          index={index}
                          key={index}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Disclosure.Panel className="sm:hidden relative z-10 bg-deepazure">
          <div className="px-2 pt-2 pb-3 flex flex-col gap-1">
            {navigation.map((item) => (
              <Link key={item.name} to={item.href}>
                <Disclosure.Button
                  className={classNames(
                    item.current
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    ' px-3 w-full py-2 rounded-md text-base font-medium flex'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              </Link>
            ))}
          </div>
        </Disclosure.Panel>
      </>
    </Disclosure>
  )
}
