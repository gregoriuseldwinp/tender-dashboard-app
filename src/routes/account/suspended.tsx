import { createFileRoute } from '@tanstack/react-router'
import { SuspendedAccountPage } from '../../features/auth/pages/suspended-account-page'

export const Route = createFileRoute('/account/suspended')({
  component: SuspendedAccountPage,
})
