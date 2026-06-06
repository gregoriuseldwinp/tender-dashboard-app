import { createFileRoute } from '@tanstack/react-router'
import { ProtectedRoute } from '../../../components/shared/protected-route'
import { SupplierCreateProposalPage } from '../../../features/supplier/pages/supplier-create-proposal-page'

export const Route = createFileRoute('/supplier/tenders/$id/proposals/create')({
  component: function Page() {
    const { id } = Route.useParams()
    return <ProtectedRoute requiredRole="supplier"><SupplierCreateProposalPage tenderId={id} /></ProtectedRoute>
  },
})
