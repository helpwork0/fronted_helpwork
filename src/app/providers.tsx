import { AuthProvider } from '@/features/auth/AuthContext'
import { MessagesProvider } from '@/features/messages/MessagesContext'
import { TourProvider } from '@/components/onboarding/TourProvider'

/**
 * Proveedores globales.
 * El orden importa: TourProvider consulta la sesión para decidir si una
 * guía debe correr, así que AuthProvider tiene que envolverlo.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <MessagesProvider>
        <TourProvider>{children}</TourProvider>
      </MessagesProvider>
    </AuthProvider>
  )
}
