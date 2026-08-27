import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { AuthShell } from '../components/AuthShell'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Mascot, type MascotPose } from '@/components/mascot/Mascot'
import { ROUTES } from '@/config/site.config'
import { cn } from '@/lib/cn'
import type { UserRole } from '@/types'
import { useAutoTour } from '@/components/onboarding/useAutoTour'
import { MascotGuideButton } from '@/components/onboarding/MascotGuideButton'
import { GoogleSignIn } from '../GoogleSignIn'
import { TERMINOS } from '@/config/site.config'

const OPCIONES: { rol: UserRole; titulo: string; texto: string; pose: MascotPose }[] = [
  { rol: 'solicitante', titulo: `Busco ayuda`,
    texto: `Publico lo que necesito y elijo entre las propuestas. Serás un ${TERMINOS.solicitante.singular}.`, pose: 'libro' },
  { rol: 'helpworker',  titulo: 'Quiero ser HelpWorker',
    texto: `Ofrezco mis habilidades y gano dinero con ellas. Verás las solicitudes de los ${TERMINOS.solicitante.plural}.`, pose: 'laptop' },
]

/** Paso 1 del registro: elegir rol. */
export default function RoleSelectPage() {
  const [rol, setRol] = useState<UserRole | null>(null)
  const navigate = useNavigate()
  useAutoTour('rol')

  return (
    <AuthShell wide>
      <div className="text-center">
        <Badge>1. SELECCIÓN DE ROL</Badge>
        <h1 className="mt-4 text-[32px] font-extrabold">¿Cómo quieres empezar?</h1>
        <p className="mt-2 text-[15.5px] text-ink-soft">Elige tu rol inicial. Siempre podrás cambiarlo después.</p>
      </div>

      <div className="mt-9 grid gap-5 sm:grid-cols-2">
        {OPCIONES.map(op => {
          const activo = rol === op.rol
          return (
            <motion.button
              key={op.rol}
              data-tour={`rol-${op.rol}`}
              onClick={() => setRol(op.rol)}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className={cn(
                'rounded-xl2 border-2 bg-white p-7 text-center transition-colors duration-300',
                activo ? 'border-brand-500 bg-brand-50/50 shadow-lift' : 'border-surface-line hover:border-brand-200',
              )}
            >
              <div className={cn('mx-auto grid h-[190px] w-[190px] place-items-center rounded-full transition-colors', activo ? 'bg-brand-100' : 'bg-brand-50')}>
                <Mascot pose={op.pose} animation={activo ? 'float' : 'none'} className="w-[170px]" />
              </div>
              <h2 className="mt-5 text-[22px] font-extrabold text-brand-600">{op.titulo}</h2>
              <p className="mt-1.5 text-[15px] text-ink-soft">{op.texto}</p>
            </motion.button>
          )
        })}
      </div>

      <Button
        data-tour="rol-continuar"
        size="lg" fullWidth className="mt-8"
        disabled={!rol}
        onClick={() => navigate(ROUTES.registro, { state: { rol } })}
      >
        Continuar
      </Button>

      {rol && (
        <div className="mt-5">
          <div className="mb-4 flex items-center gap-4">
            <span className="h-px flex-1 bg-surface-line" />
            <span className="text-[13px] text-ink-muted">o crea tu cuenta al instante</span>
            <span className="h-px flex-1 bg-surface-line" />
          </div>
          <GoogleSignIn
            rol={rol}
            esRegistro
            onListo={r => navigate(r === 'helpworker' ? ROUTES.appHelpWorker : ROUTES.appSolicitante, { replace: true })}
          />
        </div>
      )}

      <p className="mt-4 flex items-center justify-center gap-1.5 text-[13px] text-ink-muted">
        <Lock size={13} /> Puedes cambiar tu rol en cualquier momento desde tu perfil.
      </p>

      <MascotGuideButton tourId="rol" />
    </AuthShell>
  )
}
