import { useState } from 'react'
import { motion } from 'framer-motion'
import { Inbox, MessageSquare, Wallet, Info, CheckCheck } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Tabs } from '@/components/ui/Tabs'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { NOTIFICACIONES, NOTIFICACIONES_HW, type Notificacion } from '@/data/appData'
import { useAuth } from '@/features/auth/AuthContext'
import { cn } from '@/lib/cn'

const ICONOS = {
  propuesta: { icon: Inbox, clase: 'bg-brand-50 text-brand-600' },
  mensaje:   { icon: MessageSquare, clase: 'bg-success-100 text-success-500' },
  pago:      { icon: Wallet, clase: 'bg-amber-100 text-amber-500' },
  sistema:   { icon: Info, clase: 'bg-violet-100 text-violet-600' },
}

export default function NotificationsPage() {
  const { usuario } = useAuth()
  // Cada rol recibe avisos distintos: al HelpWorker le importan las
  // solicitudes nuevas; al HelpSeeker, las propuestas que le llegan.
  const esHW = usuario?.rol === 'helpworker'
  const [items, setItems] = useState<Notificacion[]>(esHW ? NOTIFICACIONES_HW : NOTIFICACIONES)
  const [tab, setTab] = useState('todas')

  const sinLeer = items.filter(n => !n.leida)
  const lista = tab === 'sin-leer' ? sinLeer : items
  const marcarTodas = () => setItems(is => is.map(n => ({ ...n, leida: true })))

  return (
    <div>
      <PageHeader titulo="Notificaciones" descripcion="Todo lo que pasó mientras no estabas.">
        <Button variant="secondary" size="sm" onClick={marcarTodas} disabled={sinLeer.length === 0}>
          <CheckCheck size={15} /> Marcar todas como leídas
        </Button>
      </PageHeader>

      <div className="mb-4">
        <Tabs activa={tab} onChange={setTab} tabs={[
          { id: 'todas', label: 'Todas', contador: items.length },
          { id: 'sin-leer', label: 'Sin leer', contador: sinLeer.length },
        ]} />
      </div>

      {lista.length === 0 ? (
        <div className="panel"><EmptyState titulo="Todo al día" texto="No tienes notificaciones sin leer." /></div>
      ) : (
        <div className="panel divide-y divide-white/60 overflow-hidden">
          {lista.map((n, i) => {
            const { icon: Icono, clase } = ICONOS[n.tipo]
            return (
              <motion.button
                key={n.id}
                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                onClick={() => setItems(is => is.map(x => x.id === n.id ? { ...x, leida: true } : x))}
                className={cn('flex w-full items-start gap-4 px-5 py-4 text-left transition hover:bg-white/60',
                  !n.leida && 'bg-brand-50/50')}
              >
                <span className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-full', clase)}>
                  <Icono size={17} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className={cn('text-[14.5px] leading-snug', n.leida ? 'texto-suave' : 'font-medium')}>{n.texto}</p>
                  <p className="mt-0.5 text-[12px] text-ink-muted">{n.hace}</p>
                </div>
                {!n.leida && <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-brand-500" />}
              </motion.button>
            )
          })}
        </div>
      )}
    </div>
  )
}
