/* ------------------------------------------------------------------
   Datos de prueba de las pantallas internas.
   Todo esto lo reemplazan llamadas al backend; los tipos no cambian.
------------------------------------------------------------------- */

const AV = (s: string) => `https://i.pravatar.cc/120?u=${s}`

/* ---------------- Solicitante ---------------- */

export interface Propuesta {
  id: string; solicitud: string; helpworker: string; avatarUrl: string
  profesion: string; rating: number; precio: number; unidad: string
  mensaje: string; hace: string; estado: 'pendiente' | 'aceptada' | 'rechazada'
}

export const PROPUESTAS: Propuesta[] = [
  { id: 'p1', solicitud: 'Clases de Matemáticas', helpworker: 'Joaquín Quintero', avatarUrl: AV('joaquin'), profesion: 'Ingeniero Matemático', rating: 4.9, precio: 12, unidad: 'hora', mensaje: 'Puedo ayudarte con integrales y álgebra lineal. Tengo material propio de práctica.', hace: 'hace 2 h', estado: 'pendiente' },
  { id: 'p2', solicitud: 'Clases de Matemáticas', helpworker: 'María Fernanda C.', avatarUrl: AV('maria'), profesion: 'Profesora de Matemáticas', rating: 4.8, precio: 15, unidad: 'hora', mensaje: 'Doy clases hace 4 años a nivel universitario. Flexible con horarios.', hace: 'hace 5 h', estado: 'pendiente' },
  { id: 'p3', solicitud: 'Diseño de Logo', helpworker: 'Pedro A.', avatarUrl: AV('pedro'), profesion: 'Diseñador Gráfico', rating: 4.9, precio: 80, unidad: 'proyecto', mensaje: 'Te entrego 3 propuestas de logo y los archivos vectoriales.', hace: 'ayer', estado: 'aceptada' },
  { id: 'p4', solicitud: 'Tesis de Ingeniería Civil', helpworker: 'Andrés Felipe R.', avatarUrl: AV('andres'), profesion: 'Tutor Universitario', rating: 4.7, precio: 18, unidad: 'hora', mensaje: 'Manejo SAP2000 y ETABS. Puedo revisar tu marco teórico también.', hace: 'hace 3 d', estado: 'rechazada' },
]

export interface Favorito {
  id: string; nombre: string; avatarUrl: string; profesion: string
  rating: number; reseñas: number; tarifa: string; habilidades: string[]; enLinea: boolean
}

export const FAVORITOS: Favorito[] = [
  { id: 'f1', nombre: 'Joaquín Quintero', avatarUrl: AV('joaquin'), profesion: 'Ingeniero Matemático', rating: 4.9, reseñas: 128, tarifa: '$10 – $15 / hora', habilidades: ['Cálculo', 'Álgebra', 'Estadística'], enLinea: true },
  { id: 'f2', nombre: 'María Fernanda C.', avatarUrl: AV('maria'), profesion: 'Profesora de Matemáticas', rating: 4.8, reseñas: 96, tarifa: '$12 – $18 / hora', habilidades: ['Matemáticas', 'Física'], enLinea: true },
  { id: 'f3', nombre: 'Pedro A.', avatarUrl: AV('pedro'), profesion: 'Diseñador Gráfico', rating: 4.9, reseñas: 38, tarifa: '$60 – $120 / proyecto', habilidades: ['Branding', 'Ilustración'], enLinea: false },
]

export interface Pago {
  id: string; concepto: string; contraparte: string; fecha: string
  monto: number; estado: 'retenido' | 'liberado' | 'pendiente'; metodo: string
}

export const PAGOS: Pago[] = [
  { id: 'g1', concepto: 'Diseño de Logo', contraparte: 'Pedro A.', fecha: '12 ago 2026', monto: 80, estado: 'retenido', metodo: 'Tarjeta ****4821' },
  { id: 'g2', concepto: 'Clases de Matemáticas (4 h)', contraparte: 'Joaquín Quintero', fecha: '05 ago 2026', monto: 48, estado: 'liberado', metodo: 'Tarjeta ****4821' },
  { id: 'g3', concepto: 'Revisión de tesis', contraparte: 'Andrés Felipe R.', fecha: '28 jul 2026', monto: 90, estado: 'liberado', metodo: 'Transferencia' },
  { id: 'g4', concepto: 'Asesoría de estadística', contraparte: 'María Fernanda C.', fecha: '20 jul 2026', monto: 36, estado: 'liberado', metodo: 'Tarjeta ****4821' },
]

export interface Notificacion {
  id: string; tipo: 'propuesta' | 'mensaje' | 'pago' | 'sistema'
  texto: string; hace: string; leida: boolean
}

export const NOTIFICACIONES: Notificacion[] = [
  { id: 'n1', tipo: 'propuesta', texto: 'Joaquín Quintero envió una propuesta a "Clases de Matemáticas".', hace: 'hace 2 h', leida: false },
  { id: 'n2', tipo: 'mensaje', texto: 'Tienes 2 mensajes sin leer de Joaquín Quintero.', hace: 'hace 3 h', leida: false },
  { id: 'n3', tipo: 'pago', texto: 'El pago de "Diseño de Logo" quedó retenido correctamente.', hace: 'ayer', leida: true },
  { id: 'n4', tipo: 'sistema', texto: 'Completa tu perfil para recibir mejores recomendaciones.', hace: 'hace 2 d', leida: true },
  { id: 'n5', tipo: 'propuesta', texto: 'Tu solicitud "Diseño de Logo" pasó a estado En progreso.', hace: 'hace 4 d', leida: true },
]

/* ---------------- HelpWorker ---------------- */

export interface Trabajo {
  id: string; titulo: string; cliente: string; avatarUrl: string
  estado: 'propuesta' | 'en_curso' | 'entregado' | 'pagado'
  monto: number; entrega: string; progreso: number
}

export const TRABAJOS: Trabajo[] = [
  { id: 't1', titulo: 'Clases de Excel — Nivel Intermedio', cliente: 'Ariana López', avatarUrl: AV('ariana'), estado: 'en_curso', monto: 60, entrega: '20 ago', progreso: 65 },
  { id: 't2', titulo: 'Asesoría de Estadística', cliente: 'Carlos M.', avatarUrl: AV('carlos'), estado: 'en_curso', monto: 90, entrega: '24 ago', progreso: 30 },
  { id: 't3', titulo: 'Diseño de Presentación', cliente: 'Lucía R.', avatarUrl: AV('lucia'), estado: 'entregado', monto: 20, entrega: '10 ago', progreso: 100 },
  { id: 't4', titulo: 'Tutoría de Cálculo', cliente: 'Diego S.', avatarUrl: AV('diego'), estado: 'pagado', monto: 45, entrega: '02 ago', progreso: 100 },
  { id: 't5', titulo: 'Revisión de código Python', cliente: 'Ana P.', avatarUrl: AV('anap'), estado: 'propuesta', monto: 35, entrega: '—', progreso: 0 },
]

export interface Resena {
  id: string; autor: string; avatarUrl: string; trabajo: string
  estrellas: number; texto: string; fecha: string
}

export const RESENAS: Resena[] = [
  { id: 'r1', autor: 'Ariana López', avatarUrl: AV('ariana'), trabajo: 'Clases de Excel', estrellas: 5, texto: 'Explica con muchísima paciencia y prepara ejercicios a medida. Volvería a contratarlo sin dudar.', fecha: '14 ago 2026' },
  { id: 'r2', autor: 'Diego S.', avatarUrl: AV('diego'), trabajo: 'Tutoría de Cálculo', estrellas: 5, texto: 'Entendí en dos sesiones lo que llevaba un semestre arrastrando.', fecha: '03 ago 2026' },
  { id: 'r3', autor: 'Lucía R.', avatarUrl: AV('lucia'), trabajo: 'Diseño de Presentación', estrellas: 4, texto: 'Buen resultado y entrega puntual. Habría querido una revisión extra.', fecha: '11 ago 2026' },
  { id: 'r4', autor: 'Carlos M.', avatarUrl: AV('carlos'), trabajo: 'Asesoría de Estadística', estrellas: 5, texto: 'Muy claro con los conceptos de regresión. Recomendado.', fecha: '29 jul 2026' },
]

export interface Evento {
  dia: number; hora: string; titulo: string; cliente: string
  tipo: 'clase' | 'entrega' | 'reunion'
}

export const EVENTOS: Evento[] = [
  { dia: 18, hora: '16:00', titulo: 'Clase de Excel', cliente: 'Ariana López', tipo: 'clase' },
  { dia: 20, hora: '10:00', titulo: 'Entrega presentación', cliente: 'Lucía R.', tipo: 'entrega' },
  { dia: 20, hora: '18:00', titulo: 'Tutoría de Cálculo', cliente: 'Diego S.', tipo: 'clase' },
  { dia: 24, hora: '09:00', titulo: 'Reunión de arranque', cliente: 'Carlos M.', tipo: 'reunion' },
  { dia: 27, hora: '17:30', titulo: 'Asesoría estadística', cliente: 'Carlos M.', tipo: 'clase' },
]

/* ---------------- Común ---------------- */

export const FAQ = [
  { p: '¿Cómo publico una solicitud?', r: 'Desde el botón "Nueva solicitud" del menú lateral. Describe lo que necesitas, indica presupuesto y fecha, y publícala. Las propuestas empiezan a llegar en minutos.' },
  { p: '¿Cuándo se cobra el dinero?', r: 'El pago se retiene al aceptar una propuesta y se libera cuando confirmas que el trabajo está terminado. Si algo sale mal, puedes abrir una disputa antes de liberar.' },
  { p: '¿Cómo se calcula el porcentaje de match?', r: 'Combina cinco factores: habilidades declaradas, disponibilidad horaria, modalidad, reputación y si la tarifa entra en tu presupuesto.' },
  { p: '¿Puedo cambiar de rol?', r: 'Sí. Desde Ajustes puedes activar el rol de HelpWorker aunque te hayas registrado como solicitante, y al revés.' },
  { p: '¿Qué pasa si nadie responde mi solicitud?', r: 'Revisa que el presupuesto sea realista y que la descripción tenga detalles. También puedes invitar directamente a HelpWorkers desde el matching.' },
  { p: '¿Cómo verifican los perfiles?', r: 'Se valida identidad con documento y se confirma el correo y el teléfono. Los perfiles con título académico pueden subir el respaldo para obtener la insignia azul.' },
]

/* ---------------- Presencia: quién está activo ahora ---------------- */

export interface Presencia {
  id: string; nombre: string; avatarUrl: string; detalle: string
  estado: 'en_linea' | 'ocupado' | 'ausente'
  /** Para HelpWorkers: su especialidad. Para HelpSeekers: qué necesita. */
  etiqueta: string
}

/** Los que el HelpSeeker ve en su panel: HelpWorkers disponibles. */
export const HELPWORKERS_ACTIVOS: Presencia[] = [
  { id: 'a1', nombre: 'Joaquín Quintero', avatarUrl: AV('joaquin'), detalle: 'Ing. Matemático · 4.9', estado: 'en_linea', etiqueta: 'Cálculo' },
  { id: 'a2', nombre: 'María Fernanda C.', avatarUrl: AV('maria'), detalle: 'Prof. Matemáticas · 4.8', estado: 'en_linea', etiqueta: 'Estadística' },
  { id: 'a3', nombre: 'Pedro A.', avatarUrl: AV('pedro'), detalle: 'Diseñador · 4.9', estado: 'ocupado', etiqueta: 'Branding' },
  { id: 'a4', nombre: 'Andrés Felipe R.', avatarUrl: AV('andres'), detalle: 'Tutor · 4.7', estado: 'ausente', etiqueta: 'Álgebra' },
  { id: 'a5', nombre: 'Camila V.', avatarUrl: AV('camila'), detalle: 'Ing. de Software · 5.0', estado: 'en_linea', etiqueta: 'Python' },
]

/** Los que el HelpWorker ve en su panel: HelpSeekers buscando ayuda. */
export const HELPSEEKERS_ACTIVOS: Presencia[] = [
  { id: 'b1', nombre: 'Ariana López', avatarUrl: AV('ariana'), detalle: 'Publicó hace 12 min', estado: 'en_linea', etiqueta: 'Tesis' },
  { id: 'b2', nombre: 'Carlos M.', avatarUrl: AV('carlos'), detalle: 'Publicó hace 40 min', estado: 'en_linea', etiqueta: 'Estadística' },
  { id: 'b3', nombre: 'Lucía R.', avatarUrl: AV('lucia'), detalle: 'Publicó hace 2 h', estado: 'ocupado', etiqueta: 'Diseño' },
  { id: 'b4', nombre: 'Diego S.', avatarUrl: AV('diego'), detalle: 'Publicó hace 3 h', estado: 'en_linea', etiqueta: 'Cálculo' },
  { id: 'b5', nombre: 'Ana P.', avatarUrl: AV('anap'), detalle: 'Publicó ayer', estado: 'ausente', etiqueta: 'Python' },
]

/* ------- Solicitudes compatibles: el "matching" del HelpWorker ------- */

export interface SolicitudCompatible {
  id: string; titulo: string; seeker: string; avatarUrl: string
  categoria: string; modalidad: string; presupuesto: string
  match: number; publicado: string; descripcion: string
  postulantes: number; urgente?: boolean
}

export const SOLICITUDES_COMPATIBLES: SolicitudCompatible[] = [
  { id: 'sc1', titulo: 'Tutoría de Cálculo Diferencial', seeker: 'Ariana López', avatarUrl: AV('ariana'), categoria: 'Clases particulares', modalidad: 'En línea', presupuesto: '$10 – $15 / hora', match: 96, publicado: 'hace 12 min', postulantes: 2, urgente: true, descripcion: 'Necesito reforzar integrales y límites para el examen del próximo viernes. Nivel universitario, primer semestre.' },
  { id: 'sc2', titulo: 'Asesoría en Estadística Inferencial', seeker: 'Carlos M.', avatarUrl: AV('carlos'), categoria: 'Clases particulares', modalidad: 'En línea', presupuesto: '$15 – $20 / hora', match: 91, publicado: 'hace 40 min', postulantes: 4, descripcion: 'Tengo que aplicar pruebas de hipótesis y regresión en mi trabajo de titulación. Busco alguien que me explique el fundamento, no que lo haga por mí.' },
  { id: 'sc3', titulo: 'Revisión de código en Python', seeker: 'Ana P.', avatarUrl: AV('anap'), categoria: 'Programación', modalidad: 'Remoto', presupuesto: '$30 – $45 / proyecto', match: 84, publicado: 'ayer', postulantes: 6, descripcion: 'Script de análisis de datos con pandas que lanza errores. Necesito que lo revisen y me expliquen qué está mal.' },
  { id: 'sc4', titulo: 'Clases de Álgebra Lineal', seeker: 'Diego S.', avatarUrl: AV('diego'), categoria: 'Clases particulares', modalidad: 'Presencial', presupuesto: '$12 – $18 / hora', match: 79, publicado: 'hace 3 h', postulantes: 1, descripcion: 'Matrices, determinantes y espacios vectoriales. Prefiero presencial, estoy en el centro de Loja.' },
]

/* ---------------- Notificaciones del HelpWorker ---------------- */

export const NOTIFICACIONES_HW: Notificacion[] = [
  { id: 'h1', tipo: 'propuesta', texto: 'Ariana López publicó "Tutoría de Cálculo" — 96% de compatibilidad contigo.', hace: 'hace 12 min', leida: false },
  { id: 'h2', tipo: 'mensaje', texto: 'Carlos M. respondió a tu propuesta de estadística.', hace: 'hace 1 h', leida: false },
  { id: 'h3', tipo: 'pago', texto: 'Se liberó el pago de "Tutoría de Cálculo": $45 acreditados.', hace: 'ayer', leida: true },
  { id: 'h4', tipo: 'sistema', texto: 'Tu tasa de respuesta subió a 92%. Sigue así.', hace: 'hace 2 d', leida: true },
  { id: 'h5', tipo: 'propuesta', texto: 'Lucía R. calificó tu trabajo con 4 estrellas.', hace: 'hace 4 d', leida: true },
]
