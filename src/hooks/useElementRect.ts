import { useCallback, useEffect, useState } from 'react'

/**
 * Sigue la posición de un elemento del DOM buscado por selector.
 * Lo usa el tour guiado para dibujar el "foco" sobre el elemento correcto.
 */
export function useElementRect(selector: string | null) {
  const [rect, setRect] = useState<DOMRect | null>(null)

  const measure = useCallback(() => {
    if (!selector) return setRect(null)
    const el = document.querySelector(selector)
    setRect(el ? el.getBoundingClientRect() : null)
  }, [selector])

  useEffect(() => {
    measure()
    if (!selector) return
    const el = document.querySelector(selector)
    el?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    const id = window.setTimeout(measure, 420) // re-medir tras el scroll
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure, true)
    return () => {
      window.clearTimeout(id)
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure, true)
    }
  }, [selector, measure])

  return rect
}
