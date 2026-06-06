import { createFileRoute } from '@tanstack/react-router'
import { ProtectedRoute } from '../../../components/shared/protected-route'
import { AdminPendingAccountsPage } from '../../../features/admin/pages/admin-pending-accounts-page'

export const Route = createFileRoute('/admin/accounts/pending')({
  component: () => <ProtectedRoute requiredRole="internal"><AdminPendingAccountsPage /></ProtectedRoute>,
})
