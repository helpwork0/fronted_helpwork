import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { EVENTOS } from '@/data/appData'
import { cn } from '@/lib/cn'

const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

const TIPOS = {
  clase:   'bg-brand-500',
  entrega: 'bg-amber-500',
  reunion: 'bg-violet-500',
}

export default function CalendarPage() {
  const hoy = new Date()
  const [mes, setMes] = useState(hoy.getMonth())
  const [anio, setAnio] = useState(hoy.getFullYear())
  const [seleccion, setSeleccion] = useState<number | null>(hoy.getDate())

  const diasDelMes = new Date(anio, mes + 1, 0).getDate()
  // getDay() da 0 para domingo; se corrige para que la semana empiece en lunes
  const primerDia = (new Date(anio, mes, 1).getDay() + 6) % 7

  const cambiarMes = (delta: number) => {
    const d = new Date(anio, mes + delta, 1)
    setMes(d.getMonth()); setAnio(d.getFullYear()); setSeleccion(null)
  }

  const eventosDe = (dia: number) => EVENTOS.filter(e => e.dia === dia)
  const eventosSeleccion = seleccion ? eventosDe(seleccion) : []

  return (
    <div>
      <PageHeader titulo="Calendario" descripcion="Tus clases, entregas y reuniones." />

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        {/* ---- Mes ---- */}
        <div className="panel p-5">
          <header className="mb-4 flex items-center justify-between">
            <h2 className="text-[18px] font-bold capitalize">{MESES[mes]} {anio}</h2>
            <div className="flex gap-1">
              <button onClick={() => cambiarMes(-1)} aria-label="Mes anterior"
                className="grid h-9 w-9 place-items-center rounded-lg text-ink-soft transition hover:bg-brand-50 hover:text-brand-600">
                <ChevronLeft size={18} />
              </button>
              <button onClick={() => cambiarMes(1)} aria-label="Mes siguiente"
                className="grid h-9 w-9 place-items-center rounded-lg text-ink-soft transition hover:bg-brand-50 hover:text-brand-600">
                <ChevronRight size={18} />
              </button>
            </div>
          </header>

          <div className="grid grid-cols-7 gap-1.5">
            {DIAS.map(d => (
              <div key={d} className="pb-2 text-center text-[12px] font-bold texto-suave">{d}</div>
            ))}

            {Array.from({ length: primerDia }).map((_, i) => <div key={`v${i}`} />)}

            {Array.from({ length: diasDelMes }).map((_, i) => {
              const dia = i + 1
              const evs = eventosDe(dia)
              const esHoy = dia === hoy.getDate() && mes === hoy.getMonth() && anio === hoy.getFullYear()
              return (
                <motion.button
                  key={dia}
                  whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }}
                  onClick={() => setSeleccion(dia)}
                  className={cn(
                    'relative flex aspect-square flex-col items-center justify-center rounded-xl text-[14px] font-medium transition-colors',
                    seleccion === dia ? 'bg-brand-600 text-white'
                      : esHoy ? 'bg-brand-50 font-bold text-brand-600'
                      : 'hover:bg-white/80',
                  )}
                >
                  {dia}
                  {evs.length > 0 && (
                    <span className="absolute bottom-1.5 flex gap-0.5">
                      {evs.slice(0, 3).map((e, k) => (
                        <span key={k} className={cn('h-1.5 w-1.5 rounded-full',
                          seleccion === dia ? 'bg-white' : TIPOS[e.tipo])} />
                      ))}
                    </span>
                  )}
                </motion.button>
              )
            })}
          </div>

          <div className="mt-5 flex flex-wrap gap-4 border-t border-white/60 pt-4 text-[12.5px] texto-suave">
            {Object.entries(TIPOS).map(([k, c]) => (
              <span key={k} className="inline-flex items-center gap-1.5 capitalize">
                <span className={cn('h-2.5 w-2.5 rounded-full', c)} /> {k}
              </span>
            ))}
          </div>
        </div>

        {/* ---- Día seleccionado ---- */}
        <aside className="panel p-5">
          <h2 className="text-[17px] font-bold">
            {seleccion ? `${seleccion} de ${MESES[mes]}` : 'Elige un día'}
          </h2>

          <div className="mt-4 space-y-3">
            {eventosSeleccion.map((e, i) => (
              <motion.article
                key={i}
                initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                className="rounded-xl2 border border-white/70 bg-white/65 p-3.5"
              >
                <div className="flex items-center gap-2">
                  <span className={cn('h-2.5 w-2.5 shrink-0 rounded-full', TIPOS[e.tipo])} />
                  <h3 className="truncate text-[14.5px] font-bold">{e.titulo}</h3>
                </div>
                <p className="mt-1 text-[13px] texto-suave">{e.cliente}</p>
                <p className="mt-1.5 inline-flex items-center gap-1 text-[12.5px] text-ink-muted">
                  <Clock size={12} /> {e.hora}
                </p>
              </motion.article>
            ))}

            {seleccion && eventosSeleccion.length === 0 && (
              <p className="rounded-xl border border-dashed border-white/80 px-4 py-8 text-center text-[13px] texto-suave">
                Nada agendado este día
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
