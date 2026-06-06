import { type SelectHTMLAttributes, forwardRef } from 'react'
import { cn } from '../../lib/cn'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ error, className, children, ...props }, ref) => (
    <select
      ref={ref}
      aria-invalid={error ? 'true' : undefined}
      className={cn(
        'block w-full rounded-lg border px-3 py-2 text-sm text-gray-900 transition-colors bg-white appearance-none',
        'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
        error
          ? 'border-red-400 bg-red-50'
          : 'border-gray-300 hover:border-gray-400',
        'disabled:bg-gray-100 disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  ),
)
Select.displayName = 'Select'
