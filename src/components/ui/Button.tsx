import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'success' | 'white'
type Size = 'sm' | 'md' | 'lg'

const base =
  'relative inline-flex items-center justify-center gap-2 font-display font-semibold ' +
  'rounded-full overflow-hidden select-none whitespace-nowrap ' +
  'transition-[transform,box-shadow,background-color] duration-300 ease-out ' +
  'will-change-transform active:scale-[.97] ' +
  'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-300/60 ' +
  'disabled:opacity-50 disabled:pointer-events-none'

const variants: Record<Variant, string> = {
  primary:   'bg-brand-600 text-white hover:bg-brand-500 hover:-translate-y-0.5 hover:shadow-lift',
  secondary: 'bg-white text-brand-600 border border-brand-200 hover:border-brand-400 hover:-translate-y-0.5 hover:shadow-soft',
  success:   'bg-success-500 text-white hover:brightness-110 hover:-translate-y-0.5 hover:shadow-lift',
  ghost:     'bg-transparent text-ink-soft hover:bg-brand-50 hover:text-brand-600',
  white:     'bg-white/85 text-ink border border-white/70 backdrop-blur-md hover:bg-white hover:-translate-y-0.5',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-[13px]',
  md: 'h-11 px-6 text-[15px]',
  lg: 'h-[52px] px-8 text-base',
}

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  to?: string          // si se pasa, renderiza un <Link> de react-router
  fullWidth?: boolean
}

/**
 * Botón del sistema de diseño.
 * Incluye el "sheen" (destello diagonal) que recorre el botón al pasar el mouse,
 * al estilo de las landings modernas.
 */
export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = 'primary', size = 'md', to, fullWidth, className, children, ...rest }, ref,
) {
  const classes = cn(base, variants[variant], sizes[size], fullWidth && 'w-full', 'group', className)

  const inner = (
    <>
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-[120%] bg-gradient-to-r
                   from-transparent via-white/35 to-transparent group-hover:animate-sheen"
      />
    </>
  )

  if (to) {
    return <Link to={to} className={classes}>{inner}</Link>
  }
  return <button ref={ref} className={classes} {...rest}>{inner}</button>
})
