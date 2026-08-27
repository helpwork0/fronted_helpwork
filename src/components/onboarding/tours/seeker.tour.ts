import type { TourStep } from '../tour.types'

/**
 * Guía del panel del solicitante.
 *
 * Los cuatro primeros pasos explican CÓMO FUNCIONA la plataforma; los
 * siguientes señalan dónde está cada cosa. Ese orden importa: quien acaba de
 * entrar por primera vez necesita entender el modelo antes que la interfaz.
 * Se muestra una sola vez por cuenta, tanto si se registró como si inició
 * sesión, y queda siempre disponible en el botón flotante del hámster.
 */
export const SEEKER_TOUR: TourStep[] = [
  // --- Cómo funciona HelpWork ---
  { target: null, pose: 'saludo',
    titulo: '¡Bienvenido a HelpWork! 👋',
    texto: 'Soy Helpy. En un minuto te explico cómo funciona esto y dónde está cada cosa. Puedes salir cuando quieras con Esc.' },
  { target: null, pose: 'libro',
    titulo: 'La idea es simple',
    texto: 'Aquí eres un HelpSeeker: publicas lo que necesitas y los HelpWorkers te escriben a ti. No tienes que buscar ni perseguir a nadie.' },
  { target: null, pose: 'guia',
    titulo: 'Son cuatro pasos',
    texto: '1) Publicas tu necesidad. 2) Recibes propuestas y eliges. 3) Conversan y acuerdan. 4) Al terminar, calificas. Así de corto.' },
  { target: null, pose: 'laptop',
    titulo: '¿Y el dinero?',
    texto: 'El pago queda retenido en la plataforma y se libera cuando confirmas que el trabajo está hecho. Ninguno de los dos corre riesgo.' },

  // --- Dónde está cada cosa ---
  { target: '[data-tour="panel-buscar"]', pose: 'guia', placement: 'bottom',
    titulo: 'Busca lo que necesitas',
    texto: 'Escribe en tus propias palabras: "ayuda con tesis", "clases de cálculo". No hace falta usar categorías exactas.' },
  { target: '[data-tour="panel-categorias"]', pose: 'guia', placement: 'bottom',
    titulo: 'O explora por categoría',
    texto: 'Si prefieres mirar sin buscar nada concreto, entra por aquí y navega los servicios disponibles.' },
  { target: '[data-tour="panel-solicitudes"]', pose: 'libro', placement: 'right',
    titulo: 'Tus solicitudes activas',
    texto: 'Cada tarjeta muestra el estado y cuántas propuestas has recibido. Toca una para ver el detalle y responder.' },
  { target: '[data-tour="panel-match"]', pose: 'laptop', placement: 'left',
    titulo: 'Match inteligente',
    texto: 'El porcentaje mide qué tanto encaja esa persona con lo que pediste: habilidades, horario, modalidad y presupuesto.' },
  { target: null, pose: 'saludo',
    titulo: 'Quién está disponible',
    texto: 'Más abajo ves qué HelpWorkers están conectados ahora mismo. Si alguien está en línea, escribirle suele conseguir respuesta en minutos.' },
  { target: '[data-tour="panel-acciones"]', pose: 'guia', placement: 'top',
    titulo: 'Acciones rápidas',
    texto: 'Los atajos a lo que más se usa. Si es tu primera vez, empieza por "Nueva solicitud".' },
  { target: '[data-tour="fab-guia"]', pose: 'saludo', placement: 'left',
    titulo: 'Estaré aquí',
    texto: 'Si te pierdes, tócame en esta esquina y repito la guía de la pantalla en la que estés.' },
]
