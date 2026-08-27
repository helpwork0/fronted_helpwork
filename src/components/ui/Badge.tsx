import { cn } from '@/lib/cn'

type Tone = 'brand' | 'success' | 'amber' | 'neutral'

const tones: Record<Tone, string> = {
  brand:   'bg-brand-50 text-brand-600 ring-brand-200',
  success: 'bg-success-100 text-success-500 ring-green-200',
  amber:   'bg-amber-100 text-amber-500 ring-amber-200',
  neutral: 'bg-slate-100 text-ink-soft ring-slate-200',
}

export function Badge({ tone = 'brand', className, children }: { tone?: Tone; className?: string; children: React.ReactNode }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset', tones[tone], className)}>
      {children}
    </span>
  )
}
