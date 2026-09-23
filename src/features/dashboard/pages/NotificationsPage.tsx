import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Inbox, Info, CheckCheck } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Tabs } from '@/components/ui/Tabs'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { type Notificacion } from '@/data/appData'
import { cn } from '@/lib/cn'
import { http } from '@/lib/api/http'
import { ENDPOINTS } from '@/lib/api/endpoints'

const ICONOS = { propuesta: { icon: Inbox, clase: 'bg-brand-50 text-brand-600' }, mensaje: { icon: Info, clase: 'bg-violet-100 text-violet-600' }, pago: { icon: Info, clase: 'bg-violet-100 text-violet-600' }, sistema: { icon: Info, clase: 'bg-violet-100 text-violet-600' } }
type ApiNotification = { id: string | number; titulo: string; mensaje: string; fecha: string; leido: boolean; tipo: string }

export default function NotificationsPage() {
  const [items, setItems] = useState<Notificacion[]>([]); const [tab, setTab] = useState('todas'); const [offset, setOffset] = useState(0); const [hasMore, setHasMore] = useState(false); const [loading, setLoading] = useState(true)
  const cargar = async (nextOffset = 0, append = false) => {
    const page = await http.get<{ items: ApiNotification[]; pagination: { hasMore: boolean } }>(ENDPOINTS.notificaciones.list(20, nextOffset))
    const mapped: Notificacion[] = page.items.map(item => ({ id: String(item.id), texto: item.mensaje || item.titulo, hace: new Date(item.fecha).toLocaleString('es-EC'), leida: item.leido, tipo: item.tipo === 'new_match' ? 'propuesta' : 'sistema' }))
    setItems(current => append ? [...current, ...mapped] : mapped); setOffset(nextOffset + mapped.length); setHasMore(page.pagination.hasMore)
  }
  useEffect(() => { cargar().catch(() => setItems([])).finally(() => setLoading(false)) }, [])
  const sinLeer = items.filter(n => !n.leida); const lista = tab === 'sin-leer' ? sinLeer : items
  const marcarTodas = async () => { await http.patch(ENDPOINTS.notificaciones.readAll); setItems(is => is.map(n => ({ ...n, leida: true }))); window.dispatchEvent(new Event('helpwork:notificaciones-actualizadas')) }
  const marcarLeida = async (id: string) => { await http.patch(ENDPOINTS.notificaciones.read(id)); setItems(is => is.map(x => x.id === id ? { ...x, leida: true } : x)); window.dispatchEvent(new Event('helpwork:notificaciones-actualizadas')) }
  return <div><PageHeader titulo="Notificaciones" descripcion="Todo lo que pasó mientras no estabas."><Button variant="secondary" size="sm" onClick={marcarTodas} disabled={sinLeer.length === 0}><CheckCheck size={15} /> Marcar todas como leídas</Button></PageHeader><div className="mb-4"><Tabs activa={tab} onChange={setTab} tabs={[{ id: 'todas', label: 'Todas', contador: items.length }, { id: 'sin-leer', label: 'Sin leer', contador: sinLeer.length }]} /></div>
    {loading ? <div className="panel grid min-h-48 place-items-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-100 border-t-brand-500" /></div> : lista.length === 0 ? <div className="panel"><EmptyState titulo="Todo al día" texto="No tienes notificaciones sin leer." /></div> : <div className="panel divide-y divide-white/60 overflow-hidden">{lista.map((n, i) => { const { icon: Icono, clase } = ICONOS[n.tipo]; return <motion.button key={n.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .05 * i }} onClick={() => marcarLeida(n.id)} className={cn('flex w-full items-start gap-4 px-5 py-4 text-left transition hover:bg-white/60', !n.leida && 'bg-brand-50/50')}><span className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-full', clase)}><Icono size={17} /></span><div className="min-w-0 flex-1"><p className={cn('text-[14.5px] leading-snug', n.leida ? 'texto-suave' : 'font-medium')}>{n.texto}</p><p className="mt-0.5 text-[12px] text-ink-muted">{n.hace}</p></div>{!n.leida && <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-brand-500" />}</motion.button> })}</div>}
    {tab === 'todas' && hasMore && <div className="mt-4 text-center"><Button variant="secondary" size="sm" onClick={() => cargar(offset, true)}>Mostrar más</Button></div>}
  </div>
}
