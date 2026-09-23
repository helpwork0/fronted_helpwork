import { NavLink, Outlet } from 'react-router-dom'
import { Home, Shield } from 'lucide-react'
import { Logo } from '@/components/layout/Logo'
import { AppBar } from '@/components/layout/AppBar'
import { ROUTES } from '@/config/site.config'
/** Base independiente del administrador; no comparte navegación con usuarios. */
export default function AdministradorLayout() { return <div className="ambiente min-h-screen"><aside className="fixed inset-y-0 left-0 hidden w-[264px] border-r border-white/70 bg-white/75 p-5 backdrop-blur-2xl lg:block"><Logo /><p className="mt-7 text-[11px] font-bold uppercase tracking-wider text-ink-muted">Administración</p><NavLink to={ROUTES.appAdministrador} className="mt-3 flex items-center gap-3 rounded-xl bg-brand-50 px-3.5 py-2.5 text-[14px] font-medium text-brand-700"><Home size={18} /> Inicio</NavLink><div className="mt-2 flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] text-ink-muted/50"><Shield size={18} /> Moderación</div></aside><main className="lg:pl-[264px]"><AppBar notificationsTo={ROUTES.appAdministrador} /><div className="px-5 py-7 sm:px-8"><Outlet /></div></main></div> }
