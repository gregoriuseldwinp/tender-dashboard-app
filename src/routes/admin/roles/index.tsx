import { createFileRoute } from '@tanstack/react-router'
import { ProtectedRoute } from '../../../components/shared/protected-route'
import { AdminRolesPage } from '../../../features/admin/pages/admin-roles-page'

export const Route = createFileRoute('/admin/roles/')({
  component: () => <ProtectedRoute requiredRole="internal"><AdminRolesPage /></ProtectedRoute>,
})
