import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ArrowLeft, ArrowRight } from 'lucide-react'
import { Mascot } from '@/components/mascot/Mascot'
import { useElementRect } from '@/hooks/useElementRect'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'
import { cn } from '@/lib/cn'
import type { TourStep } from './tour.types'

const PAD = 10          // margen alrededor del elemento resaltado
const CARD_W = 340

interface Props {
  steps: TourStep[]
  index: number
  onNext: () => void
  onPrev: () => void
  onClose: () => void
}

/**
 * Capa del tour: oscurece la pantalla, abre un "hueco" sobre el elemento
 * del paso actual y muestra a la mascota explicando qué hacer.
 *
 * El hueco se logra con un box-shadow gigante: el recuadro queda limpio y
 * todo lo demás oscurecido, sin necesidad de máscaras SVG.
 */
export function TourOverlay({ steps, index, onNext, onPrev, onClose }: Props) {
  const step = steps[index]
  const medido = useElementRect(step.target)
  // Un elemento oculto (por ejemplo el menú de escritorio en móvil) mide 0:
  // en ese caso se ignora y el globo se muestra centrado, sin foco.
  const rect = medido && medido.width > 4 && medido.height > 4 ? medido : null
  const isLast = index === steps.length - 1
  useLockBodyScroll(true)

  // Teclado: ←  →  Esc
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight' || e.key === 'Enter') onNext()
      if (e.key === 'ArrowLeft') onPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onNext, onPrev, onClose])

  const card = getCardPosition(rect, step.placement)

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label="Guía interactiva">
      {/* Fondo oscurecido (cuando no hay elemento objetivo) */}
      {!rect && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-ink/60 backdrop-blur-[2px]" />}

      {/* Foco sobre el elemento */}
      {rect && (
        <motion.div
          initial={false}
          animate={{ top: rect.top - PAD, left: rect.left - PAD, width: rect.width + PAD * 2, height: rect.height + PAD * 2 }}
          transition={{ type: 'spring', stiffness: 260, damping: 30 }}
          className="pointer-events-none absolute rounded-2xl ring-4 ring-brand-400/70 animate-pulseRing"
          style={{ boxShadow: '0 0 0 9999px rgba(11,27,58,.62)' }}
        />
      )}

      {/* Globo explicativo */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 14, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="absolute"
          style={{ ...card, width: CARD_W }}
        >
          <div className="relative rounded-xl2 bg-white p-5 pt-4 shadow-[0_24px_70px_rgba(11,27,58,.35)]">
            {/* Mascota asomada */}
            <div className="pointer-events-none absolute -top-16 -left-6 w-28">
              <Mascot pose={step.pose ?? 'guia'} animation="pop" />
            </div>

            <button
              onClick={onClose}
              aria-label="Cerrar guía"
              className="absolute right-3 top-3 rounded-lg p-1.5 text-ink-muted transition hover:bg-brand-50 hover:text-brand-600"
            >
              <X size={16} />
            </button>

            <p className="mb-1 pl-16 text-[11px] font-bold uppercase tracking-widest text-brand-500">
              Paso {index + 1} de {steps.length}
            </p>
            <h3 className="pl-16 text-[17px] font-bold leading-snug">{step.titulo}</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{step.texto}</p>

            {/* Progreso */}
            <div className="mt-4 flex items-center gap-1.5">
              {steps.map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-300',
                    i === index ? 'w-6 bg-brand-500' : i < index ? 'w-1.5 bg-brand-300' : 'w-1.5 bg-surface-line',
                  )}
                />
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <button onClick={onClose} className="text-[13px] font-medium text-ink-muted hover:text-ink">
                Saltar guía
              </button>
              <div className="flex items-center gap-2">
                {index > 0 && (
                  <button
                    onClick={onPrev}
                    className="inline-flex h-9 items-center gap-1.5 rounded-full border border-surface-line px-4 text-[13px] font-semibold text-ink-soft transition hover:border-brand-300 hover:text-brand-600"
                  >
                    <ArrowLeft size={14} /> Atrás
                  </button>
                )}
                <button
                  onClick={onNext}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full bg-brand-600 px-5 text-[13px] font-semibold text-white transition hover:bg-brand-500"
                >
                  {isLast ? 'Entendido' : 'Siguiente'} <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/** Coloca el globo cerca del elemento sin salirse de la ventana. */
function getCardPosition(rect: DOMRect | null, placement: TourStep['placement'] = 'bottom') {
  const H = 250
  if (!rect) {
    return { top: `calc(50% - ${H / 2}px)`, left: `calc(50% - ${CARD_W / 2}px)` }
  }
  const gap = 22
  let top = rect.bottom + gap
  let left = rect.left

  if (placement === 'top') top = rect.top - H - gap
  if (placement === 'left') { top = rect.top; left = rect.left - CARD_W - gap }
  if (placement === 'right') { top = rect.top; left = rect.right + gap }

  // Corrección de bordes
  left = Math.min(Math.max(16, left), window.innerWidth - CARD_W - 16)
  top = Math.min(Math.max(80, top), window.innerHeight - H - 16)
  return { top, left }
}
