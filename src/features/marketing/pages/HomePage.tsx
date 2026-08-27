import { useAutoTour } from '@/components/onboarding/useAutoTour'
import { MascotGuideButton } from '@/components/onboarding/MascotGuideButton'
import { Hero } from '../sections/Hero'
import { HowItWorks } from '../sections/HowItWorks'
import { ForWho } from '../sections/ForWho'
import { Benefits } from '../sections/Benefits'
import { Pricing } from '../sections/Pricing'
import { Resources } from '../sections/Resources'
import { FinalCTA } from '../sections/FinalCTA'

/** Landing pública. El orden de las secciones define el recorrido del usuario. */
export default function HomePage() {
  useAutoTour('home')   // se lanza sola la primera visita

  return (
    <>
      <Hero />
      <HowItWorks />
      <ForWho />
      <Benefits />
      <Pricing />
      <Resources />
      <FinalCTA />
      <MascotGuideButton tourId="home" />
    </>
  )
}
