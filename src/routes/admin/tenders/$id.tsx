import { createFileRoute } from '@tanstack/react-router'
import { ProtectedRoute } from '../../../components/shared/protected-route'
import { AdminTenderDetailPage } from '../../../features/admin/pages/admin-tender-detail-page'

export const Route = createFileRoute('/admin/tenders/$id')({
  component: function Page() {
    const { id } = Route.useParams()
    return <ProtectedRoute requiredRole="internal"><AdminTenderDetailPage id={id} /></ProtectedRoute>
  },
})
