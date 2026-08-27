import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, LifeBuoy, BookOpen, MessageCircle, Search } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { Mascot } from '@/components/mascot/Mascot'
import { FAQ } from '@/data/appData'
import { useMessages } from '@/features/messages/MessagesContext'
import { useReplayTour } from '@/components/onboarding/useAutoTour'
import { cn } from '@/lib/cn'

export default function HelpPage() {
  const [abierta, setAbierta] = useState<number | null>(0)
  const [q, setQ] = useState('')
  const { abrirChat } = useMessages()
  const repetirGuia = useReplayTour('solicitante')

  const lista = FAQ.filter(f => (f.p + f.r).toLowerCase().includes(q.toLowerCase()))

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader titulo="Centro de ayuda" descripcion="Resuelve tus dudas o habla con nosotros." />

      {/* Accesos */}
      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        <Atajo icon={BookOpen} titulo="Ver la guía otra vez" texto="Te repito el recorrido de la app" onClick={repetirGuia} />
        <Atajo icon={MessageCircle} titulo="Escribir a soporte" texto="Respondemos en menos de 2 h" onClick={() => abrirChat('cv4')} />
        <Atajo icon={LifeBuoy} titulo="Reportar un problema" texto="Cuéntanos qué salió mal" onClick={() => abrirChat('cv4')} />
      </div>

      {/* Buscador */}
      <div className="panel mb-4 flex items-center gap-2 px-5 py-3">
        <Search size={17} className="shrink-0 text-ink-muted" />
        <input
          value={q} onChange={e => setQ(e.target.value)} placeholder="Busca en las preguntas frecuentes"
          className="min-w-0 flex-1 bg-transparent py-1 text-[15px] outline-none placeholder:text-ink-muted/80"
        />
      </div>

      {/* Preguntas */}
      <div className="panel divide-y divide-white/60 overflow-hidden">
        {lista.map((f, i) => (
          <div key={f.p}>
            <button
              onClick={() => setAbierta(abierta === i ? null : i)}
              className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-white/60"
            >
              <span className="flex-1 text-[15px] font-semibold">{f.p}</span>
              <ChevronDown size={18} className={cn('shrink-0 text-ink-muted transition-transform duration-300', abierta === i && 'rotate-180 text-brand-600')} />
            </button>
            <AnimatePresence initial={false}>
              {abierta === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }} className="overflow-hidden"
                >
                  <p className="px-5 pb-4 text-[14px] leading-relaxed texto-suave">{f.r}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
        {lista.length === 0 && <p className="px-5 py-10 text-center text-[14px] texto-suave">Sin resultados para "{q}"</p>}
      </div>

      <div className="panel mt-5 flex items-center gap-5 bg-gradient-to-r from-brand-50/80 to-white/50 p-5">
        <Mascot pose="guia" animation="none" className="w-[78px]" />
        <div className="min-w-0 flex-1">
          <p className="text-[16px] font-bold">¿No encontraste lo que buscabas?</p>
          <p className="text-[13.5px] texto-suave">Escríbenos y te respondemos por chat.</p>
        </div>
        <Button size="sm" onClick={() => abrirChat('cv4')}>Hablar con soporte</Button>
      </div>
    </div>
  )
}

function Atajo({ icon: Icon, titulo, texto, onClick }: {
  icon: typeof LifeBuoy; titulo: string; texto: string; onClick: () => void
}) {
  return (
    <button onClick={onClick}
      className="panel panel-hover flex items-center gap-3.5 p-4 text-left">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
        <Icon size={19} />
      </span>
      <span className="min-w-0">
        <span className="block text-[14.5px] font-bold">{titulo}</span>
        <span className="block text-[12.5px] texto-suave">{texto}</span>
      </span>
    </button>
  )
}
