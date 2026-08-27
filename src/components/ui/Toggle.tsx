import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

interface Props {
  options: readonly [string, string]
  value: 0 | 1
  onChange: (v: 0 | 1) => void
  hint?: string
}

/** Selector de dos opciones con la "píldora" animada (mensual / anual). */
export function Toggle({ options, value, onChange, hint }: Props) {
  return (
    <div className="relative inline-flex items-center gap-1 rounded-full border border-surface-line bg-white p-1 shadow-soft">
      {options.map((opt, i) => (
        <button
          key={opt}
          onClick={() => onChange(i as 0 | 1)}
          className={cn(
            'relative z-10 rounded-full px-6 py-2.5 text-sm font-semibold transition-colors duration-300',
            value === i ? 'text-white' : 'text-ink-soft hover:text-brand-600',
          )}
        >
          {opt}
          {i === 1 && hint && value === 1 && (
            <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-[11px]">{hint}</span>
          )}
        </button>
      ))}
      <motion.span
        aria-hidden
        layout
        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        className="absolute inset-y-1 rounded-full bg-brand-600"
        style={{ left: value === 0 ? 4 : '50%', right: value === 0 ? '50%' : 4 }}
      />
    </div>
  )
}
