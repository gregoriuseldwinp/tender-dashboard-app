import { createFileRoute } from '@tanstack/react-router'
import { ProtectedRoute } from '../../../components/shared/protected-route'
import { BuyerTenderProposalsPage } from '../../../features/buyer/pages/buyer-tender-proposals-page'

export const Route = createFileRoute('/buyer/tenders/$id/proposals')({
  component: function Page() {
    const { id } = Route.useParams()
    return <ProtectedRoute requiredRole="buyer"><BuyerTenderProposalsPage id={id} /></ProtectedRoute>
  },
})
