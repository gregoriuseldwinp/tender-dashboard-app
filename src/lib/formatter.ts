import { format, parseISO } from 'date-fns'
import { id } from 'date-fns/locale'

export function formatCurrencyIDR(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '-'
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return '-'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return '-'
  try {
    const date = typeof value === 'string' ? parseISO(value) : value
    return format(date, 'd MMM yyyy', { locale: id })
  } catch {
    return '-'
  }
}

export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) return '-'
  try {
    const date = typeof value === 'string' ? parseISO(value) : value
    return format(date, 'd MMM yyyy, HH:mm', { locale: id })
  } catch {
    return '-'
  }
}

export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

export function shortId(id: string): string {
  return id.slice(0, 8).toUpperCase()
}
