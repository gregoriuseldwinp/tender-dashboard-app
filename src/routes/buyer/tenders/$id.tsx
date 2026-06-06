import { createFileRoute, Outlet } from '@tanstack/react-router'
import { ProtectedRoute } from '../../../components/shared/protected-route'

export const Route = createFileRoute('/buyer/tenders/$id')({
  component: function Layout() {
    return <ProtectedRoute requiredRole="buyer"><Outlet /></ProtectedRoute>
  },
})
