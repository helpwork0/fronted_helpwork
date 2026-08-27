import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { Conversacion } from '@/types'
import { CONVERSACIONES, RESPUESTAS_DEMO } from './data'

/* ------------------------------------------------------------------
   Estado de la mensajería.

   Vive en un contexto porque hay TRES lugares que necesitan lo mismo:
   el icono de la barra (cuántos sin leer), el desplegable (la lista) y
   las ventanitas de chat (los mensajes). Sin contexto habría que pasar
   props por media aplicación.
------------------------------------------------------------------- */

interface MessagesContextValue {
  conversaciones: Conversacion[]
  totalNoLeidos: number
  /** Ids de los chats abiertos abajo a la derecha (máximo 3 a la vez). */
  abiertos: string[]
  minimizados: string[]
  abrirChat: (id: string) => void
  cerrarChat: (id: string) => void
  alternarMinimizado: (id: string) => void
  enviar: (id: string, texto: string) => void
}

const MessagesContext = createContext<MessagesContextValue | null>(null)

const MAX_ABIERTOS = 3
const ahora = () => new Date().toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })

export function MessagesProvider({ children }: { children: React.ReactNode }) {
  const [conversaciones, setConversaciones] = useState<Conversacion[]>(CONVERSACIONES)
  const [abiertos, setAbiertos] = useState<string[]>([])
  const [minimizados, setMinimizados] = useState<string[]>([])

  const abrirChat = useCallback((id: string) => {
    // Al abrir se marca como leída: es lo que espera cualquiera
    setConversaciones(cs => cs.map(c => (c.id === id ? { ...c, noLeidos: 0 } : c)))
    setMinimizados(m => m.filter(x => x !== id))
    setAbiertos(a => (a.includes(id) ? a : [id, ...a].slice(0, MAX_ABIERTOS)))
  }, [])

  const cerrarChat = useCallback((id: string) => {
    setAbiertos(a => a.filter(x => x !== id))
    setMinimizados(m => m.filter(x => x !== id))
  }, [])

  const alternarMinimizado = useCallback((id: string) => {
    setMinimizados(m => (m.includes(id) ? m.filter(x => x !== id) : [...m, id]))
  }, [])

  const enviar = useCallback((id: string, texto: string) => {
    const limpio = texto.trim()
    if (!limpio) return

    setConversaciones(cs => cs.map(c => c.id === id
      ? { ...c, mensajes: [...c.mensajes, { id: `m${Date.now()}`, autor: 'yo', texto: limpio, hora: ahora() }] }
      : c))

    // Respuesta simulada, solo para que la maqueta se sienta viva.
    // TODO backend: esto lo reemplaza un WebSocket o un polling.
    const espera = 900 + Math.random() * 900
    window.setTimeout(() => {
      const respuesta = RESPUESTAS_DEMO[Math.floor(Math.random() * RESPUESTAS_DEMO.length)]
      setConversaciones(cs => cs.map(c => c.id === id
        ? { ...c, mensajes: [...c.mensajes, { id: `r${Date.now()}`, autor: 'otro', texto: respuesta, hora: ahora() }] }
        : c))
    }, espera)
  }, [])

  const totalNoLeidos = useMemo(
    () => conversaciones.reduce((n, c) => n + c.noLeidos, 0),
    [conversaciones],
  )

  const value = useMemo(
    () => ({ conversaciones, totalNoLeidos, abiertos, minimizados, abrirChat, cerrarChat, alternarMinimizado, enviar }),
    [conversaciones, totalNoLeidos, abiertos, minimizados, abrirChat, cerrarChat, alternarMinimizado, enviar],
  )

  return <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>
}

export function useMessages() {
  const ctx = useContext(MessagesContext)
  if (!ctx) throw new Error('useMessages debe usarse dentro de <MessagesProvider>')
  return ctx
}
