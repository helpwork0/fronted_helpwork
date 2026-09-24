/* Catálogo de endpoints. Mantener aquí evita strings sueltos por el código. */
export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    me: '/auth/me',
    googleUrl: '/auth/google/url',
    session: '/auth/session',
    logout: '/auth/logout',
  },
  usuarios: { perfilPropio: '/usuarios/me/perfil', activarSolicitante: '/usuarios/me/roles/solicitante', modoSolicitante: '/usuarios/me/roles/solicitante', perfilSolicitante: (id: string) => `/usuarios/${id}/perfil-solicitante`, perfilProveedor: (id: string) => `/usuarios/${id}/perfil-proveedor`, perfilPublicoProveedor: (id: string) => `/usuarios/proveedores/${id}/perfil-publico`, perfilPublicoSolicitante: (id: string) => `/usuarios/solicitantes/${id}/perfil-publico`, favoritosProveedores: '/usuarios/me/favoritos/proveedores', favoritoProveedor: (id: string) => `/usuarios/me/favoritos/proveedores/${id}` },
  solicitudes: {
    list: '/solicitudes',
    byId: (id: string) => `/solicitudes/${id}`,
    attachments: (id: string) => `/solicitudes/${id}/adjuntos`,
    attachment: (id: string, attachmentId: string) => `/solicitudes/${id}/adjuntos/${attachmentId}`,
    attachmentsProvider: (id: string) => `/solicitudes/${id}/adjuntos-proveedor`,
    status: (id: string, status: 'active' | 'paused' | 'closed' | 'expired') => `/solicitudes/${id}/${status}`,
  },
  matching: {
    recommend: '/matching/recomendar',
  },
  catalogo: { campos: '/catalogo/campos', temas: (fieldCode: string) => `/catalogo/temas?campoCodigo=${encodeURIComponent(fieldCode)}`, tiposServicio: '/catalogo/tipos-servicio' },
  proveedores: { servicios: (id: string) => `/proveedores/${id}/servicios`, disponibilidad: (id: string) => `/proveedores/${id}/disponibilidad` },
  recomendaciones: { solicitud: (requestId: string) => `/recomendaciones/solicitud/${requestId}`, ranking: (requestId: string) => `/recomendaciones/solicitud/${requestId}/ranking`, proveedor: (providerId: string) => `/recomendaciones/proveedor/${providerId}`, estado: (id: string) => `/recomendaciones/${id}/estado` },
  notificaciones: { list: (limit: number, offset: number) => `/notificaciones?limit=${limit}&offset=${offset}`, summary: '/notificaciones/resumen', read: (id: string | number) => `/notificaciones/${id}/leida`, readAll: '/notificaciones/leidas/todas' },
  moderacion: { resenasMias: '/moderacion/resenas/mias', resenasProveedor: (id: string) => `/moderacion/resenas/proveedor/${id}`, crearResena: '/moderacion/resenas', resenasSolicitanteMias: '/moderacion/resenas-solicitante/mias', resenasSolicitante: (id: string) => `/moderacion/resenas-solicitante/${id}`, crearResenaSolicitante: '/moderacion/resenas-solicitante', bloqueosMios: '/moderacion/bloqueos/mios', bloquear: '/moderacion/bloqueos', desbloquear: (blockedId: string) => `/moderacion/bloqueos/${blockedId}`, incidencia: '/moderacion/incidencias' },
  tareas: { list: '/tareas', byId: (id: string) => `/tareas/${id}`, create: '/tareas', remove: (id: string) => `/tareas/${id}` },
  oportunidades: { list: '/oportunidades' },
  planes: { list: '/planes' },
} as const
