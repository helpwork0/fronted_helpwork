import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Send, Smile, Phone, Video, Info, ArrowLeft } from 'lucide-react'
import { useMessages } from './MessagesContext'
import { PageHeader } from '@/components/ui/PageHeader'
import { useAuth } from '@/features/auth/AuthContext'
import { contraparte } from '@/config/site.config'
import { EmptyState } from '@/components/ui/EmptyState'
import { cn } from '@/lib/cn'

/**
 * Bandeja de mensajes a pantalla completa (estilo Messenger):
 * lista de conversaciones a la izquierda, conversación abierta a la derecha.
 * En móvil se muestra una u otra, nunca las dos.
 */
export default function InboxPage() {
  const { conversaciones, abrirChat, enviar } = useMessages()
  const { usuario } = useAuth()
  const otros = contraparte(usuario?.rol ?? 'solicitante')
  const [activa, setActiva] = useState<string | null>(conversaciones[0]?.id ?? null)
  const [busqueda, setBusqueda] = useState('')
  const [texto, setTexto] = useState('')

  const conv = conversaciones.find(c => c.id === activa)
  const filtradas = conversaciones.filter(c => c.nombre.toLowerCase().includes(busqueda.toLowerCase()))

  const seleccionar = (id: string) => { setActiva(id); abrirChat(id) }
  const mandar = () => { if (conv) { enviar(conv.id, texto); setTexto('') } }

  return (
    <div>
      <PageHeader
        titulo="Mensajes"
        descripcion={`Tus conversaciones con ${otros.plural}.`}
      />

      <div className="panel grid h-[calc(100vh-230px)] min-h-[520px] overflow-hidden md:grid-cols-[320px_1fr]">
        {/* ---- Lista ---- */}
        <aside className={cn('flex flex-col border-white/60 md:border-r', activa && 'hidden md:flex')}>
          <div className="border-b border-white/60 p-3">
            <div className="flex items-center gap-2 rounded-full bg-black/[.04] px-3.5 py-2">
              <Search size={15} className="shrink-0 text-ink-muted" />
              <input
                value={busqueda} onChange={e => setBusqueda(e.target.value)}
                placeholder="Buscar conversación"
                className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-ink-muted/80"
              />
            </div>
          </div>

          <ul className="flex-1 overflow-y-auto p-2">
            {filtradas.map(c => {
              const ultimo = c.mensajes[c.mensajes.length - 1]
              return (
                <li key={c.id}>
                  <button
                    onClick={() => seleccionar(c.id)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition',
                      activa === c.id ? 'bg-brand-50 ring-1 ring-brand-100' : 'hover:bg-white/70',
                    )}
                  >
                    <div className="relative shrink-0">
                      <img src={c.avatarUrl} alt="" className="h-12 w-12 rounded-full bg-brand-50 object-cover" />
                      {c.enLinea && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-success-500 ring-2 ring-white" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={cn('truncate text-[14.5px]', c.noLeidos ? 'font-bold' : 'font-semibold')}>{c.nombre}</p>
                      <p className={cn('truncate text-[12.5px]', c.noLeidos ? 'font-medium text-ink' : 'texto-suave')}>
                        {ultimo.autor === 'yo' && 'Tú: '}{ultimo.texto}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span className="text-[11px] text-ink-muted">{ultimo.hora}</span>
                      {c.noLeidos > 0 && (
                        <span className="grid h-5 min-w-[20px] place-items-center rounded-full bg-brand-600 px-1 text-[11px] font-bold text-white">
                          {c.noLeidos}
                        </span>
                      )}
                    </div>
                  </button>
                </li>
              )
            })}
            {filtradas.length === 0 && <li className="py-10 text-center text-[14px] texto-suave">Sin resultados</li>}
          </ul>
        </aside>

        {/* ---- Conversación ---- */}
        <section className={cn('flex flex-col', !activa && 'hidden md:flex')}>
          {conv ? (
            <>
              <header className="flex items-center gap-3 border-b border-white/60 bg-white/50 px-4 py-3">
                <button onClick={() => setActiva(null)} className="grid h-9 w-9 place-items-center rounded-lg text-ink-soft hover:bg-brand-50 md:hidden">
                  <ArrowLeft size={18} />
                </button>
                <img src={conv.avatarUrl} alt="" className="h-11 w-11 shrink-0 rounded-full bg-brand-50 object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15.5px] font-bold leading-tight">{conv.nombre}</p>
                  <p className="truncate text-[12.5px] texto-suave">
                    {conv.enLinea ? 'Activo ahora' : conv.rol}{conv.sobre && ` · ${conv.sobre}`}
                  </p>
                </div>
                {[Phone, Video, Info].map((Icono, i) => (
                  <button key={i} className="grid h-9 w-9 place-items-center rounded-lg text-ink-soft transition hover:bg-brand-50 hover:text-brand-600">
                    <Icono size={18} />
                  </button>
                ))}
              </header>

              <div className="flex flex-1 flex-col gap-1.5 overflow-y-auto px-5 py-4">
                <AnimatePresence initial={false}>
                  {conv.mensajes.map((m, i) => {
                    const mio = m.autor === 'yo'
                    const seguido = i > 0 && conv.mensajes[i - 1].autor === m.autor
                    return (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        className={cn('flex items-end gap-2', mio ? 'justify-end' : 'justify-start', !seguido && i > 0 && 'mt-3')}
                      >
                        {!mio && (seguido
                          ? <span className="w-7 shrink-0" />
                          : <img src={conv.avatarUrl} alt="" className="h-7 w-7 shrink-0 rounded-full bg-brand-50 object-cover" />)}
                        <div className={cn(
                          'max-w-[min(460px,70%)] rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed',
                          mio ? 'rounded-br-md bg-brand-600 text-white' : 'rounded-bl-md bg-black/[.05]',
                        )}>
                          {m.texto}
                          <span className={cn('ml-2 text-[10.5px]', mio ? 'text-white/70' : 'text-ink-muted')}>{m.hora}</span>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-2 border-t border-white/60 bg-white/50 px-3 py-3">
                <button className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink-muted transition hover:bg-brand-50 hover:text-brand-600">
                  <Smile size={18} />
                </button>
                <input
                  value={texto} onChange={e => setTexto(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') mandar() }}
                  placeholder="Escribe un mensaje..."
                  className="min-w-0 flex-1 rounded-full bg-black/[.04] px-4 py-2.5 text-[14px] outline-none transition focus:bg-black/[.06] placeholder:text-ink-muted/80"
                />
                <button
                  onClick={mandar} disabled={!texto.trim()} aria-label="Enviar"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-600 text-white transition hover:bg-brand-500 disabled:opacity-40"
                >
                  <Send size={17} />
                </button>
              </div>
            </>
          ) : (
            <EmptyState titulo="Elige una conversación" texto="Selecciona alguien de la lista para ver los mensajes." />
          )}
        </section>
      </div>
    </div>
  )
}
