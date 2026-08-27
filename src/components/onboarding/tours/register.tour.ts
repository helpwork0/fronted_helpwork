import type { TourStep } from '../tour.types'

export const REGISTER_TOUR: TourStep[] = [
  { target: '[data-tour="registro-pasos"]', pose: 'guia', placement: 'bottom',
    titulo: 'Son tres pasos',
    texto: 'Cuenta, detalles y confirmación. La barra de arriba te dice siempre dónde estás.' },
  { target: '[data-tour="registro-campos"]', pose: 'libro', placement: 'right',
    titulo: 'Tus datos',
    texto: 'Usa un correo al que tengas acceso: ahí llegan las notificaciones de tus solicitudes.' },
  { target: '[data-tour="registro-terminos"]', pose: 'guia', placement: 'top',
    titulo: 'Términos',
    texto: 'Marca la casilla para poder continuar. Puedes leer las condiciones en los enlaces azules.' },
  { target: '[data-tour="registro-continuar"]', pose: 'laptop', placement: 'top',
    titulo: 'Avanza',
    texto: 'Al terminar los tres pasos entras directo a tu panel, listo para publicar tu primera solicitud.' },
]
