import { createFileRoute } from '@tanstack/react-router'
import { ProtectedRoute } from '../../../components/shared/protected-route'
import { SupplierProposalsPage } from '../../../features/supplier/pages/supplier-proposals-page'

export const Route = createFileRoute('/supplier/proposals/')({
  component: () => <ProtectedRoute requiredRole="supplier"><SupplierProposalsPage /></ProtectedRoute>,
})
