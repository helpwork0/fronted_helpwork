import { cn } from '@/lib/cn'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  glass?: boolean
}

export function Card({ hover, glass, className, children, ...rest }: Props) {
  return (
    <div
      className={cn(
        'rounded-xl2 border border-surface-line bg-white shadow-soft',
        glass && 'glass-card border-white/60',
        hover && 'transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift hover:border-brand-200',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
