import { MouseEvent, useEffect, useState } from 'react'
import { Disclosure } from '@headlessui/react'
import { Bars3Icon } from '@heroicons/react/24/outline'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '../contexts/ToastContext'
import AdvancedPropertiesToolbar from '../Components/NavbarToolbars/AdvancedPropertiesToolbar'
import InversionsToolbar from './NavbarToolbars/InversionsToolbar'
import LinearEquationsToolbar from './NavbarToolbars/LinearEquationsToolbar'
import MatrixOperationsToolbar from './NavbarToolbars/MatrixOperationsToolbar'
import NavbarMenuItem from './NavbarMenuItem'
import { wait } from '../lib/utils'
import DASH_NAVBAR_LINKS from '../constants/dashNavbarLinks'
import Logo from '../../public/logo.webp'

function classNames(...classes: Array<string>) {
  return classes.filter(Boolean).join(' ')
}

export default function DashNavbar() {
  const { showError } = useToast()

  // For disclosure menu on small screens
  const [activeIndex, setActiveIndex] = useState<number>(0)

  // Track the visibility of each submenu
  const [submenuVisible, setSubmenuVisible] = useState<{ [key: number]: boolean }>({})

  const [navigation, setNavigation] = useState([
    { name: 'Matrix Operations', href: '/', current: false, component: MatrixOperationsToolbar },
    { name: 'Advanced Properties', href: '/advanced-properties', current: false, component: AdvancedPropertiesToolbar },
    { name: 'Inversions', href: '/inversions', current: false, component: InversionsToolbar },
    { name: 'Linear Equations Systems', href: '/linear-equations-systems', current: false, component: LinearEquationsToolbar },
  ])

  const navigate = useNavigate()

  // Handle submenu visibility when clicking a menu item
  const handleChangePanelIndex = (e: MouseEvent<HTMLDivElement>, index: number) => {
    setActiveIndex(index)

    const slideContainer = document.getElementsByClassName('slide-container')[index]

    if (!submenuVisible[index]) {
      slideContainer.classList.remove('slide-exit-active')
      console.log('to add enter');
      slideContainer.classList.add('slide-enter-active')
    } else {
      console.log('to remove enter');
      slideContainer.classList.remove('slide-enter-active')
      slideContainer.classList.add('slide-exit-active')
    }

    // Toggle the visibility of the corresponding submenu
    setSubmenuVisible((prevState) => ({
      ...prevState,
      [index]: !prevState[index], // Toggle visibility for the current index
    }));
  }

  useEffect(() => {
    const slideContainers = document.getElementsByClassName('slide-container')
    console.log(slideContainers);

  }, [])

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
          <div className="flex flex-col items-start">
            {DASH_NAVBAR_LINKS.map((item, index) => (
              <div
                onClick={(e) => handleChangePanelIndex(e, index)}
                className={classNames(
                  index === activeIndex
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  ' w-full text-base bold'
                )}
                key={item.name}
              >
                <div className="row-v h-14">
                  <h4 className='px-5'>{item.name}</h4>
                </div>
                  <ul
                    className={classNames(
                      'slide-container slide-exit-active',
                    )}
                  >
                    {item.subroutes.map((subroute) => (
                      <li
                        className="py-4 px-8 text-white border-b-lightgray"
                        key={subroute.name}
                      >
                        <Link to={subroute.href}>{subroute.name}</Link>
                      </li>
                    ))}
                  </ul>
                {/* )} */}
              </div>
            ))}
          </div>
        </Disclosure.Panel>
      </>
    </Disclosure>
  )
}
