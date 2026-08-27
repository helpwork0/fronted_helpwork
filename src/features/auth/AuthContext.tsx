import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { User, UserRole } from '@/types'

/* ------------------------------------------------------------------
   Sesión (versión sin backend).

   Se guardan DOS cosas distintas y por separado, y esa separación es
   justamente lo que hace que las guías no reaparezcan al cerrar sesión:

   · helpwork:sesion   → quién está dentro AHORA. Se borra al salir.
   · helpwork:cuentas  → registro de cuentas creadas en este navegador.
                         NO se borra al salir. Ahí vive `esCuentaNueva`.

   Cuando llegue el backend, `esCuentaNueva` debería ser un campo del
   usuario que devuelve la API (por ejemplo `onboarding_completado`),
   para que la guía siga la cuenta y no al navegador.
------------------------------------------------------------------- */

const CLAVE_SESION = 'helpwork:sesion'
const CLAVE_CUENTAS = 'helpwork:cuentas'

export interface Sesion extends User {
  /** true solo si la cuenta se creó aquí. Decide si corren las guías. */
  esCuentaNueva: boolean
}

interface CuentaGuardada {
  nombre: string
  rol: UserRole
  esCuentaNueva: boolean
}

/** Id estable a partir del correo: al volver a entrar es el mismo usuario. */
function idDesdeEmail(email: string): string {
  let h = 0
  const limpio = email.trim().toLowerCase()
  for (let i = 0; i < limpio.length; i++) {
    h = (h << 5) - h + limpio.charCodeAt(i)
    h |= 0
  }
  return `u_${Math.abs(h).toString(36)}`
}

function leer<T>(clave: string, porDefecto: T): T {
  try { return JSON.parse(localStorage.getItem(clave) ?? '') as T } catch { return porDefecto }
}

const leerCuentas = () => leer<Record<string, CuentaGuardada>>(CLAVE_CUENTAS, {})

function guardarCuenta(email: string, cuenta: CuentaGuardada) {
  const cuentas = leerCuentas()
  cuentas[email.trim().toLowerCase()] = cuenta
  localStorage.setItem(CLAVE_CUENTAS, JSON.stringify(cuentas))
}

function construirSesion(email: string, cuenta: CuentaGuardada): Sesion {
  return {
    id: idDesdeEmail(email),
    nombre: cuenta.nombre,
    email: email.trim().toLowerCase(),
    rol: cuenta.rol,
    avatarUrl: `https://i.pravatar.cc/120?u=${idDesdeEmail(email)}`,
    verificado: true,
    esCuentaNueva: cuenta.esCuentaNueva,
  }
}

interface AuthContextValue {
  usuario: Sesion | null
  /** Entrar con una cuenta que ya existe (o improvisarla si no está). */
  login: (datos: { email: string; nombre?: string; rol?: UserRole }) => Sesion
  /** Crear cuenta. Es el ÚNICO camino que activa las guías. */
  registrar: (datos: { nombre: string; email: string; rol: UserRole }) => Sesion
  /** Salir. Borra la sesión y nada más: las guías vistas se conservan. */
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Sesion | null>(() => leer<Sesion | null>(CLAVE_SESION, null))

  const abrirSesion = useCallback((sesion: Sesion) => {
    localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion))
    setUsuario(sesion)
    return sesion
  }, [])

  const registrar = useCallback<AuthContextValue['registrar']>(({ nombre, email, rol }) => {
    // TODO backend:  await http.post(ENDPOINTS.auth.register, { nombre, email, rol })
    const cuenta: CuentaGuardada = { nombre, rol, esCuentaNueva: true }
    guardarCuenta(email, cuenta)
    return abrirSesion(construirSesion(email, cuenta))
  }, [abrirSesion])

  const login = useCallback<AuthContextValue['login']>(({ email, nombre, rol }) => {
    // TODO backend:  const { token, user } = await http.post(ENDPOINTS.auth.login, ...)
    const guardada = leerCuentas()[email.trim().toLowerCase()]

    // Si la cuenta no está en este navegador, se asume que ya existía en el
    // servidor: entra sin guías, porque no la acaba de crear.
    const cuenta: CuentaGuardada = guardada ?? {
      nombre: nombre ?? email.split('@')[0],
      rol: rol ?? 'solicitante',
      esCuentaNueva: false,
    }
    if (!guardada) guardarCuenta(email, cuenta)

    return abrirSesion(construirSesion(email, cuenta))
  }, [abrirSesion])

  const logout = useCallback(() => {
    // Solo la sesión. Ni las cuentas ni las guías vistas se tocan.
    localStorage.removeItem(CLAVE_SESION)
    setUsuario(null)
  }, [])

  const value = useMemo(() => ({ usuario, login, registrar, logout }), [usuario, login, registrar, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
