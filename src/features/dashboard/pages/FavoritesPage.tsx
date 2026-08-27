import { motion } from 'framer-motion'
import { Star, Heart, MessageSquare } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { FAVORITOS } from '@/data/appData'
import { useMessages } from '@/features/messages/MessagesContext'
import { staggerContainer, fadeUp } from '@/lib/motion/variants'

export default function FavoritesPage() {
  const { abrirChat } = useMessages()

  return (
    <div>
      <PageHeader titulo="Favoritos" descripcion="Los HelpWorkers que guardaste para volver a contratar." />

      <motion.div variants={staggerContainer(0.08)} initial="hidden" animate="show"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {FAVORITOS.map((f, i) => (
          <motion.article key={f.id} variants={fadeUp} className="panel panel-hover flex flex-col p-5">
            <div className="flex items-start gap-3">
              <div className="relative shrink-0">
                <img src={f.avatarUrl} alt="" className="h-14 w-14 rounded-full object-cover" />
                {f.enLinea && <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-success-500 ring-2 ring-white" />}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-[16px] font-bold">{f.nombre}</h3>
                <p className="truncate text-[13px] texto-suave">{f.profesion}</p>
                <p className="text-[12.5px] text-ink-muted">
                  <Star size={11} className="inline text-amber-500" /> {f.rating} ({f.reseñas} reseñas)
                </p>
              </div>
              <button aria-label="Quitar de favoritos" className="shrink-0 rounded-lg p-1.5 text-red-500 transition hover:bg-red-50">
                <Heart size={18} fill="currentColor" />
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {f.habilidades.map(h => (
                <span key={h} className="rounded-full bg-brand-50 px-2.5 py-1 text-[12px] font-medium text-brand-600">{h}</span>
              ))}
            </div>

            <p className="mt-3 text-[14px] font-semibold">{f.tarifa}</p>

            <div className="mt-4 flex gap-2 border-t border-white/60 pt-4">
              <Button size="sm" variant="secondary" fullWidth>Ver perfil</Button>
              <Button size="sm" fullWidth onClick={() => abrirChat(`cv${(i % 3) + 1}`)}>
                <MessageSquare size={14} /> Chat
              </Button>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </div>
  )
}
