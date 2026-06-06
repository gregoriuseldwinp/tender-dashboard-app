import { Menu, LogOut, ChevronDown } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Badge } from '../ui/badge'
import { Dropdown } from '../ui/dropdown'
import { useToast } from '../ui/toast'
import { apiFetch } from '../../lib/api'
import type { AuthUser } from '../../features/auth/api'

const accountTypeLabel: Record<string, string> = {
  buyer: 'Buyer',
  supplier: 'Supplier',
  internal: 'Admin',
}

interface TopbarProps {
  user: AuthUser
  onMenuClick: () => void
}

export function Topbar({ user, onMenuClick }: TopbarProps) {
  const qc = useQueryClient()
  const navigate = useNavigate()
  const { success } = useToast()

  const handleLogout = async () => {
    try {
      await apiFetch('/auth/logout', 'POST')
    } catch {
      // ignore
    }
    qc.clear()
    success('Berhasil keluar')
    navigate({ to: '/login' })
  }

  const accountType = user.account?.accountType ?? 'buyer'

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 h-16 shrink-0">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex-1 lg:flex-none" />

      <div className="flex items-center gap-3">
        <div className="hidden sm:block text-right">
          <p className="text-sm font-semibold text-gray-900 leading-tight">
            {user.account?.companyName ?? user.name}
          </p>
          <p className="text-xs text-gray-500">{user.name}</p>
        </div>
        <Badge variant={accountType === 'internal' ? 'warning' : accountType === 'buyer' ? 'primary' : 'success'}>
          {accountTypeLabel[accountType]}
        </Badge>
        <Dropdown
          trigger={
            <button className="flex items-center gap-1 p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
              <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-semibold">
                {(user.account?.companyName ?? user.name ?? '?')[0].toUpperCase()}
              </div>
              <ChevronDown className="w-4 h-4" />
            </button>
          }
          items={[
            {
              label: 'Keluar',
              icon: <LogOut className="w-4 h-4" />,
              onClick: handleLogout,
              danger: true,
            },
          ]}
        />
      </div>
    </header>
  )
}
