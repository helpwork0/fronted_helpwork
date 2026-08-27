import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import {
  Home, FileText, MessageSquare, Inbox, Heart, Wallet, Bell, HelpCircle,
  Briefcase, Calendar, Star, User, Settings, Sparkles,
} from 'lucide-react'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { DashboardLayout, type SidebarItem } from '@/components/layout/DashboardLayout'
import { ROUTES } from '@/config/site.config'
import { ScrollToTop } from './ScrollToTop'
import { RutaPrivada } from './RutaPrivada'

/* Carga diferida: cada página va en su propio chunk => arranque más rápido. */
const HomePage       = lazy(() => import('@/features/marketing/pages/HomePage'))
const PricingPage    = lazy(() => import('@/features/marketing/pages/PricingPage'))
const LoginPage      = lazy(() => import('@/features/auth/pages/LoginPage'))
const RegisterPage   = lazy(() => import('@/features/auth/pages/RegisterPage'))
const RoleSelectPage = lazy(() => import('@/features/auth/pages/RoleSelectPage'))

const SeekerHome     = lazy(() => import('@/features/dashboard/pages/SeekerHomePage'))
const WorkerHome     = lazy(() => import('@/features/dashboard/pages/WorkerHomePage'))
const MatchingPage   = lazy(() => import('@/features/dashboard/pages/MatchingPage'))
const WorkerMatching = lazy(() => import('@/features/dashboard/pages/WorkerMatchingPage'))
const RequestsPage   = lazy(() => import('@/features/dashboard/pages/RequestsPage'))
const NewRequestPage = lazy(() => import('@/features/dashboard/pages/NewRequestPage'))
const ProposalsPage  = lazy(() => import('@/features/dashboard/pages/ProposalsPage'))
const FavoritesPage  = lazy(() => import('@/features/dashboard/pages/FavoritesPage'))
const PaymentsPage   = lazy(() => import('@/features/dashboard/pages/PaymentsPage'))
const NotifPage      = lazy(() => import('@/features/dashboard/pages/NotificationsPage'))
const HelpPage       = lazy(() => import('@/features/dashboard/pages/HelpPage'))
const OpportunitiesPage = lazy(() => import('@/features/dashboard/pages/OpportunitiesPage'))
const JobsPage       = lazy(() => import('@/features/dashboard/pages/JobsPage'))
const CalendarPage   = lazy(() => import('@/features/dashboard/pages/CalendarPage'))
const ReviewsPage    = lazy(() => import('@/features/dashboard/pages/ReviewsPage'))
const ProfilePage    = lazy(() => import('@/features/dashboard/pages/ProfilePage'))
const SettingsPage   = lazy(() => import('@/features/dashboard/pages/SettingsPage'))
const InboxPage      = lazy(() => import('@/features/messages/InboxPage'))

const MENU_SOLICITANTE: SidebarItem[] = [
  { label: 'Inicio', to: ROUTES.appSolicitante, icon: Home },
  { label: 'Mis solicitudes', to: ROUTES.solicitudes, icon: FileText },
  { label: 'Mensajes', to: ROUTES.mensajes, icon: MessageSquare },
  { label: 'Propuestas', to: ROUTES.propuestas, icon: Inbox },
  { label: 'Matching', to: ROUTES.matching, icon: Sparkles },
  { label: 'Favoritos', to: ROUTES.favoritos, icon: Heart },
  { label: 'Pagos', to: ROUTES.pagos, icon: Wallet },
  { label: 'Notificaciones', to: ROUTES.notificaciones, icon: Bell, badge: 2 },
  { label: 'Ajustes', to: ROUTES.ajustes, icon: Settings },
  { label: 'Ayuda', to: ROUTES.ayuda, icon: HelpCircle },
]

const MENU_HELPWORKER: SidebarItem[] = [
  { label: 'Inicio', to: ROUTES.appHelpWorker, icon: Home },
  { label: 'Oportunidades', to: ROUTES.oportunidades, icon: Briefcase },
  { label: 'Matching', to: ROUTES.matchingHW, icon: Sparkles },
  { label: 'Mis trabajos', to: ROUTES.trabajos, icon: FileText },
  { label: 'Mensajes', to: ROUTES.mensajes, icon: MessageSquare },
  { label: 'Calendario', to: ROUTES.calendario, icon: Calendar },
  { label: 'Ganancias', to: ROUTES.ganancias, icon: Wallet },
  { label: 'Reseñas', to: ROUTES.resenas, icon: Star },
  { label: 'Perfil público', to: ROUTES.perfil, icon: User },
  { label: 'Ajustes', to: ROUTES.ajustes, icon: Settings },
  { label: 'Ayuda', to: ROUTES.ayuda, icon: HelpCircle },
]

const USUARIO_SOLICITANTE = { nombre: 'Ariana López', subtitulo: 'Solicitante verificado', avatarUrl: 'https://i.pravatar.cc/120?u=ariana' }
const USUARIO_HELPWORKER  = { nombre: 'Joaquín Quintero', subtitulo: 'HelpWorker · Plan Pro', avatarUrl: 'https://i.pravatar.cc/120?u=joaquin' }

const Cargando = () => (
  <div className="grid min-h-[60vh] place-items-center">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-100 border-t-brand-500" />
  </div>
)

const router = createBrowserRouter([
  {
    element: <><ScrollToTop /><PublicLayout /></>,
    children: [
      { path: ROUTES.home, element: <HomePage /> },
      { path: ROUTES.precios, element: <PricingPage /> },
      { path: ROUTES.login, element: <LoginPage /> },
      { path: ROUTES.registro, element: <RegisterPage /> },
      { path: ROUTES.registroRol, element: <RoleSelectPage /> },
    ],
  },
  {
    // Zona del solicitante
    element: (
      <RutaPrivada>
        <ScrollToTop />
        <DashboardLayout items={MENU_SOLICITANTE} usuario={USUARIO_SOLICITANTE} />
      </RutaPrivada>
    ),
    children: [
      { path: ROUTES.appSolicitante, element: <SeekerHome /> },
      { path: ROUTES.solicitudes, element: <RequestsPage /> },
      { path: ROUTES.nuevaSolicitud, element: <NewRequestPage /> },
      { path: ROUTES.propuestas, element: <ProposalsPage /> },
      { path: ROUTES.matching, element: <MatchingPage /> },
      { path: ROUTES.favoritos, element: <FavoritesPage /> },
      { path: ROUTES.pagos, element: <PaymentsPage /> },
      { path: ROUTES.mensajes, element: <InboxPage /> },
      { path: ROUTES.notificaciones, element: <NotifPage /> },
      { path: ROUTES.ajustes, element: <SettingsPage /> },
      { path: ROUTES.ayuda, element: <HelpPage /> },
    ],
  },
  {
    // Zona del HelpWorker
    element: (
      <RutaPrivada>
        <ScrollToTop />
        <DashboardLayout items={MENU_HELPWORKER} usuario={USUARIO_HELPWORKER} />
      </RutaPrivada>
    ),
    children: [
      { path: ROUTES.appHelpWorker, element: <WorkerHome /> },
      { path: ROUTES.oportunidades, element: <OpportunitiesPage /> },
      { path: ROUTES.trabajos, element: <JobsPage /> },
      { path: ROUTES.calendario, element: <CalendarPage /> },
      { path: ROUTES.resenas, element: <ReviewsPage /> },
      { path: ROUTES.perfil, element: <ProfilePage /> },
      { path: ROUTES.ganancias, element: <PaymentsPage modo="helpworker" /> },
      { path: ROUTES.matchingHW, element: <WorkerMatching /> },
      { path: ROUTES.mensajes, element: <InboxPage /> },
      { path: ROUTES.notificaciones, element: <NotifPage /> },
      { path: ROUTES.ajustes, element: <SettingsPage /> },
      { path: ROUTES.ayuda, element: <HelpPage /> },
    ],
  },
  { path: '*', element: <div className="grid min-h-screen place-items-center text-ink-muted">404 — Página no encontrada</div> },
])

export function AppRouter() {
  return (
    <Suspense fallback={<Cargando />}>
      <RouterProvider router={router} />
    </Suspense>
  )
}
