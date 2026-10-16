import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Bookmark, CalendarClock, MapPin, Send, ShieldCheck, Star, UserRound } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { AnimatedNumber } from '../components/AnimatedNumber'
import { EmptyState } from '@/components/ui/EmptyState'
import { staggerContainer, fadeUp } from '@/lib/motion/variants'
import { Tabs } from '@/components/ui/Tabs'
import { useAuth } from '@/features/auth/AuthContext'
import ProveedorMatchingSolicitudesPage from '@/features/proveedor/solicitante/ProveedorMatchingSolicitudesPage'
import { useLocation } from 'react-router-dom'
import { http } from '@/lib/api/http'
import { ENDPOINTS } from '@/lib/api/endpoints'
import type { ApiProviderCompatibleRequest, ApiProviderOpportunity, ApiSavedRequest } from '@/lib/api/helpwork.types'
import { RequesterProposalModal } from '../components/RequesterProposalModal'
import { SendProposalModal } from '../components/SendProposalModal'
import { TERMINOS } from '@/config/site.config'

const CRITERIOS = [
  { t: 'Tus habilidades', d: 'Lo que pide encaja con los servicios que declaraste.' },
  { t: 'Tu horario', d: 'La fecha y modalidad respetan tu disponibilidad actual.' },
  { t: 'Tu tarifa', d: 'El presupuesto es compatible con tu perfil.' },
  { t: 'Tu reputación', d: 'La puntuación usa el mismo motor real de matching.' },
]
type Tab = 'compatibles' | 'guardadas' | 'mis-solicitudes'
const limit = (value?: string | null) => value ? new Intl.DateTimeFormat('es-EC', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Guayaquil' }).format(new Date(value)) : 'Sin fecha límite'
const opportunityFrom = (item: ApiProviderCompatibleRequest): ApiProviderOpportunity => ({ id: `compatible-${item.request_id}`, request_id: item.request_id, status: 'shown', rank_position: item.rank_position, created_at: '', matching: item.matching, requester: item.requester, service_requests: item.service_request })
const fromSaved = (item: ApiSavedRequest): ApiProviderCompatibleRequest => ({ rank_position: 0, request_id: item.request_id, proposal_status: item.proposal_status, matching: {}, requester: item.requester, service_request: item.service_requests })

/** Matching real proveedor → solicitudes asignadas y ordenadas por compatibilidad. */
export default function WorkerMatchingPage() {
  const { usuario } = useAuth()
  const dobleRol = usuario?.roles.includes('solicitante') ?? false
  const { state } = useLocation() as { state?: { tab?: Tab } }
  const [tab, setTab] = useState<Tab>(state?.tab ?? 'compatibles')
  const [items, setItems] = useState<ApiProviderCompatibleRequest[]>([])
  const [saved, setSaved] = useState<ApiSavedRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<ApiProviderCompatibleRequest | null>(null)
  const [proposalTarget, setProposalTarget] = useState<ApiProviderCompatibleRequest | null>(null)
  const cargar = useCallback(async () => {
    try {
      const [compatible, savedItems] = await Promise.all([http.get<ApiProviderCompatibleRequest[]>(ENDPOINTS.matching.providerCompatibleRequests), http.get<ApiSavedRequest[]>(ENDPOINTS.propuestas.saved)])
      setItems(compatible); setSaved(savedItems)
    } finally { setLoading(false) }
  }, [])
  useEffect(() => { cargar().catch(() => undefined) }, [cargar])
  const savedIds = useMemo(() => new Set(saved.map(item => item.request_id)), [saved])
  const toggleSaved = async (item: ApiProviderCompatibleRequest) => {
    if (savedIds.has(item.request_id)) await http.del(ENDPOINTS.propuestas.save(item.request_id))
    else await http.post(ENDPOINTS.propuestas.save(item.request_id))
    await cargar()
  }
  const current = tab === 'guardadas' ? saved.map(fromSaved) : items
  const tabItems = [{ id: 'compatibles', label: 'Solicitudes compatibles', contador: items.length }, { id: 'guardadas', label: 'Solicitudes guardadas', contador: saved.length }, ...(dobleRol ? [{ id: 'mis-solicitudes', label: 'Mis solicitudes' }] : [])]
  return <div>
    <PageHeader titulo="Matching inteligente" descripcion={`Solicitudes de ${TERMINOS.solicitante.plural} que encajan con tu perfil.`} />
    <div className="mb-5"><Tabs idLayout="matching-helpworker" activa={tab} onChange={id => setTab(id as Tab)} tabs={tabItems} /></div>
    {tab === 'mis-solicitudes' ? <ProveedorMatchingSolicitudesPage /> : <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
      <motion.div variants={staggerContainer(.1)} initial="hidden" animate="show" className="space-y-4">
        {loading ? <div className="panel grid min-h-48 place-items-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-100 border-t-brand-500" /></div> : !current.length ? <div className="panel"><EmptyState titulo={tab === 'guardadas' ? 'No tienes solicitudes guardadas' : 'No hay solicitudes compatibles'} texto={tab === 'guardadas' ? 'Guarda una solicitud desde Matching para revisarla después.' : 'Cuando el algoritmo encuentre una coincidencia real, aparecerá aquí.'} /></div> : <><p className="text-[14px] font-semibold">{current.length} solicitudes <span className="font-normal texto-suave">compatibles con tu perfil</span></p>{current.map((item, index) => <RequestCard key={item.request_id} item={item} index={index} saved={savedIds.has(item.request_id)} onSave={() => toggleSaved(item).catch(() => undefined)} onDetails={() => setSelected(item)} onProposal={() => setProposalTarget(item)} />)}</>}
      </motion.div>
      <motion.aside variants={fadeUp} initial="hidden" animate="show" className="panel h-fit p-5"><h2 className="text-[16.5px] font-bold">¿Por qué te aparecen estas?</h2><ul className="mt-4 space-y-4">{CRITERIOS.map(c => <li key={c.t} className="flex gap-3"><span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600"><ShieldCheck size={15} /></span><div><p className="text-[14px] font-bold">{c.t}</p><p className="text-[13px] leading-snug texto-suave">{c.d}</p></div></li>)}</ul><p className="mt-4 border-t border-white/60 pt-4 text-[12.5px] texto-suave">Las tarjetas se ordenan por compatibilidad. El plan podrá cambiar este límite más adelante.</p></motion.aside>
    </div>}
    <RequesterProposalModal item={selected ? opportunityFrom(selected) : null} onClose={() => setSelected(null)} />
    <SendProposalModal item={proposalTarget} onClose={() => setProposalTarget(null)} onSent={() => cargar().catch(() => undefined)} />
  </div>
}

function RequestCard({ item, index, saved, onSave, onDetails, onProposal }: { item: ApiProviderCompatibleRequest; index: number; saved: boolean; onSave: () => void; onDetails: () => void; onProposal: () => void }) {
  const request = item.service_request
  const score = Number(item.matching.distribution_score ?? item.matching.reciprocal_score ?? 0)
  const budget = request?.budget_min != null && request?.budget_max != null ? `$${request.budget_min} – $${request.budget_max}` : 'Por definir'
  const title = request?.description_free?.slice(0, 78) || `Solicitud de ${request?.service_type_code ?? 'servicio'}`
  const blockedByProposal = item.proposal_status === 'pending' || item.proposal_status === 'accepted'
  const proposalLabel = item.proposal_status === 'accepted' ? 'Propuesta aceptada' : item.proposal_status === 'pending' ? 'Propuesta enviada' : 'Enviar propuesta'
  return <motion.article variants={fadeUp} className="panel panel-hover p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div className="flex min-w-0 items-center gap-3">{item.requester?.avatar_url ? <img src={item.requester.avatar_url} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover" /> : <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600"><UserRound size={20} /></span>}<div className="min-w-0"><div className="mb-1 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10.5px] font-bold text-amber-700"><Star size={11} fill="currentColor" /> TOP {item.rank_position || index + 1}</div><h3 className="truncate text-[17px] font-bold leading-tight" title={request?.description_free ?? undefined}>{title}</h3><p className="text-[13px] texto-suave">{item.requester?.full_name || 'HelpSeeker'} · <span className="text-brand-600">HelpSeeker</span></p></div></div><div className="shrink-0 text-right"><p className="text-[26px] font-extrabold leading-none text-success-500">{score ? <AnimatedNumber valor={score} decimales={1} sufijo="%" duracion={900 + index * 130} /> : '—'}</p><p className="text-[11.5px] texto-suave">compatibilidad real</p></div></div>{score > 0 && <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-black/[.07]"><motion.div className="h-full rounded-full bg-success-500" initial={{ width: 0 }} whileInView={{ width: `${score}%` }} viewport={{ once: true }} transition={{ duration: 1, ease: 'easeOut', delay: .2 }} /></div>}<p className="mt-3.5 line-clamp-2 text-[14px] leading-relaxed text-ink-soft">{request?.description_free || 'Sin descripción adicional.'}</p><div className="mt-3.5 flex flex-wrap gap-x-5 gap-y-2 text-[12.5px] texto-suave"><span className="inline-flex items-center gap-1.5"><MapPin size={13} className="text-brand-500" />{request?.modality ?? '—'} · {request?.city ?? 'Sin ciudad'}</span><span className="inline-flex items-center gap-1.5">${budget}</span><span className="inline-flex items-center gap-1.5"><CalendarClock size={13} className="text-brand-500" />Límite: {limit(request?.expires_at)}</span>{score > 90 && <Badge tone="amber">Alta compatibilidad</Badge>}</div><div className="mt-4 flex flex-wrap gap-2 border-t border-white/60 pt-4"><Button size="sm" onClick={onProposal} disabled={blockedByProposal} title={blockedByProposal ? 'No puedes enviar otra propuesta hasta que esta sea rechazada.' : undefined}><Send size={14} /> {proposalLabel}</Button><Button size="sm" variant="secondary" onClick={onSave}><Bookmark size={14} fill={saved ? 'currentColor' : 'none'} />{saved ? 'Guardada' : 'Guardar'}</Button><Button size="sm" variant="ghost" onClick={onDetails}>Ver detalle</Button></div></motion.article>
}
