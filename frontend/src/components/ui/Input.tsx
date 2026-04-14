import { forwardRef, InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-rust-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-lg border px-3 py-2.5 text-sm transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent',
            'bg-white text-rust-900 placeholder:text-rust-400',
            error
              ? 'border-red-300 bg-red-50 focus:ring-red-400'
              : 'border-rust-200 hover:border-rust-300',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
        {hint && !error && <p className="text-xs text-rust-500">{hint}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'