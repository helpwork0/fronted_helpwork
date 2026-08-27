/* ------------------------------------------------------------------
   MODO DEMOSTRACIÓN

   Con esto en `true`, cada vez que se abre o recarga la página la app
   arranca LIMPIA: sin sesión, sin cuentas guardadas y sin guías vistas.

   Sirve para presentarle el producto a alguien y que vea el recorrido
   completo desde el principio: landing → guía de bienvenida → registro
   → panel. Sin esto, la segunda vez entrarías ya con la sesión abierta
   y el cliente no vería nada de eso.

   PONER EN `false` ANTES DE PUBLICAR: en producción la gente espera que
   su sesión siga abierta al volver.
------------------------------------------------------------------- */
export const MODO_DEMO = true

/** Prefijo de todo lo que la app guarda en el navegador. */
export const PREFIJO_ALMACENAMIENTO = 'helpwork:'
