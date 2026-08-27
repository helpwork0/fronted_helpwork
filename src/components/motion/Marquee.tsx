import { cn } from '@/lib/cn'

/**
 * Cinta infinita. Duplicamos el contenido y desplazamos -50%:
 * el bucle queda perfecto sin saltos.
 */
export function Marquee({ children, className, speed = 32 }: { children: React.ReactNode; className?: string; speed?: number }) {
  return (
    <div className={cn('group relative overflow-hidden', className)}>
      <div
        className="flex w-max animate-marquee group-hover:[animation-play-state:paused]"
        style={{ animationDuration: `${speed}s` }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>{children}</div>
      </div>
      {/* Difuminado en los extremos */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-surface-subtle to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-surface-subtle to-transparent" />
    </div>
  )
}
