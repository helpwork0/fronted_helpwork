import { motion } from 'framer-motion'
import { Calendar, DollarSign } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { TRABAJOS, type Trabajo } from '@/data/appData'
import { useMessages } from '@/features/messages/MessagesContext'
import { cn } from '@/lib/cn'

const COLUMNAS = [
  { id: 'propuesta', titulo: 'Propuestas enviadas', color: 'bg-black/[.06] text-ink-soft' },
  { id: 'en_curso',  titulo: 'En curso',            color: 'bg-brand-50 text-brand-600' },
  { id: 'entregado', titulo: 'Entregados',          color: 'bg-amber-100 text-amber-500' },
  { id: 'pagado',    titulo: 'Pagados',             color: 'bg-success-100 text-success-500' },
] as const

/** Tablero tipo kanban: cada columna es un estado del trabajo. */
export default function JobsPage() {
  const { abrirChat } = useMessages()

  return (
    <div>
      <PageHeader titulo="Mis trabajos" descripcion="En qué estado está cada compromiso que tienes." />

      <div className="grid gap-4 lg:grid-cols-4">
        {COLUMNAS.map((col, ci) => {
          const items = TRABAJOS.filter(t => t.estado === col.id)
          return (
            <motion.section
              key={col.id}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ci * 0.08, duration: 0.45 }}
              className="panel flex flex-col p-3"
            >
              <header className="mb-3 flex items-center justify-between px-1">
                <h2 className="text-[14px] font-bold">{col.titulo}</h2>
                <span className={cn('rounded-full px-2 py-0.5 text-[11.5px] font-bold', col.color)}>{items.length}</span>
              </header>

              <div className="flex flex-col gap-2.5">
                {items.map(t => <TarjetaTrabajo key={t.id} t={t} onChat={() => abrirChat('cv1')} />)}
                {items.length === 0 && (
                  <p className="rounded-xl border border-dashed border-white/80 px-3 py-6 text-center text-[12.5px] texto-suave">
                    Sin trabajos aquí
                  </p>
                )}
              </div>
            </motion.section>
          )
        })}
      </div>
    </div>
  )
}

function TarjetaTrabajo({ t, onChat }: { t: Trabajo; onChat: () => void }) {
  return (
    <motion.article
      whileHover={{ y: -3 }}
      className="cursor-pointer rounded-xl2 border border-white/70 bg-white/70 p-3.5 transition-shadow hover:shadow-soft"
    >
      <h3 className="text-[14px] font-bold leading-snug">{t.titulo}</h3>

      <div className="mt-2 flex items-center gap-2">
        <img src={t.avatarUrl} alt="" className="h-6 w-6 rounded-full object-cover" />
        <span className="truncate text-[12.5px] texto-suave">{t.cliente}</span>
      </div>

      {t.progreso > 0 && t.progreso < 100 && (
        <div className="mt-3">
          <div className="h-1.5 overflow-hidden rounded-full bg-black/[.07]">
            <motion.div className="h-full rounded-full bg-brand-500"
              initial={{ width: 0 }} animate={{ width: `${t.progreso}%` }} transition={{ duration: 1, ease: 'easeOut' }} />
          </div>
          <p className="mt-1 text-[11.5px] text-ink-muted">{t.progreso}% completado</p>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between border-t border-white/70 pt-2.5 text-[12px]">
        <span className="inline-flex items-center gap-1 texto-suave"><Calendar size={12} /> {t.entrega}</span>
        <span className="inline-flex items-center gap-0.5 font-bold"><DollarSign size={12} />{t.monto}</span>
      </div>

      <Button size="sm" variant="secondary" fullWidth className="mt-2.5" onClick={e => { e.stopPropagation(); onChat() }}>
        Abrir chat
      </Button>
    </motion.article>
  )
}
