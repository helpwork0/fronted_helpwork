import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, MapPin, Clock, SlidersHorizontal } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Tabs } from '@/components/ui/Tabs'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { AnimatedNumber } from '../components/AnimatedNumber'
import { OPORTUNIDADES } from '@/data/mock'
import type { Opportunity } from '@/types'
import { staggerContainer, fadeUp } from '@/lib/motion/variants'

const MAS: Opportunity[] = [
  { id: 'o4', titulo: 'Tutoría de Álgebra Lineal', categoria: 'Estudios y Tutorías', modalidad: 'En línea', publicadoHace: 'hace 6 h', precio: 14, unidad: 'hora', match: 88, avatarUrl: 'https://i.pravatar.cc/120?u=op4' },
  { id: 'o5', titulo: 'Revisión de tesis en APA', categoria: 'Redacción', modalidad: 'Remoto', publicadoHace: 'hace 1 d', precio: 120, unidad: 'proyecto', match: 81, avatarUrl: 'https://i.pravatar.cc/120?u=op5' },
  { id: 'o6', titulo: 'Clases de Python básico', categoria: 'Programación', modalidad: 'En línea', publicadoHace: 'hace 2 d', precio: 16, unidad: 'hora', match: 76, avatarUrl: 'https://i.pravatar.cc/120?u=op6' },
]
const TODAS: Opportunity[] = [...OPORTUNIDADES, ...MAS]

export default function OpportunitiesPage() {
  const [tab, setTab] = useState('recomendadas')
  const [q, setQ] = useState('')

  const base = tab === 'recomendadas' ? TODAS.filter(o => o.match >= 85)
    : tab === 'urgentes' ? TODAS.filter(o => o.urgente)
    : TODAS
  const lista = base.filter(o => o.titulo.toLowerCase().includes(q.toLowerCase()))

  return (
    <div>
      <PageHeader titulo="Oportunidades" descripcion="Trabajos publicados que encajan con tu perfil.">
        <Button variant="secondary" size="sm"><SlidersHorizontal size={15} /> Filtros</Button>
      </PageHeader>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs activa={tab} onChange={setTab} tabs={[
          { id: 'recomendadas', label: 'Recomendadas', contador: TODAS.filter(o => o.match >= 85).length },
          { id: 'urgentes', label: 'Urgentes', contador: TODAS.filter(o => o.urgente).length },
          { id: 'todas', label: 'Todas', contador: TODAS.length },
        ]} />
        <div className="flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-4 py-2 backdrop-blur-xl sm:w-72">
          <Search size={15} className="shrink-0 text-ink-muted" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar oportunidad"
            className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-ink-muted/80" />
        </div>
      </div>

      {lista.length === 0 ? (
        <div className="panel"><EmptyState titulo="Nada por ahora" texto="No hay oportunidades que coincidan. Prueba ampliando tus habilidades en el perfil." /></div>
      ) : (
        <motion.div variants={staggerContainer(0.07)} initial="hidden" animate="show" className="grid gap-3">
          {lista.map((o, i) => (
            <motion.article key={o.id} variants={fadeUp} className="panel panel-hover flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
              <img src={o.avatarUrl} alt="" className="h-14 w-14 shrink-0 rounded-full object-cover" />

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-[16px] font-bold">{o.titulo}</h3>
                  {o.urgente && <Badge tone="amber">Urgente</Badge>}
                </div>
                <div className="mt-1 flex flex-wrap gap-x-5 gap-y-1 text-[12.5px] texto-suave">
                  <span className="inline-flex items-center gap-1"><MapPin size={12} /> {o.modalidad}</span>
                  <span>{o.categoria}</span>
                  <span className="inline-flex items-center gap-1"><Clock size={12} /> {o.publicadoHace}</span>
                </div>
              </div>

              <p className="shrink-0 text-[16px] font-bold">
                ${o.precio}<span className="text-[12.5px] font-normal text-ink-muted"> / {o.unidad}</span>
              </p>

              <div className="shrink-0 text-center">
                <p className="text-[17px] font-extrabold text-success-500">
                  <AnimatedNumber valor={o.match} sufijo="%" duracion={800 + i * 120} />
                </p>
                <p className="text-[11px] text-ink-muted">match</p>
              </div>

              <div className="flex shrink-0 gap-2">
                <Button size="sm" variant="secondary">Ver</Button>
                <Button size="sm">Postular</Button>
              </div>
            </motion.article>
          ))}
        </motion.div>
      )}
    </div>
  )
}
