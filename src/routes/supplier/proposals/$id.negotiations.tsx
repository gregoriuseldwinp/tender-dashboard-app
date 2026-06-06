import { createFileRoute } from '@tanstack/react-router'
import { ProtectedRoute } from '../../../components/shared/protected-route'
import { SupplierNegotiationPage } from '../../../features/supplier/pages/supplier-negotiation-page'

export const Route = createFileRoute('/supplier/proposals/$id/negotiations')({
  component: function Page() {
    const { id } = Route.useParams()
    return <ProtectedRoute requiredRole="supplier"><SupplierNegotiationPage proposalId={id} /></ProtectedRoute>
  },
})
