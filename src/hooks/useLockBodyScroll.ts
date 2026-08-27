import { useEffect } from 'react'

/** Bloquea el scroll del body mientras `locked` sea true (modales, tour, menú móvil). */
export function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [locked])
}
