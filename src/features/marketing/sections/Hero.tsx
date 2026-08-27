import { motion } from 'framer-motion'
import { Sparkles, Zap, ShieldCheck, Star } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { FadingPhrases } from '@/components/motion/FadingPhrases'
import { Mascot } from '@/components/mascot/Mascot'
import { MascotChat } from '@/components/mascot/MascotChat'
import { HERO_CHAT, HERO_PHRASES } from '@/data/mock'
import { ROUTES } from '@/config/site.config'

const PILARES = [
  { icon: Sparkles,    titulo: 'Match inteligente',      texto: 'Te conectamos con la persona ideal.' },
  { icon: Zap,         titulo: 'Conexión inmediata',      texto: 'Encuentra u ofrece ayuda al instante.' },
  { icon: ShieldCheck, titulo: 'Pagos seguros',           texto: 'Transacciones protegidas.' },
  { icon: Star,        titulo: 'Confianza y reputación',  texto: 'Reseñas y perfiles verificados.' },
]

/**
 * HERO — TODO QUIETO SALVO EL TEXTO.
 *
 * Aquí no hay parallax, ni zoom del fondo, ni nubes cruzando, ni la mascota
 * flotando. La foto está fija y la mascota inmóvil. La página no se mueve.
 *
 * Lo único vivo son dos cosas, y las dos son texto:
 *   1) El titular releva frases con un fundido suave (FadingPhrases).
 *   2) La nube de pensamiento va soltando mensajes de a tres (MascotChat).
 *
 * Ninguna de las dos cambia la altura de su caja, así que el resto de la
 * pantalla permanece exactamente donde está. Las apariciones iniciales son
 * solo de opacidad, sin desplazamiento, para que nada "salte" al cargar.
 */
export function Hero() {
  return (
    <section className="relative flex min-h-[640px] flex-col justify-center overflow-hidden lg:h-[100svh] lg:max-h-[880px]">
      {/* Fondo fijo */}
      <div className="absolute inset-0 -z-20">
        <img src="/assets/hero-bg.jpg" alt="" className="h-full w-full scale-[1.02] object-cover object-center" />
      </div>

      {/* Velos para que el texto se lea sobre cualquier zona de la foto */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/55 via-white/10 to-transparent" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-white/75 via-white/15 to-transparent" />

      <Container className="pb-[168px] pt-[calc(var(--nav-h)+1.5rem)] sm:pb-[150px]">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_400px] lg:gap-10">
          {/* Columna de texto */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="max-w-[560px]"
          >
            <FadingPhrases
              phrases={HERO_PHRASES}
              intervalo={4600}
              className="text-[clamp(1.95rem,3.4vw,3.2rem)] text-ink"
            />

            <p className="mt-5 max-w-[460px] text-[15.5px] leading-relaxed text-ink-soft">
              Del nicho académico a un marketplace inteligente de servicios.
              Encuentra ayuda o ofrece tus habilidades y haz crecer tu futuro.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button to={ROUTES.registroRol} data-tour="hero-estudiante">Soy estudiante / Busco ayuda</Button>
              <Button variant="white" to={ROUTES.registroRol}>Soy Help Worker / Ofrezco ayuda</Button>
            </div>
          </motion.div>

          {/* Columna mascota: ella quieta, solo hablan sus pensamientos */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.15, ease: 'easeOut' }}
            className="relative hidden flex-col items-center lg:flex"
            data-tour="hero-mascota"
          >
            <MascotChat
              messages={HERO_CHAT}
              variant="thought"
              stepDelay={2600}
              maxVisible={3}
              className="mb-1"
            />
            <Mascot pose="laptop" animation="none" className="w-[230px] xl:w-[260px]" />
          </motion.div>
        </div>
      </Container>

      <PilaresBar />
    </section>
  )
}

/** Barra de pilares: aparece una vez y se queda fija. */
function PilaresBar() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.9, ease: 'easeOut' }}
      className="absolute inset-x-0 bottom-5 z-10"
    >
      <Container>
        <div className="glass-card grid grid-cols-2 gap-x-2 rounded-xl3 px-2 py-1 lg:grid-cols-4 lg:divide-x lg:divide-white/50">
          {PILARES.map(p => (
            <div key={p.titulo} className="group flex items-center gap-3 px-3 py-3 lg:px-4">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/70 text-brand-600 shadow-soft">
                <p.icon size={16} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[13.5px] font-bold text-ink">{p.titulo}</p>
                <p className="truncate text-[12px] text-ink-soft">{p.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </motion.div>
  )
}
