import { MODO_DEMO, PREFIJO_ALMACENAMIENTO } from '@/config/demo.config'

/**
 * Borra todo el rastro que la app dejó en el navegador: la sesión, las
 * cuentas creadas y el registro de guías vistas.
 *
 * Se ejecuta antes de renderizar (ver `main.tsx`), así que React arranca
 * ya con el navegador limpio y no hay ningún parpadeo de "estaba dentro
 * y ahora salí".
 */
export function limpiarAlmacenamiento() {
  Object.keys(localStorage)
    .filter(k => k.startsWith(PREFIJO_ALMACENAMIENTO))
    .forEach(k => localStorage.removeItem(k))
}

/** Punto de arranque. Hoy solo aplica el modo demostración. */
export function bootstrap() {
  if (MODO_DEMO) limpiarAlmacenamiento()
}
