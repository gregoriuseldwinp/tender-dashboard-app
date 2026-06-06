import { createFileRoute } from '@tanstack/react-router'
import { ProtectedRoute } from '../../../components/shared/protected-route'
import { BuyerTendersPage } from '../../../features/buyer/pages/buyer-tenders-page'

export const Route = createFileRoute('/buyer/tenders/')({
  component: () => <ProtectedRoute requiredRole="buyer"><BuyerTendersPage /></ProtectedRoute>,
})
