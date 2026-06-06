import { Navigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '../../lib/constants'
import { apiFetch } from '../../lib/api'
import type { AuthUser } from '../../features/auth/api'

export function RoleRedirect() {
  const { data: user, isLoading } = useQuery({
    queryKey: QUERY_KEYS.AUTH_ME,
    queryFn: () => apiFetch<AuthUser>('/auth/me'),
    retry: false,
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" />

  if (user.account?.status === 'pending') return <Navigate to="/account/pending" />
  if (user.account?.status === 'rejected') return <Navigate to="/account/rejected" />
  if (user.account?.status === 'suspended') return <Navigate to="/account/suspended" />

  if (user.account?.accountType === 'buyer') return <Navigate to="/buyer/dashboard" />
  if (user.account?.accountType === 'supplier') return <Navigate to="/supplier/dashboard" />
  if (user.account?.accountType === 'internal') return <Navigate to="/admin/dashboard" />

  return <Navigate to="/login" />
}
