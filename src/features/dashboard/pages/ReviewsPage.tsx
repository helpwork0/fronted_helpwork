import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { AnimatedNumber } from '../components/AnimatedNumber'
import { RESENAS } from '@/data/appData'
import { staggerContainer, fadeUp } from '@/lib/motion/variants'

export default function ReviewsPage() {
  const promedio = RESENAS.reduce((n, r) => n + r.estrellas, 0) / RESENAS.length
  // Cuántas reseñas hay de 5, 4, 3... estrellas
  const distribucion = [5, 4, 3, 2, 1].map(e => ({ e, n: RESENAS.filter(r => r.estrellas === e).length }))

  return (
    <div>
      <PageHeader titulo="Reseñas" descripcion="Lo que dicen las personas que trabajaron contigo." />

      <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
        {/* Resumen */}
        <aside className="panel h-fit p-6 text-center">
          <p className="text-[52px] font-extrabold leading-none">
            <AnimatedNumber valor={promedio} decimales={1} />
          </p>
          <div className="mt-2 flex justify-center gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
              <Star key={i} size={18} className="text-amber-500"
                fill={i <= Math.round(promedio) ? 'currentColor' : 'none'} />
            ))}
          </div>
          <p className="mt-1.5 text-[13.5px] texto-suave">{RESENAS.length} reseñas</p>

          <div className="mt-5 space-y-2 border-t border-white/60 pt-4">
            {distribucion.map(({ e, n }) => (
              <div key={e} className="flex items-center gap-2 text-[12.5px]">
                <span className="w-3 shrink-0 text-right texto-suave">{e}</span>
                <Star size={11} className="shrink-0 text-amber-500" fill="currentColor" />
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-black/[.07]">
                  <motion.div className="h-full rounded-full bg-amber-500"
                    initial={{ width: 0 }} animate={{ width: `${(n / RESENAS.length) * 100}%` }}
                    transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }} />
                </div>
                <span className="w-4 shrink-0 text-ink-muted">{n}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Listado */}
        <motion.div variants={staggerContainer(0.08)} initial="hidden" animate="show" className="grid gap-3">
          {RESENAS.map(r => (
            <motion.article key={r.id} variants={fadeUp} className="panel panel-hover p-5">
              <div className="flex items-start gap-3.5">
                <img src={r.avatarUrl} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-[15.5px] font-bold">{r.autor}</h3>
                    <span className="text-[12.5px] text-ink-muted">{r.fecha}</span>
                  </div>
                  <div className="mt-0.5 flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} size={13} className="text-amber-500" fill={i <= r.estrellas ? 'currentColor' : 'none'} />
                    ))}
                  </div>
                  <p className="mt-2.5 text-[14px] leading-relaxed text-ink-soft">{r.texto}</p>
                  <p className="mt-2 text-[12.5px] text-ink-muted">Sobre: <span className="font-semibold text-brand-600">{r.trabajo}</span></p>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
