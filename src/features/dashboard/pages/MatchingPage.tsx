import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, CircleDollarSign, Monitor, ShieldCheck, Headphones, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
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
  const [request, setRequest] = useState<ApiRequest | null>(null)
  const [candidates, setCandidates] = useState<MatchCandidate[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    http.get<ApiRequest[]>(ENDPOINTS.solicitudes.list).then(async requests => {
      const selected = requests.find(item => item.id === state?.requestId) ?? requests.find(item => item.status === 'active') ?? requests[0]
      if (!selected) return
      // Abrir Matching nunca cambia el estado: solo consulta las recomendaciones ya calculadas.
      setRequest(selected)
      if (selected.status !== 'active') { setCandidates([]); return }
      const ranking = await http.get<ApiRankingCandidate[]>(ENDPOINTS.recomendaciones.ranking(selected.id))
      const stored = await http.get<ApiRecommendation[]>(ENDPOINTS.recomendaciones.solicitud(selected.id))
      setCandidates(ranking.map(rankingFromApi))
      await Promise.all(stored.filter(item => item.status === 'assigned').map(item => http.patch(ENDPOINTS.recomendaciones.estado(item.id), { status: 'shown' })))
    }).catch(() => setCandidates([])).finally(() => setLoading(false))
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

          {loading ? <div className="panel grid min-h-48 place-items-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-100 border-t-brand-500" /></div> : <motion.div
            variants={staggerContainer(0.1)} initial="hidden" animate="show"
            data-tour="match-lista" className="grid gap-4 2xl:grid-cols-2"
          >
            {candidates.map(c => <MatchCard key={c.id} c={c} onBlock={id => bloquear(id).catch(() => undefined)} onReport={id => reportar(id).catch(() => undefined)} />)}
          </motion.div>}

          <p className="mt-5 flex items-center justify-center gap-2 text-[12.5px] texto-suave">
            <ShieldCheck size={14} className="shrink-0 text-success-500" />
            Todos pasan por un proceso de verificación de identidad.
          </p>
        </section>
      </div>
    </div>
  )
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
