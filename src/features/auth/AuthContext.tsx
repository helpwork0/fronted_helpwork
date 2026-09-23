import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { User, UserRole } from '@/types'
import { http } from '@/lib/api/http'
import { ENDPOINTS } from '@/lib/api/endpoints'
import { type AuthResponse, userFromApi } from '@/lib/api/helpwork.types'

export interface Sesion extends User { esCuentaNueva: boolean }

interface AuthContextValue {
  usuario: Sesion | null
  cargandoSesion: boolean
  login: (datos: { email: string; password: string }) => Promise<Sesion>
  registrar: (datos: { nombre: string; email: string; password: string; rol: UserRole }) => Promise<{ sesion: Sesion | null; emailConfirmationRequired: boolean }>
  completarOAuth: (tokens: { accessToken: string; refreshToken?: string; expiresIn?: number; rol?: UserRole }) => Promise<Sesion>
  refrescarSesion: () => Promise<Sesion | null>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)
const rolApi = (rol: UserRole) => rol === 'helpworker' ? 'provider' : 'requester'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Sesion | null>(null)
  const [cargandoSesion, setCargandoSesion] = useState(true)

  useEffect(() => {
    http.get<AuthResponse>(ENDPOINTS.auth.me)
      .then(response => setUsuario(userFromApi(response)))
      .catch(() => setUsuario(null))
      .finally(() => setCargandoSesion(false))
  }, [])

  const login = useCallback(async ({ email, password }: { email: string; password: string }) => {
    const response = await http.post<AuthResponse>(ENDPOINTS.auth.login, { email, password })
    const sesion = userFromApi(response)
    setUsuario(sesion)
    return sesion
  }, [])

  const registrar = useCallback(async ({ nombre, email, password, rol }: { nombre: string; email: string; password: string; rol: UserRole }) => {
    const response = await http.post<AuthResponse>(ENDPOINTS.auth.register, { fullName: nombre, email, password, role: rolApi(rol) })
    if (response.emailConfirmationRequired) return { sesion: null, emailConfirmationRequired: true }
    const sesion = userFromApi(response, true)
    setUsuario(sesion)
    return { sesion, emailConfirmationRequired: false }
  }, [])

  const completarOAuth = useCallback(async ({ accessToken, refreshToken, expiresIn, rol }: { accessToken: string; refreshToken?: string; expiresIn?: number; rol?: UserRole }) => {
    const response = await http.post<AuthResponse>(ENDPOINTS.auth.session, { accessToken, refreshToken, expiresIn, role: rol ? rolApi(rol) : undefined })
    const sesion = userFromApi(response)
    setUsuario(sesion)
    return sesion
  }, [])

  const logout = useCallback(async () => {
    try { await http.post(ENDPOINTS.auth.logout) } finally { setUsuario(null) }
  }, [])
  const refrescarSesion = useCallback(async () => {
    try { const sesion = userFromApi(await http.get<AuthResponse>(ENDPOINTS.auth.me)); setUsuario(sesion); return sesion } catch { setUsuario(null); return null }
  }, [])

  const value = useMemo(() => ({ usuario, cargandoSesion, login, registrar, completarOAuth, refrescarSesion, logout }), [usuario, cargandoSesion, login, registrar, completarOAuth, refrescarSesion, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
