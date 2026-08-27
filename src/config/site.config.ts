/* ------------------------------------------------------------------
   Fuente única de verdad para textos, navegación y rutas.
   Cambiar un texto aquí lo cambia en toda la app.
------------------------------------------------------------------- */

export const ROUTES = {
  home: '/',
  precios: '/precios',
  login: '/iniciar-sesion',
  registro: '/registro',
  registroRol: '/registro/rol',
  // --- Solicitante ---
  appSolicitante: '/app/solicitante',
  solicitudes: '/app/solicitudes',
  nuevaSolicitud: '/app/solicitudes/nueva',
  propuestas: '/app/propuestas',
  favoritos: '/app/favoritos',
  pagos: '/app/pagos',
  matching: '/app/matching',
  // --- HelpWorker ---
  appHelpWorker: '/app/helpworker',
  oportunidades: '/app/oportunidades',
  trabajos: '/app/trabajos',
  calendario: '/app/calendario',
  resenas: '/app/resenas',
  perfil: '/app/perfil',
  ganancias: '/app/ganancias',
  matchingHW: '/app/matching-trabajos',
  // --- Comunes ---
  mensajes: '/app/mensajes',
  notificaciones: '/app/notificaciones',
  ajustes: '/app/ajustes',
  ayuda: '/app/ayuda',
} as const

export const NAV_LINKS = [
  { label: 'Cómo funciona', href: '#como-funciona' },
  { label: 'Para quién', href: '#para-quien' },
  { label: 'Beneficios', href: '#beneficios' },
  { label: 'Precios', href: '#precios' },
  { label: 'Recursos', href: '#recursos', hasDropdown: true },
] as const

/* ------------------------------------------------------------------
   CÓMO SE LLAMA CADA ROL.

   "HelpWorker" ya estaba: es quien ofrece su trabajo.
   Al otro lado hacía falta un nombre propio —decir "el solicitante" en
   la interfaz suena a trámite—, así que se llama "HelpSeeker": el que
   busca. Rima con el primero y se entiende sin explicación.

   Está aquí y no repartido por el código: cambiar el apodo es cambiar
   estas líneas y nada más.
------------------------------------------------------------------- */
export const TERMINOS = {
  solicitante: {
    singular: 'HelpSeeker',
    plural: 'HelpSeekers',
    descripcion: 'Personas que necesitan ayuda',
  },
  helpworker: {
    singular: 'HelpWorker',
    plural: 'HelpWorkers',
    descripcion: 'Personas que ofrecen su trabajo',
  },
} as const

/** Devuelve cómo llamar a la CONTRAPARTE del rol que se pasa. */
export const contraparte = (rol: 'solicitante' | 'helpworker') =>
  rol === 'solicitante' ? TERMINOS.helpworker : TERMINOS.solicitante

export const SITE = {
  nombre: 'HelpWork',
  claim: 'Conectamos talento con oportunidades reales.',
  email: 'info@helpwork.com',
  telefono: '+593 98 987 7633',
  pais: 'Ecuador',
} as const

export const FOOTER_COLUMNS = [
  { titulo: 'Plataforma', links: ['Cómo funciona', 'Explorar servicios', 'Help Workers'] },
  { titulo: 'Empresa', links: ['Sobre nosotros', 'Blog', 'Contacto'] },
  { titulo: 'Recursos', links: ['Centro de ayuda', 'Políticas', 'Términos'] },
] as const
