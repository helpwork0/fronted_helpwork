import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthContext'
import { ROUTES } from '@/config/site.config'

/**
 * Ponlo en false mientras enseñas la maqueta: así se puede abrir
 * /app/solicitante directamente sin iniciar sesión.
 */
export const EXIGIR_SESION = true

/** Bloquea las rutas de /app y manda al login si no hay sesión. */
export function RutaPrivada({ children }: { children: React.ReactNode }) {
  const { usuario, cargandoSesion } = useAuth()
  const { pathname } = useLocation()

  if (cargandoSesion) return <div className="grid min-h-[60vh] place-items-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-100 border-t-brand-500" /></div>
  if (EXIGIR_SESION && !usuario) {
    return <Navigate to={ROUTES.login} replace state={{ desde: pathname }} />
  }
  return <>{children}</>
}
