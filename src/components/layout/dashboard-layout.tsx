import { useState, type ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '../../lib/constants'
import { apiFetch } from '../../lib/api'
import type { AuthUser } from '../../features/auth/api'
import { usePermissions } from '../../features/auth/hooks'
import { Sidebar } from './sidebar'
import { Topbar } from './topbar'

interface DashboardLayoutProps {
  children: ReactNode
  role: 'buyer' | 'supplier' | 'internal'
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { data: user } = useQuery({
    queryKey: QUERY_KEYS.AUTH_ME,
    queryFn: () => apiFetch<AuthUser>('/auth/me'),
  })
  const permissions = usePermissions()

  if (!user) return null

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar role={role} permissions={permissions} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar user={user} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
