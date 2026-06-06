import { type ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface FormFieldProps {
  label?: string
  htmlFor?: string
  helper?: string
  error?: string
  required?: boolean
  children: ReactNode
  className?: string
}

export function FormField({ label, htmlFor, helper, error, required, children, className }: FormFieldProps) {
  const descId = helper ? `${htmlFor}-helper` : undefined
  const errId = error ? `${htmlFor}-error` : undefined

  return (
    <div className={cn('space-y-1', className)}>
      {label && (
        <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div aria-describedby={errId ?? descId}>{children}</div>
      {helper && !error && (
        <p id={descId} className="text-xs text-gray-500">{helper}</p>
      )}
      {error && (
        <p id={errId} className="text-xs text-red-600 flex items-center gap-1">{error}</p>
      )}
    </div>
  )
}
