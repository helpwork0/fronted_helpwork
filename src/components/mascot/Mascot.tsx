import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

/** Poses disponibles de la mascota (hámster). Añade más PNG en /public/assets/mascota. */
export const MASCOT_POSES = {
  saludo: '/assets/mascota/mascota-saludo.png',
  guia: '/assets/mascota/mascota-guia.png',
  libro: '/assets/mascota/mascota-libro.png',
  laptop: '/assets/mascota/mascota-laptop.png',
} as const

export type MascotPose = keyof typeof MASCOT_POSES

interface Props {
  pose?: MascotPose
  /** 'float' = flota suave, 'pop' = entra con rebote, 'none' = estático */
  animation?: 'float' | 'pop' | 'none'
  className?: string
  alt?: string
}

export function Mascot({ pose = 'saludo', animation = 'float', className, alt = 'Mascota de HelpWork' }: Props) {
  const img = (
    <img
      src={MASCOT_POSES[pose]}
      alt={alt}
      draggable={false}
      className={cn('select-none object-contain drop-shadow-[0_18px_28px_rgba(11,27,58,.22)]', className)}
    />
  )

  if (animation === 'none') return img

  if (animation === 'pop') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 16 }}
      >
        {img}
      </motion.div>
    )
  }

  return (
    <motion.div
      animate={{ y: [0, -14, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    >
      {img}
    </motion.div>
  )
}
