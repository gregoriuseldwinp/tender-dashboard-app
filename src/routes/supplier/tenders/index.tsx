import { createFileRoute } from '@tanstack/react-router'
import { ProtectedRoute } from '../../../components/shared/protected-route'
import { SupplierTendersPage } from '../../../features/supplier/pages/supplier-tenders-page'

export const Route = createFileRoute('/supplier/tenders/')({
  component: () => <ProtectedRoute requiredRole="supplier"><SupplierTendersPage /></ProtectedRoute>,
})
