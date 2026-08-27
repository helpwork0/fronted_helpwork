import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { ROUTES } from '@/config/site.config'

/** Isotipo (bombilla + H) construido en SVG: nítido en cualquier tamaño. */
export function Logo({ light = false, className }: { light?: boolean; className?: string }) {
  return (
    <Link to={ROUTES.home} className={cn('group inline-flex items-center gap-2.5', className)} aria-label="HelpWork — inicio">
      <span className="relative grid h-10 w-10 place-items-center transition-transform duration-300 group-hover:scale-105">
        <svg viewBox="0 0 40 40" className="h-10 w-10">
          <defs>
            <linearGradient id="hw-g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={light ? '#FFFFFF' : '#60A5FA'} />
              <stop offset="100%" stopColor={light ? '#DBEAFE' : '#1D4ED8'} />
            </linearGradient>
          </defs>
          {/* rayos */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
            <rect key={a} x="19.2" y="1.5" width="1.6" height="5" rx="0.8" fill="url(#hw-g)"
                  transform={`rotate(${a} 20 20)`} opacity={0.85} />
          ))}
          {/* bombilla */}
          <path d="M20 8.5c-5.2 0-9.4 4.2-9.4 9.4 0 3.6 2 6.2 3.6 8 .9 1 1.4 2 1.4 3.2v1.3h8.8v-1.3c0-1.2.5-2.2 1.4-3.2 1.6-1.8 3.6-4.4 3.6-8 0-5.2-4.2-9.4-9.4-9.4Z"
                fill="url(#hw-g)" />
          <rect x="15.6" y="31.6" width="8.8" height="2.4" rx="1.2" fill="url(#hw-g)" opacity=".85" />
          <rect x="17" y="35.4" width="6" height="2.2" rx="1.1" fill="url(#hw-g)" opacity=".7" />
          <text x="20" y="22.6" textAnchor="middle" fontSize="11" fontWeight="800"
                fontFamily="Plus Jakarta Sans, sans-serif" fill={light ? '#1D4ED8' : '#FFFFFF'}>H</text>
        </svg>
      </span>
      <span className={cn('font-display text-[22px] font-extrabold tracking-tight', light ? 'text-white' : 'text-ink')}>
        Help<span className={light ? 'text-brand-200' : 'text-brand-500'}>Work</span>
      </span>
    </Link>
  )
}
