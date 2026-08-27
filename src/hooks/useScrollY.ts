import { useEffect, useState } from 'react'

/** Devuelve true cuando el scroll vertical supera `threshold` px. */
export function useScrolledPast(threshold = 24) {
  const [passed, setPassed] = useState(false)
  useEffect(() => {
    const onScroll = () => setPassed(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])
  return passed
}
