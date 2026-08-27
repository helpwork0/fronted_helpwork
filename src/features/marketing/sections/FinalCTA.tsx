import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { FadingPhrases } from '@/components/motion/FadingPhrases'
import { Mascot } from '@/components/mascot/Mascot'
import { MascotChat } from '@/components/mascot/MascotChat'
import { HERO_CHAT, HERO_PHRASES } from '@/data/mock'
import { ROUTES } from '@/config/site.config'

/**
 * Cierre de la landing. Mismo criterio que el hero: el bloque está quieto,
 * solo se relevan las frases del titular y los mensajes de la nube.
 */
export function FinalCTA() {
  return (
    <section className="pb-20">
      <Container>
        <div className="relative overflow-hidden rounded-xl3 shadow-lift">
          <img src="/assets/hero-bg.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/40 to-transparent" />

          <div className="relative grid items-center gap-6 px-7 py-10 sm:px-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="max-w-lg">
                <FadingPhrases
                  phrases={HERO_PHRASES}
                  intervalo={5200}
                  as="h2"
                  className="text-[clamp(1.5rem,2.5vw,2.05rem)] text-ink"
                />
              </div>

              <p className="mt-3 max-w-md text-[15px] text-ink-soft">
                Del nicho académico a un marketplace inteligente de servicios.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button to={ROUTES.registroRol}>Soy estudiante / Busco ayuda</Button>
                <Button variant="white" to={ROUTES.registroRol}>Soy Help Worker / Ofrezco ayuda</Button>
              </div>
            </div>

            <div className="relative hidden flex-col items-center sm:flex">
              <MascotChat
                messages={HERO_CHAT}
                variant="thought"
                stepDelay={2800}
                maxVisible={3}
                className="mb-1"
              />
              <Mascot pose="laptop" animation="none" className="w-[180px] lg:w-[200px]" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
