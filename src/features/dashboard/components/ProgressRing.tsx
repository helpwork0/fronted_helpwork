import { motion } from 'framer-motion'

/**
 * Anillo de progreso en SVG. Se dibuja animando `strokeDashoffset`:
 * el trazo tiene la longitud exacta de la circunferencia, así que
 * desplazarlo equivale a "rellenar" el anillo.
 */
export function ProgressRing({
  valor, tamano = 56, grosor = 5, color = '#16A34A',
}: { valor: number; tamano?: number; grosor?: number; color?: string }) {
  const r = (tamano - grosor) / 2
  const circunferencia = 2 * Math.PI * r

  return (
    <div className="relative shrink-0" style={{ width: tamano, height: tamano }}>
      <svg width={tamano} height={tamano} className="-rotate-90">
        <circle cx={tamano / 2} cy={tamano / 2} r={r} fill="none" stroke="rgba(11,27,58,.09)" strokeWidth={grosor} />
        <motion.circle
          cx={tamano / 2} cy={tamano / 2} r={r} fill="none"
          stroke={color} strokeWidth={grosor} strokeLinecap="round"
          strokeDasharray={circunferencia}
          initial={{ strokeDashoffset: circunferencia }}
          whileInView={{ strokeDashoffset: circunferencia * (1 - valor / 100) }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-[13px] font-extrabold" style={{ color }}>
        {valor}%
      </span>
    </div>
  )
}
