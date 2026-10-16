import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lightbulb, MessageSquare, UserRound, X } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Tabs } from '@/components/ui/Tabs'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { http } from '@/lib/api/http'
import { ENDPOINTS } from '@/lib/api/endpoints'
import type { ApiProposal } from '@/lib/api/helpwork.types'
import { staggerContainer, fadeUp } from '@/lib/motion/variants'
import { ROUTES } from '@/config/site.config'

const ETIQUETAS = {
  pending: { txt: 'Pendiente', clase: 'bg-amber-100 text-amber-600' },
  accepted: { txt: 'Aceptada', clase: 'bg-success-100 text-success-600' },
  rejected: { txt: 'Rechazada', clase: 'bg-red-50 text-red-600' },
}

type Tab = 'pending' | 'accepted' | 'rejected' | 'all'
const relative = (date: string) => new Intl.RelativeTimeFormat('es', { numeric: 'auto' }).format(Math.round((new Date(date).getTime() - Date.now()) / 86400000), 'day')

/** Propuestas reales recibidas por el dueño de las solicitudes. */
export default function ProposalsPage() {
  const [tab, setTab] = useState<Tab>('pending')
  const [items, setItems] = useState<ApiProposal[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const navigate = useNavigate(); const { pathname } = useLocation()
  const cargar = useCallback(async () => {
    try { setItems(await http.get<ApiProposal[]>(ENDPOINTS.propuestas.mine)) } finally { setLoading(false) }
  }, [])
  useEffect(() => {
    cargar().catch(() => undefined)
    const interval = window.setInterval(() => cargar().catch(() => undefined), 12000)
    const refresh = () => cargar().catch(() => undefined)
    window.addEventListener('helpwork:propuestas-actualizadas', refresh)
    return () => { window.clearInterval(interval); window.removeEventListener('helpwork:propuestas-actualizadas', refresh) }
  }, [cargar])
  const lista = useMemo(() => tab === 'all' ? items : items.filter(item => item.status === tab), [items, tab])
  const responder = async (proposal: ApiProposal, status: 'accepted' | 'rejected') => {
    setUpdating(proposal.id)
    try {
      const updated = await http.patch<ApiProposal>(status === 'accepted' ? ENDPOINTS.propuestas.accept(proposal.id) : ENDPOINTS.propuestas.reject(proposal.id))
      setItems(current => current.map(item => item.id === proposal.id ? { ...item, ...updated } : item))
      window.dispatchEvent(new Event('helpwork:propuestas-actualizadas'))
      window.dispatchEvent(new Event('helpwork:notificaciones-actualizadas'))
      if (status === 'accepted' && updated.conversation_id) {
        const target = pathname.startsWith('/app/helpworker/') ? ROUTES.mensajes : ROUTES.mensajesSolicitante
        navigate(target, { state: { conversationId: updated.conversation_id } })
      }
    } finally { setUpdating(null) }
  }
  const count = (status?: ApiProposal['status']) => status ? items.filter(item => item.status === status).length : items.length
  return <div>
    <PageHeader titulo="Propuestas recibidas" descripcion="Compara las ofertas reales y elige a quién contratar." />
    <div className="mb-4"><Tabs activa={tab} onChange={id => setTab(id as Tab)} tabs={[{ id: 'pending', label: 'Pendientes', contador: count('pending') }, { id: 'accepted', label: 'Aceptadas', contador: count('accepted') }, { id: 'rejected', label: 'Rechazadas', contador: count('rejected') }, { id: 'all', label: 'Todas', contador: count() }]} /></div>
    {loading ? <div className="panel grid min-h-48 place-items-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-100 border-t-brand-500" /></div> : !lista.length ? <div className="panel"><EmptyState titulo="Sin propuestas aquí" texto="Cuando un HelpWorker responda a una de tus solicitudes, aparecerá aquí." /></div> : <motion.div variants={staggerContainer(.07)} initial="hidden" animate="show" className="grid gap-3">{lista.map(proposal => {
      const provider = proposal.provider_profiles
      const profile = proposal.users
      const status = ETIQUETAS[proposal.status]
      return <motion.article key={proposal.id} variants={fadeUp} className="panel panel-hover p-5"><div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        {profile?.avatar_url ? <img src={profile.avatar_url} alt="" className="h-14 w-14 shrink-0 rounded-full object-cover" /> : <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600"><UserRound size={23} /></span>}
        <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="truncate text-[16.5px] font-bold">{provider?.display_name || profile?.full_name || 'HelpWorker'}</h3><span className={`rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold ${status.clase}`}>{status.txt}</span></div><p className="text-[13px] texto-suave">{provider?.city || 'HelpWorker'} · {Number(provider?.review_count ?? 0) ? <><Lightbulb size={11} className="inline text-brand-500" fill="currentColor" /> {Number(provider?.average_rating ?? 0).toFixed(1)} · {provider?.review_count} reseñas</> : 'Sin valoraciones todavía'}</p><p className="mt-2.5 whitespace-pre-wrap text-[14px] leading-relaxed text-ink-soft">{proposal.description || 'El HelpWorker no añadió una descripción.'}</p><p className="mt-2 text-[12.5px] text-ink-muted">Para <span className="font-semibold text-brand-600">{proposal.service_requests?.description_free?.slice(0, 80) || `Solicitud de ${proposal.service_requests?.service_type_code ?? 'servicio'}`}</span> · {relative(proposal.created_at)}</p></div>
        <div className="flex shrink-0 flex-col items-end gap-3"><p className="text-[20px] font-extrabold">${Number(proposal.amount).toFixed(2)}<span className="text-[13px] font-normal text-ink-muted"> / servicio</span></p>{proposal.status === 'pending' ? <div className="flex gap-2"><Button size="sm" variant="ghost" disabled={updating === proposal.id} className="text-red-600 hover:bg-red-50" onClick={() => responder(proposal, 'rejected').catch(() => undefined)}><X size={14} /></Button><Button size="sm" variant="success" disabled={updating === proposal.id} onClick={() => responder(proposal, 'accepted').catch(() => undefined)}>{updating === proposal.id ? 'Guardando…' : <><MessageSquare size={14} /> Aceptar chat</>}</Button></div> : proposal.conversation_id ? <Button size="sm" variant="secondary" onClick={() => navigate(pathname.startsWith('/app/helpworker/') ? ROUTES.mensajes : ROUTES.mensajesSolicitante, { state: { conversationId: proposal.conversation_id } })}><MessageSquare size={14} /> Ver conversación</Button> : null}</div>
      </div></motion.article>
    })}</motion.div>}
  </div>
}
