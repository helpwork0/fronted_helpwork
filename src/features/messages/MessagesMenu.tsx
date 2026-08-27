import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageSquare, Search } from 'lucide-react'
import { useMessages } from './MessagesContext'
import { cn } from '@/lib/cn'

/**
 * Icono de mensajes de la barra superior, al estilo de Facebook:
 * un contador de no leídos y, al tocarlo, la lista de conversaciones.
 * Elegir una abre el mini chat abajo a la derecha.
 */
export function MessagesMenu() {
  const { conversaciones, totalNoLeidos, abrirChat } = useMessages()
  const [abierto, setAbierto] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const caja = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!abierto) return
    const fuera = (e: MouseEvent) => {
      if (caja.current && !caja.current.contains(e.target as Node)) setAbierto(false)
    }
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setAbierto(false) }
    document.addEventListener('mousedown', fuera)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', fuera)
      document.removeEventListener('keydown', esc)
    }
  }, [abierto])

  const filtradas = conversaciones.filter(c =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()),
  )

  return (
    <div ref={caja} className="relative">
      <button
        onClick={() => setAbierto(v => !v)}
        aria-label={`Mensajes${totalNoLeidos ? `, ${totalNoLeidos} sin leer` : ''}`}
        aria-expanded={abierto}
        className={cn(
          'relative grid h-10 w-10 place-items-center rounded-xl transition-colors',
          abierto ? 'bg-brand-100 text-brand-600' : 'text-ink-soft hover:bg-brand-50 hover:text-brand-600',
        )}
      >
        <MessageSquare size={19} />
        <AnimatePresence>
          {totalNoLeidos > 0 && (
            <motion.span
              initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 480, damping: 22 }}
              className="absolute -right-0.5 -top-0.5 grid h-[19px] min-w-[19px] place-items-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white ring-2 ring-white"
            >
              {totalNoLeidos}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {abierto && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 top-full z-50 mt-2 w-[368px] overflow-hidden rounded-xl2 border border-white/70 bg-white/85 shadow-lift backdrop-blur-2xl"
          >
            <div className="px-4 pb-3 pt-4">
              <h3 className="text-[19px] font-extrabold">Mensajes</h3>
              <div className="mt-3 flex items-center gap-2 rounded-full bg-black/[.04] px-3.5 py-2">
                <Search size={15} className="shrink-0 text-ink-muted" />
                <input
                  value={busqueda}
                  onChange={e => setBusqueda(e.target.value)}
                  placeholder="Buscar en Mensajes"
                  className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-ink-muted/80"
                />
              </div>
            </div>

            <ul className="max-h-[380px] overflow-y-auto px-2 pb-2">
              {filtradas.map(c => {
                const ultimo = c.mensajes[c.mensajes.length - 1]
                return (
                  <li key={c.id}>
                    <button
                      onClick={() => { abrirChat(c.id); setAbierto(false) }}
                      className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition hover:bg-brand-50/80"
                    >
                      <div className="relative shrink-0">
                        <img src={c.avatarUrl} alt="" className="h-12 w-12 rounded-full bg-brand-50 object-cover" />
                        {c.enLinea && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-success-500 ring-2 ring-white" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={cn('truncate text-[14.5px]', c.noLeidos ? 'font-bold' : 'font-semibold')}>
                          {c.nombre}
                        </p>
                        <p className={cn('truncate text-[13px]', c.noLeidos ? 'font-medium text-ink' : 'texto-suave')}>
                          {ultimo.autor === 'yo' && 'Tú: '}{ultimo.texto}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <span className="text-[11.5px] text-ink-muted">{ultimo.hora}</span>
                        {c.noLeidos > 0 && <span className="h-2.5 w-2.5 rounded-full bg-brand-500" />}
                      </div>
                    </button>
                  </li>
                )
              })}

              {filtradas.length === 0 && (
                <li className="px-4 py-8 text-center text-[14px] texto-suave">Sin resultados</li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
