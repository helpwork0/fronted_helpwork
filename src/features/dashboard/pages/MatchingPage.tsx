import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, CircleDollarSign, Monitor, ShieldCheck, Headphones, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { MatchCard } from '../components/MatchCard'
import { CANDIDATOS } from '@/data/mock'
import { staggerContainer, fadeUp } from '@/lib/motion/variants'
import { ROUTES, TERMINOS } from '@/config/site.config'
import { useAutoTour } from '@/components/onboarding/useAutoTour'

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
export default function MatchingPage() {
  useAutoTour('matching')

  return (
    <div className="pb-24">
      <Link
        to={ROUTES.solicitudes}
        className="mb-4 inline-flex items-center gap-2 text-[14px] font-medium texto-suave transition hover:text-brand-600"
      >
        <ArrowLeft size={16} /> Volver a mis solicitudes
      </Link>

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
              <Badge tone="success">Activa</Badge>
            </div>

            <p className="text-[15px] font-bold leading-snug">Clases particulares de Matemáticas</p>

            <dl className="mt-3.5 space-y-2.5 text-[13px]">
              <Dato icon={Monitor} label="Modalidad" valor="En línea" />
              <Dato icon={CircleDollarSign} label="Presupuesto" valor="$10 – $15 / hora" />
              <Dato icon={Calendar} label="Fecha requerida" valor="Desde el 27 may 2025" />
            </dl>

            <p className="mt-3.5 border-t border-white/60 pt-3.5 text-[13px] leading-relaxed texto-suave">
              Busco profesor/a de matemáticas para nivel universitario.
              Temas: cálculo diferencial, integrales y álgebra lineal.
            </p>

            <Button variant="ghost" size="sm" className="mt-3" to={ROUTES.solicitudes}>
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
              {CANDIDATOS.length} {TERMINOS.helpworker.plural}
              <span className="font-normal texto-suave"> altamente compatibles</span>
            </p>
            <p className="text-[12.5px] texto-suave">Ordenados por compatibilidad</p>
          </div>

          <motion.div
            variants={staggerContainer(0.1)} initial="hidden" animate="show"
            data-tour="match-lista" className="grid gap-4 2xl:grid-cols-2"
          >
            {CANDIDATOS.map(c => <MatchCard key={c.id} c={c} />)}
          </motion.div>

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