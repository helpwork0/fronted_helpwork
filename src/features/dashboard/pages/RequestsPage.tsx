import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, ArrowRight } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Tabs } from '@/components/ui/Tabs'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { ProgressRing } from '../components/ProgressRing'
import { SOLICITUDES } from '@/data/mock'
import { staggerContainer, fadeUp } from '@/lib/motion/variants'
import { ROUTES } from '@/config/site.config'

const EXTRA = [
  { ...SOLICITUDES[0], id: 's4', titulo: 'Corrección de estilo APA', categoria: 'Redacción de tesis', estado: 'completado' as const, propuestas: 4, actualizadoHace: 'hace 6 d' },
  { ...SOLICITUDES[1], id: 's5', titulo: 'Traducción de abstract', categoria: 'Redacción de tesis', estado: 'completado' as const, propuestas: 2, actualizadoHace: 'hace 9 d' },
]
const TODAS = [...SOLICITUDES, ...EXTRA]
const PROGRESO: Record<string, number> = { s1: 70, s2: 35, s3: 55, s4: 100, s5: 100 }

export default function RequestsPage() {
  const [tab, setTab] = useState('activas')
  const [q, setQ] = useState('')

  const activas = TODAS.filter(s => s.estado !== 'completado')
  const cerradas = TODAS.filter(s => s.estado === 'completado')
  const base = tab === 'activas' ? activas : tab === 'cerradas' ? cerradas : TODAS
  const lista = base.filter(s => s.titulo.toLowerCase().includes(q.toLowerCase()))

  return (
    <div>
      <PageHeader titulo="Mis solicitudes" descripcion="Todo lo que has publicado y en qué va cada cosa.">
        <Button to={ROUTES.nuevaSolicitud}><Plus size={16} /> Nueva solicitud</Button>
      </PageHeader>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          activa={tab} onChange={setTab}
          tabs={[
            { id: 'activas', label: 'Activas', contador: activas.length },
            { id: 'cerradas', label: 'Cerradas', contador: cerradas.length },
            { id: 'todas', label: 'Todas', contador: TODAS.length },
          ]}
        />
        <div className="flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-4 py-2 backdrop-blur-xl sm:w-72">
          <Search size={15} className="shrink-0 text-ink-muted" />
          <input
            value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar solicitud"
            className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-ink-muted/80"
          />
        </div>
      </div>

      {lista.length === 0 ? (
        <div className="panel">
          <EmptyState titulo="Nada por aquí" texto="No hay solicitudes que coincidan con lo que buscas.">
            <Button to={ROUTES.nuevaSolicitud} className="mt-2"><Plus size={16} /> Publicar una</Button>
          </EmptyState>
        </div>
      ) : (
        <motion.div variants={staggerContainer(0.07)} initial="hidden" animate="show" className="grid gap-3">
          {lista.map(s => (
            <motion.article
              key={s.id}
              variants={fadeUp}
              whileHover={{ x: 5 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              className="panel panel-hover group flex cursor-pointer items-center gap-4 p-4"
            >
              <ProgressRing valor={PROGRESO[s.id] ?? 50} tamano={54}
                color={s.estado === 'completado' ? '#6096FA' : '#16A34A'} />
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-[16px] font-bold">{s.titulo}</h3>
                <p className="truncate text-[13px] texto-suave">{s.categoria}</p>
                <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-ink-muted">
                  <span>{s.propuestas} propuestas</span>
                  <span>Actualizado {s.actualizadoHace}</span>
                </div>
              </div>
              <span className={`hidden shrink-0 rounded-full px-3 py-1.5 text-[12.5px] font-semibold sm:block ${
                s.estado === 'completado' ? 'bg-brand-50 text-brand-600'
                : s.estado === 'recibiendo' ? 'bg-amber-100 text-amber-500'
                : 'bg-success-100 text-success-500'}`}>
                {s.estado === 'completado' ? 'Completada' : s.estado === 'recibiendo' ? 'Recibiendo propuestas' : 'En progreso'}
              </span>
              <ArrowRight size={17} className="shrink-0 text-ink-muted transition-transform group-hover:translate-x-1 group-hover:text-brand-600" />
            </motion.article>
          ))}
        </motion.div>
      )}
    </div>
  )
}
