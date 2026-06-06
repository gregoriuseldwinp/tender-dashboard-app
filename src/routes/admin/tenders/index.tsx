import { createFileRoute } from '@tanstack/react-router'
import { ProtectedRoute } from '../../../components/shared/protected-route'
import { AdminTendersPage } from '../../../features/admin/pages/admin-tenders-page'

export const Route = createFileRoute('/admin/tenders/')({
  component: () => <ProtectedRoute requiredRole="internal"><AdminTendersPage /></ProtectedRoute>,
})
