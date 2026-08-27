import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, Check, X, MessageSquare } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Tabs } from '@/components/ui/Tabs'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { PROPUESTAS } from '@/data/appData'
import { useMessages } from '@/features/messages/MessagesContext'
import { staggerContainer, fadeUp } from '@/lib/motion/variants'

const ETIQUETAS = {
  pendiente: { txt: 'Pendiente', clase: 'bg-amber-100 text-amber-500' },
  aceptada:  { txt: 'Aceptada',  clase: 'bg-success-100 text-success-500' },
  rechazada: { txt: 'Rechazada', clase: 'bg-black/[.06] text-ink-muted' },
}

export default function ProposalsPage() {
  const [tab, setTab] = useState('pendiente')
  const { abrirChat } = useMessages()
  const lista = tab === 'todas' ? PROPUESTAS : PROPUESTAS.filter(p => p.estado === tab)

  return (
    <div>
      <PageHeader titulo="Propuestas recibidas" descripcion="Compara y elige a quién contratar." />

      <div className="mb-4">
        <Tabs
          activa={tab} onChange={setTab}
          tabs={[
            { id: 'pendiente', label: 'Pendientes', contador: PROPUESTAS.filter(p => p.estado === 'pendiente').length },
            { id: 'aceptada', label: 'Aceptadas', contador: PROPUESTAS.filter(p => p.estado === 'aceptada').length },
            { id: 'rechazada', label: 'Rechazadas', contador: PROPUESTAS.filter(p => p.estado === 'rechazada').length },
            { id: 'todas', label: 'Todas', contador: PROPUESTAS.length },
          ]}
        />
      </div>

      {lista.length === 0 ? (
        <div className="panel"><EmptyState titulo="Sin propuestas aquí" texto="Cuando lleguen propuestas en este estado, aparecerán en esta lista." /></div>
      ) : (
        <motion.div variants={staggerContainer(0.07)} initial="hidden" animate="show" className="grid gap-3">
          {lista.map(p => (
            <motion.article key={p.id} variants={fadeUp} className="panel panel-hover p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                <img src={p.avatarUrl} alt="" className="h-14 w-14 shrink-0 rounded-full object-cover" />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-[16.5px] font-bold">{p.helpworker}</h3>
                    <span className={`rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold ${ETIQUETAS[p.estado].clase}`}>
                      {ETIQUETAS[p.estado].txt}
                    </span>
                  </div>
                  <p className="text-[13px] texto-suave">
                    {p.profesion} · <Star size={11} className="inline text-amber-500" /> {p.rating}
                  </p>
                  <p className="mt-2.5 text-[14px] leading-relaxed text-ink-soft">{p.mensaje}</p>
                  <p className="mt-2 text-[12.5px] text-ink-muted">
                    Para <span className="font-semibold text-brand-600">{p.solicitud}</span> · {p.hace}
                  </p>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-3">
                  <p className="text-[20px] font-extrabold">
                    ${p.precio}<span className="text-[13px] font-normal text-ink-muted"> / {p.unidad}</span>
                  </p>
                  {p.estado === 'pendiente' ? (
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => abrirChat('cv1')}>
                        <MessageSquare size={14} /> Chat
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50"><X size={14} /></Button>
                      <Button size="sm" variant="success"><Check size={14} /> Aceptar</Button>
                    </div>
                  ) : (
                    <Button size="sm" variant="secondary" onClick={() => abrirChat('cv1')}>
                      <MessageSquare size={14} /> Ver conversación
                    </Button>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      )}
    </div>
  )
}
