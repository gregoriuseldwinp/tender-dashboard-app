import { type TextareaHTMLAttributes, forwardRef } from 'react'
import { cn } from '../../lib/cn'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
  minRows?: number
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, minRows = 3, className, ...props }, ref) => (
    <textarea
      ref={ref}
      rows={minRows}
      aria-invalid={error ? 'true' : undefined}
      className={cn(
        'block w-full rounded-lg border px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition-colors resize-y',
        'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
        error
          ? 'border-red-400 bg-red-50 focus:ring-red-400 focus:border-red-400'
          : 'border-gray-300 bg-white hover:border-gray-400',
        'disabled:bg-gray-100 disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    />
  ),
)
Textarea.displayName = 'Textarea'
