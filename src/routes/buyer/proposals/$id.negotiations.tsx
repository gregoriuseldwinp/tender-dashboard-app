import { createFileRoute } from '@tanstack/react-router'
import { ProtectedRoute } from '../../../components/shared/protected-route'
import { BuyerNegotiationPage } from '../../../features/buyer/pages/buyer-negotiation-page'

export const Route = createFileRoute('/buyer/proposals/$id/negotiations')({
  component: function Page() {
    const { id } = Route.useParams()
    return <ProtectedRoute requiredRole="buyer"><BuyerNegotiationPage proposalId={id} /></ProtectedRoute>
  },
})
