import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthContext'
import { ROUTES } from '@/config/site.config'

export function RutaRol({ rol, children }: { rol: 'solicitante' | 'helpworker' | 'administrador'; children: React.ReactNode }) {
  const { usuario, cargandoSesion } = useAuth()
  const location = useLocation()
  if (cargandoSesion) return <div className="grid min-h-[60vh] place-items-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-100 border-t-brand-500" /></div>
  if (!usuario) return <Navigate to={ROUTES.login} replace state={{ desde: location.pathname }} />
  if (!usuario.roles.includes(rol)) return <Navigate to={usuario.roles.includes('administrador') ? ROUTES.appAdministrador : usuario.roles.includes('helpworker') ? ROUTES.appHelpWorker : ROUTES.appSolicitante} replace />
  return <>{children}</>
}
