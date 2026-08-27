/* ------------------------------------------------------------------
   Tipos de dominio. Cuando llegue el backend, estos mismos tipos son
   los que debe devolver la API (así no cambias los componentes).
------------------------------------------------------------------- */

export type UserRole = 'solicitante' | 'helpworker'

export interface User {
  id: string
  nombre: string
  email: string
  rol: UserRole
  avatarUrl?: string
  verificado: boolean
}

export type RequestStatus = 'publicado' | 'recibiendo' | 'en_progreso' | 'completado'

export interface ServiceRequest {
  id: string
  titulo: string
  categoria: string
  estado: RequestStatus
  propuestas: number
  actualizadoHace: string
  imagenUrl?: string
}

export interface MatchCandidate {
  id: string
  nombre: string
  profesion: string
  rating: number
  reseñas: number
  match: number          // 0-100
  tarifaMin: number
  tarifaMax: number
  unidad: 'hora' | 'proyecto'
  habilidades: string[]
  disponibilidad: string
  modalidad: string
  avatarUrl: string
  verificado: boolean
}

export interface Opportunity {
  id: string
  titulo: string
  categoria: string
  modalidad: string
  publicadoHace: string
  precio: number
  unidad: 'hora' | 'proyecto'
  match: number
  urgente?: boolean
  avatarUrl: string
}

export interface Plan {
  id: string
  nombre: string
  precioMensual: number
  precioAnual: number
  tagline: string
  destacado?: boolean
  features: string[]
}

/* ---------------------- Mensajería ---------------------- */

export interface Mensaje {
  id: string
  /** 'yo' = lo escribió la persona que usa la app. */
  autor: 'yo' | 'otro'
  texto: string
  hora: string
}

export interface Conversacion {
  id: string
  nombre: string
  rol: string
  avatarUrl: string
  enLinea: boolean
  noLeidos: number
  /** Contexto: a qué solicitud pertenece esta conversación. */
  sobre?: string
  mensajes: Mensaje[]
}
