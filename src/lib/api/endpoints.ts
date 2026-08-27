/* Catálogo de endpoints. Mantener aquí evita strings sueltos por el código. */
export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    me: '/auth/me',
    google: '/auth/google',
  },
  solicitudes: {
    list: '/solicitudes',
    byId: (id: string) => `/solicitudes/${id}`,
  },
  matching: {
    forRequest: (id: string) => `/matching/solicitud/${id}`,
  },
  oportunidades: { list: '/oportunidades' },
  planes: { list: '/planes' },
} as const
