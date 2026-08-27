import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, LogOut, Settings, User as UserIcon, RefreshCw, RotateCcw } from 'lucide-react'
import { useAuth } from '@/features/auth/AuthContext'
import { reiniciarGuias } from '@/components/onboarding/useAutoTour'
import { limpiarAlmacenamiento } from '@/app/bootstrap'
import { MODO_DEMO } from '@/config/demo.config'
import { ROUTES } from '@/config/site.config'

/**
 * Bloque de usuario con menú desplegable. Se cierra al hacer clic fuera
 * o con Esc, para no quedarse abierto si el usuario se distrae.
 */
export function UserMenu({ nombre, subtitulo, avatarUrl }: { nombre: string; subtitulo: string; avatarUrl: string }) {
  const [abierto, setAbierto] = useState(false)
  const caja = useRef<HTMLDivElement>(null)
  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!abierto) return
    const fuera = (e: MouseEvent) => {
      if (caja.current && !caja.current.contains(e.target as Node)) setAbierto(false)
    }
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setAbierto(false) }
    document.addEventListener('mousedown', fuera)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', fuera)
      document.removeEventListener('keydown', esc)
    }
  }, [abierto])

  const cerrarSesion = () => {
    logout()                       // borra la sesión, NO las guías vistas
    navigate(ROUTES.home, { replace: true })
  }

  return (
    <div ref={caja} className="relative">
      <button
        onClick={() => setAbierto(v => !v)}
        aria-haspopup="menu"
        aria-expanded={abierto}
        className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-brand-50"
      >
        <img src={avatarUrl} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{nombre}</p>
          <p className="truncate text-xs text-ink-muted">{subtitulo}</p>
        </div>
        <ChevronDown
          size={16}
          className={`shrink-0 text-ink-muted transition-transform duration-200 ${abierto ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {abierto && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute bottom-full left-0 z-50 mb-2 w-full min-w-[220px] overflow-hidden rounded-xl2 border border-surface-line bg-white p-1.5 shadow-lift"
          >
            <Item icon={UserIcon} label="Mi perfil" onClick={() => setAbierto(false)} />
            <Item icon={Settings} label="Ajustes" onClick={() => setAbierto(false)} />
            <Item
              icon={RefreshCw}
              label="Volver a ver las guías"
              onClick={() => { reiniciarGuias(); setAbierto(false); window.location.reload() }}
            />

            {MODO_DEMO && (
              <Item
                icon={RotateCcw}
                label="Reiniciar demostración"
                onClick={() => { limpiarAlmacenamiento(); window.location.href = '/' }}
              />
            )}

            <div className="my-1.5 h-px bg-surface-line" />

            <Item icon={LogOut} label="Cerrar sesión" tono="peligro" onClick={cerrarSesion} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Item({
  icon: Icon, label, onClick, tono = 'normal',
}: {
  icon: typeof LogOut
  label: string
  onClick: () => void
  tono?: 'normal' | 'peligro'
}) {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[14px] font-medium transition ${
        tono === 'peligro'
          ? 'text-red-600 hover:bg-red-50'
          : 'text-ink-soft hover:bg-brand-50 hover:text-brand-600'
      }`}
    >
      <Icon size={16} className="shrink-0" />
      {label}
    </button>
  )
}
