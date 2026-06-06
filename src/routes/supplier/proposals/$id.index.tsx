import { createFileRoute } from '@tanstack/react-router'
import { SupplierProposalDetailPage } from '../../../features/supplier/pages/supplier-proposal-detail-page'

export const Route = createFileRoute('/supplier/proposals/$id/')({
  component: function Page() {
    const { id } = Route.useParams()
    return <SupplierProposalDetailPage id={id} />
  },
})
