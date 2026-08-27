import { useEffect } from 'react'
import { useTour } from './TourProvider'
import { TOURS, type TourId } from './tours'
import { useAuth } from '@/features/auth/AuthContext'

const BASE = 'helpwork:tours-vistos'

/**
 * Guías que solo tienen sentido dentro de la app. Se rigen por la CUENTA:
 * se muestran una única vez por usuario, tanto si acaba de registrarse como
 * si es su primera vez entrando en este navegador. Las demás (landing,
 * login, registro) se rigen por el navegador, porque ahí aún no hay cuenta.
 */
const TOURS_PRIVADOS: TourId[] = ['solicitante', 'helpworker', 'matching']

/**
 * El registro de "ya vistas" se guarda por ámbito:
 *   · tours públicos  → helpwork:tours-vistos:anon
 *   · tours privados  → helpwork:tours-vistos:<id del usuario>
 *
 * CERRAR SESIÓN NO BORRA ESTAS CLAVES. Solo se elimina `helpwork:sesion`
 * (ver AuthContext), así que al volver a entrar las guías no reaparecen.
 * Y como la clave lleva el id del usuario, si otra persona entra en el
 * mismo navegador sí recibe las suyas.
 */
const clave = (ambito: string) => `${BASE}:${ambito}`

function vistos(ambito: string): string[] {
  try { return JSON.parse(localStorage.getItem(clave(ambito)) ?? '[]') } catch { return [] }
}

function marcarVisto(ambito: string, id: string) {
  const lista = vistos(ambito)
  if (!lista.includes(id)) localStorage.setItem(clave(ambito), JSON.stringify([...lista, id]))
}

/** Borra el historial de guías de todos los ámbitos. Útil al probar. */
export function reiniciarGuias() {
  Object.keys(localStorage)
    .filter(k => k.startsWith(BASE))
    .forEach(k => localStorage.removeItem(k))
}

/**
 * Lanza la guía de una pantalla cuando corresponde.
 *
 * Reglas:
 *  · Pantallas públicas → una vez por navegador.
 *  · Pantallas privadas → una vez por cuenta. Da igual si llegó registrándose
 *    o iniciando sesión: la primera vez que pisa la pantalla, se explica.
 *
 * Quien la marca como vista es el propio registro `tours-vistos:<id>`, y ese
 * registro NO se borra al cerrar sesión. Por eso no se repite nunca.
 */
export function useAutoTour(id: TourId) {
  const { start } = useTour()
  const { usuario } = useAuth()

  useEffect(() => {
    const pasos = TOURS[id]
    if (!pasos) return

    const esPrivado = TOURS_PRIVADOS.includes(id)

    // Dentro de la app la guía es cosa de la cuenta, no del navegador
    if (esPrivado && !usuario) return

    const ambito = esPrivado ? usuario!.id : 'anon'
    if (vistos(ambito).includes(id)) return

    // Espera a que termine la animación de entrada de la pantalla
    const t = window.setTimeout(() => { start(pasos); marcarVisto(ambito, id) }, 850)
    return () => window.clearTimeout(t)
  }, [id, start, usuario])
}

/** Relanza a mano la guía de la pantalla actual (botón flotante). */
export function useReplayTour(id: TourId) {
  const { start } = useTour()
  return () => { const pasos = TOURS[id]; if (pasos) start(pasos) }
}
