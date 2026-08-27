import type { TourStep } from '../tour.types'

export const MATCHING_TOUR: TourStep[] = [
  { target: '[data-tour="match-solicitud"]', pose: 'libro', placement: 'right',
    titulo: 'La solicitud',
    texto: 'A la izquierda está lo que pediste. Si cambias algo aquí, los resultados se recalculan.' },
  { target: '[data-tour="match-lista"]', pose: 'guia', placement: 'top',
    titulo: 'Los candidatos',
    texto: 'Ordenados por compatibilidad. La barra verde es visual: mientras más llena, mejor encaja con tu solicitud.' },
  { target: '[data-tour="match-criterios"]', pose: 'laptop', placement: 'left',
    titulo: '¿De dónde sale el porcentaje?',
    texto: 'De cinco criterios: habilidades, disponibilidad, reputación, modalidad y presupuesto. Aquí ves cada uno.' },
]
