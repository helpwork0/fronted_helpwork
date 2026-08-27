import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthContext'

/**
 * Ponlo en false mientras enseñas la maqueta: así se puede abrir
 * /app/solicitante directamente sin iniciar sesión.
 */
export const EXIGIR_SESION = true

/** Bloquea las rutas de /app y manda al login si no hay sesión. */
export function RutaPrivada({ children }: { children: React.ReactNode }) {
  const { usuario } = useAuth()
  const { pathname } = useLocation()

  if (EXIGIR_SESION && !usuario) {
    return <Navigate to="/iniciar-sesion" replace state={{ desde: pathname }} />
  }
  return <>{children}</>
}
