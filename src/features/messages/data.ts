import type { Conversacion } from '@/types'

const AV = (s: string) => `https://i.pravatar.cc/120?u=${s}`

/** Conversaciones de prueba. Reemplazar por GET /mensajes cuando exista el backend. */
export const CONVERSACIONES: Conversacion[] = [
  {
    id: 'cv1', nombre: 'Joaquín Quintero', rol: 'Ingeniero Matemático',
    avatarUrl: AV('joaquin'), enLinea: true, noLeidos: 2, sobre: 'Clases de Matemáticas',
    mensajes: [
      { id: 'x1', autor: 'otro', texto: 'Hola Ariana, vi tu solicitud de cálculo diferencial 👋', hora: '10:12' },
      { id: 'x2', autor: 'yo',   texto: '¡Hola! Sí, necesito ayuda con integrales sobre todo.', hora: '10:14' },
      { id: 'x3', autor: 'otro', texto: 'Perfecto, es justo lo que más enseño.', hora: '10:15' },
      { id: 'x4', autor: 'otro', texto: '¿Te sirve mañana a las 4 de la tarde?', hora: '10:15' },
    ],
  },
  {
    id: 'cv2', nombre: 'María Fernanda C.', rol: 'Profesora de Matemáticas',
    avatarUrl: AV('maria'), enLinea: true, noLeidos: 1, sobre: 'Clases de Matemáticas',
    mensajes: [
      { id: 'y1', autor: 'otro', texto: 'Buenas tardes, te envié mi propuesta 🙂', hora: '09:40' },
      { id: 'y2', autor: 'yo',   texto: 'Gracias, la reviso hoy mismo.', hora: '09:52' },
      { id: 'y3', autor: 'otro', texto: 'Sin apuro. Cualquier duda me escribes.', hora: '09:53' },
    ],
  },
  {
    id: 'cv3', nombre: 'Andrés Felipe R.', rol: 'Tutor Universitario',
    avatarUrl: AV('andres'), enLinea: false, noLeidos: 0, sobre: 'Tesis de Ingeniería Civil',
    mensajes: [
      { id: 'z1', autor: 'yo',   texto: '¿Manejas análisis estructural?', hora: 'Ayer' },
      { id: 'z2', autor: 'otro', texto: 'Sí, trabajo con SAP2000 y ETABS.', hora: 'Ayer' },
      { id: 'z3', autor: 'yo',   texto: 'Excelente, te escribo el lunes.', hora: 'Ayer' },
    ],
  },
  {
    id: 'cv4', nombre: 'Soporte HelpWork', rol: 'Equipo de ayuda',
    avatarUrl: '/assets/mascota/mascota-saludo.png', enLinea: true, noLeidos: 0,
    mensajes: [
      { id: 'w1', autor: 'otro', texto: '¡Bienvenida a HelpWork! Si algo no te cuadra, escríbenos por aquí.', hora: 'Lun' },
    ],
  },
]

/** Respuestas automáticas para que la maqueta se sienta viva al escribir. */
export const RESPUESTAS_DEMO = [
  'Perfecto, anotado 👍',
  'Dame un momento y te confirmo.',
  'Claro que sí, sin problema.',
  '¿Te parece si lo vemos con calma mañana?',
  'Listo, quedamos así entonces.',
]
