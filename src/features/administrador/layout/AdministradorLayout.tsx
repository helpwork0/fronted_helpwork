import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Archive, BarChart3, FileCheck, Home, KeyRound, LogOut, Settings2, Users } from 'lucide-react'
import { Logo } from '@/components/layout/Logo'
import { AppBar } from '@/components/layout/AppBar'
import { MascotGuideButton } from '@/components/onboarding/MascotGuideButton'
import { ROUTES } from '@/config/site.config'
import { useAuth } from '@/features/auth/AuthContext'

const item = 'mt-2 flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-medium text-ink-soft transition hover:bg-brand-50 hover:text-brand-700 [&.active]:bg-brand-50 [&.active]:text-brand-700'

export default function AdministradorLayout() {
  const { logout } = useAuth(); const navigate = useNavigate()
  const cerrarSesion = async () => { await logout(); navigate(ROUTES.home, { replace: true }) }
  return <div className="ambiente min-h-screen"><aside className="fixed inset-y-0 left-0 hidden w-[264px] border-r border-white/70 bg-white/75 p-5 backdrop-blur-2xl lg:block"><Logo /><p className="mt-7 text-[11px] font-bold uppercase tracking-wider text-ink-muted">Administración</p><NavLink end to={ROUTES.appAdministrador} className={item}><Home size={18}/> Resumen</NavLink><NavLink to={ROUTES.adminOperacion} className={item}><Users size={18}/> Comunidad y moderación</NavLink><NavLink to={ROUTES.adminRecuperacion} className={item}><KeyRound size={18}/> Recuperación de cuentas</NavLink><NavLink to={ROUTES.adminSolicitudes} className={item}><FileCheck size={18}/> Solicitudes, ofertas y acuerdos</NavLink><NavLink to={ROUTES.adminSaludMercado} className={item}><BarChart3 size={18}/> Salud del mercado</NavLink><NavLink to={ROUTES.adminMensajesArchivados} className={item}><Archive size={18}/> Chats archivados</NavLink><NavLink to={ROUTES.adminAvanzado} className={item}><Settings2 size={18}/> CMS, reportes y tecnología</NavLink><button type="button" onClick={() => cerrarSesion().catch(() => undefined)} className="absolute bottom-6 left-5 right-5 flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-semibold text-red-600 transition hover:bg-red-50"><LogOut size={18}/> Cerrar sesión</button></aside><main className="lg:pl-[264px]"><AppBar notificationsTo={ROUTES.appAdministrador}/><div className="px-5 py-7 sm:px-8"><Outlet/></div></main><MascotGuideButton tourId="modulo-administrador"/></div>
}
