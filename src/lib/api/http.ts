/* ------------------------------------------------------------------
   Cliente HTTP único. Todo el frontend habla con el backend por aquí.
   Ventaja: cuando conectes Express, solo tocas este archivo
   (token, refresh, manejo de errores) y nada más.
------------------------------------------------------------------- */

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

export class ApiError extends Error {
  constructor(public status: number, message: string, public data?: unknown) {
    super(message)
    this.name = 'ApiError'
  }
}

let authToken: string | null = null
export const setAuthToken = (token: string | null) => { authToken = token }

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...options.headers,
    },
  })

  const isJson = res.headers.get('content-type')?.includes('application/json')
  const body = isJson ? await res.json().catch(() => null) : null

  if (!res.ok) {
    throw new ApiError(res.status, (body as any)?.message ?? res.statusText, body)
  }
  return body as T
}

export const http = {
  get:  <T>(p: string) => request<T>(p),
  post: <T>(p: string, data?: unknown) => request<T>(p, { method: 'POST', body: JSON.stringify(data) }),
  put:  <T>(p: string, data?: unknown) => request<T>(p, { method: 'PUT', body: JSON.stringify(data) }),
  del:  <T>(p: string) => request<T>(p, { method: 'DELETE' }),
}
