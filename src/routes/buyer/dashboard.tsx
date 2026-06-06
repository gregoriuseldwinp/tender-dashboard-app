import { createFileRoute } from '@tanstack/react-router'
import { ProtectedRoute } from '../../components/shared/protected-route'
import { BuyerDashboardPage } from '../../features/buyer/pages/buyer-dashboard-page'

export const Route = createFileRoute('/buyer/dashboard')({
  component: () => <ProtectedRoute requiredRole="buyer"><BuyerDashboardPage /></ProtectedRoute>,
})
