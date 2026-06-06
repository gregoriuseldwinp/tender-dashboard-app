import { createFileRoute } from '@tanstack/react-router'
import { BuyerProposalDetailPage } from '../../../features/buyer/pages/buyer-proposal-detail-page'

export const Route = createFileRoute('/buyer/proposals/$id/')({
  component: function Page() {
    const { id } = Route.useParams()
    return <BuyerProposalDetailPage id={id} />
  },
})
