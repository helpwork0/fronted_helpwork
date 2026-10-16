import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, CircleDollarSign, Monitor, ShieldCheck, Headphones, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { MatchCard } from '../components/MatchCard'
import { staggerContainer, fadeUp } from '@/lib/motion/variants'
import { ROUTES, TERMINOS } from '@/config/site.config'
import { useAutoTour } from '@/components/onboarding/useAutoTour'
import { http } from '@/lib/api/http'
import { ENDPOINTS } from '@/lib/api/endpoints'
import { type ApiRecommendation, type ApiRequest, type ApiRankingCandidate, rankingFromApi } from '@/lib/api/helpwork.types'
import type { MatchCandidate } from '@/types'
import { ProviderProfileModal } from '../components/ProviderProfileModal'

const CRITERIOS = [
  { titulo: 'Habilidades',    texto: 'Tienen experiencia en los temas y el nivel que necesitas.' },
  { titulo: 'Disponibilidad', texto: 'Sus horarios se ajustan a lo que pediste.' },
  { titulo: 'Reputación',     texto: 'Están bien calificados por otros HelpSeekers.' },
  { titulo: 'Modalidad',      texto: 'Trabajan en línea, como prefieres.' },
  { titulo: 'Presupuesto',    texto: 'Sus tarifas entran en tu rango estimado.' },
]

/**
 * Matching del HelpSeeker: personas recomendadas para una solicitud.
 *
 * DISPOSICIÓN: dos columnas, no tres. El contexto (qué pediste y por qué
 * te aparecen estos) va junto a la izquierda; los resultados ocupan todo
 * el resto. Con tres columnas la lista quedaba en unos 600 px y las
 * tarjetas no respiraban.
 */
export default function MatchingPage({ embedded = false, volverA = ROUTES.solicitudes }: { embedded?: boolean; volverA?: string }) {
  useAutoTour('matching')
  const { state } = useLocation() as { state?: { requestId?: string } }
  const navigate = useNavigate()
  const [request, setRequest] = useState<ApiRequest | null>(null)
  const [candidates, setCandidates] = useState<MatchCandidate[]>([])
  const [loading, setLoading] = useState(true)
  const [profileProviderId, setProfileProviderId] = useState<string | null>(null)
  useEffect(() => {
    let active = true
    const startedAt = Date.now()
    setLoading(true)
    const cargar = async () => {
      try {
        const requests = await http.get<ApiRequest[]>(ENDPOINTS.solicitudes.list)
        const selected = requests.find(item => item.id === state?.requestId) ?? requests.find(item => item.status === 'active') ?? requests[0]
        if (!selected) return
        // Abrir Matching nunca cambia el estado: solo consulta las recomendaciones ya calculadas.
        if (!active) return
        setRequest(selected)
        if (selected.status !== 'active') { setCandidates([]); return }
        const [ranking, stored] = await Promise.all([
          http.get<ApiRankingCandidate[]>(ENDPOINTS.recomendaciones.ranking(selected.id)),
          http.get<ApiRecommendation[]>(ENDPOINTS.recomendaciones.solicitud(selected.id)),
        ])
        if (!active) return
        setCandidates(ranking.map(rankingFromApi))
        await Promise.all(stored.filter(item => item.status === 'assigned').map(item => http.patch(ENDPOINTS.recomendaciones.estado(item.id), { status: 'shown' })))
      } catch { if (active) setCandidates([]) } finally {
        const remaining = Math.max(0, 3000 - (Date.now() - startedAt))
        window.setTimeout(() => { if (active) setLoading(false) }, remaining)
      }
    }
    cargar()
    return () => { active = false }
  }, [state?.requestId])
  const presupuesto = useMemo(() => request?.budget_min != null && request?.budget_max != null ? `$${request.budget_min} – $${request.budget_max}` : 'Por definir', [request])
  const bloquear = async (providerId: string) => {
    if (!window.confirm('¿Bloquear a este HelpWorker? Dejará de aparecer en tus recomendaciones.')) return
    await http.post(ENDPOINTS.moderacion.bloquear, { blockedId: providerId, reason: 'Bloqueado desde resultados de matching' })
    setCandidates(actuales => actuales.filter(candidate => candidate.id !== providerId))
  }
  const reportar = async (providerId: string) => {
    const description = window.prompt('Describe brevemente el motivo del reporte.')
    if (!description?.trim()) return
    await http.post(ENDPOINTS.moderacion.incidencia, { targetUserId: providerId, category: 'conducta', description: description.trim() })
    window.alert('Reporte enviado para revisión.')
  }

  return (
    <div className="pb-24">
      {!embedded && <Link
        to={volverA}
        className="mb-4 inline-flex items-center gap-2 text-[14px] font-medium texto-suave transition hover:text-brand-600"
      >
        <ArrowLeft size={16} /> Volver a mis solicitudes
      </Link>}

      {/* --- Título --- */}
      <motion.header
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
        className="mb-5"
      >
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-600 text-white">
            <Sparkles size={22} />
          </span>
          <div>
            <h1 className="text-[28px] font-extrabold leading-tight">Matching inteligente</h1>
            <p className="text-[14.5px] texto-suave">
              Los mejores {TERMINOS.helpworker.plural} para tu solicitud.
            </p>
          </div>
        </div>
      </motion.header>

      <div className="grid gap-5 lg:grid-cols-[300px_1fr]">

        {/* ================= Columna de contexto ================= */}
        <motion.aside
          variants={staggerContainer(0.08)} initial="hidden" animate="show"
          className="space-y-4 lg:sticky lg:top-20 lg:self-start"
        >
          {/* Solicitud */}
          <motion.section variants={fadeUp} data-tour="match-solicitud" className="panel p-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-[15.5px] font-bold">Solicitud seleccionada</h2>
              <Badge tone={request?.status === 'active' ? 'success' : 'neutral'}>{request?.status === 'active' ? 'Activa' : request?.status === 'expired' ? 'Vencida' : 'Cerrada'}</Badge>
            </div>

            <p title={request?.description_free ?? undefined} className="max-h-[2.8rem] overflow-hidden break-words text-[15px] font-bold leading-snug">{request?.description_free?.slice(0, 110) || request?.field_code || 'Solicitud seleccionada'}</p>

            <dl className="mt-3.5 space-y-2.5 text-[13px]">
              <Dato icon={Monitor} label="Modalidad" valor={request?.modality ?? '—'} />
              <Dato icon={CircleDollarSign} label="Presupuesto" valor={presupuesto} />
              <Dato icon={Calendar} label="Fecha requerida" valor={request?.needed_at ? new Date(request.needed_at).toLocaleDateString('es-EC') : 'Flexible'} />
            </dl>

            <p title={request?.description_free ?? undefined} className="mt-3.5 max-h-[5.3rem] overflow-hidden break-words border-t border-white/60 pt-3.5 text-[13px] leading-relaxed texto-suave">
              {request?.description_free || 'Selecciona una solicitud para conocer sus recomendaciones.'}
            </p>

            <Button variant="ghost" size="sm" className="mt-3" to={volverA}>
              Editar solicitud
            </Button>
          </motion.section>

          {/* Por qué estos */}
          <motion.section variants={fadeUp} data-tour="match-criterios" className="panel p-5">
            <h2 className="text-[15.5px] font-bold">¿Por qué te aparecen estos?</h2>
            <ul className="mt-3.5 space-y-3">
              {CRITERIOS.map(c => (
                <li key={c.titulo} className="flex gap-2.5">
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
                    <ShieldCheck size={13} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13.5px] font-bold">{c.titulo}</p>
                    <p className="text-[12.5px] leading-snug texto-suave">{c.texto}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.section>

          <motion.div variants={fadeUp}>
            <Button variant="secondary" fullWidth size="sm">
              <Headphones size={15} /> Hablar con un asesor
            </Button>
          </motion.div>
        </motion.aside>

        {/* ================= Resultados ================= */}
        <section>
          <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2">
            <p className="text-[14.5px] font-semibold">
              {candidates.length} {TERMINOS.helpworker.plural}
              <span className="font-normal texto-suave"> altamente compatibles</span>
            </p>
            <p className="text-[12.5px] texto-suave">Ordenados por compatibilidad</p>
          </div>

          {loading ? <MatchingThinking /> : <motion.div
            variants={staggerContainer(0.1)} initial="hidden" animate="show"
            data-tour="match-lista" className="grid gap-4 2xl:grid-cols-2"
          >
            {candidates.map(c => <MatchCard key={c.id} c={c} onBlock={id => bloquear(id).catch(() => undefined)} onReport={id => reportar(id).catch(() => undefined)} onProfile={setProfileProviderId} onContact={() => navigate(embedded ? ROUTES.mensajes : ROUTES.mensajesSolicitante)} />)}
          </motion.div>}

          <p className="mt-5 flex items-center justify-center gap-2 text-[12.5px] texto-suave">
            <ShieldCheck size={14} className="shrink-0 text-success-500" />
            Todos pasan por un proceso de verificación de identidad.
          </p>
        </section>
      </div>
      <ProviderProfileModal providerId={profileProviderId} onClose={() => setProfileProviderId(null)} onFavoriteChange={async isFavorite => { if (!profileProviderId) return; if (isFavorite) await http.post(ENDPOINTS.usuarios.favoritoProveedor(profileProviderId)); else await http.del(ENDPOINTS.usuarios.favoritoProveedor(profileProviderId)); }} />
    </div>
  )
}

function MatchingThinking() {
  return <motion.div initial={{ opacity: 0, scale: .98 }} animate={{ opacity: 1, scale: 1 }} className="panel grid min-h-[300px] place-items-center overflow-hidden p-8 text-center"><div><div className="relative mx-auto h-20 w-20"><motion.span animate={{ rotate: 360 }} transition={{ duration: 7, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 rounded-full border border-brand-200/80 border-t-brand-500" />{[0, 1, 2].map(index => <motion.span key={index} animate={{ opacity: [0.25, 1, .25], scale: [.7, 1.25, .7], y: [0, -4, 0] }} transition={{ duration: 1.35, repeat: Infinity, delay: index * .22 }} className="absolute text-brand-500" style={{ left: `${20 + index * 21}px`, top: `${21 + (index === 1 ? -7 : 6)}px` }}><Sparkles size={index === 1 ? 27 : 17} fill="currentColor" /></motion.span>)}</div><h3 className="mt-6 text-[18px] font-bold">La IA está buscando HelpWorkers compatibles</h3><p className="mt-2 max-w-sm text-[13.5px] leading-relaxed texto-suave">Por favor espera mientras analiza habilidades, disponibilidad, reputación, modalidad y presupuesto.</p><div className="mt-5 flex justify-center gap-1.5">{[0, 1, 2].map(index => <motion.span key={index} animate={{ y: [0, -5, 0], opacity: [.35, 1, .35] }} transition={{ duration: .9, repeat: Infinity, delay: index * .16 }} className="h-2 w-2 rounded-full bg-brand-500" />)}</div></div></motion.div>
}

function Dato({ icon: Icon, label, valor }: { icon: typeof Monitor; label: string; valor: string }) {
  return (
    <div className="flex gap-2.5">
      <Icon size={14} className="mt-0.5 shrink-0 text-brand-500" />
      <div className="min-w-0">
        <dt className="text-[11.5px] text-ink-muted">{label}</dt>
        <dd className="font-semibold">{valor}</dd>
      </div>
    </div>
  )
}
