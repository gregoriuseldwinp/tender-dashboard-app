import { createFileRoute } from '@tanstack/react-router'
import { RoleRedirect } from '../components/shared/role-redirect'

export const Route = createFileRoute('/')({
  component: RoleRedirect,
})
