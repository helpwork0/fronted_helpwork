import { motion } from 'framer-motion'
import { ArrowRight, BookOpen, ClipboardList, Headphones, MessageCircle } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { staggerContainer, fadeUp } from '@/lib/motion/variants'

const RECURSOS = [
  { tag: 'BLOG',            icon: BookOpen,      titulo: 'Consejos para destacar', texto: 'Tips prácticos para mejorar tu perfil y conseguir más entrevistas.', cta: 'Leer más' },
  { tag: 'GUÍAS',           icon: ClipboardList, titulo: 'Guías paso a paso',      texto: 'Recursos detallados para cada etapa de tu búsqueda laboral.',        cta: 'Leer más' },
  { tag: 'WEBINARS',        icon: Headphones,    titulo: 'Webinars y talleres',    texto: 'Aprende de expertos en nuestros eventos en vivo.',                   cta: 'Ver próximos' },
  { tag: 'CENTRO DE AYUDA', icon: MessageCircle, titulo: 'Centro de ayuda',        texto: 'Resuelve tus dudas y saca el máximo provecho de HelpWork.',          cta: 'Ir al centro' },
]

export function Resources() {
  return (
    <section id="recursos" className="scroll-mt-24 py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="RECURSOS"
          title="Aprende, crece y encuentra más oportunidades"
          subtitle="Descubre contenido útil para potenciar tu perfil y tu búsqueda."
        />

        <motion.div
          variants={staggerContainer(0.1, 0.1)}
          initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}
          className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {RECURSOS.map(r => (
            <motion.article
              key={r.titulo}
              variants={fadeUp}
              whileHover={{ y: -8 }}
              transition={{ type: 'spring', stiffness: 250, damping: 22 }}
              className="group overflow-hidden rounded-xl2 border border-surface-line bg-white shadow-soft"
            >
              <div className="grid h-28 place-items-center bg-gradient-to-br from-brand-50 to-brand-100">
                <r.icon size={34} className="text-brand-500 transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div className="p-5">
                <p className="text-[11px] font-bold tracking-widest text-brand-500">{r.tag}</p>
                <h3 className="mt-1.5 text-[16.5px] font-bold">{r.titulo}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">{r.texto}</p>
                <a href="#" className="mt-4 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-brand-600 transition-all group-hover:gap-2.5">
                  {r.cta} <ArrowRight size={14} />
                </a>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </Container>
    </section>
  )
}
