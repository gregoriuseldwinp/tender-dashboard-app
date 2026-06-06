import { createFileRoute } from '@tanstack/react-router'
import { ProtectedRoute } from '../../../components/shared/protected-route'
import { AdminAccountDetailPage } from '../../../features/admin/pages/admin-account-detail-page'

export const Route = createFileRoute('/admin/accounts/$id')({
  component: function Page() {
    const { id } = Route.useParams()
    return <ProtectedRoute requiredRole="internal"><AdminAccountDetailPage id={id} /></ProtectedRoute>
  },
})
