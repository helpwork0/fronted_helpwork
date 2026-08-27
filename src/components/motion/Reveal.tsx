import { motion, type Variants } from 'framer-motion'
import { fadeUp } from '@/lib/motion/variants'

interface Props {
  children: React.ReactNode
  delay?: number
  className?: string
  variants?: Variants
  amount?: number
}

/**
 * Envuelve cualquier bloque para que aparezca al hacer scroll.
 * Se dispara una sola vez (once) para que el scroll no "parpadee".
 */
export function Reveal({ children, delay = 0, className, variants = fadeUp, amount = 0.35 }: Props) {
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}
