import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/layout/Logo'
import { AuthShell } from '../components/AuthShell'
import { ROUTES } from '@/config/site.config'
import { cn } from '@/lib/cn'
import { useAutoTour } from '@/components/onboarding/useAutoTour'
import { useAuth } from '../AuthContext'
import { GoogleSignIn } from '../GoogleSignIn'
import type { UserRole } from '@/types'
import { MascotGuideButton } from '@/components/onboarding/MascotGuideButton'

const PASOS = ['Cuenta', 'Detalles', 'Confirmar'] as const

export default function RegisterPage() {
  const [paso, setPaso] = useState(0)
  const [acepta, setAcepta] = useState(false)
  const [datos, setDatos] = useState({ nombre: '', email: '', password: '', confirmarPassword: '' })
  const navigate = useNavigate()
  const { registrar } = useAuth()
  useAutoTour('registro')

  // El rol llega desde la pantalla anterior de selección
  const { state } = useLocation() as { state?: { rol?: UserRole } }
  const rol: UserRole = state?.rol ?? 'solicitante'

  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)
  const siguiente = async (e: React.FormEvent) => {
    e.preventDefault()
    if (paso < PASOS.length - 1) { setPaso(p => p + 1); return }
    if (datos.password !== datos.confirmarPassword) { setPaso(0); setError('Las contraseñas no coinciden.'); return }
    setError(''); setEnviando(true)
    try {
      const result = await registrar({ nombre: datos.nombre, email: datos.email, password: datos.password, rol })
      if (result.emailConfirmationRequired) { setError('Revisa tu correo y confirma la cuenta antes de iniciar sesión.'); setPaso(0); return }
      navigate(result.sesion?.rol === 'helpworker' ? ROUTES.appHelpWorker : ROUTES.appSolicitante, { replace: true })
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'No se pudo crear la cuenta.'); setPaso(0) } finally { setEnviando(false) }
  }

  return (
    <AuthShell>
      {/* Indicador de pasos */}
      <ol data-tour="registro-pasos" className="mb-8 flex items-center justify-center">
        {PASOS.map((p, i) => (
          <li key={p} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <span className={cn(
                'grid h-9 w-9 place-items-center rounded-full text-[14px] font-bold transition-colors duration-300',
                i <= paso ? 'bg-brand-600 text-white' : 'border border-surface-line bg-white text-ink-muted',
              )}>{i + 1}</span>
              <span className={cn('text-[12.5px] font-semibold', i === paso ? 'text-brand-600' : 'text-ink-muted')}>{p}</span>
            </div>
            {i < PASOS.length - 1 && (
              <span className="relative mx-3 mb-5 h-[2px] w-16 bg-surface-line">
                <motion.span
                  className="absolute inset-y-0 left-0 bg-brand-500"
                  initial={{ width: 0 }} animate={{ width: i < paso ? '100%' : 0 }} transition={{ duration: 0.4 }}
                />
              </span>
            )}
          </li>
        ))}
      </ol>

      <div className="mb-6 flex flex-col items-center text-center">
        <Logo />
        <h1 className="mt-5 text-[28px] font-extrabold">Crea tu cuenta</h1>
        <p className="mt-1.5 max-w-xs text-[15px] text-ink-soft">
          Únete a la comunidad de talento que ayuda y logra resultados.
        </p>
      </div>

      {paso === 0 && (
        <>
          <GoogleSignIn
            rol={rol}
            esRegistro
            onListo={r => navigate(r === 'helpworker' ? ROUTES.appHelpWorker : ROUTES.appSolicitante, { replace: true })}
          />
          <div className="my-6 flex items-center gap-4">
            <span className="h-px flex-1 bg-surface-line" />
            <span className="text-[13px] text-ink-muted">o regístrate con tu correo</span>
            <span className="h-px flex-1 bg-surface-line" />
          </div>
        </>
      )}

      <form onSubmit={siguiente} className="space-y-4">
        {paso === 0 && (
          <div data-tour="registro-campos" className="space-y-4">
            <Input
              label="Nombre completo" placeholder="Ej. Tu nombre" required
              value={datos.nombre} onChange={e => setDatos({ ...datos, nombre: e.target.value })}
            />
            <Input
              label="Correo electrónico" type="email" placeholder="tucorreo@ejemplo.com" required
              value={datos.email} onChange={e => setDatos({ ...datos, email: e.target.value })}
            />
            <Input label="Contraseña" type="password" placeholder="••••••••••" required value={datos.password} onChange={e => setDatos({ ...datos, password: e.target.value })} />
            <Input label="Confirmar contraseña" type="password" placeholder="••••••••••" required value={datos.confirmarPassword} onChange={e => setDatos({ ...datos, confirmarPassword: e.target.value })} />

            <label data-tour="registro-terminos" className="flex items-start gap-2.5 text-[13.5px] leading-snug text-ink-soft">
              <input
                type="checkbox" checked={acepta} onChange={e => setAcepta(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-surface-line accent-brand-600"
              />
              <span>
                Acepto los <a href="#" className="font-medium text-brand-600 hover:underline">Términos y Condiciones</a>
                {' '}y la <a href="#" className="font-medium text-brand-600 hover:underline">Política de Privacidad</a>
              </span>
            </label>
          </div>
        )}

        {paso === 1 && (
          <>
            <Input label="Ciudad" placeholder="Loja, Ecuador" />
            <Input label="Área principal" placeholder="Ej. Matemáticas, Diseño, Marketing" />
            <Input label="Teléfono (opcional)" placeholder="+593 ..." />
          </>
        )}

        {paso === 2 && (
          <div className="rounded-xl2 bg-brand-50 p-6 text-center">
            <p className="text-[15.5px] font-semibold text-brand-700">Revisa tus datos y confirma</p>
            <p className="mt-2 text-[14px] text-ink-soft">
              Al confirmar te llevaremos a tu panel, donde podrás publicar tu primera solicitud.
            </p>
          </div>
        )}

        <Button data-tour="registro-continuar" type="submit" size="lg" fullWidth disabled={(paso === 0 && !acepta) || enviando}>
          {enviando ? 'Creando cuenta…' : paso === PASOS.length - 1 ? 'Crear cuenta' : 'Continuar'}
        </Button>
        {error && <p className="text-center text-[13px] text-red-600">{error}</p>}
      </form>

      <p className="mt-5 text-center text-[14.5px] text-ink-soft">
        ¿Ya tienes cuenta?{' '}
        <Link to={ROUTES.login} className="font-semibold text-brand-600 hover:underline">Inicia sesión</Link>
      </p>

      <MascotGuideButton tourId="registro" />
    </AuthShell>
  )
}
