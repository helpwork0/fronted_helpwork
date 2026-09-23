import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/config/site.config'
import { useAuth } from '../AuthContext'
import type { UserRole } from '@/types'

export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const { completarOAuth } = useAuth()
  const [error, setError] = useState('')
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1))
    const query = new URLSearchParams(window.location.search)
    const accessToken = params.get('access_token')
    if (!accessToken) { setError('Google no devolvió una sesión válida.'); return }
    const rol = query.get('rol') === 'helpworker' ? 'helpworker' : 'solicitante'
    completarOAuth({ accessToken, refreshToken: params.get('refresh_token') ?? undefined, expiresIn: Number(params.get('expires_in') ?? 3600), rol: rol as UserRole })
      .then(session => navigate(session.rol === 'helpworker' ? ROUTES.appHelpWorker : ROUTES.appSolicitante, { replace: true }))
      .catch(() => setError('No se pudo abrir la sesión. Inténtalo nuevamente.'))
  }, [completarOAuth, navigate])
  return <div className="grid min-h-screen place-items-center p-6 text-center"><div><div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-brand-100 border-t-brand-500" /><p className="mt-4 text-ink-soft">{error || 'Terminando tu inicio de sesión…'}</p></div></div>
}
