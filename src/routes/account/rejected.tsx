import { createFileRoute } from '@tanstack/react-router'
import { RejectedAccountPage } from '../../features/auth/pages/rejected-account-page'

export const Route = createFileRoute('/account/rejected')({
  component: RejectedAccountPage,
})
