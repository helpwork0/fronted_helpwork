import { motion } from 'framer-motion'
import { BadgeCheck, Clock, MapPin, Star, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { AnimatedNumber } from './AnimatedNumber'
import { fadeUp } from '@/lib/motion/variants'
import type { MatchCandidate } from '@/types'

/**
 * Tarjeta de candidato.
 *
 * OJO CON LOS BREAKPOINTS: esta tarjeta vive dentro de una columna, no a
 * lo ancho de la pantalla. Usar `lg:flex-row` (1024 px) la ponía en fila
 * cuando la VENTANA medía 1024, aunque la columna real midiera 600 — y
 * todo se aplastaba.
 *
 * Por eso ahora el diseño es vertical por defecto y se apoya en apilar
 * bloques completos: cabecera, barra, habilidades, datos y acciones.
 * Solo se reparte en fila dentro de cada bloque, con `sm:`, que a esa
 * altura sí hay espacio garantizado.
 */
export function MatchCard({ c }: { c: MatchCandidate }) {
  return (
    <motion.article variants={fadeUp} className="panel panel-hover p-5">

      {/* --- Cabecera: quién es + qué tan compatible --- */}
      <header className="flex items-start gap-3.5">
        <div className="relative shrink-0">
          <img src={c.avatarUrl} alt="" className="h-14 w-14 rounded-full object-cover" />
          <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-success-500 ring-2 ring-white" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="flex items-center gap-1.5 text-[17px] font-bold leading-tight">
            <span className="truncate">{c.nombre}</span>
            {c.verificado && <BadgeCheck size={16} className="shrink-0 text-brand-500" />}
          </h3>
          <p className="truncate text-[13.5px] texto-suave">{c.profesion}</p>
          <p className="mt-0.5 flex items-center gap-1 text-[12.5px] text-ink-muted">
            <Star size={12} className="shrink-0 text-amber-500" fill="currentColor" />
            {c.rating} · {c.reseñas} reseñas
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-[24px] font-extrabold leading-none text-success-500">
            <AnimatedNumber valor={c.match} sufijo="%" />
          </p>
          <p className="text-[11px] texto-suave">de match</p>
        </div>
      </header>

      {/* --- Barra de compatibilidad --- */}
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-black/[.07]">
        <motion.div
          className="h-full rounded-full bg-success-500"
          initial={{ width: 0 }}
          whileInView={{ width: `${c.match}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        />
      </div>

      {/* --- Habilidades --- */}
      <div className="mt-3.5 flex flex-wrap gap-1.5">
        {c.habilidades.map(h => (
          <span key={h} className="rounded-full bg-brand-50 px-2.5 py-1 text-[12px] font-medium text-brand-600">
            {h}
          </span>
        ))}
      </div>

      {/* --- Datos concretos --- */}
      <dl className="mt-3.5 grid gap-2 text-[13px] sm:grid-cols-3">
        <Dato icon={Clock} etiqueta="Disponible" valor={c.disponibilidad} />
        <Dato icon={MapPin} etiqueta="Modalidad" valor={c.modalidad} />
        <Dato
          icon={Star}
          etiqueta="Tarifa estimada"
          valor={`$${c.tarifaMin} – $${c.tarifaMax} / ${c.unidad}`}
        />
      </dl>

      {/* --- Acciones --- */}
      <div className="mt-4 flex flex-wrap gap-2 border-t border-white/60 pt-4">
        <Button size="sm" className="flex-1 sm:flex-none">
          <MessageSquare size={14} /> Contactar
        </Button>
        <Button size="sm" variant="secondary" className="flex-1 sm:flex-none">
          Ver perfil
        </Button>
      </div>
    </motion.article>
  )
}

function Dato({ icon: Icon, etiqueta, valor }: { icon: typeof Clock; etiqueta: string; valor: string }) {
  return (
    <div className="rounded-xl bg-white/60 px-3 py-2">
      <dt className="flex items-center gap-1.5 text-[11.5px] text-ink-muted">
        <Icon size={11} className="shrink-0 text-brand-500" /> {etiqueta}
      </dt>
      <dd className="mt-0.5 truncate font-semibold">{valor}</dd>
    </div>
  )
}