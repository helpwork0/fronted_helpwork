import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
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
import { http } from '@/lib/api/http'
import { ENDPOINTS } from '@/lib/api/endpoints'
import type { LucideIcon } from 'lucide-react'
import type { TourId } from '@/components/onboarding/tours'

/** Qué guía corresponde a cada ruta privada. */
const TOUR_POR_RUTA: Record<string, TourId> = {
  [ROUTES.appSolicitante]: 'solicitante',
  [ROUTES.appHelpWorker]: 'helpworker',
  [ROUTES.matching]: 'matching',
}

export interface SidebarItem {
  label: string
  to: string
  icon: LucideIcon
  badge?: number
  disabled?: boolean
}

interface Props {
  items: SidebarItem[]
  usuario?: { nombre: string; subtitulo: string; avatarUrl: string }
  /** Bloque promocional al pie de la barra lateral. */
  aside?: React.ReactNode
}

/** Layout de la app privada: barra lateral fija + contenido con scroll. */
export function DashboardLayout({ items, usuario, aside }: Props) {
  const { pathname } = useLocation()
  const tourId = TOUR_POR_RUTA[pathname]
  const { usuario: sesion } = useAuth()
  const { totalNoLeidos } = useMessages()
  const [notificacionesNoLeidas, setNotificacionesNoLeidas] = useState(0)
  const [menuNotificaciones, setMenuNotificaciones] = useState(false)
  const [ultimasNotificaciones, setUltimasNotificaciones] = useState<{ id: string | number; titulo: string; mensaje: string; fecha: string; leido: boolean }[]>([])
  useEffect(() => {
    const actualizar = () => http.get<{ unreadCount: number }>(ENDPOINTS.notificaciones.summary).then(r => setNotificacionesNoLeidas(r.unreadCount)).catch(() => setNotificacionesNoLeidas(0))
    actualizar(); window.addEventListener('helpwork:notificaciones-actualizadas', actualizar)
    return () => window.removeEventListener('helpwork:notificaciones-actualizadas', actualizar)
  }, [])
  const abrirNotificaciones = async () => { setMenuNotificaciones(open => !open); if (!menuNotificaciones) { const page = await http.get<{ items: { id: string | number; titulo: string; mensaje: string; fecha: string; leido: boolean }[] }>(ENDPOINTS.notificaciones.list(3, 0)); setUltimasNotificaciones(page.items) } }

  // Si hay sesión real se muestran sus datos; si no, los de demostración
  const perfil = sesion
    ? {
        nombre: sesion.nombre,
        subtitulo: sesion.rol === 'helpworker' ? 'HelpWorker verificado' : 'Solicitante verificado',
        avatarUrl: sesion.avatarUrl ?? usuario?.avatarUrl ?? '',
      }
    : usuario ?? { nombre: 'Usuario Help Work', subtitulo: 'Sesión', avatarUrl: '' }

  return (
    <div className="ambiente relative min-h-screen bg-gradient-to-br from-[#F4F8FF] via-[#FAFBFF] to-[#F6F4FF]">
      {/* Barra lateral */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[264px] flex-col border-r border-white/70 bg-white/75 backdrop-blur-2xl lg:flex">
        <div className="px-5 py-6"><Logo /></div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3">
          {items.map(item => {
            const active = pathname === item.to
            if (item.disabled) return <div key={item.to} title="Activa el modo HelpSeeker desde Ajustes" className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14.5px] font-medium text-ink-muted/50"><item.icon size={18} /><span className="flex-1">{item.label}</span><span className="text-[10px]">Bloqueado</span></div>
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
                {(item.label === 'Mensajes' ? totalNoLeidos : item.label === 'Notificaciones' ? notificacionesNoLeidas : item.badge) ? (
                  <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[11px] font-bold text-white">
                    {item.label === 'Mensajes' ? totalNoLeidos : item.label === 'Notificaciones' ? notificacionesNoLeidas : item.badge}
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
            <div className="relative"><IconButton icon={Bell} label="Alertas" dot={notificacionesNoLeidas > 0} onClick={() => abrirNotificaciones().catch(() => undefined)} />
              {menuNotificaciones && <div className="absolute right-0 top-12 w-[340px] overflow-hidden rounded-2xl border border-white/80 bg-white/85 shadow-[0_18px_55px_rgba(11,27,58,.16)] backdrop-blur-2xl"><div className="flex items-center justify-between border-b border-surface-line px-4 py-3"><p className="text-[14px] font-bold">Notificaciones</p><span className="text-[12px] texto-suave">{notificacionesNoLeidas} sin leer</span></div>{ultimasNotificaciones.length ? <div className="divide-y divide-surface-line/70">{ultimasNotificaciones.map(item => <div key={item.id} className="px-4 py-3"><p className={cn('text-[13px] leading-snug', item.leido ? 'texto-suave' : 'font-semibold')}>{item.mensaje || item.titulo}</p><p className="mt-1 text-[11px] text-ink-muted">{new Date(item.fecha).toLocaleString('es-EC')}</p></div>)}</div> : <p className="px-4 py-5 text-center text-[13px] texto-suave">No tienes notificaciones.</p>}<NavLink to={ROUTES.notificaciones} onClick={() => setMenuNotificaciones(false)} className="block border-t border-surface-line px-4 py-3 text-center text-[13px] font-semibold text-brand-600 transition hover:bg-brand-50">Ver todas las notificaciones</NavLink></div>}
            </div>
            <IconButton icon={HelpCircle} label="Ayuda" />
            {perfil.avatarUrl ? <img src={perfil.avatarUrl} alt="" className="ml-2 h-9 w-9 rounded-full object-cover ring-2 ring-white" /> : <span className="ml-2 grid h-9 w-9 place-items-center rounded-full bg-brand-50 text-[12px] font-bold text-brand-600">{perfil.nombre.slice(0, 1)}</span>}
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

function IconButton({ icon: Icon, label, dot, onClick }: { icon: LucideIcon; label: string; dot?: boolean; onClick?: () => void }) {
  return (
    <button aria-label={label} onClick={onClick} className="relative grid h-10 w-10 place-items-center rounded-xl text-ink-soft transition hover:bg-brand-50 hover:text-brand-600">
      <Icon size={19} />
      {dot && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />}
    </button>
  )
}
