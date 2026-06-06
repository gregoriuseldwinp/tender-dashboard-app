import { createFileRoute } from '@tanstack/react-router'
import { ProtectedRoute } from '../../../components/shared/protected-route'
import { SupplierEditProposalPage } from '../../../features/supplier/pages/supplier-edit-proposal-page'

export const Route = createFileRoute('/supplier/proposals/$id/edit')({
  component: function Page() {
    const { id } = Route.useParams()
    return <ProtectedRoute requiredRole="supplier"><SupplierEditProposalPage id={id} /></ProtectedRoute>
  },
})
