import { createFileRoute } from '@tanstack/react-router'
import { ProtectedRoute } from '../../../components/shared/protected-route'
import { AdminPendingTendersPage } from '../../../features/admin/pages/admin-pending-tenders-page'

export const Route = createFileRoute('/admin/tenders/pending')({
  component: () => <ProtectedRoute requiredRole="internal"><AdminPendingTendersPage /></ProtectedRoute>,
})
