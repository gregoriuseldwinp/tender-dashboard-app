import { Badge } from '../ui/badge'

const tenderStatusMap: Record<string, { label: string; variant: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'neutral' }> = {
  draft: { label: 'Draft', variant: 'neutral' },
  pending_review: { label: 'Menunggu Review', variant: 'warning' },
  approved: { label: 'Disetujui', variant: 'primary' },
  rejected: { label: 'Ditolak', variant: 'danger' },
  published: { label: 'Published', variant: 'success' },
  closed: { label: 'Ditutup', variant: 'neutral' },
  cancelled: { label: 'Dibatalkan', variant: 'danger' },
}

const proposalStatusMap: Record<string, { label: string; variant: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'neutral' }> = {
  submitted: { label: 'Diajukan', variant: 'primary' },
  under_review: { label: 'Direview', variant: 'warning' },
  shortlisted: { label: 'Shortlisted', variant: 'success' },
  rejected: { label: 'Ditolak', variant: 'danger' },
  accepted: { label: 'Diterima', variant: 'success' },
  withdrawn: { label: 'Ditarik', variant: 'neutral' },
}

const accountStatusMap: Record<string, { label: string; variant: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'neutral' }> = {
  pending: { label: 'Menunggu Approval', variant: 'warning' },
  approved: { label: 'Aktif', variant: 'success' },
  rejected: { label: 'Ditolak', variant: 'danger' },
  suspended: { label: 'Disuspend', variant: 'danger' },
}

type StatusType = 'tender' | 'proposal' | 'account'

interface StatusBadgeProps {
  status: string
  type?: StatusType
}

export function StatusBadge({ status, type = 'tender' }: StatusBadgeProps) {
  const map = type === 'proposal' ? proposalStatusMap : type === 'account' ? accountStatusMap : tenderStatusMap
  const config = map[status] ?? { label: status, variant: 'default' as const }
  return <Badge variant={config.variant}>{config.label}</Badge>
}
