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
  authCallback: '/auth/callback',
  // --- Solicitante ---
  appSolicitante: '/app/solicitante',
  solicitudes: '/app/solicitante/solicitudes', nuevaSolicitud: '/app/solicitante/solicitudes/nueva', propuestas: '/app/solicitante/propuestas', favoritos: '/app/solicitante/favoritos', pagos: '/app/solicitante/pagos', matching: '/app/solicitante/matching', calendarioSolicitante: '/app/solicitante/calendario', resenasSolicitante: '/app/solicitante/resenas', perfilSolicitante: '/app/solicitante/perfil', mensajesSolicitante: '/app/solicitante/mensajes', notificacionesSolicitante: '/app/solicitante/notificaciones', ajustesSolicitante: '/app/solicitante/ajustes', ayudaSolicitante: '/app/solicitante/ayuda',
  // --- HelpWorker ---
  appHelpWorker: '/app/helpworker',
  oportunidades: '/app/helpworker/oportunidades', matchingHW: '/app/helpworker/matching', trabajos: '/app/helpworker/trabajos', calendario: '/app/helpworker/calendario', resenas: '/app/helpworker/resenas', perfil: '/app/helpworker/perfil', ganancias: '/app/helpworker/ganancias', mensajes: '/app/helpworker/mensajes', notificaciones: '/app/helpworker/notificaciones', ajustes: '/app/helpworker/ajustes', ayuda: '/app/helpworker/ayuda',
  // --- Faceta solicitante exclusiva del HelpWorker con doble rol ---
  proveedorSolicitudes: '/app/helpworker/solicitante/solicitudes', proveedorNuevaSolicitud: '/app/helpworker/solicitante/solicitudes/nueva', proveedorMatchingSolicitudes: '/app/helpworker/solicitante/matching', proveedorPropuestas: '/app/helpworker/solicitante/propuestas', proveedorFavoritos: '/app/helpworker/solicitante/favoritos',
  // --- Administrador ---
  appAdministrador: '/app/administrador',
  adminSaludMercado: '/app/administrador/salud-mercado',
  adminMensajesArchivados: '/app/administrador/mensajes-archivados',
  adminOperacion: '/app/administrador/operacion',
  adminMarketplace: '/app/administrador/marketplace',
  adminAvanzado: '/app/administrador/avanzado',
  adminRecuperacion: '/app/administrador/recuperacion',
  adminSolicitudes: '/app/administrador/solicitudes',
} as const

/** Punto de entrada único por rol: impide que administración caiga en solicitante. */
export function dashboardRouteForRole(role: 'solicitante' | 'helpworker' | 'administrador') {
  if (role === 'administrador') return ROUTES.appAdministrador
  return role === 'helpworker' ? ROUTES.appHelpWorker : ROUTES.appSolicitante
}

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
