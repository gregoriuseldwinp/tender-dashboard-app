import { createFileRoute } from '@tanstack/react-router'
import { RegisterBuyerPage } from '../../features/auth/pages/register-buyer-page'

export const Route = createFileRoute('/register/buyer')({
  component: RegisterBuyerPage,
})
