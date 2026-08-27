import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Al cambiar de ruta vuelve arriba (si no, React Router conserva el scroll). */
export function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }) }, [pathname])
  return null
}
