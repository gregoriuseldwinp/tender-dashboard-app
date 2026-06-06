import { formatDate, formatDateTime } from '../../lib/formatter'

export function DateText({ value }: { value?: string | Date | null }) {
  return <span>{formatDate(value)}</span>
}

export function DateTimeText({ value }: { value?: string | Date | null }) {
  return <span>{formatDateTime(value)}</span>
}
