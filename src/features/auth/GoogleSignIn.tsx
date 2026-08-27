import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Loader2 } from 'lucide-react'
import { useAuth } from './AuthContext'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'
import type { UserRole } from '@/types'

/* ------------------------------------------------------------------
   Entrar con Google (simulado).

   No hay OAuth real porque no hay servidor: se imita el selector de
   cuentas de Google para que el flujo se pueda enseñar completo.

   CUANDO EXISTA EL BACKEND: reemplazar `elegir()` por la redirección
   a `ENDPOINTS.auth.google` (o el SDK de Google Identity Services) y
   borrar el componente `SelectorCuentas`. El resto —el botón y qué
   hacer al volver con la sesión— queda igual.
------------------------------------------------------------------- */

interface CuentaGoogle { nombre: string; email: string; avatarUrl: string }

const CUENTAS: CuentaGoogle[] = [
  { nombre: 'Ariana López', email: 'ariana.lopez@gmail.com', avatarUrl: 'https://i.pravatar.cc/120?u=ariana' },
  { nombre: 'Joaquín Quintero', email: 'joaquin.quintero@gmail.com', avatarUrl: 'https://i.pravatar.cc/120?u=joaquin' },
]

export function GoogleIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.76c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
    </svg>
  )
}

/**
 * Botón "Continuar con Google". Abre el selector y, al elegir cuenta,
 * crea la sesión con el rol indicado.
 *
 * @param rol       rol con el que se crea la cuenta si es nueva
 * @param onListo   qué hacer después de entrar (normalmente navegar)
 * @param esRegistro true = crea cuenta (activa las guías del panel)
 */
export function GoogleSignIn({
  rol = 'solicitante', onListo, esRegistro = false, ...rest
}: {
  rol?: UserRole
  onListo: (rol: UserRole) => void
  esRegistro?: boolean
} & React.HTMLAttributes<HTMLButtonElement>) {
  const [abierto, setAbierto] = useState(false)
  const [cargando, setCargando] = useState<string | null>(null)
  const { login, registrar } = useAuth()

  const elegir = (c: CuentaGoogle) => {
    setCargando(c.email)
    // Pausa breve: sin ella el cambio es tan instantáneo que parece un error
    window.setTimeout(() => {
      const sesion = esRegistro
        ? registrar({ nombre: c.nombre, email: c.email, rol })
        : login({ email: c.email, nombre: c.nombre, rol })
      setAbierto(false)
      setCargando(null)
      onListo(sesion.rol)
    }, 750)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className="flex h-[52px] w-full items-center justify-center gap-3 rounded-xl border border-surface-line bg-white text-[15.5px] font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft"
        {...rest}
      >
        <GoogleIcon /> Continuar con Google
      </button>

      <AnimatePresence>
        {abierto && (
          <SelectorCuentas
            cargando={cargando}
            onElegir={elegir}
            onCerrar={() => !cargando && setAbierto(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

function SelectorCuentas({
  cargando, onElegir, onCerrar,
}: { cargando: string | null; onElegir: (c: CuentaGoogle) => void; onCerrar: () => void }) {
  useLockBodyScroll(true)

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onCerrar}
      className="fixed inset-0 z-[120] grid place-items-center bg-ink/55 p-5 backdrop-blur-sm"
      role="dialog" aria-modal="true" aria-label="Elegir una cuenta de Google"
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-[420px] overflow-hidden rounded-xl2 bg-white shadow-[0_30px_80px_rgba(11,27,58,.35)]"
      >
        <header className="relative border-b border-surface-line px-6 py-5 text-center">
          <button onClick={onCerrar} aria-label="Cerrar"
            className="absolute right-4 top-4 rounded-lg p-1.5 text-ink-muted transition hover:bg-brand-50">
            <X size={16} />
          </button>
          <GoogleIcon size={30} />
          <h2 className="mt-2 text-[19px] font-bold">Elige una cuenta</h2>
          <p className="mt-0.5 text-[13.5px] text-ink-soft">para continuar en HelpWork</p>
        </header>

        <ul className="p-2">
          {CUENTAS.map(c => (
            <li key={c.email}>
              <button
                onClick={() => onElegir(c)}
                disabled={!!cargando}
                className="flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-left transition hover:bg-brand-50 disabled:opacity-60"
              >
                <img src={c.avatarUrl} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14.5px] font-semibold">{c.nombre}</span>
                  <span className="block truncate text-[13px] text-ink-muted">{c.email}</span>
                </span>
                {cargando === c.email && <Loader2 size={18} className="shrink-0 animate-spin text-brand-500" />}
              </button>
            </li>
          ))}

          <li>
            <button
              onClick={() => onElegir({ nombre: 'Nueva persona', email: `demo${Date.now()}@gmail.com`, avatarUrl: 'https://i.pravatar.cc/120?u=nueva' })}
              disabled={!!cargando}
              className="flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-left transition hover:bg-brand-50 disabled:opacity-60"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-50 text-[18px] text-brand-600">+</span>
              <span className="text-[14.5px] font-semibold">Usar otra cuenta</span>
            </button>
          </li>
        </ul>

        <p className="border-t border-surface-line px-6 py-4 text-[12px] leading-relaxed text-ink-muted">
          Para continuar, Google compartirá tu nombre, correo y foto de perfil con HelpWork.
        </p>
      </motion.div>
    </motion.div>
  )
}
