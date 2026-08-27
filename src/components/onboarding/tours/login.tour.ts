import type { TourStep } from '../tour.types'

export const LOGIN_TOUR: TourStep[] = [
  { target: null, pose: 'saludo',
    titulo: 'Vamos a entrar',
    texto: 'Te acompaño en 5 pasos para que accedas a tu cuenta sin perderte.' },
  { target: '[data-tour="login-google"]', pose: 'guia', placement: 'bottom',
    titulo: 'La vía rápida',
    texto: 'Si tienes correo de Google, este botón te deja dentro en un clic. No necesitas recordar contraseñas.' },
  { target: '[data-tour="login-email"]', pose: 'guia', placement: 'right',
    titulo: 'Tu correo',
    texto: 'Escribe el mismo correo con el que te registraste. Ahí te llegarán las propuestas y avisos.' },
  { target: '[data-tour="login-password"]', pose: 'guia', placement: 'right',
    titulo: 'Tu contraseña',
    texto: 'Toca el ojito para verificar que la escribiste bien. Si la olvidaste, usa el enlace de abajo.' },
  { target: '[data-tour="login-submit"]', pose: 'laptop', placement: 'top',
    titulo: '¡Y listo!',
    texto: 'Entra y te llevo a tu panel: ahí verás tus solicitudes y los HelpWorkers recomendados.' },
  { target: '[data-tour="login-register"]', pose: 'saludo', placement: 'top',
    titulo: '¿Aún no tienes cuenta?',
    texto: 'Créala gratis en menos de un minuto. Solo eliges tu rol y empiezas.' },
]
