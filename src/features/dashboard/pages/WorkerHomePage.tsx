import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Briefcase, ShieldCheck, DollarSign, Star, MapPin, Clock,
  TrendingUp, Users, Calendar, ArrowRight, Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { AnimatedNumber } from '../components/AnimatedNumber'
import { ProgressRing } from '../components/ProgressRing'
import { Mascot } from '@/components/mascot/Mascot'
import { EVENTOS, RESENAS } from '@/data/appData'
import { PresenceList } from '../components/PresenceList'
import { TERMINOS } from '@/config/site.config'
import { useAuth } from '@/features/auth/AuthContext'
import { useMessages } from '@/features/messages/MessagesContext'
import { staggerContainer, fadeUp } from '@/lib/motion/variants'
import { useAutoTour } from '@/components/onboarding/useAutoTour'
import { ROUTES } from '@/config/site.config'
import { cn } from '@/lib/cn'
import { http } from '@/lib/api/http'
import { ENDPOINTS } from '@/lib/api/endpoints'
import type { ApiProviderCompatibleRequest, ApiProviderJob } from '@/lib/api/helpwork.types'
import { CmsAnnouncements } from '../components/CmsAnnouncements'

function truncarRecomendacion(texto: string, maximo = 60) {
  const limpio = texto.trim()
  return limpio.length > maximo ? `${limpio.slice(0, maximo).trimEnd()}…` : limpio
}

/** Panel del HelpWorker, con la misma estética de cristal que el del solicitante. */
export default function WorkerHomePage() {
  useAutoTour('helpworker')
  const { usuario } = useAuth()
  const { abrirChat } = useMessages()

  const hora = new Date().getHours()
  const saludo = hora < 12 ? 'Buenos días' : hora < 19 ? 'Buenas tardes' : 'Buenas noches'
  const nombre = usuario?.nombre.split(' ')[0] ?? 'Joaquín'
  const [oportunidades, setOportunidades] = useState<ApiProviderCompatibleRequest[]>([])
  const [trabajos, setTrabajos] = useState<ApiProviderJob[]>([])
  const [cargandoDatos, setCargandoDatos] = useState(true)

  useEffect(() => {
    let activo = true
    Promise.all([
      http.get<ApiProviderCompatibleRequest[]>(ENDPOINTS.matching.providerCompatibleRequests),
      http.get<ApiProviderJob[]>(ENDPOINTS.propuestas.jobs),
    ]).then(([compatibles, jobs]) => {
      if (!activo) return
      setOportunidades(compatibles)
      setTrabajos(jobs)
    }).catch(() => { if (activo) { setOportunidades([]); setTrabajos([]) } }).finally(() => { if (activo) setCargandoDatos(false) })
    return () => { activo = false }
  }, [])

  return (
    <motion.div variants={staggerContainer(0.07)} initial="hidden" animate="show" className="space-y-5">

      {/* ---------- Saludo ---------- */}
      <motion.section variants={fadeUp} className="panel flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-brand-500">{saludo}</p>
          <h1 className="mt-1 text-[30px] font-extrabold leading-tight">Hola, {nombre} 👋</h1>
          <p className="mt-1 text-[15px] texto-suave">Tienes oportunidades increíbles hoy</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 rounded-full border border-white/80 bg-white/70 px-4 py-2.5">
            <span className="relative h-6 w-11 shrink-0 rounded-full bg-success-500">
              <span className="absolute right-0.5 top-0.5 h-5 w-5 rounded-full bg-white" />
            </span>
            <div>
              <p className="text-[13.5px] font-semibold leading-tight text-success-500">Disponible</p>
              <p className="text-[11.5px] texto-suave">Recibiendo oportunidades</p>
            </div>
          </div>
          <Button to={ROUTES.oportunidades}><Zap size={16} /> Ver oportunidades</Button>
        </div>
      </motion.section>

      <motion.div variants={fadeUp}><CmsAnnouncements /></motion.div>

      {/* ---------- Métricas ---------- */}
      <motion.section variants={staggerContainer(0.06)} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metrica icon={Briefcase}   label="Solicitudes compatibles" valor={oportunidades.length} tono="brand" />
        <Metrica icon={ShieldCheck} label="Trabajos activos" valor={trabajos.filter(job => !['delivered', 'paid'].includes(job.status)).length} tono="success" />
        <Metrica icon={DollarSign}  label="Trabajos aceptados" valor={trabajos.length} tono="violet" />
        <Metrica icon={Star}        label="En conversación" valor={trabajos.filter(job => job.status === 'in_conversation').length} tono="amber" />
      </motion.section>

      <div className="grid gap-5 xl:grid-cols-[1.3fr_1fr]">
        {/* ---------- Oportunidades ---------- */}
        <motion.section variants={fadeUp} data-tour="hw-oportunidades" className="panel p-5">
          <header className="mb-4 flex items-center justify-between">
            <h2 className="text-[18px] font-bold">Recomendadas para ti</h2>
            <Button variant="ghost" size="sm" to={ROUTES.oportunidades}>Ver todas</Button>
          </header>

          <div className="space-y-2.5">
            {oportunidades.map((o, i) => (
              <motion.article
                key={o.request_id}
                variants={fadeUp}
                whileHover={{ x: 4 }}
                transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                className="group flex cursor-pointer items-center gap-4 rounded-xl2 border border-white/70 bg-white/55 p-3.5 transition-colors hover:bg-white/85"
              >
                {o.requester?.avatar_url ? <img src={o.requester.avatar_url} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover" /> : <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600"><Users size={19} /></div>}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="max-w-[320px] truncate text-[15px] font-bold" title={o.service_request?.description_free || 'Solicitud compatible'}>{truncarRecomendacion(o.service_request?.description_free || 'Solicitud compatible')}</h3>
                    <Badge tone="brand">Top {o.rank_position}</Badge>
                  </div>
                  <div className="mt-0.5 flex flex-wrap gap-x-4 gap-y-0.5 text-[12px] texto-suave">
                    <span className="inline-flex items-center gap-1"><MapPin size={11} /> {o.service_request?.city || o.service_request?.modality || 'Online'}</span>
                    <span className="inline-flex items-center gap-1"><Clock size={11} /> {o.service_request?.academic_level || 'Nivel académico'}</span>
                  </div>
                </div>
                <p className="hidden shrink-0 text-[15px] font-bold sm:block">
                  {o.requester?.full_name || 'HelpSeeker'}
                </p>
                <div className="shrink-0 text-center">
                  <p className="text-[15px] font-extrabold text-success-500">
                    <AnimatedNumber valor={Math.round(Number(o.matching?.distribution_score ?? o.matching?.reciprocal_score ?? 0))} sufijo="%" duracion={900 + i * 140} />
                  </p>
                  <p className="text-[10.5px] text-ink-muted">match</p>
                </div>
                <ArrowRight size={16} className="shrink-0 text-ink-muted transition-transform group-hover:translate-x-1 group-hover:text-brand-600" />
              </motion.article>
            ))}
            {!cargandoDatos && !oportunidades.length && <p className="py-8 text-center text-sm texto-suave">No tienes solicitudes compatibles por ahora.</p>}
            {cargandoDatos && <p className="py-8 text-center text-sm texto-suave">Cargando solicitudes compatibles…</p>}
          </div>
        </motion.section>

        {/* ---------- Panel derecho ---------- */}
        <div className="space-y-5">
          {/* Trabajos en curso */}
          <motion.section variants={fadeUp} className="panel p-5">
            <header className="mb-4 flex items-center justify-between">
              <h2 className="text-[18px] font-bold">Trabajos en curso</h2>
              <Button variant="ghost" size="sm" to={ROUTES.trabajos}>Ver todos</Button>
            </header>
            <div className="space-y-3">
              {trabajos.filter(t => !['delivered', 'paid'].includes(t.status)).map(t => (
                <div key={t.id} className="flex items-center gap-3.5 rounded-xl2 border border-white/70 bg-white/55 p-3">
                  <ProgressRing valor={t.progress_percentage} tamano={46} color="#2563EB" />
                  <div className="min-w-0 flex-1">
                    <p className="max-w-[300px] truncate text-[14px] font-bold" title={t.service_requests?.description_free || 'Trabajo aceptado'}>{truncarRecomendacion(t.service_requests?.description_free || 'Trabajo aceptado')}</p>
                    <p className="truncate text-[12.5px] texto-suave">{t.users?.full_name || 'HelpSeeker'} · {t.status}</p>
                  </div>
                  <Button size="sm" variant="secondary" onClick={() => abrirChat('cv1')}>Chat</Button>
                </div>
              ))}
              {!cargandoDatos && !trabajos.length && <p className="py-5 text-center text-sm texto-suave">Aún no tienes trabajos aceptados.</p>}
            </div>
          </motion.section>

          {/* Agenda */}
          <motion.section variants={fadeUp} className="panel p-5">
            <header className="mb-4 flex items-center justify-between">
              <h2 className="text-[18px] font-bold">Próximo en tu agenda</h2>
              <Button variant="ghost" size="sm" to={ROUTES.calendario}>Calendario</Button>
            </header>
            <ol className="space-y-2.5">
              {EVENTOS.slice(0, 3).map((e, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.08 }}
                  className="flex items-center gap-3.5 rounded-xl2 border border-white/70 bg-white/55 p-3"
                >
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                    <Calendar size={17} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-bold">{e.titulo}</p>
                    <p className="truncate text-[12.5px] texto-suave">{e.cliente} · día {e.dia}, {e.hora}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </motion.section>
        </div>
      </div>

      {/* ---------- Quién está buscando ayuda ---------- */}
      <motion.div variants={fadeUp}>
        <PresenceList
          titulo={`${TERMINOS.solicitante.plural} buscando ayuda ahora`}
          gente={oportunidades.slice(0, 5).map((o) => ({ id: o.request_id, nombre: o.requester?.full_name || 'HelpSeeker', avatarUrl: o.requester?.avatar_url || 'https://via.placeholder.com/96', detalle: o.service_request?.description_free || 'Solicitud compatible', etiqueta: `${Math.round(Number(o.matching?.distribution_score ?? 0))}% match`, estado: 'en_linea' as const }))}
          textoBoton="Proponer"
          onAccion={() => abrirChat('cv1')}
          verTodos={ROUTES.oportunidades}
        />
      </motion.div>

      <div className="grid gap-5 xl:grid-cols-[1.3fr_1fr]">
        {/* Completar perfil */}
        <motion.section variants={fadeUp} data-tour="hw-perfil" className="panel flex flex-col items-center gap-5 p-5 sm:flex-row">
          <Mascot pose="saludo" animation="none" className="w-[84px]" />
          <div className="min-w-0 flex-1">
            <p className="text-[16.5px] font-bold">Completa tu perfil y recibe más oportunidades</p>
            <p className="text-[13.5px] texto-suave">Los perfiles completos reciben hasta 3× más invitaciones.</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/[.08]">
                <motion.div className="h-full rounded-full bg-success-500"
                  initial={{ width: 0 }} animate={{ width: '85%' }} transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }} />
              </div>
              <span className="text-[13px] font-bold">85%</span>
            </div>
          </div>
          <Button className="shrink-0" to={ROUTES.perfil}>Completar perfil</Button>
        </motion.section>

        {/* Última reseña */}
        <motion.section variants={fadeUp} className="panel p-5">
          <header className="mb-3 flex items-center justify-between">
            <h2 className="text-[18px] font-bold">Última reseña</h2>
            <Button variant="ghost" size="sm" to={ROUTES.resenas}>Ver todas</Button>
          </header>
          <div className="flex gap-3.5">
            <img src={RESENAS[0].avatarUrl} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover" />
            <div className="min-w-0">
              <p className="text-[14.5px] font-bold">{RESENAS[0].autor}</p>
              <div className="mt-0.5 flex gap-0.5">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} size={12} className="text-amber-500" fill={i <= RESENAS[0].estrellas ? 'currentColor' : 'none'} />
                ))}
              </div>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">{RESENAS[0].texto}</p>
            </div>
          </div>
        </motion.section>
      </div>
    </motion.div>
  )
}

/* ---------------------------------------------------------------- */

const tonos = {
  brand:   'bg-brand-50 text-brand-600',
  success: 'bg-success-100 text-success-500',
  amber:   'bg-amber-100 text-amber-500',
  violet:  'bg-violet-100 text-violet-600',
}

function Metrica({ icon: Icon, label, valor, tono, decimales = 0, prefijo = '', sufijo = '' }: {
  icon: typeof Briefcase; label: string; valor: number
  tono: keyof typeof tonos; decimales?: number; prefijo?: string; sufijo?: string
}) {
  return (
    <motion.div variants={fadeUp} className="panel panel-hover flex items-center gap-4 p-5" data-tour="hw-stats">
      <span className={cn('grid h-12 w-12 shrink-0 place-items-center rounded-2xl', tonos[tono])}>
        <Icon size={21} />
      </span>
      <div className="min-w-0">
        <p className="truncate text-[12.5px] texto-suave">{label}</p>
        <p className="text-[24px] font-extrabold leading-tight">
          <AnimatedNumber valor={valor} decimales={decimales} prefijo={prefijo} sufijo={sufijo} />
        </p>
      </div>
    </motion.div>
  )
}

/* Iconos usados en tipos arriba pero no en el árbol: se dejan importados
   para que el archivo siga siendo fácil de extender. */
void TrendingUp; void Users
