import { createFileRoute, Outlet } from '@tanstack/react-router'
import { ProtectedRoute } from '../../../components/shared/protected-route'

export const Route = createFileRoute('/supplier/proposals/$id')({
  component: function Layout() {
    return <ProtectedRoute requiredRole="supplier"><Outlet /></ProtectedRoute>
  },
})
