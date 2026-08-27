import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/cn'

export interface Phrase {
  texto: string
  /** Palabras que se pintan en azul de marca. Se comparan sin acentos ni signos. */
  destacar?: string[]
}

interface Props {
  phrases: Phrase[]
  /** Milisegundos que permanece visible cada frase (sin contar el fundido). */
  intervalo?: number
  className?: string
  as?: 'h1' | 'h2'
}

const norm = (s: string) => s.toLowerCase().replace(/[.,!¡?¿]/g, '')

/**
 * Frases que se relevan con un fundido suave.
 *
 * EL PUNTO CLAVE: el bloque NO cambia de altura al cambiar de frase, porque si
 * lo hiciera empujaría todo lo de abajo en cada relevo. Para evitarlo se
 * renderiza una copia invisible de la frase más larga, que es la que reserva el
 * espacio; las frases reales van encima en posición absoluta. Así la caja mide
 * siempre lo mismo y solo cambia la opacidad.
 *
 * El fundido entra y sale a la vez (no espera a que una termine), así que se
 * percibe como un relevo continuo y no como un parpadeo.
 */
export function FadingPhrases({ phrases, intervalo = 4200, className, as = 'h1' }: Props) {
  const [i, setI] = useState(0)

  useEffect(() => {
    if (phrases.length < 2) return
    const id = window.setInterval(() => setI(n => (n + 1) % phrases.length), intervalo)
    return () => window.clearInterval(id)
  }, [phrases.length, intervalo])

  // La frase con más caracteres define la altura del bloque
  const masLarga = phrases.reduce((a, b) => (b.texto.length > a.texto.length ? b : a), phrases[0])
  const Tag = as === 'h1' ? motion.h1 : motion.h2
  const base = cn('font-display font-extrabold leading-[1.12] tracking-tight', className)

  const pintar = (p: Phrase) =>
    p.texto.split(' ').map((palabra, k) => {
      const marcada = (p.destacar ?? []).map(norm).includes(norm(palabra))
      return (
        <span key={k} className={marcada ? 'text-brand-500' : undefined}>
          {palabra}{' '}
        </span>
      )
    })

  return (
    <div className="relative">
      {/* Fantasma: no se ve, solo reserva la altura */}
      <span aria-hidden className={cn(base, 'invisible block')}>
        {masLarga.texto}
      </span>

      <AnimatePresence>
        <Tag
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: 'easeInOut' }}
          className={cn(base, 'absolute inset-0')}
        >
          {pintar(phrases[i])}
        </Tag>
      </AnimatePresence>
    </div>
  )
}
