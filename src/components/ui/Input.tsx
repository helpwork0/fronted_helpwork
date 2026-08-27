import { forwardRef, useId, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/cn'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, error, type = 'text', className, ...rest }, ref,
) {
  const id = useId()
  const [visible, setVisible] = useState(false)
  const isPassword = type === 'password'

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink-soft">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          ref={ref}
          type={isPassword && visible ? 'text' : type}
          className={cn(
            'h-12 w-full rounded-xl border border-surface-line bg-white px-4 text-[15px] text-ink',
            'placeholder:text-ink-muted/70 transition-all duration-200',
            'focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100',
            isPassword && 'pr-12',
            error && 'border-red-300 focus:border-red-400 focus:ring-red-100',
            className,
          )}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible(v => !v)}
            aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-ink-muted hover:bg-brand-50 hover:text-brand-600"
          >
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>}
    </div>
  )
})
