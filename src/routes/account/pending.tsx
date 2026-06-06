import { createFileRoute } from '@tanstack/react-router'
import { PendingApprovalPage } from '../../features/auth/pages/pending-approval-page'

export const Route = createFileRoute('/account/pending')({
  component: PendingApprovalPage,
})
