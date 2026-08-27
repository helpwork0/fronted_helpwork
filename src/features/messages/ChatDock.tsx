import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Send, X, Smile } from 'lucide-react'
import { useMessages } from './MessagesContext'
import type { Conversacion } from '@/types'
import { cn } from '@/lib/cn'

/**
 * Ventanitas de chat ancladas abajo a la derecha, como en Facebook.
 * Se abren desde el desplegable de mensajes, se pueden minimizar y
 * conviven hasta tres a la vez.
 *
 * Se deja libre el borde derecho (right-[104px]) porque ahí está el
 * botón flotante de la mascota.
 */
export function ChatDock() {
  const { conversaciones, abiertos } = useMessages()

  return (
    <div className="pointer-events-none fixed bottom-0 right-[104px] z-40 hidden items-end gap-3 md:flex">
      <AnimatePresence>
        {abiertos.map(id => {
          const conv = conversaciones.find(c => c.id === id)
          return conv ? <VentanaChat key={id} conv={conv} /> : null
        })}
      </AnimatePresence>
    </div>
  )
}

function VentanaChat({ conv }: { conv: Conversacion }) {
  const { cerrarChat, alternarMinimizado, minimizados, enviar } = useMessages()
  const [texto, setTexto] = useState('')
  const finLista = useRef<HTMLDivElement>(null)
  const minimizado = minimizados.includes(conv.id)

  // Bajar al último mensaje cada vez que llega uno nuevo
  useEffect(() => {
    if (!minimizado) finLista.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conv.mensajes.length, minimizado])

  const mandar = () => { enviar(conv.id, texto); setTexto('') }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className="pointer-events-auto flex w-[330px] flex-col overflow-hidden rounded-t-xl2 border border-white/70 bg-white/85 shadow-[0_-8px_40px_rgba(11,27,58,.22)] backdrop-blur-2xl"
    >
      {/* Cabecera */}
      <header
        onClick={() => alternarMinimizado(conv.id)}
        className="flex cursor-pointer items-center gap-2.5 border-b border-white/60 bg-white/60 px-3 py-2.5"
      >
        <div className="relative shrink-0">
          <img src={conv.avatarUrl} alt="" className="h-9 w-9 rounded-full bg-brand-50 object-cover" />
          {conv.enLinea && <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-success-500 ring-2 ring-white" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-bold leading-tight">{conv.nombre}</p>
          <p className="truncate text-[11.5px] texto-suave">
            {conv.enLinea ? 'Activo ahora' : conv.rol}
          </p>
        </div>
        <button
          onClick={e => { e.stopPropagation(); alternarMinimizado(conv.id) }}
          aria-label={minimizado ? 'Abrir chat' : 'Minimizar chat'}
          className="grid h-7 w-7 place-items-center rounded-lg text-ink-soft transition hover:bg-brand-50"
        >
          <Minus size={15} />
        </button>
        <button
          onClick={e => { e.stopPropagation(); cerrarChat(conv.id) }}
          aria-label="Cerrar chat"
          className="grid h-7 w-7 place-items-center rounded-lg text-ink-soft transition hover:bg-red-50 hover:text-red-600"
        >
          <X size={15} />
        </button>
      </header>

      <AnimatePresence initial={false}>
        {!minimizado && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            {conv.sobre && (
              <p className="border-b border-white/60 bg-brand-50/60 px-3 py-1.5 text-center text-[11.5px] texto-suave">
                Sobre: <span className="font-semibold text-brand-600">{conv.sobre}</span>
              </p>
            )}

            {/* Mensajes */}
            <div className="flex h-[300px] flex-col gap-1.5 overflow-y-auto px-3 py-3">
              {conv.mensajes.map((m, i) => {
                const mio = m.autor === 'yo'
                const seguido = i > 0 && conv.mensajes[i - 1].autor === m.autor
                return (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={cn('flex items-end gap-1.5', mio ? 'justify-end' : 'justify-start', !seguido && i > 0 && 'mt-2')}
                  >
                    {!mio && !seguido && (
                      <img src={conv.avatarUrl} alt="" className="h-6 w-6 shrink-0 rounded-full bg-brand-50 object-cover" />
                    )}
                    {!mio && seguido && <span className="w-6 shrink-0" />}
                    <div
                      title={m.hora}
                      className={cn(
                        'max-w-[210px] rounded-2xl px-3 py-2 text-[13.5px] leading-snug',
                        mio
                          ? 'rounded-br-md bg-brand-600 text-white'
                          : 'rounded-bl-md bg-black/[.05] text-ink',
                      )}
                    >
                      {m.texto}
                    </div>
                  </motion.div>
                )
              })}
              <div ref={finLista} />
            </div>

            {/* Escribir */}
            <div className="flex items-center gap-2 border-t border-white/60 bg-white/60 px-2.5 py-2">
              <button aria-label="Emoji" className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-ink-muted transition hover:bg-brand-50 hover:text-brand-600">
                <Smile size={17} />
              </button>
              <input
                value={texto}
                onChange={e => setTexto(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') mandar() }}
                placeholder="Escribe un mensaje..."
                className="min-w-0 flex-1 rounded-full bg-black/[.04] px-3.5 py-2 text-[13.5px] outline-none transition focus:bg-black/[.06] placeholder:text-ink-muted/80"
              />
              <button
                onClick={mandar}
                disabled={!texto.trim()}
                aria-label="Enviar"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-600 text-white transition hover:bg-brand-500 disabled:opacity-40"
              >
                <Send size={15} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
