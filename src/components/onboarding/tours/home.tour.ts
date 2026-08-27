import type { TourStep } from '../tour.types'

/**
 * GUÍA DE BIENVENIDA — es la primera que ve cualquier persona.
 *
 * Cubre el recorrido completo: quién es Helpy, qué es HelpWork, cómo
 * funciona el modelo, los dos roles, el dinero, los planes y cómo
 * registrarse. Termina señalando el botón de crear cuenta, que es la
 * acción que queremos que ocurra.
 *
 * Corre sola en la primera visita al navegador y queda siempre
 * disponible en el botón flotante del hámster.
 */
export const HOME_TOUR: TourStep[] = [
  // --- Presentación ---
  { target: null, pose: 'saludo',
    titulo: '¡Hola! Soy Helpy 👋',
    texto: 'Te doy la bienvenida a HelpWork. En un par de minutos te cuento qué es, cómo funciona y cómo empezar. Puedes salir cuando quieras con Esc.' },
  { target: null, pose: 'libro',
    titulo: '¿Qué es HelpWork?',
    texto: 'Un lugar donde quien necesita ayuda y quien sabe hacerla se encuentran. Empezó con lo académico —tesis, tutorías, tareas— y hoy abarca diseño, programación y más.' },

  // --- Cómo funciona ---
  { target: '[data-tour="nav-como-funciona"]', pose: 'guia', placement: 'bottom',
    titulo: 'Funciona en cuatro pasos',
    texto: 'Publicas lo que necesitas, recibes propuestas y eliges, conversan y acuerdan, y al terminar se califican. Aquí abajo lo tienes explicado con dibujos.' },
  { target: null, pose: 'laptop',
    titulo: 'Tú no buscas: te encuentran',
    texto: 'Esta es la diferencia. No tienes que revisar perfiles uno por uno: publicas y las personas que saben del tema te escriben a ti.' },
  { target: null, pose: 'guia',
    titulo: 'El match inteligente',
    texto: 'Cada persona que te llega trae un porcentaje de compatibilidad. Sale de cinco cosas: habilidades, disponibilidad, modalidad, reputación y si su tarifa entra en tu presupuesto.' },

  // --- Los dos roles ---
  { target: '[data-tour="hero-estudiante"]', pose: 'libro', placement: 'bottom',
    titulo: 'Hay dos formas de entrar',
    texto: 'Si necesitas ayuda con tareas, tesis o proyectos, eres un HelpSeeker: publicas y recibes propuestas. Es esta puerta.' },
  { target: null, pose: 'laptop',
    titulo: 'O como HelpWorker',
    texto: 'Si lo tuyo es enseñar o resolver, ofreces tus habilidades y ganas dinero con ellas. Verás las solicitudes de los HelpSeekers y les propones tu trabajo.' },
  { target: null, pose: 'guia',
    titulo: 'Son dos aplicaciones distintas',
    texto: 'Cada rol tiene su propio panel, sus propios mensajes y su propio matching. El HelpSeeker ve personas; el HelpWorker ve trabajos. Puedes tener los dos con la misma cuenta.' },

  // --- Confianza y dinero ---
  { target: null, pose: 'guia',
    titulo: '¿Y el dinero cómo va?',
    texto: 'El pago queda retenido por HelpWork al aceptar una propuesta y se libera cuando confirmas que el trabajo está hecho. Ninguno de los dos corre riesgo.' },
  { target: null, pose: 'saludo',
    titulo: 'Perfiles verificados',
    texto: 'Se valida identidad, correo y teléfono. Las reseñas son de trabajos reales, así que lo que lees es lo que hay.' },

  // --- Planes ---
  { target: '[data-tour="seccion-precios"]', pose: 'laptop', placement: 'top',
    titulo: 'Puedes usarlo gratis',
    texto: 'El plan Explora no cuesta nada. Los planes de pago solo amplían conexiones y visibilidad, y son para HelpWorkers que quieren más trabajo.' },

  // --- Registro ---
  { target: '[data-tour="nav-registro"]', pose: 'guia', placement: 'bottom',
    titulo: 'Crear tu cuenta',
    texto: 'Son tres pasos y menos de un minuto: eliges tu rol, pones tus datos y confirmas. No pedimos tarjeta para registrarte.' },
  { target: '[data-tour="nav-login"]', pose: 'saludo', placement: 'bottom',
    titulo: '¿Ya tienes cuenta?',
    texto: 'Entra por aquí y te acompaño también en el inicio de sesión. Cuando estés dentro te explico tu panel.' },
  { target: '[data-tour="fab-guia"]', pose: 'saludo', placement: 'left',
    titulo: 'Estaré aquí siempre',
    texto: 'Si algo no te queda claro, tócame en esta esquina y repito la guía de la pantalla en la que estés. ¡Nos vemos dentro!' },
]
