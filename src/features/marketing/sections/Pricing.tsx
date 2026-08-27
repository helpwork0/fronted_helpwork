import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Compass, Rocket, BarChart3, Crown } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Button } from '@/components/ui/Button'
import { Toggle } from '@/components/ui/Toggle'
import { Reveal } from '@/components/motion/Reveal'
import { PLANES } from '@/data/mock'
import { staggerContainer, fadeUp } from '@/lib/motion/variants'
import { cn } from '@/lib/cn'

const ICONOS = [Compass, Rocket, BarChart3, Crown]

export function Pricing() {
  const [ciclo, setCiclo] = useState<0 | 1>(0)   // 0 = mensual, 1 = anual

  return (
    <section id="precios" data-tour="seccion-precios" className="scroll-mt-24 bg-white py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="PLANES HELPWORKERS"
          title={<>Elige el plan que impulsa <span className="text-brand-500">tu crecimiento</span></>}
          subtitle="Más herramientas, más oportunidades. Siempre compatibilidad real."
        />

        <Reveal className="mt-8 flex justify-center">
          <Toggle options={['Pago mensual', 'Pago anual']} value={ciclo} onChange={setCiclo} hint="Ahorra 20%" />
        </Reveal>

        <motion.div
          variants={staggerContainer(0.1, 0.1)}
          initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}
          className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {PLANES.map((plan, i) => {
            const Icono = ICONOS[i]
            const precio = ciclo === 0 ? plan.precioMensual : plan.precioAnual / 12
            const gratis = plan.precioMensual === 0

            return (
              <motion.div
                key={plan.id}
                variants={fadeUp}
                whileHover={{ y: -10 }}
                transition={{ type: 'spring', stiffness: 250, damping: 22 }}
                className={cn(
                  'relative flex flex-col rounded-xl2 border bg-white p-6 shadow-soft transition-shadow duration-300 hover:shadow-lift',
                  plan.destacado ? 'border-success-500 ring-1 ring-success-500' : 'border-surface-line',
                )}
              >
                {plan.destacado && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-success-500 px-3.5 py-1 text-[12px] font-bold text-white shadow-soft">
                    Más elegido
                  </span>
                )}

                <Icono size={26} className={cn('mx-auto', plan.destacado ? 'text-success-500' : 'text-brand-500')} />
                <h3 className={cn('mt-4 text-center text-xl font-bold', plan.destacado ? 'text-success-500' : 'text-brand-600')}>
                  {plan.nombre}
                </h3>

                <div className="mt-3 text-center">
                  {gratis ? (
                    <p className="text-[30px] font-extrabold leading-none">Gratis</p>
                  ) : (
                    <p className="text-[30px] font-extrabold leading-none">
                      ${precio.toFixed(2)}
                      <span className="text-base font-semibold text-ink-muted"> / mes</span>
                    </p>
                  )}
                  <p className="mt-1.5 text-[14px] text-ink-soft">{plan.tagline}</p>
                </div>

                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-[14.5px] text-ink-soft">
                      <Check size={16} className="mt-0.5 shrink-0 text-success-500" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  className="mt-7"
                  fullWidth
                  variant={plan.destacado ? 'success' : 'primary'}
                >
                  {gratis ? 'Comenzar gratis' : 'Elegir plan'}
                </Button>
              </motion.div>
            )
          })}
        </motion.div>

        <Reveal delay={0.2}>
          <p className="mt-10 text-center text-[14px] text-ink-muted">
            Todos los planes incluyen mensajería en la app y alertas por correo y WhatsApp.
          </p>
        </Reveal>
      </Container>
    </section>
  )
}
