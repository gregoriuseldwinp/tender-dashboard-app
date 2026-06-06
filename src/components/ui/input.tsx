import { type InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '../../lib/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className, ...props }, ref) => (
    <input
      ref={ref}
      aria-invalid={error ? 'true' : undefined}
      className={cn(
        'block w-full rounded-lg border px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
        error
          ? 'border-red-400 bg-red-50 focus:ring-red-400 focus:border-red-400'
          : 'border-gray-300 bg-white hover:border-gray-400',
        'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500',
        className,
      )}
      {...props}
    />
  ),
)
Input.displayName = 'Input'
