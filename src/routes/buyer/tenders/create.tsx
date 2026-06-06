import { createFileRoute } from '@tanstack/react-router'
import { ProtectedRoute } from '../../../components/shared/protected-route'
import { BuyerCreateTenderPage } from '../../../features/buyer/pages/buyer-create-tender-page'

export const Route = createFileRoute('/buyer/tenders/create')({
  component: () => <ProtectedRoute requiredRole="buyer"><BuyerCreateTenderPage /></ProtectedRoute>,
})
