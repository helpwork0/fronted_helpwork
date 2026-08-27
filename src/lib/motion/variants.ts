import type { Variants, Transition } from 'framer-motion'

/* Curvas compartidas: todo el sitio se siente coherente. */
export const EASE = [0.22, 1, 0.36, 1] as const
export const spring: Transition = { type: 'spring', stiffness: 120, damping: 18, mass: 0.9 }

/** Contenedor que reparte la entrada de sus hijos en cascada. */
export const staggerContainer = (stagger = 0.08, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
})

/** Entrada desde abajo (el patrón base del scroll-reveal). */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: EASE } },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: EASE } },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: EASE } },
}

/** Palabra por palabra: el titular del hero. */
export const wordReveal: Variants = {
  hidden: { opacity: 0, y: '55%', rotate: 3 },
  show: { opacity: 1, y: '0%', rotate: 0, transition: { duration: 0.8, ease: EASE } },
}

/** Burbujas de chat que "se despliegan". */
export const bubbleIn: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.9 },
  show: { opacity: 1, y: 0, scale: 1, transition: { ...spring } },
}
