import { useEffect, useState } from 'react'
import { Bell, HelpCircle } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import { useAuth } from '@/features/auth/AuthContext'
import { MessagesMenu } from '@/features/messages/MessagesMenu'
import { ChatDock } from '@/features/messages/ChatDock'
import { http } from '@/lib/api/http'
import { ENDPOINTS } from '@/lib/api/endpoints'
import { cn } from '@/lib/cn'

/** AppBar visual original de HelpWork, compartida porque no contiene navegación por rol. */
export function AppBar({ notificationsTo }: { notificationsTo: string }) {
  const { usuario } = useAuth()
  const [unread, setUnread] = useState(0)
  const [open, setOpen] = useState(false)
  const [latest, setLatest] = useState<{ id: string | number; titulo: string; mensaje: string; fecha: string; leido: boolean }[]>([])

  const refresh = () => http.get<{ unreadCount: number }>(ENDPOINTS.notificaciones.summary).then(r => setUnread(r.unreadCount)).catch(() => setUnread(0))
  useEffect(() => {
    refresh()
    window.addEventListener('helpwork:notificaciones-actualizadas', refresh)
    return () => window.removeEventListener('helpwork:notificaciones-actualizadas', refresh)
  }, [])

  const toggleNotifications = async () => {
    setOpen(value => !value)
    if (!open) setLatest((await http.get<{ items: typeof latest }>(ENDPOINTS.notificaciones.list(3, 0))).items)
  }

  return <>
    <header className="sticky top-0 z-30 glass">
      <div className="flex h-16 items-center justify-end gap-2 px-5 sm:px-8">
        <MessagesMenu />
        <div className="relative">
          <IconButton icon={Bell} label="Alertas" dot={unread > 0} onClick={() => toggleNotifications().catch(() => undefined)} />
          {open && <div className="absolute right-0 top-12 w-[340px] overflow-hidden rounded-2xl border border-white/80 bg-white/85 shadow-[0_18px_55px_rgba(11,27,58,.16)] backdrop-blur-2xl">
            <div className="flex items-center justify-between border-b border-surface-line px-4 py-3"><p className="text-[14px] font-bold">Notificaciones</p><span className="text-[12px] texto-suave">{unread} sin leer</span></div>
            {latest.length ? <div className="divide-y divide-surface-line/70">{latest.map(item => <div key={item.id} className="px-4 py-3"><p className={cn('text-[13px] leading-snug', item.leido ? 'texto-suave' : 'font-semibold')}>{item.mensaje || item.titulo}</p><p className="mt-1 text-[11px] text-ink-muted">{new Date(item.fecha).toLocaleString('es-EC')}</p></div>)}</div> : <p className="px-4 py-5 text-center text-[13px] texto-suave">No tienes notificaciones.</p>}
            <NavLink to={notificationsTo} onClick={() => setOpen(false)} className="block border-t border-surface-line px-4 py-3 text-center text-[13px] font-semibold text-brand-600 transition hover:bg-brand-50">Ver todas las notificaciones</NavLink>
          </div>}
        </div>
        <IconButton icon={HelpCircle} label="Ayuda" />
        {usuario?.avatarUrl ? <img src={usuario.avatarUrl} alt="" className="ml-2 h-9 w-9 rounded-full object-cover ring-2 ring-white" /> : <span className="ml-2 grid h-9 w-9 place-items-center rounded-full bg-brand-50 text-[12px] font-bold text-brand-600">{usuario?.nombre?.slice(0, 1) ?? 'U'}</span>}
      </div>
    </header>
    <ChatDock />
  </>
}

function IconButton({ icon: Icon, label, dot, onClick }: { icon: LucideIcon; label: string; dot?: boolean; onClick?: () => void }) {
  return <button aria-label={label} onClick={onClick} className="relative grid h-10 w-10 place-items-center rounded-xl text-ink-soft transition hover:bg-brand-50 hover:text-brand-600"><Icon size={19} />{dot && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />}</button>
}
