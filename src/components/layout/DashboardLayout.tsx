import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bell, HelpCircle } from 'lucide-react'
import { Logo } from './Logo'
import { UserMenu } from './UserMenu'
import { useAuth } from '@/features/auth/AuthContext'
import { MessagesMenu } from '@/features/messages/MessagesMenu'
import { ChatDock } from '@/features/messages/ChatDock'
import { useMessages } from '@/features/messages/MessagesContext'
import { MascotGuideButton } from '@/components/onboarding/MascotGuideButton'
import { ROUTES } from '@/config/site.config'
import { cn } from '@/lib/cn'
import type { LucideIcon } from 'lucide-react'
import type { TourId } from '@/components/onboarding/tours'

/** Qué guía corresponde a cada ruta privada. */
const TOUR_POR_RUTA: Record<string, TourId> = {
  [ROUTES.appSolicitante]: 'solicitante',
  [ROUTES.appHelpWorker]: 'helpworker',
  [ROUTES.matching]: 'matching',
  [ROUTES.matchingHW]: 'matching',
}

export interface SidebarItem {
  label: string
  to: string
  icon: LucideIcon
  badge?: number
}

interface Props {
  items: SidebarItem[]
  usuario: { nombre: string; subtitulo: string; avatarUrl: string }
  /** Bloque promocional al pie de la barra lateral. */
  aside?: React.ReactNode
}

/** Layout de la app privada: barra lateral fija + contenido con scroll. */
export function DashboardLayout({ items, usuario, aside }: Props) {
  const { pathname } = useLocation()
  const tourId = TOUR_POR_RUTA[pathname]
  const { usuario: sesion } = useAuth()
  const { totalNoLeidos } = useMessages()

  // Si hay sesión real se muestran sus datos; si no, los de demostración
  const perfil = sesion
    ? {
        nombre: sesion.nombre,
        subtitulo: sesion.rol === 'helpworker' ? 'HelpWorker verificado' : 'Solicitante verificado',
        avatarUrl: sesion.avatarUrl ?? usuario.avatarUrl,
      }
    : usuario

  return (
    <div className="ambiente relative min-h-screen bg-gradient-to-br from-[#F4F8FF] via-[#FAFBFF] to-[#F6F4FF]">
      {/* Barra lateral */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[264px] flex-col border-r border-white/70 bg-white/75 backdrop-blur-2xl lg:flex">
        <div className="px-5 py-6"><Logo /></div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3">
          {items.map(item => {
            const active = pathname === item.to
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  'relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14.5px] font-medium transition-colors duration-200',
                  active ? 'text-brand-700' : 'text-ink-soft hover:bg-brand-50/70 hover:text-brand-600',
                )}
              >
                {active && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute inset-0 -z-10 rounded-xl bg-brand-50 ring-1 ring-brand-100"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <item.icon size={18} className={active ? 'text-brand-600' : ''} />
                <span className="flex-1">{item.label}</span>
                {(item.label === 'Mensajes' ? totalNoLeidos : item.badge) ? (
                  <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[11px] font-bold text-white">
                    {item.label === 'Mensajes' ? totalNoLeidos : item.badge}
                  </span>
                ) : null}
              </NavLink>
            )
          })}
        </nav>

        {aside && <div className="p-3">{aside}</div>}

        <div className="border-t border-surface-line p-2">
          <UserMenu {...perfil} />
        </div>
      </aside>

      {/* Contenido */}
      <div className="relative z-10 lg:pl-[264px]">
        <header className="sticky top-0 z-30 glass">
          <div className="flex h-16 items-center justify-end gap-2 px-5 sm:px-8">
            <MessagesMenu />
            <IconButton icon={Bell} label="Alertas" dot />
            <IconButton icon={HelpCircle} label="Ayuda" />
            <img src={perfil.avatarUrl} alt="" className="ml-2 h-9 w-9 rounded-full object-cover ring-2 ring-white" />
          </div>
        </header>

        <main className="px-5 py-7 sm:px-8">
          <Outlet />
        </main>

        {/* Mini chats anclados abajo, estilo Facebook */}
        <ChatDock />

        {/* Mascota flotante: relanza la guía de la pantalla actual */}
        {tourId && <MascotGuideButton tourId={tourId} />}
      </div>
    </div>
  )
}

function IconButton({ icon: Icon, label, dot }: { icon: LucideIcon; label: string; dot?: boolean }) {
  return (
    <button aria-label={label} className="relative grid h-10 w-10 place-items-center rounded-xl text-ink-soft transition hover:bg-brand-50 hover:text-brand-600">
      <Icon size={19} />
      {dot && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />}
    </button>
  )
}
