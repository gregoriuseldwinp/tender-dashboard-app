import { createFileRoute } from '@tanstack/react-router'
import { BuyerTenderDetailPage } from '../../../features/buyer/pages/buyer-tender-detail-page'

export const Route = createFileRoute('/buyer/tenders/$id/')({
  component: function Page() {
    const { id } = Route.useParams()
    return <BuyerTenderDetailPage id={id} />
  },
})
