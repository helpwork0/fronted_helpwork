import type { TourStep } from '../tour.types'

export const ROLE_TOUR: TourStep[] = [
  { target: null, pose: 'saludo',
    titulo: 'Primero, tu rol',
    texto: 'Esta elección decide qué verás en tu panel. Tranquilo: se puede cambiar después.' },
  { target: '[data-tour="rol-solicitante"]', pose: 'libro', placement: 'bottom',
    titulo: 'Busco ayuda',
    texto: 'Elige esto si necesitas tutorías, apoyo con tareas o con tu tesis. Publicarás solicitudes y recibirás propuestas.' },
  { target: '[data-tour="rol-helpworker"]', pose: 'laptop', placement: 'bottom',
    titulo: 'Quiero ser HelpWorker',
    texto: 'Elige esto si quieres ofrecer tus conocimientos y ganar dinero. Recibirás oportunidades según tu perfil.' },
  { target: '[data-tour="rol-continuar"]', pose: 'guia', placement: 'top',
    titulo: 'Continuar',
    texto: 'El botón se activa cuando marcas una de las dos tarjetas. Después vienen tus datos.' },
]
