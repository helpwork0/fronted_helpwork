import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { bubbleIn } from '@/lib/motion/variants'
import { cn } from '@/lib/cn'

type Tone = 'neutral' | 'success' | 'amber'

export interface ChatMessage {
  id: string
  texto: string
  tone?: Tone
  icon?: 'check' | 'star'
}

const toneStyles: Record<Tone, string> = {
  neutral: 'bg-white text-ink',
  success: 'bg-success-100 text-ink',
  amber: 'bg-amber-100 text-ink',
}

interface Props {
  messages: ChatMessage[]
  className?: string
  stepDelay?: number
  loop?: boolean
  /**
   * 'chat'    → burbujas de conversación alineadas a la derecha.
   * 'thought' → nube de pensamiento sobre la cabeza de la mascota,
   *             con la estela de burbujitas apuntando hacia abajo.
   */
  variant?: 'chat' | 'thought'
  /**
   * Cuántas burbujas se ven a la vez. Al superarlo, la más antigua se va por
   * arriba y entra la nueva por abajo: la lista puede ser larga sin que la
   * nube crezca ni empuje el resto de la pantalla.
   */
  maxVisible?: number
}

/**
 * Conversación que se despliega sola, mensaje a mensaje, con indicador de
 * "escribiendo…" entre uno y otro. `loop` reinicia la secuencia para que
 * siempre haya movimiento en pantalla.
 */
export function MascotChat({
  messages,
  className,
  stepDelay = 1500,
  loop = true,
  variant = 'chat',
  maxVisible = 3,
}: Props) {
  const [visible, setVisible] = useState(0)
  const [typing, setTyping] = useState(true)
  const esPensamiento = variant === 'thought'

  useEffect(() => {
    let cancelled = false
    const timers: number[] = []

    const run = () => {
      messages.forEach((_, i) => {
        timers.push(window.setTimeout(() => {
          if (cancelled) return
          setTyping(true)
          window.setTimeout(() => !cancelled && setTyping(false), 520)
          setVisible(i + 1)
        }, stepDelay * i + 500))
      })

      timers.push(window.setTimeout(() => {
        if (cancelled) return
        setTyping(false)
        if (loop) {
          window.setTimeout(() => { if (!cancelled) { setVisible(0); run() } }, 3200)
        }
      }, stepDelay * messages.length + 500))
    }

    run()
    return () => { cancelled = true; timers.forEach(clearTimeout) }
  }, [messages, stepDelay, loop])

  return (
    <div className={cn('flex flex-col', esPensamiento ? 'items-center gap-2' : 'items-end gap-3', className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        {messages.slice(Math.max(0, visible - maxVisible), visible).map(m => (
          <motion.div
            key={m.id}
            layout
            variants={bubbleIn}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, scale: 0.92, y: -8, transition: { duration: 0.35 } }}
            className={cn(
              'flex items-start gap-2 font-medium leading-snug shadow-soft',
              toneStyles[m.tone ?? 'neutral'],
              esPensamiento
                ? 'max-w-[230px] rounded-[22px] border border-white/70 px-4 py-2.5 text-[13px]'
                : 'max-w-[240px] rounded-2xl px-4 py-3 text-[13.5px]',
            )}
          >
            {m.icon === 'check' && <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-success-500" />}
            {m.icon === 'star' && <span className="mt-[1px] shrink-0 text-[13px]">⭐</span>}
            <span>{m.texto}</span>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Indicador "escribiendo…" / "pensando…" */}
      <AnimatePresence>
        {typing && visible < messages.length && (
          <motion.div
            variants={bubbleIn}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, scale: 0.85 }}
            className={cn(
              'flex items-center gap-1.5 bg-white shadow-soft',
              esPensamiento ? 'rounded-[22px] border border-white/70 px-4 py-3' : 'rounded-2xl px-4 py-3.5',
            )}
          >
            {[0, 1, 2].map(i => (
              <motion.span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-brand-300"
                animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.18 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Estela de la nube de pensamiento: dos burbujitas hacia la cabeza */}
      {esPensamiento && (
        <div className="flex flex-col items-center gap-1 pt-0.5">
          {[10, 6].map((s, i) => (
            <motion.span
              key={s}
              className="rounded-full bg-white/90 shadow-soft ring-1 ring-white/70"
              style={{ width: s, height: s }}
              animate={{ scale: [1, 1.18, 1], opacity: [0.75, 1, 0.75] }}
              transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.35, ease: 'easeInOut' }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
