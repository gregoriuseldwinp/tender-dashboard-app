import { formatCurrencyIDR } from '../../lib/formatter'

export function MoneyText({ value }: { value?: number | string | null }) {
  return <span>{formatCurrencyIDR(value)}</span>
}
