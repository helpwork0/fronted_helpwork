import { useEffect, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { HelpCircle } from 'lucide-react'
import { AuthShell } from '../components/AuthShell'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/layout/Logo'
import { useTour } from '@/components/onboarding/TourProvider'
import { LOGIN_TOUR } from '@/components/onboarding/tours'
import { MascotGuideButton } from '@/components/onboarding/MascotGuideButton'
import { ROUTES } from '@/config/site.config'
import { useAuth } from '../AuthContext'
import { GoogleSignIn } from '../GoogleSignIn'

/**
 * Pantalla de inicio de sesión.
 * Al llegar desde el botón "Iniciar sesión" de la barra superior
 * (que envía state.startTour) arranca sola la guía de la mascota.
 * También puede lanzarse a mano con el botón "Ver guía".
 */
export default function LoginPage() {
  const { start } = useTour()
  const { state } = useLocation() as { state?: { startTour?: boolean } }
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    if (state?.startTour) {
      const id = window.setTimeout(() => start(LOGIN_TOUR), 700) // deja terminar la animación de entrada
      return () => window.clearTimeout(id)
    }
  }, [state, start])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setEnviando(true)
    try {
      const sesion = await login(form)
      navigate(sesion.rol === 'helpworker' ? ROUTES.appHelpWorker : ROUTES.appSolicitante)
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'No se pudo iniciar sesión.') } finally { setEnviando(false) }
  }

  return (
    <AuthShell>
      <div className="mb-7 flex flex-col items-center text-center">
        <Logo />
        <h1 className="mt-6 text-[30px] font-extrabold">Iniciar sesión</h1>
        <p className="mt-1.5 text-[15px] text-ink-soft">Te damos la bienvenida de nuevo.</p>
      </div>

      <GoogleSignIn
        data-tour="login-google"
        onListo={rol => navigate(rol === 'helpworker' ? ROUTES.appHelpWorker : ROUTES.appSolicitante)}
      />

      <div className="my-6 flex items-center gap-4">
        <span className="h-px flex-1 bg-surface-line" />
        <span className="text-[13px] text-ink-muted">o continúa con email</span>
        <span className="h-px flex-1 bg-surface-line" />
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div data-tour="login-email">
          <Input
            label="Correo electrónico" type="email" placeholder="tu.correo@ejemplo.com" required
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div data-tour="login-password">
          <Input
            label="Contraseña" type="password" placeholder="••••••••" required
            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
          />
          <div className="mt-1.5 text-right">
            <a href="#" className="text-[13px] font-medium text-brand-600 hover:underline">¿Olvidaste tu contraseña?</a>
          </div>
        </div>

        <div data-tour="login-submit" className="pt-1">
          <Button type="submit" size="lg" fullWidth disabled={enviando}>{enviando ? 'Ingresando…' : 'Iniciar sesión'}</Button>
        </div>
        {error && <p className="text-center text-[13px] text-red-600">{error}</p>}
      </form>

      <p data-tour="login-register" className="mt-6 text-center text-[14.5px] text-ink-soft">
        ¿No tienes cuenta?{' '}
        <Link to={ROUTES.registroRol} className="font-semibold text-brand-600 hover:underline">Regístrate gratis</Link>
      </p>

      <button
        onClick={() => start(LOGIN_TOUR)}
        className="mx-auto mt-5 flex items-center gap-1.5 text-[13px] font-medium text-ink-muted transition hover:text-brand-600"
      >
        <HelpCircle size={14} /> Ver guía paso a paso
      </button>

      <MascotGuideButton tourId="login" />
    </AuthShell>
  )
}
