import { createFileRoute } from '@tanstack/react-router'
import { ProtectedRoute } from '../../../components/shared/protected-route'
import { AdminAccountsPage } from '../../../features/admin/pages/admin-accounts-page'

export const Route = createFileRoute('/admin/accounts/')({
  component: () => <ProtectedRoute requiredRole="internal"><AdminAccountsPage /></ProtectedRoute>,
})
