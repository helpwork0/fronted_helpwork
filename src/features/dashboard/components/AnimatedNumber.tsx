import { useEffect, useRef, useState } from 'react'

/**
 * Cuenta desde 0 hasta `valor` al montarse.
 * Usa requestAnimationFrame (no setInterval) para ir sincronizado con el
 * refresco de la pantalla, y una curva easeOut para que frene al final
 * en lugar de cortarse en seco.
 */
export function AnimatedNumber({
  valor, duracion = 1100, decimales = 0, prefijo = '', sufijo = '',
}: {
  valor: number; duracion?: number; decimales?: number; prefijo?: string; sufijo?: string
}) {
  const [n, setN] = useState(0)
  const frame = useRef(0)

  useEffect(() => {
    const inicio = performance.now()
    const paso = (t: number) => {
      const avance = Math.min((t - inicio) / duracion, 1)
      const suave = 1 - Math.pow(1 - avance, 3)     // easeOutCubic
      setN(valor * suave)
      if (avance < 1) frame.current = requestAnimationFrame(paso)
    }
    frame.current = requestAnimationFrame(paso)
    return () => cancelAnimationFrame(frame.current)
  }, [valor, duracion])

  return <>{prefijo}{n.toFixed(decimales)}{sufijo}</>
}
