/* ------------------------------------------------------------------
   DATOS DE PRUEBA (mock).
   Sustituir por llamadas reales cuando exista el backend:
     const { data } = await http.get(ENDPOINTS.planes.list)
   Los componentes NO cambian porque los tipos son los mismos.
------------------------------------------------------------------- */
import type { MatchCandidate, Opportunity, Plan, ServiceRequest } from '@/types'
import type { ChatMessage } from '@/components/mascot/MascotChat'

import type { Phrase } from '@/components/motion/FadingPhrases'

/**
 * Frases del titular. Se relevan solas con un fundido.
 * Conviene que tengan longitudes parecidas: la más larga fija la altura
 * del bloque y las demás dejarían un hueco si fueran mucho más cortas.
 */
export const HERO_PHRASES: Phrase[] = [
  { texto: 'Aprovecha tu tiempo. Conectamos talento con oportunidades reales.',
    destacar: ['oportunidades', 'reales'] },
  { texto: 'Encuentra a la persona indicada en minutos, no en semanas.',
    destacar: ['persona', 'indicada'] },
  { texto: 'Tus habilidades valen. Convierte lo que sabes en ingresos reales.',
    destacar: ['ingresos', 'reales'] },
  { texto: 'Del apunte a la práctica. Aprende de quien ya pasó por ahí.',
    destacar: ['ya', 'pasó', 'por', 'ahí'] },
  { texto: 'Ayuda verificada, precios claros y pagos protegidos.',
    destacar: ['pagos', 'protegidos'] },
]

/**
 * Conversación del hero. Se muestran de a tres y van rotando, así que la
 * lista puede ser larga sin que la nube crezca.
 */
export const HERO_CHAT: ChatMessage[] = [
  { id: 'm01', texto: 'Necesito ayuda con mi tesis 📚' },
  { id: 'm02', texto: 'Te puedo ayudar con estadística', tone: 'success', icon: 'check' },
  { id: 'm03', texto: '¡Perfecto! Hagámoslo 😊', tone: 'amber', icon: 'star' },
  { id: 'm04', texto: '¿Alguien de cálculo diferencial?' },
  { id: 'm05', texto: 'Doy clases los martes y jueves', tone: 'success', icon: 'check' },
  { id: 'm06', texto: 'Agendado para mañana ✅', tone: 'amber', icon: 'star' },
  { id: 'm07', texto: 'Busco quien me arme la presentación' },
  { id: 'm08', texto: 'Diseño de slides, lo hago seguido', tone: 'success', icon: 'check' },
  { id: 'm09', texto: 'Quedó increíble, gracias ⭐', tone: 'amber', icon: 'star' },
  { id: 'm10', texto: 'Necesito revisar mi código en Python' },
  { id: 'm11', texto: 'Reviso y te explico los errores', tone: 'success', icon: 'check' },
  { id: 'm12', texto: 'Al fin lo entendí 🙌', tone: 'amber', icon: 'star' },
]

export const PLANES: Plan[] = [
  {
    id: 'explora', nombre: 'Explora', precioMensual: 0, precioAnual: 0, tagline: 'Para empezar',
    features: ['2 conexiones diarias', 'Acceso limitado', 'Herramientas básicas', 'Crecimiento inteligente'],
  },
  {
    id: 'impulso', nombre: 'Impulso', precioMensual: 4.99, precioAnual: 47.9, tagline: 'Más oportunidades',
    features: ['5 conexiones diarias', 'Búsqueda avanzada', 'Herramientas esenciales', 'Soporte prioritario', 'Ideas personalizadas'],
  },
  {
    id: 'crece', nombre: 'Crece', precioMensual: 9.99, precioAnual: 95.9, tagline: 'Más visibilidad', destacado: true,
    features: ['Conexiones ilimitadas', 'Búsqueda inteligente', 'Herramientas avanzadas', 'Recomendaciones diarias', 'Análisis de compatibilidad', 'Soporte preferente'],
  },
  {
    id: 'pro', nombre: 'Pro', precioMensual: 19.99, precioAnual: 191.9, tagline: 'Máximo potencial',
    features: ['Conexiones ilimitadas', 'Búsqueda avanzada', 'Perfil destacado', 'Recomendaciones diarias', 'Análisis profundo', 'Soporte prioritario'],
  },
]

export const SOLICITUDES: ServiceRequest[] = [
  { id: 's1', titulo: 'Tesis de Ingeniería Civil', categoria: 'Redacción de tesis', estado: 'en_progreso', propuestas: 2, actualizadoHace: 'hace 1h' },
  { id: 's2', titulo: 'Clases de Matemáticas', categoria: 'Clases particulares', estado: 'recibiendo', propuestas: 5, actualizadoHace: 'hace 3h' },
  { id: 's3', titulo: 'Diseño de Logo', categoria: 'Diseño / Creación', estado: 'en_progreso', propuestas: 3, actualizadoHace: 'hace 5h' },
]

const AVATAR = (seed: string) => `https://i.pravatar.cc/160?u=${seed}`

export const CANDIDATOS: MatchCandidate[] = [
  {
    id: 'c1', nombre: 'Joaquín Quintero', profesion: 'Ingeniero Matemático', rating: 4.9, reseñas: 128, match: 92,
    tarifaMin: 10, tarifaMax: 15, unidad: 'hora', habilidades: ['Matemáticas', 'Cálculo', 'Álgebra Lineal', 'Estadística'],
    disponibilidad: 'Hoy 16:00 – 20:00', modalidad: 'En línea', avatarUrl: AVATAR('joaquin'), verificado: true,
  },
  {
    id: 'c2', nombre: 'María Fernanda C.', profesion: 'Profesora de Matemáticas', rating: 4.8, reseñas: 96, match: 88,
    tarifaMin: 12, tarifaMax: 18, unidad: 'hora', habilidades: ['Matemáticas', 'Cálculo', 'Física', 'Estadística'],
    disponibilidad: 'Hoy 18:00 – 22:00', modalidad: 'En línea', avatarUrl: AVATAR('maria'), verificado: true,
  },
  {
    id: 'c3', nombre: 'Andrés Felipe R.', profesion: 'Tutor Universitario', rating: 4.7, reseñas: 74, match: 84,
    tarifaMin: 9, tarifaMax: 14, unidad: 'hora', habilidades: ['Matemáticas', 'Álgebra', 'Cálculo', 'Programación'],
    disponibilidad: 'Mañana 09:00 – 13:00', modalidad: 'En línea', avatarUrl: AVATAR('andres'), verificado: true,
  },
]

export const OPORTUNIDADES: Opportunity[] = [
  { id: 'o1', titulo: 'Clases de Excel — Nivel Intermedio', categoria: 'Estudios y Tutorías', modalidad: 'En línea', publicadoHace: 'hace 2h', precio: 15, unidad: 'hora', match: 95, urgente: true, avatarUrl: AVATAR('op1') },
  { id: 'o2', titulo: 'Diseño de Presentación Profesional', categoria: 'Diseño y Creatividad', modalidad: 'Remoto', publicadoHace: 'hace 3h', precio: 20, unidad: 'proyecto', match: 92, avatarUrl: AVATAR('op2') },
  { id: 'o3', titulo: 'Asesoría en Marketing Digital', categoria: 'Marketing Digital', modalidad: 'En línea', publicadoHace: 'hace 5h', precio: 18, unidad: 'hora', match: 90, avatarUrl: AVATAR('op3') },
]
