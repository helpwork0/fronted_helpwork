import { motion } from 'framer-motion'
import { Wallet, ShieldCheck, TrendingUp, Download, CreditCard } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { AnimatedNumber } from '../components/AnimatedNumber'
import { PAGOS } from '@/data/appData'
import { staggerContainer, fadeUp } from '@/lib/motion/variants'

const ESTADOS = {
  retenido:  { txt: 'Retenido', clase: 'bg-amber-100 text-amber-500' },
  liberado:  { txt: 'Liberado', clase: 'bg-success-100 text-success-500' },
  pendiente: { txt: 'Pendiente', clase: 'bg-black/[.06] text-ink-muted' },
}

/** Pagos del solicitante. El mismo componente sirve de base para el HelpWorker. */
export default function PaymentsPage({ modo = 'solicitante' }: { modo?: 'solicitante' | 'helpworker' }) {
  const esHW = modo === 'helpworker'
  const total = PAGOS.reduce((n, p) => n + p.monto, 0)
  const retenido = PAGOS.filter(p => p.estado === 'retenido').reduce((n, p) => n + p.monto, 0)

  return (
    <div>
      <PageHeader
        titulo={esHW ? 'Ganancias' : 'Pagos'}
        descripcion={esHW ? 'Lo que has ganado y lo que está por liberarse.' : 'Tu historial y el dinero retenido en garantía.'}
      >
        <Button variant="secondary" size="sm"><Download size={15} /> Descargar historial</Button>
      </PageHeader>

      <motion.div variants={staggerContainer(0.07)} initial="hidden" animate="show"
        className="mb-5 grid gap-4 sm:grid-cols-3">
        <Resumen icon={esHW ? TrendingUp : Wallet} tono="bg-brand-50 text-brand-600"
          label={esHW ? 'Total ganado' : 'Total gastado'} valor={total} />
        <Resumen icon={ShieldCheck} tono="bg-amber-100 text-amber-500" label="Retenido en garantía" valor={retenido} />
        <Resumen icon={CreditCard} tono="bg-success-100 text-success-500" label="Movimientos" valor={PAGOS.length} moneda={false} />
      </motion.div>

      <div className="panel overflow-hidden">
        <div className="border-b border-white/60 px-5 py-4">
          <h2 className="text-[17px] font-bold">Historial</h2>
        </div>
        <ul className="divide-y divide-white/60">
          {PAGOS.map((p, i) => (
            <motion.li
              key={p.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
              className="flex flex-wrap items-center gap-4 px-5 py-4 transition hover:bg-white/50"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-bold">{p.concepto}</p>
                <p className="truncate text-[13px] texto-suave">
                  {esHW ? 'Cliente' : 'Para'}: {p.contraparte} · {p.metodo}
                </p>
              </div>
              <span className="shrink-0 text-[13px] text-ink-muted">{p.fecha}</span>
              <span className={`shrink-0 rounded-full px-3 py-1 text-[12px] font-semibold ${ESTADOS[p.estado].clase}`}>
                {ESTADOS[p.estado].txt}
              </span>
              <span className="w-20 shrink-0 text-right text-[16px] font-extrabold">${p.monto}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      <div className="panel mt-5 flex gap-3 p-5">
        <ShieldCheck size={20} className="mt-0.5 shrink-0 text-brand-500" />
        <p className="text-[13.5px] texto-suave">
          El dinero queda retenido por HelpWork y solo se libera cuando ambas partes confirman
          que el trabajo terminó. Si algo no sale como esperabas, puedes abrir una disputa antes de liberar.
        </p>
      </div>
    </div>
  )
}

function Resumen({ icon: Icon, label, valor, tono, moneda = true }: {
  icon: typeof Wallet; label: string; valor: number; tono: string; moneda?: boolean
}) {
  return (
    <motion.div variants={fadeUp} className="panel panel-hover flex items-center gap-4 p-5">
      <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${tono}`}><Icon size={21} /></span>
      <div className="min-w-0">
        <p className="truncate text-[12.5px] texto-suave">{label}</p>
        <p className="text-[24px] font-extrabold leading-tight">
          <AnimatedNumber valor={valor} prefijo={moneda ? '$' : ''} />
        </p>
      </div>
    </motion.div>
  )
}
