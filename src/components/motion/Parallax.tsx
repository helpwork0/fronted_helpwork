import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

/** Desplaza el contenido a distinta velocidad que el scroll (profundidad). */
export function Parallax({ children, distance = 60, className }: { children: React.ReactNode; distance?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance])

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  )
}
