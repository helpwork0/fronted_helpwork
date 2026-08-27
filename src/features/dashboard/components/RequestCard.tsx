import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { fadeUp } from '@/lib/motion/variants'
import { cn } from '@/lib/cn'
import type { ServiceRequest } from '@/types'

const ESTADOS: Record<ServiceRequest['estado'], { label: string; clase: string }> = {
  publicado:   { label: 'Publicado',            clase: 'text-brand-600' },
  recibiendo:  { label: 'Recibiendo propuestas', clase: 'text-success-500' },
  en_progreso: { label: 'En progreso',           clase: 'text-success-500' },
  completado:  { label: 'Completado',            clase: 'text-ink-muted' },
}

export function RequestCard({ s }: { s: ServiceRequest }) {
  const estado = ESTADOS[s.estado]
  return (
    <motion.div variants={fadeUp}>
      <Card hover className="flex items-center gap-4 p-4">
        <div className="grid h-16 w-24 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-100 to-brand-50 text-[11px] font-bold text-brand-500">
          {s.categoria.split(' ')[0].toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-[15.5px] font-bold">{s.titulo}</h4>
          <p className="text-[13px] text-ink-muted">{estado.label} · {s.propuestas} propuestas</p>
        </div>
        <div className="shrink-0 text-right">
          <p className={cn('text-[13.5px] font-semibold', estado.clase)}>{estado.label}</p>
          <p className="text-[12.5px] text-ink-muted">Actualizado {s.actualizadoHace}</p>
        </div>
      </Card>
    </motion.div>
  )
}
