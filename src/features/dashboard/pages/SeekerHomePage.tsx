import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search, LayoutGrid, MessageSquare, PencilLine, PlusCircle, BadgeCheck, Star,
  BookOpen, GraduationCap, Briefcase, Palette, Grid3x3, TrendingUp, Clock, FileText, CheckCircle2, ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { AnimatedNumber } from '../components/AnimatedNumber'
import { ProgressRing } from '../components/ProgressRing'
import { Mascot } from '@/components/mascot/Mascot'
import { SOLICITUDES, CANDIDATOS } from '@/data/mock'
import { HELPWORKERS_ACTIVOS } from '@/data/appData'
import { PresenceList } from '../components/PresenceList'
import { TERMINOS } from '@/config/site.config'
import { useMessages } from '@/features/messages/MessagesContext'
import { useAuth } from '@/features/auth/AuthContext'
import { staggerContainer, fadeUp } from '@/lib/motion/variants'
import { useAutoTour } from '@/components/onboarding/useAutoTour'
import { ROUTES } from '@/config/site.config'
import { cn } from '@/lib/cn'

const CATEGORIAS = [
  { icon: GraduationCap, label: 'Clases particulares' },
  { icon: BookOpen,      label: 'Redacción de tesis' },
  { icon: Briefcase,     label: 'Proyectos / Prácticas' },
  { icon: Palette,       label: 'Diseño / Creación' },
  { icon: Grid3x3,       label: 'Todos los servicios' },
]

const ACCIONES = [
  { icon: LayoutGrid,    titulo: 'Ver propuestas',   texto: 'Revisa y compara lo recibido' },
  { icon: MessageSquare, titulo: 'Iniciar chat',     texto: 'Habla con tus Help Workers' },
  { icon: PencilLine,    titulo: 'Editar solicitud', texto: 'Actualiza los detalles' },
  { icon: PlusCircle,    titulo: 'Nueva solicitud',  texto: 'Publica lo que necesitas' },
]

const ACTIVIDAD = [
  { icon: FileText,    texto: 'Publicaste "Diseño de Logo"',            hace: 'hace 5 h',  tono: 'brand' },
  { icon: CheckCircle2,texto: 'Joaquín aceptó tu solicitud de tutoría', hace: 'hace 8 h',  tono: 'success' },
  { icon: Star,        texto: 'Recibiste 3 propuestas nuevas',          hace: 'ayer',      tono: 'amber' },
  { icon: TrendingUp,  texto: 'Tu tesis avanzó a "En progreso"',        hace: 'hace 2 d',  tono: 'brand' },
] as const

const tonos = {
  brand:   'bg-brand-50 text-brand-600',
  success: 'bg-success-100 text-success-500',
  amber:   'bg-amber-100 text-amber-500',
}

/** Panel del solicitante: cristal, contadores animados y accesos directos. */
export default function SeekerHomePage() {
  useAutoTour('solicitante')
  const { usuario } = useAuth()
  const { abrirChat, conversaciones } = useMessages()
  const [categoria, setCategoria] = useState(0)

  const hora = new Date().getHours()
  const saludo = hora < 12 ? 'Buenos días' : hora < 19 ? 'Buenas tardes' : 'Buenas noches'
  const nombre = usuario?.nombre.split(' ')[0] ?? 'Ariana'

  return (
    <motion.div variants={staggerContainer(0.07)} initial="hidden" animate="show" className="space-y-5">

      {/* ---------- Saludo y buscador ---------- */}
      <motion.section variants={fadeUp} className="panel overflow-hidden p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-brand-500">{saludo}</p>
            <h1 className="mt-1 text-[30px] font-extrabold leading-tight">
              Hola, {nombre} <span className="inline-block">👋</span>
            </h1>
            <p className="mt-1 text-[15px] texto-suave">¿Qué necesitas hoy?</p>
          </div>

          <div
            data-tour="panel-buscar"
            className="flex w-full max-w-xl items-center gap-2 rounded-full border border-white/80 bg-white/70 p-1.5 pl-5 shadow-soft backdrop-blur-xl transition-shadow focus-within:shadow-lift"
          >
            <Search size={18} className="shrink-0 text-ink-muted" />
            <input
              placeholder="Ej: ayuda con tesis, marketing digital, clases..."
              className="min-w-0 flex-1 bg-transparent py-2 text-[14.5px] outline-none placeholder:text-ink-muted/75"
            />
            <Button size="sm">Buscar</Button>
          </div>
        </div>

        {/* Categorías con píldora deslizante */}
        <div data-tour="panel-categorias" className="mt-6 flex flex-wrap gap-1.5 border-t border-white/60 pt-5">
          {CATEGORIAS.map((c, i) => (
            <button
              key={c.label}
              onClick={() => setCategoria(i)}
              className={cn(
                'relative flex items-center gap-2 rounded-full px-4 py-2.5 text-[14px] font-medium transition-colors duration-200',
                categoria === i ? 'text-white' : 'texto-suave hover:text-brand-600',
              )}
            >
              {categoria === i && (
                <motion.span
                  layoutId="cat-activa"
                  className="absolute inset-0 -z-10 rounded-full bg-brand-600 shadow-soft"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <c.icon size={16} />
              {c.label}
            </button>
          ))}
        </div>
      </motion.section>

      {/* ---------- Métricas ---------- */}
      <motion.section variants={staggerContainer(0.06)} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metrica icon={FileText}      label="Solicitudes activas" valor={3}  tono="brand" />
        <Metrica icon={LayoutGrid}    label="Propuestas recibidas" valor={10} tono="success" />
        <Metrica icon={Clock}         label="Respuesta promedio" valor={2.25} decimales={2} sufijo=" h" tono="amber" />
        <Metrica icon={MessageSquare} label="Chats activos" valor={conversaciones.length} tono="violet" />
      </motion.section>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_1fr]">
        {/* ---------- Solicitudes ---------- */}
        <motion.section variants={fadeUp} data-tour="panel-solicitudes" className="panel p-5">
          <header className="mb-4 flex items-center justify-between">
            <h2 className="text-[18px] font-bold">Mis solicitudes activas</h2>
            <a href="#" className="text-[13.5px] font-semibold text-brand-600 hover:underline">Ver todas</a>
          </header>

          <div className="space-y-2.5">
            {SOLICITUDES.map((s, i) => (
              <motion.article
                key={s.id}
                variants={fadeUp}
                whileHover={{ x: 4 }}
                transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                className="group flex cursor-pointer items-center gap-4 rounded-xl2 border border-white/70 bg-white/55 p-3.5 transition-colors hover:bg-white/85"
              >
                <ProgressRing valor={[70, 35, 55][i]} tamano={50} />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-[15.5px] font-bold">{s.titulo}</h3>
                  <p className="truncate text-[13px] texto-suave">{s.categoria} · {s.propuestas} propuestas</p>
                </div>
                <div className="hidden shrink-0 text-right sm:block">
                  <p className="text-[13px] font-semibold text-success-500">
                    {s.estado === 'recibiendo' ? 'Recibiendo' : 'En progreso'}
                  </p>
                  <p className="text-[12px] text-ink-muted">{s.actualizadoHace}</p>
                </div>
                <ArrowRight size={16} className="shrink-0 text-ink-muted transition-transform group-hover:translate-x-1 group-hover:text-brand-600" />
              </motion.article>
            ))}
          </div>
        </motion.section>

        {/* ---------- Recomendados ---------- */}
        <motion.section variants={fadeUp} data-tour="panel-match" className="panel p-5">
          <header className="mb-4 flex items-center justify-between">
            <h2 className="text-[18px] font-bold">Recomendados para ti</h2>
            <Button variant="ghost" size="sm" to={ROUTES.matching}>Ver todos</Button>
          </header>

          <div className="space-y-2.5">
            {CANDIDATOS.map((c, i) => (
              <motion.div
                key={c.id}
                variants={fadeUp}
                className="flex items-center gap-3 rounded-xl2 border border-transparent p-2.5 transition-all hover:border-white/70 hover:bg-white/70"
              >
                <div className="relative shrink-0">
                  <img src={c.avatarUrl} alt="" className="h-11 w-11 rounded-full object-cover" />
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-success-500 ring-2 ring-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1 truncate text-[14.5px] font-bold">
                    {c.nombre} <BadgeCheck size={14} className="shrink-0 text-brand-500" />
                  </p>
                  <p className="truncate text-[12.5px] texto-suave">
                    {c.profesion} · <Star size={10} className="inline text-amber-500" /> {c.rating}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[15px] font-extrabold text-success-500">
                    <AnimatedNumber valor={c.match} sufijo="%" duracion={900 + i * 150} />
                  </p>
                  <p className="text-[11px] text-ink-muted">match</p>
                </div>
                <Button size="sm" className="shrink-0" onClick={() => abrirChat(`cv${i + 1}`)}>
                  Chat
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_1fr]">
        {/* ---------- Quién está disponible ---------- */}
      <motion.div variants={fadeUp}>
        <PresenceList
          titulo={`${TERMINOS.helpworker.plural} disponibles`}
          gente={HELPWORKERS_ACTIVOS}
          textoBoton="Escribir"
          onAccion={() => abrirChat('cv1')}
          verTodos={ROUTES.matching}
        />
      </motion.div>

      {/* ---------- Acciones rápidas ---------- */}
        <motion.section variants={fadeUp} data-tour="panel-acciones" className="panel p-5">
          <h2 className="mb-4 text-[18px] font-bold">Acciones rápidas</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {ACCIONES.map(a => (
              <button
                key={a.titulo}
                className="group flex items-center gap-3.5 rounded-xl2 border border-white/70 bg-white/55 p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:bg-white/90 hover:shadow-lift"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                  <a.icon size={19} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[14.5px] font-bold text-brand-600">{a.titulo}</span>
                  <span className="block text-[12.5px] texto-suave">{a.texto}</span>
                </span>
              </button>
            ))}
          </div>
        </motion.section>

        {/* ---------- Actividad ---------- */}
        <motion.section variants={fadeUp} className="panel p-5">
          <h2 className="mb-4 text-[18px] font-bold">Actividad reciente</h2>
          <ol className="relative space-y-4 pl-1">
            <span className="absolute bottom-3 left-[19px] top-3 w-px bg-gradient-to-b from-brand-200 via-brand-100 to-transparent" />
            {ACTIVIDAD.map((a, i) => (
              <motion.li
                key={a.texto}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.45 }}
                className="relative flex gap-3"
              >
                <span className={cn('z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full ring-4 ring-white/80', tonos[a.tono])}>
                  <a.icon size={15} />
                </span>
                <div className="min-w-0 pt-1.5">
                  <p className="text-[14px] font-medium leading-snug">{a.texto}</p>
                  <p className="text-[12px] text-ink-muted">{a.hace}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </motion.section>
      </div>

      {/* ---------- Banner mascota ---------- */}
      <motion.div variants={fadeUp} className="panel flex items-center gap-5 overflow-hidden bg-gradient-to-r from-brand-50/80 to-white/50 p-5">
        <Mascot pose="saludo" animation="none" className="w-[78px]" />
        <div className="min-w-0 flex-1">
          <p className="text-[16px] font-bold">¿Tienes dudas sobre el proceso?</p>
          <p className="text-[13.5px] texto-suave">Toca a Helpy abajo a la derecha y te repito la guía cuando quieras.</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => abrirChat('cv4')}>Escribir a soporte</Button>
      </motion.div>
    </motion.div>
  )
}

/* ---------------------------------------------------------------- */

function Metrica({
  icon: Icon, label, valor, tono, decimales = 0, sufijo = '',
}: {
  icon: typeof FileText; label: string; valor: number
  tono: 'brand' | 'success' | 'amber' | 'violet'; decimales?: number; sufijo?: string
}) {
  const colores = { ...tonos, violet: 'bg-violet-100 text-violet-600' }
  return (
    <motion.div variants={fadeUp} className="panel panel-hover flex items-center gap-4 p-5">
      <span className={cn('grid h-12 w-12 shrink-0 place-items-center rounded-2xl', colores[tono])}>
        <Icon size={21} />
      </span>
      <div className="min-w-0">
        <p className="truncate text-[12.5px] texto-suave">{label}</p>
        <p className="text-[24px] font-extrabold leading-tight">
          <AnimatedNumber valor={valor} decimales={decimales} sufijo={sufijo} />
        </p>
      </div>
    </motion.div>
  )
}
