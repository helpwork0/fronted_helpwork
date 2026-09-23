import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarClock, MapPin, Search, Send, UserRound } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Tabs } from '@/components/ui/Tabs'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { AnimatedNumber } from '../components/AnimatedNumber'
import { staggerContainer, fadeUp } from '@/lib/motion/variants'
import { useAuth } from '@/features/auth/AuthContext'
import { http } from '@/lib/api/http'
import { ENDPOINTS } from '@/lib/api/endpoints'
import type { ApiProviderOpportunity } from '@/lib/api/helpwork.types'

const estadosActivos = new Set(['assigned', 'shown', 'opened', 'contacted'])
const textoEstado: Record<string, string> = { assigned: 'Nueva', shown: 'Nueva', opened: 'Abierta', contacted: 'Contactada', accepted: 'Aceptada', rejected: 'Rechazada', expired: 'Vencida' }
const estaVencida = (item: ApiProviderOpportunity) => item.service_requests?.status === 'expired' || Boolean(item.service_requests?.expires_at && new Date(item.service_requests.expires_at).getTime() <= Date.now())
const limite = (value?: string | null) => value ? new Intl.DateTimeFormat('es-EC', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Guayaquil' }).format(new Date(value)) : 'Sin fecha límite'

/** Bandeja real del HelpWorker: son asignaciones que produjo el motor, no solicitudes mock. */
export default function OpportunitiesPage() {
  const { usuario } = useAuth()
  const [items, setItems] = useState<ApiProviderOpportunity[]>([])
  const [tab, setTab] = useState('activas')
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)

  const cargar = () => {
    if (!usuario) return
    setLoading(true)
    http.get<ApiProviderOpportunity[]>(ENDPOINTS.recomendaciones.proveedor(usuario.id)).then(setItems).finally(() => setLoading(false))
  }
  useEffect(cargar, [usuario?.id])
  const esActiva = (item: ApiProviderOpportunity) => estadosActivos.has(item.status) && !estaVencida(item)
  const base = tab === 'activas' ? items.filter(esActiva) : tab === 'cerradas' ? items.filter(item => !esActiva(item)) : items
  const lista = useMemo(() => base.filter(item => `${item.requester?.full_name} ${item.service_requests?.description_free} ${item.service_requests?.field_code} ${item.service_requests?.service_type_code}`.toLowerCase().includes(q.toLowerCase())), [base, q])
  const avanzar = async (item: ApiProviderOpportunity) => {
    // Consultar una oportunidad no debe marcarla como “vista”; el primer cambio útil es abrirla.
    const siguiente = item.status === 'assigned' || item.status === 'shown' ? 'opened' : 'contacted'
    await http.patch(ENDPOINTS.recomendaciones.estado(item.id), { status: siguiente })
    cargar()
  }

  return <div>
    <PageHeader titulo="Oportunidades" descripcion="Solicitudes que el matching te asignó según tu perfil y disponibilidad." />
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Tabs activa={tab} onChange={setTab} tabs={[{ id: 'activas', label: 'Activas', contador: items.filter(esActiva).length }, { id: 'cerradas', label: 'Cerradas', contador: items.filter(item => !esActiva(item)).length }, { id: 'todas', label: 'Todas', contador: items.length }]} />
      <div className="flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-4 py-2 backdrop-blur-xl sm:w-72"><Search size={15} className="text-ink-muted" /><input value={q} onChange={event => setQ(event.target.value)} placeholder="Buscar oportunidad" className="min-w-0 flex-1 bg-transparent text-[14px] outline-none" /></div>
    </div>
    {loading ? <div className="panel grid min-h-48 place-items-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-100 border-t-brand-500" /></div> : !lista.length ? <div className="panel"><EmptyState titulo="No hay oportunidades" texto="Cuando el matching te asigne una solicitud compatible, aparecerá aquí." /></div> : <motion.div variants={staggerContainer(.07)} initial="hidden" animate="show" className="max-h-[calc(100vh-250px)] space-y-3 overflow-y-auto pr-2">{lista.map(item => {
      const solicitud = item.service_requests
      const vencida = estaVencida(item)
      const presupuesto = solicitud?.budget_min != null && solicitud?.budget_max != null ? `$${solicitud.budget_min} – $${solicitud.budget_max}` : 'Presupuesto por definir'
      return <motion.article key={item.id} variants={fadeUp} className="panel panel-hover grid min-w-0 gap-4 p-5 sm:grid-cols-[56px_minmax(0,1fr)_auto_auto_auto] sm:items-center">
        {item.requester?.avatar_url ? <img src={item.requester.avatar_url} alt="" className="h-14 w-14 shrink-0 rounded-2xl object-cover" /> : <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600"><UserRound size={22} /></span>}
        <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="truncate text-[16px] font-bold" title={solicitud?.description_free ?? undefined}>{solicitud?.description_free || `Solicitud de ${solicitud?.service_type_code ?? 'servicio'}`}</h3><Badge tone={esActiva(item) ? 'brand' : 'neutral'}>{vencida ? 'Vencida' : textoEstado[item.status] ?? item.status}</Badge></div><p className="mt-1 text-[12.5px] font-medium text-brand-600">{item.requester?.full_name ?? 'HelpSeeker'}</p><div className="mt-1 flex flex-wrap gap-x-5 gap-y-1 text-[12.5px] texto-suave"><span className="inline-flex items-center gap-1"><MapPin size={12} /> {solicitud?.modality ?? '—'} · {solicitud?.city ?? 'Sin ciudad'}</span><span className="inline-flex items-center gap-1"><CalendarClock size={12} /> Límite: {limite(solicitud?.expires_at)}</span></div></div>
        <p className="shrink-0 text-[15px] font-bold">{presupuesto}</p>
        <div className="shrink-0 text-center"><p className="text-[17px] font-extrabold text-success-500"><AnimatedNumber valor={Number(item.matching?.distribution_score ?? item.matching?.reciprocal_score ?? 0)} decimales={1} sufijo="%" /></p><p className="text-[11px] text-ink-muted">match real</p></div>
        {esActiva(item) && <Button size="sm" className="justify-self-start sm:justify-self-end" onClick={() => avanzar(item)}><Send size={14} /> {item.status === 'contacted' ? 'Contactar' : 'Abrir oportunidad'}</Button>}
      </motion.article>
    })}</motion.div>}
  </div>
}
