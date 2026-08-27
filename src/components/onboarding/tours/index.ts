import type { TourStep } from '../tour.types'
import { HOME_TOUR } from './home.tour'
import { LOGIN_TOUR } from './login.tour'
import { ROLE_TOUR } from './role.tour'
import { REGISTER_TOUR } from './register.tour'
import { SEEKER_TOUR } from './seeker.tour'
import { WORKER_TOUR } from './worker.tour'
import { MATCHING_TOUR } from './matching.tour'

export { HOME_TOUR, LOGIN_TOUR, ROLE_TOUR, REGISTER_TOUR, SEEKER_TOUR, WORKER_TOUR, MATCHING_TOUR }

/**
 * Registro central de guías. La clave es el id que se pasa a `useAutoTour`
 * y también la que se guarda en localStorage para no repetir la guía.
 */
export const TOURS: Record<string, TourStep[]> = {
  home: HOME_TOUR,
  login: LOGIN_TOUR,
  rol: ROLE_TOUR,
  registro: REGISTER_TOUR,
  solicitante: SEEKER_TOUR,
  helpworker: WORKER_TOUR,
  matching: MATCHING_TOUR,
}

export type TourId = keyof typeof TOURS
