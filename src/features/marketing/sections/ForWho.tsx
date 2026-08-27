import { motion } from 'framer-motion'
import { GraduationCap, Briefcase, Star, ArrowRight } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Mascot, type MascotPose } from '@/components/mascot/Mascot'
import { staggerContainer, fadeUp } from '@/lib/motion/variants'
import { ROUTES } from '@/config/site.config'
import { Link } from 'react-router-dom'

interface Perfil {
  icon: typeof GraduationCap
  titulo: string
  texto: string
  cta: string
  pose: MascotPose
  clases: { fondo: string; texto: string; borde: string }
}

const PERFILES: Perfil[] = [
  {
    icon: GraduationCap, titulo: 'Estudiantes', pose: 'libro',
    texto: 'Encuentra ayuda académica, tutorías y apoyo en tareas.',
    cta: 'Explorar como estudiante',
    clases: { fondo: 'bg-brand-50', texto: 'text-brand-600', borde: 'hover:border-brand-300' },
  },
  {
    icon: Briefcase, titulo: 'Profesionales', pose: 'laptop',
    texto: 'Publica proyectos y tareas para recibir apoyo confiable.',
    cta: 'Explorar como solicitante',
    clases: { fondo: 'bg-success-100', texto: 'text-success-500', borde: 'hover:border-green-300' },
  },
  {
    icon: Star, titulo: 'HelpWorkers', pose: 'saludo',
    texto: 'Ofrece tus habilidades, gana dinero y crece profesionalmente.',
    cta: 'Explorar como HelpWorker',
    clases: { fondo: 'bg-amber-100', texto: 'text-amber-500', borde: 'hover:border-amber-300' },
  },
]

export function ForWho() {
  return (
    <section id="para-quien" className="scroll-mt-24 bg-white py-16 sm:py-20">
      <Container>
        <SectionHeading
          title="¿Para quién?"
          subtitle="HelpWork conecta a personas que necesitan ayuda con quienes quieren ofrecerla."
        />

        <motion.div
          variants={staggerContainer(0.13, 0.1)}
          initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }}
          className="mt-11 grid gap-5 md:grid-cols-3"
        >
          {PERFILES.map(p => (
            <motion.article
              key={p.titulo}
              variants={fadeUp}
              whileHover={{ y: -8 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              className={`group relative overflow-hidden rounded-xl2 border border-surface-line ${p.clases.fondo} p-6 pb-20 transition-colors duration-300 ${p.clases.borde}`}
            >
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white shadow-soft">
                <p.icon size={24} className={p.clases.texto} />
              </span>
              <h3 className={`mt-5 text-[19px] font-bold ${p.clases.texto}`}>{p.titulo}</h3>
              <p className="mt-2 max-w-[220px] text-[14.5px] leading-relaxed text-ink-soft">{p.texto}</p>

              <Link
                to={ROUTES.registroRol}
                className="absolute bottom-6 left-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[13.5px] font-semibold text-ink shadow-soft transition-all duration-300 hover:gap-3 hover:shadow-lift"
              >
                {p.cta} <ArrowRight size={15} />
              </Link>

              {/* Mascota que asoma al hacer hover */}
              <div className="pointer-events-none absolute -bottom-2 right-0 w-[125px] translate-y-3 opacity-90 transition-all duration-500 group-hover:translate-y-0 group-hover:scale-105">
                <Mascot pose={p.pose} animation="none" />
              </div>
            </motion.article>
          ))}
        </motion.div>
      </Container>
    </section>
  )
}
