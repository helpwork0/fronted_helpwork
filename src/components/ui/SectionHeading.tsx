import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/motion/variants'
import { Badge } from './Badge'

interface Props {
  eyebrow?: string
  title: React.ReactNode
  subtitle?: string
  align?: 'center' | 'left'
}

export function SectionHeading({ eyebrow, title, subtitle, align = 'center' }: Props) {
  return (
    <motion.header
      variants={staggerContainer(0.1)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}
    >
      {eyebrow && (
        <motion.div variants={fadeUp} className="mb-4">
          <Badge>{eyebrow}</Badge>
        </motion.div>
      )}
      <motion.h2 variants={fadeUp} className="text-[clamp(1.6rem,2.6vw,2.15rem)] font-extrabold leading-tight">
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p variants={fadeUp} className="mt-2.5 text-[15.5px] text-ink-soft">
          {subtitle}
        </motion.p>
      )}
    </motion.header>
  )
}
