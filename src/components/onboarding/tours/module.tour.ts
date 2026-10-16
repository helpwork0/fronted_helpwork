import type { TourStep } from '../tour.types'

/** Guía breve reutilizable para cada módulo privado; el botón siempre permite repetirla. */
export const MODULE_TOUR: TourStep[] = [
  { target: null, pose: 'saludo', titulo: '¿Necesitas una mano?', texto: 'Soy Helpy. Esta sección reúne las acciones relacionadas con esta parte de tu cuenta.' },
  { target: '[data-tour="fab-guia"]', pose: 'guia', placement: 'left', titulo: 'Guía disponible', texto: 'Puedes tocarme cuando quieras para volver a ver esta explicación paso a paso.' },
  { target: null, pose: 'laptop', titulo: 'Consejo rápido', texto: 'Revisa primero el estado de las tarjetas y usa sus botones para continuar. Tus datos se guardan de forma segura.' },
]
