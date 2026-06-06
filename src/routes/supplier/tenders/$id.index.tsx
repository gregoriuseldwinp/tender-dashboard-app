import { createFileRoute } from '@tanstack/react-router'
import { SupplierTenderDetailPage } from '../../../features/supplier/pages/supplier-tender-detail-page'

export const Route = createFileRoute('/supplier/tenders/$id/')({
  component: function Page() {
    const { id } = Route.useParams()
    return <SupplierTenderDetailPage id={id} />
  },
})
