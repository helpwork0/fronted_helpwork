import type { TourStep } from '../tour.types'

/**
 * Guía del panel del HelpWorker. Mismo criterio que la del solicitante:
 * primero el modelo de negocio, después la interfaz.
 */
export const WORKER_TOUR: TourStep[] = [
  // --- Cómo funciona HelpWork ---
  { target: null, pose: 'saludo',
    titulo: '¡Bienvenido a HelpWork! 👋',
    texto: 'Soy Helpy. Te explico cómo se gana aquí y dónde está cada cosa. Puedes salir cuando quieras con Esc.' },
  { target: null, pose: 'laptop',
    titulo: 'Las oportunidades llegan a ti',
    texto: 'A quienes buscan ayuda los llamamos HelpSeekers. Ellos publican lo que necesitan y nosotros te mostramos lo que encaja con tu perfil.' },
  { target: null, pose: 'guia',
    titulo: 'Son cuatro pasos',
    texto: '1) Ves una oportunidad. 2) Envías tu propuesta. 3) Acuerdan y trabajas. 4) Cobras y te califican. La calificación es tu carta de presentación.' },
  { target: null, pose: 'libro',
    titulo: 'El cobro está protegido',
    texto: 'El dinero queda retenido antes de que empieces, y se libera al confirmar la entrega. No trabajas sin respaldo.' },

  // --- Dónde está cada cosa ---
  { target: '[data-tour="hw-stats"]', pose: 'guia', placement: 'bottom',
    titulo: 'Tus números',
    texto: 'Oportunidades de hoy, tasa de respuesta, ganancias del mes y tu calificación. La tasa de respuesta influye mucho en que te elijan.' },
  { target: '[data-tour="hw-oportunidades"]', pose: 'laptop', placement: 'top',
    titulo: 'Oportunidades para ti',
    texto: 'Ordenadas por compatibilidad con tu perfil. Las marcadas como urgentes suelen cerrarse en pocas horas: responde pronto.' },
  { target: null, pose: 'guia',
    titulo: 'Quién está buscando ahora',
    texto: 'Más abajo ves qué HelpSeekers están conectados en este momento. Escribir a alguien recién conectado multiplica las probabilidades de que te elija.' },
  { target: '[data-tour="hw-disponibilidad"]', pose: 'guia', placement: 'left',
    titulo: 'Tu disponibilidad',
    texto: 'Si lo apagas dejas de recibir invitaciones. Útil en época de exámenes o cuando estás saturado.' },
  { target: '[data-tour="hw-perfil"]', pose: 'libro', placement: 'top',
    titulo: 'Completa tu perfil',
    texto: 'Los perfiles completos reciben hasta 3 veces más invitaciones. Es lo primero que conviene terminar.' },
  { target: '[data-tour="fab-guia"]', pose: 'saludo', placement: 'left',
    titulo: 'Estaré aquí',
    texto: 'Si te pierdes, tócame en esta esquina y repito la guía de la pantalla en la que estés.' },
]
