import { createFileRoute } from '@tanstack/react-router'
import { ProtectedRoute } from '../../components/shared/protected-route'
import { AdminDashboardPage } from '../../features/admin/pages/admin-dashboard-page'

export const Route = createFileRoute('/admin/dashboard')({
  component: () => <ProtectedRoute requiredRole="internal"><AdminDashboardPage /></ProtectedRoute>,
})
