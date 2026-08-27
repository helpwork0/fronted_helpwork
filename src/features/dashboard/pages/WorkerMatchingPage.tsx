import { motion } from 'framer-motion'
import { Clock, MapPin, Users, Wallet, Send, Bookmark, ShieldCheck } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { AnimatedNumber } from '../components/AnimatedNumber'
import { SOLICITUDES_COMPATIBLES } from '@/data/appData'
import { useMessages } from '@/features/messages/MessagesContext'
import { TERMINOS } from '@/config/site.config'
import { staggerContainer, fadeUp } from '@/lib/motion/variants'

const CRITERIOS = [
  { t: 'Tus habilidades', d: 'Lo que pide encaja con lo que declaraste en tu perfil.' },
  { t: 'Tu horario', d: 'La persona necesita ayuda en un rango en el que estás disponible.' },
  { t: 'Tu modalidad', d: 'Coincide con si trabajas en línea, presencial o ambas.' },
  { t: 'Tu tarifa', d: 'El presupuesto que ofrece entra en tu rango.' },
  { t: 'Tu reputación', d: 'Tus reseñas te posicionan mejor frente a otros postulantes.' },
]

/**
 * El matching visto desde el otro lado: aquí el HelpWorker no ve personas,
 * ve TRABAJOS disponibles ordenados por lo bien que encajan con su perfil.
 * Es la contraparte de MatchingPage, que es la del HelpSeeker.
 */
export default function WorkerMatchingPage() {
  const { abrirChat } = useMessages()

  return (
    <div>
      <PageHeader
        titulo="Matching inteligente"
        descripcion={`Solicitudes de ${TERMINOS.solicitante.plural} que encajan con tu perfil.`}
      />

      <div className="grid gap-5 xl:grid-cols-[1fr_300px]">
        <motion.div variants={staggerContainer(0.1)} initial="hidden" animate="show" className="space-y-4">
          <p className="text-[14px] font-semibold">
            {SOLICITUDES_COMPATIBLES.length} solicitudes <span className="font-normal texto-suave">altamente compatibles</span>
          </p>

          {SOLICITUDES_COMPATIBLES.map((s, i) => (
            <motion.article key={s.id} variants={fadeUp} className="panel panel-hover p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <img src={s.avatarUrl} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover" />
                  <div className="min-w-0">
                    <h3 className="text-[17px] font-bold leading-tight">{s.titulo}</h3>
                    <p className="text-[13px] texto-suave">
                      {s.seeker} · <span className="text-brand-600">{TERMINOS.solicitante.singular}</span>
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-[26px] font-extrabold leading-none text-success-500">
                    <AnimatedNumber valor={s.match} sufijo="%" duracion={900 + i * 130} />
                  </p>
                  <p className="text-[11.5px] texto-suave">de compatibilidad</p>
                </div>
              </div>

              <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-black/[.07]">
                <motion.div className="h-full rounded-full bg-success-500"
                  initial={{ width: 0 }} whileInView={{ width: `${s.match}%` }} viewport={{ once: true }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }} />
              </div>

              <p className="mt-3.5 text-[14px] leading-relaxed text-ink-soft">{s.descripcion}</p>

              <div className="mt-3.5 flex flex-wrap gap-x-5 gap-y-2 text-[12.5px] texto-suave">
                <span className="inline-flex items-center gap-1.5"><MapPin size={13} className="text-brand-500" /> {s.modalidad}</span>
                <span className="inline-flex items-center gap-1.5"><Wallet size={13} className="text-brand-500" /> {s.presupuesto}</span>
                <span className="inline-flex items-center gap-1.5"><Users size={13} className="text-brand-500" /> {s.postulantes} postulantes</span>
                <span className="inline-flex items-center gap-1.5"><Clock size={13} className="text-brand-500" /> {s.publicado}</span>
                {s.urgente && <Badge tone="amber">Urgente</Badge>}
              </div>

              <div className="mt-4 flex flex-wrap gap-2 border-t border-white/60 pt-4">
                <Button size="sm" onClick={() => abrirChat('cv1')}><Send size={14} /> Enviar propuesta</Button>
                <Button size="sm" variant="secondary"><Bookmark size={14} /> Guardar</Button>
                <Button size="sm" variant="ghost">Ver detalle</Button>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <motion.aside variants={fadeUp} initial="hidden" animate="show" className="panel h-fit p-5">
          <h2 className="text-[16.5px] font-bold">¿Por qué te aparecen estas?</h2>
          <ul className="mt-4 space-y-4">
            {CRITERIOS.map(c => (
              <li key={c.t} className="flex gap-3">
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                  <ShieldCheck size={15} />
                </span>
                <div>
                  <p className="text-[14px] font-bold">{c.t}</p>
                  <p className="text-[13px] leading-snug texto-suave">{c.d}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t border-white/60 pt-4 text-[12.5px] texto-suave">
            Si completas más tu perfil y agregas habilidades, aparecerás en más solicitudes.
          </p>
        </motion.aside>
      </div>
    </div>
  )
}
