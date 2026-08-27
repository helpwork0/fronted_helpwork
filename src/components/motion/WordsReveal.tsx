import { motion } from 'framer-motion'
import { staggerContainer, wordReveal } from '@/lib/motion/variants'
import { cn } from '@/lib/cn'

interface Props {
  text: string
  className?: string
  /** Palabras que se pintan en azul (marca). Comparación sin acentos/mayúsculas. */
  highlight?: string[]
  delay?: number
  as?: 'h1' | 'h2'
}

const norm = (s: string) => s.toLowerCase().replace(/[.,!¡?¿]/g, '')

/**
 * Titular animado palabra por palabra: cada palabra "sube" desde debajo de su
 * propia línea.
 *
 * OJO con el interlineado: la máscara necesita `overflow-hidden`, y un
 * inline-block con overflow oculto crea su propia caja de línea, lo que
 * infla la altura. Se compensa con `pb-[0.14em] -mb-[0.14em]`: se reserva
 * espacio para las colas de las letras (p, g, j) y luego se descuenta,
 * de modo que el interlineado real es el de `leading-[1.06]` y nada más.
 */
export function WordsReveal({ text, className, highlight = [], delay = 0, as = 'h1' }: Props) {
  const words = text.split(' ')
  const hl = highlight.map(norm)
  const Tag = as === 'h1' ? motion.h1 : motion.h2

  return (
    <Tag
      variants={staggerContainer(0.055, delay)}
      initial="hidden"
      animate="show"
      className={cn('font-display font-extrabold leading-[1.06] tracking-tight', className)}
    >
      {words.map((w, i) => (
        <span
          key={`${w}-${i}`}
          className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-bottom leading-[1.06]"
        >
          <motion.span
            variants={wordReveal}
            className={cn('inline-block', hl.includes(norm(w)) && 'text-brand-500')}
          >
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
