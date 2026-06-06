import { createFileRoute } from '@tanstack/react-router'
import { ProtectedRoute } from '../../../components/shared/protected-route'
import { AdminNegotiationPage } from '../../../features/admin/pages/admin-negotiation-page'

export const Route = createFileRoute('/admin/proposals/$proposalId/negotiations')({
  component: function Page() {
    const { proposalId } = Route.useParams()
    return <ProtectedRoute requiredRole="internal"><AdminNegotiationPage proposalId={proposalId} /></ProtectedRoute>
  },
})
