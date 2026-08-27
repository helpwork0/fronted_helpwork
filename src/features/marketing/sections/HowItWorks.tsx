import { motion } from 'framer-motion'
import { FileText, Users, MessagesSquare, ThumbsUp } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Mascot } from '@/components/mascot/Mascot'
import { staggerContainer, fadeUp } from '@/lib/motion/variants'

const PASOS = [
  { icon: FileText,      titulo: 'Publica tu necesidad', texto: 'Describe lo que necesitas y recibe propuestas de ayuda.' },
  { icon: Users,         titulo: 'Elige y contrata',     texto: 'Revisa perfiles, calificaciones y elige la mejor opción.' },
  { icon: MessagesSquare,titulo: 'Sigue y comunica',     texto: 'Conversa, acuerda y da seguimiento en tiempo real.' },
  { icon: ThumbsUp,      titulo: 'Recibe y califica',    texto: 'Revisa el resultado, califica y ayuda a la comunidad.' },
]

export function HowItWorks() {
  return (
    <section id="como-funciona" className="relative scroll-mt-24 py-16 sm:py-20">
      <Container>
        <SectionHeading title={<>¿Cómo funciona <span className="text-brand-500">HelpWork</span>?</>} subtitle="Rápido, simple y seguro." />

        <motion.ol
          variants={staggerContainer(0.14, 0.15)}
          initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}
          className="relative mt-11 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* Línea punteada que se dibuja al entrar en pantalla */}
          <motion.div
            initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
            transition={{ duration: 1.1, delay: 0.4, ease: 'easeInOut' }}
            className="absolute left-[12%] right-[12%] top-9 hidden origin-left border-t-[3px] border-dotted border-success-500/50 lg:block"
          />

          {PASOS.map((p, i) => (
            <motion.li key={p.titulo} variants={fadeUp} className="group relative text-center">
              <div className="relative z-10 mx-auto grid h-[62px] w-[62px] place-items-center rounded-full bg-brand-50 ring-8 ring-white transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-100">
                <p.icon size={24} className="text-brand-600" />
              </div>
              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-600 text-[12px] font-bold text-white">{i + 1}</span>
                <h3 className="text-[15.5px] font-bold">{p.titulo}</h3>
              </div>
              <p className="mx-auto mt-2 max-w-[230px] text-[13.5px] leading-relaxed text-ink-soft">{p.texto}</p>
            </motion.li>
          ))}
        </motion.ol>

        {/* Mascota señalando los pasos */}
        <motion.div
          initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.7, duration: 0.7 }}
          className="pointer-events-none absolute -bottom-4 right-4 hidden xl:block"
        >
          <Mascot pose="guia" className="w-[150px]" />
        </motion.div>
      </Container>
    </section>
  )
}
