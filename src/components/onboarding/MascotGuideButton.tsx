import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Mascot } from '@/components/mascot/Mascot'
import { useReplayTour } from './useAutoTour'
import type { TourId } from './tours'
import { cn } from '@/lib/cn'

/**
 * Botón flotante de la mascota. Relanza la guía de la pantalla en la que
 * está el usuario. Aparece en todas las pantallas que tengan guía.
 */
export function MascotGuideButton({ tourId, className }: { tourId: TourId; className?: string }) {
  const replay = useReplayTour(tourId)
  const [hover, setHover] = useState(false)

  return (
    <div className={cn('fixed bottom-6 right-6 z-40 flex items-center gap-3', className)}>
      <AnimatePresence>
        {hover && (
          <motion.span
            initial={{ opacity: 0, x: 10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.9 }}
            className="rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-ink shadow-lift"
          >
            ¿Te muestro esta pantalla?
          </motion.span>
        )}
      </AnimatePresence>

      <motion.button
        data-tour="fab-guia"
        onClick={replay}
        onHoverStart={() => setHover(true)}
        onHoverEnd={() => setHover(false)}
        whileTap={{ scale: 0.92 }}
        animate={{ y: [0, -6, 0] }}
        transition={{ y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' } }}
        aria-label="Ver la guía de esta pantalla"
        className="grid h-[62px] w-[62px] place-items-center rounded-full bg-white shadow-lift ring-1 ring-surface-line transition-shadow hover:shadow-[0_18px_50px_rgba(29,78,216,.32)]"
      >
        <Mascot pose="saludo" animation="none" className="h-12 w-12" />
      </motion.button>
    </div>
  )
}
