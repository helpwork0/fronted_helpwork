export interface TourStep {
  /** Selector CSS del elemento a resaltar. Usa data-tour="..." en el componente. */
  target: string | null
  titulo: string
  texto: string
  /** Pose de la mascota que acompaña el paso. */
  pose?: 'saludo' | 'guia' | 'libro' | 'laptop'
  /** Posición preferida del globo respecto al elemento. */
  placement?: 'top' | 'bottom' | 'left' | 'right'
}
