import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { ROUTES } from '@/config/site.config'

/** Envoltorio de las páginas públicas (landing, precios, auth). */
export function PublicLayout() {
  const { pathname } = useLocation()
  // En el home la barra arranca transparente sobre el hero
  const overHero = pathname === ROUTES.home

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar overHero={overHero} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
