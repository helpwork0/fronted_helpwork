import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { Mascot } from '@/components/mascot/Mascot'
import { useTour } from './TourProvider'
import { TOURS, type TourId } from './tours'
import { cn } from '@/lib/cn'
import { http } from '@/lib/api/http'
import { ENDPOINTS } from '@/lib/api/endpoints'
import type { TourStep } from './tour.types'

type RemoteTutorial = { module_key: string; title: string; steps: TourStep[] }

function moduleKeyFor(pathname: string, scope: 'solicitante' | 'helpworker' | 'administrador') {
  const part = pathname.split('/').filter(Boolean).at(-1) ?? ''
  const normalized = part === 'app' || part === 'solicitante' || part === 'helpworker' || part === 'administrador' ? 'inicio' : part === 'nueva' ? 'nueva-solicitud' : part
  if (scope === 'helpworker' && pathname.includes('/solicitante/')) return `solicitante-${normalized}`
  return `${scope}-${normalized}`
}

/**
 * Botón flotante de la mascota. Relanza la guía de la pantalla en la que
 * está el usuario. Aparece en todas las pantallas que tengan guía.
 */
export function MascotGuideButton({ tourId, className }: { tourId: TourId; className?: string }) {
  const { pathname } = useLocation()
  const { start } = useTour()
  const [hover, setHover] = useState(false)
  const [hint, setHint] = useState(true)
  const [loading, setLoading] = useState(false)
  useEffect(() => { const timer = window.setInterval(() => setHint(value => !value), 3000); return () => window.clearInterval(timer) }, [])
  const replay = useCallback(async () => {
    const scope = tourId === 'modulo-solicitante' ? 'solicitante' : tourId === 'modulo-proveedor' ? 'helpworker' : tourId === 'modulo-administrador' ? 'administrador' : null
    if (!scope) { start(TOURS[tourId]); return }
    setLoading(true)
    try {
      const tutorial = await http.get<RemoteTutorial>(ENDPOINTS.tutoriales.modulo(moduleKeyFor(pathname, scope)))
      start(tutorial.steps)
    } catch {
      // Respaldo mínimo mientras aún no se ejecuta la migración de tutoriales.
      start(TOURS[tourId])
    } finally { setLoading(false) }
  }, [pathname, start, tourId])

  return (
    <div className={cn('fixed bottom-6 right-6 z-40 flex items-center gap-3', className)}>
      <AnimatePresence>
        {(hover || hint) && (
          <motion.span
            initial={{ opacity: 0, x: 10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.9 }}
            className="rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-ink shadow-lift"
          >
            ¿Necesitas ayuda? Da clic
          </motion.span>
        )}
      </AnimatePresence>

      <motion.button
        data-tour="fab-guia"
        onClick={() => void replay()}
        onHoverStart={() => setHover(true)}
        onHoverEnd={() => setHover(false)}
        whileTap={{ scale: 0.92 }}
        animate={{ y: [0, -6, 0] }}
        transition={{ y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' } }}
        aria-label="Ver la guía de esta pantalla"
        className="grid h-[62px] w-[62px] place-items-center rounded-full bg-white shadow-lift ring-1 ring-surface-line transition-shadow hover:shadow-[0_18px_50px_rgba(29,78,216,.32)]"
      >
        {loading ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-100 border-t-brand-600" /> : <Mascot pose="saludo" animation="none" className="h-12 w-12" />}
      </motion.button>
    </div>
  )
}
