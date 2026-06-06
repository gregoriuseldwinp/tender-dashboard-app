import { createFileRoute } from '@tanstack/react-router'
import { AdminProposalDetailPage } from '../../../features/admin/pages/admin-proposal-detail-page'

export const Route = createFileRoute('/admin/proposals/$proposalId/')({
  component: function Page() {
    const { proposalId } = Route.useParams()
    return <AdminProposalDetailPage proposalId={proposalId} />
  },
})
