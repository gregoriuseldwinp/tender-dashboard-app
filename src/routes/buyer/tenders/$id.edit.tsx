import { createFileRoute } from '@tanstack/react-router'
import { ProtectedRoute } from '../../../components/shared/protected-route'
import { BuyerEditTenderPage } from '../../../features/buyer/pages/buyer-edit-tender-page'

export const Route = createFileRoute('/buyer/tenders/$id/edit')({
  component: function Page() {
    const { id } = Route.useParams()
    return <ProtectedRoute requiredRole="buyer"><BuyerEditTenderPage id={id} /></ProtectedRoute>
  },
})
