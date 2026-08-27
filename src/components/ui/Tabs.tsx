import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

export interface Tab { id: string; label: string; contador?: number }

/** Pestañas con píldora deslizante (usa layoutId para que se mueva sola). */
export function Tabs({
  tabs, activa, onChange, idLayout = 'tab-activa',
}: { tabs: Tab[]; activa: string; onChange: (id: string) => void; idLayout?: string }) {
  return (
    <div className="flex flex-wrap gap-1 rounded-full border border-white/70 bg-white/60 p-1 backdrop-blur-xl">
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={cn(
            'relative rounded-full px-4 py-2 text-[13.5px] font-semibold transition-colors duration-200',
            activa === t.id ? 'text-white' : 'texto-suave hover:text-brand-600',
          )}
        >
          {activa === t.id && (
            <motion.span
              layoutId={idLayout}
              className="absolute inset-0 -z-10 rounded-full bg-brand-600"
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            />
          )}
          {t.label}
          {t.contador != null && (
            <span className={cn('ml-1.5 rounded-full px-1.5 py-0.5 text-[11px]',
              activa === t.id ? 'bg-white/25' : 'bg-black/[.06]')}>
              {t.contador}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
