import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Menu, X } from 'lucide-react'
import { Logo } from './Logo'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { useScrolledPast } from '@/hooks/useScrollY'
import { NAV_LINKS, ROUTES } from '@/config/site.config'
import { cn } from '@/lib/cn'
import { useAuth } from '@/features/auth/AuthContext'

/**
 * Barra superior.
 *
 * LEGIBILIDAD: antes los enlaces iban en blanco mientras la barra era
 * transparente, y sobre el cielo claro del hero no se leían. Ahora el texto es
 * SIEMPRE oscuro y, en su lugar, se coloca detrás un velo blanco degradado
 * (`from-white/85`) que garantiza el contraste sin tapar la foto. Es el mismo
 * recurso que usan las apps de iOS: el texto no cambia, cambia el fondo.
 *
 * Al pasar de 28 px de scroll el velo se sustituye por el cristal esmerilado
 * (blur + saturación), con una transición de 500 ms.
 */
export function Navbar({ overHero = false }: { overHero?: boolean }) {
  const scrolled = useScrolledPast(28)
  const [openMobile, setOpenMobile] = useState(false)
  const navigate = useNavigate()
  const { usuario } = useAuth()

  // Con sesión abierta no tiene sentido ofrecer "Iniciar sesión"
  const panel = usuario?.rol === 'helpworker' ? ROUTES.appHelpWorker : ROUTES.appSolicitante

  // Velo degradado solo mientras estamos arriba del hero
  const conVelo = overHero && !scrolled

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        scrolled
          ? 'glass shadow-[0_1px_20px_rgba(11,27,58,.08)]'
          : conVelo
            ? 'bg-gradient-to-b from-white/85 via-white/55 to-transparent'
            : 'glass',
      )}
      style={{ height: 'var(--nav-h)' }}
    >
      <Container className="flex h-full items-center justify-between">
        <Logo />

        {/* Navegación escritorio */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map(link => (
            <a
              key={link.label}
              href={link.href}
              data-tour={link.href === '#como-funciona' ? 'nav-como-funciona' : undefined}
              className="group relative rounded-full px-4 py-2 text-[15px] font-semibold text-ink-soft
                         transition-colors duration-200 hover:text-brand-600"
            >
              <span className="inline-flex items-center gap-1">
                {link.label}
                {'hasDropdown' in link && link.hasDropdown && <ChevronDown size={15} />}
              </span>
              {/* Subrayado que crece desde el centro */}
              <span className="absolute inset-x-4 bottom-1 h-[2px] origin-center scale-x-0 rounded-full
                               bg-brand-500 transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {usuario ? (
            <Button size="sm" to={panel}>Ir a mi panel</Button>
          ) : (
            <>
              <Button
                variant="secondary"
                size="sm"
                data-tour="nav-login"
                onClick={() => navigate(ROUTES.login, { state: { startTour: true } })}
              >
                Iniciar sesión
              </Button>
              <Button size="sm" to={ROUTES.registroRol} data-tour="nav-registro">Únete gratis</Button>
            </>
          )}
        </div>

        {/* Botón móvil */}
        <button
          onClick={() => setOpenMobile(v => !v)}
          aria-label="Abrir menú"
          className="rounded-xl p-2 text-ink lg:hidden"
        >
          {openMobile ? <X /> : <Menu />}
        </button>
      </Container>

      {/* Menú móvil */}
      <AnimatePresence>
        {openMobile && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="glass overflow-hidden lg:hidden"
          >
            <Container className="flex flex-col gap-1 py-4">
              {NAV_LINKS.map(l => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpenMobile(false)}
                  className="rounded-xl px-4 py-3 font-semibold text-ink-soft hover:bg-brand-50 hover:text-brand-600"
                >
                  {l.label}
                </a>
              ))}
              <div className="mt-2 flex flex-col gap-2">
                {usuario ? (
                  <Button fullWidth to={panel}>Ir a mi panel</Button>
                ) : (
                  <>
                    <Button
                      variant="secondary"
                      fullWidth
                      onClick={() => { setOpenMobile(false); navigate(ROUTES.login, { state: { startTour: true } }) }}
                    >
                      Iniciar sesión
                    </Button>
                    <Button fullWidth to={ROUTES.registroRol}>Únete gratis</Button>
                  </>
                )}
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
