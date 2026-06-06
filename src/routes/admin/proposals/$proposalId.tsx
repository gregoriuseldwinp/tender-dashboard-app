import { createFileRoute, Outlet } from '@tanstack/react-router'
import { ProtectedRoute } from '../../../components/shared/protected-route'

export const Route = createFileRoute('/admin/proposals/$proposalId')({
  component: function Layout() {
    return <ProtectedRoute requiredRole="internal"><Outlet /></ProtectedRoute>
  },
})
