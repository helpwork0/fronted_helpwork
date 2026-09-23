import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { http } from '@/lib/api/http'
import { ENDPOINTS } from '@/lib/api/endpoints'
import { ROUTES } from '@/config/site.config'
import type { UserRole } from '@/types'

export function GoogleIcon({ size = 20 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.76c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"/><path fill="#FBBC05" d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"/></svg>
}

export function GoogleSignIn({ rol = 'solicitante', ...rest }: { rol?: UserRole; onListo?: (rol: UserRole) => void; esRegistro?: boolean } & React.HTMLAttributes<HTMLButtonElement>) {
  const [cargando, setCargando] = useState(false)
  const iniciar = async () => {
    setCargando(true)
    try {
      const redirectTo = `${window.location.origin}${ROUTES.authCallback}?rol=${rol}`
      const response = await http.post<{ url: string }>(ENDPOINTS.auth.googleUrl, { redirectTo })
      window.location.assign(response.url)
    } catch {
      setCargando(false)
    }
  }
  return <button type="button" onClick={iniciar} disabled={cargando} className="flex h-[52px] w-full items-center justify-center gap-3 rounded-xl border border-surface-line bg-white text-[15.5px] font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft disabled:opacity-60" {...rest}>
    {cargando ? <Loader2 className="animate-spin" size={20} /> : <GoogleIcon />} Continuar con Google
  </button>
}
