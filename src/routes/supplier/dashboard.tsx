import { createFileRoute } from '@tanstack/react-router'
import { ProtectedRoute } from '../../components/shared/protected-route'
import { SupplierDashboardPage } from '../../features/supplier/pages/supplier-dashboard-page'

export const Route = createFileRoute('/supplier/dashboard')({
  component: () => <ProtectedRoute requiredRole="supplier"><SupplierDashboardPage /></ProtectedRoute>,
})
