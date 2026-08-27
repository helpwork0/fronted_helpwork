import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { TourStep } from './tour.types'
import { TourOverlay } from './TourOverlay'

interface TourContextValue {
  start: (steps: TourStep[]) => void
  stop: () => void
  isActive: boolean
}

const TourContext = createContext<TourContextValue | null>(null)

/**
 * Provee el tour guiado a toda la app.
 * Uso:  const { start } = useTour();  start(LOGIN_TOUR)
 */
export function TourProvider({ children }: { children: React.ReactNode }) {
  const [steps, setSteps] = useState<TourStep[] | null>(null)
  const [index, setIndex] = useState(0)

  const start = useCallback((s: TourStep[]) => { setSteps(s); setIndex(0) }, [])
  const stop  = useCallback(() => { setSteps(null); setIndex(0) }, [])

  const next = useCallback(() => {
    setIndex(i => {
      if (!steps) return i
      if (i + 1 >= steps.length) { setSteps(null); return 0 }
      return i + 1
    })
  }, [steps])

  const prev = useCallback(() => setIndex(i => Math.max(0, i - 1)), [])

  const value = useMemo(() => ({ start, stop, isActive: steps !== null }), [start, stop, steps])

  return (
    <TourContext.Provider value={value}>
      {children}
      {steps && (
        <TourOverlay steps={steps} index={index} onNext={next} onPrev={prev} onClose={stop} />
      )}
    </TourContext.Provider>
  )
}

export function useTour() {
  const ctx = useContext(TourContext)
  if (!ctx) throw new Error('useTour debe usarse dentro de <TourProvider>')
  return ctx
}
