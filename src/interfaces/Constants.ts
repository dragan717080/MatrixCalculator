interface Sublink {
  name: string
  href: string
}

export interface DashNavbarLink {
  name: string
  subroutes: Sublink[]
}
