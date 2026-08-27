import { motion } from 'framer-motion'
import { Clock, Sparkles, BadgeCheck, CreditCard } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { staggerContainer, fadeUp } from '@/lib/motion/variants'

const BENEFICIOS = [
  { icon: Clock,      titulo: 'Ahorra tiempo',      texto: 'Encuentra ayuda rápida y eficiente para lo que necesitas.' },
  { icon: Sparkles,   titulo: 'Match inteligente',  texto: 'Te conectamos con la persona ideal según tus necesidades.' },
  { icon: BadgeCheck, titulo: 'Talento verificado', texto: 'Perfiles verificados, calificaciones reales y opiniones de la comunidad.' },
  { icon: CreditCard, titulo: 'Pagos seguros',      texto: 'Transacciones protegidas y pagos dentro de la plataforma.' },
]

export function Benefits() {
  return (
    <section id="beneficios" className="scroll-mt-24 py-16 sm:py-20">
      <Container>
        <SectionHeading title="Beneficios que marcan la diferencia" />

        <motion.div
          variants={staggerContainer(0.1, 0.1)}
          initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}
          className="mt-11 grid gap-7 sm:grid-cols-2 lg:grid-cols-4"
        >
          {BENEFICIOS.map(b => (
            <motion.div key={b.titulo} variants={fadeUp} className="group flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white shadow-soft ring-1 ring-surface-line transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-brand-600 group-hover:ring-brand-600">
                <b.icon size={23} className="text-brand-600 transition-colors duration-300 group-hover:text-white" />
              </span>
              <div>
                <h3 className="text-[16.5px] font-bold text-brand-700">{b.titulo}</h3>
                <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-soft">{b.texto}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  )
}
