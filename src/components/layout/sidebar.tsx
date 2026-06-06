import { Link, useRouterState } from '@tanstack/react-router'
import {
  LayoutDashboard, FileText, PlusCircle, Package, ClipboardList,
  Users, Clock, CheckSquare, ShieldCheck, X,
} from 'lucide-react'
import { cn } from '../../lib/cn'
import { hasPermission, hasAnyPermission } from '../../lib/auth'

interface NavItem {
  label: string
  to: string
  icon: typeof LayoutDashboard
  permission?: string
  anyPermission?: string[]
}

const buyerNav: NavItem[] = [
  { label: 'Dashboard', to: '/buyer/dashboard', icon: LayoutDashboard, permission: 'dashboard:read' },
  { label: 'Tender Saya', to: '/buyer/tenders', icon: FileText, permission: 'tender:read' },
  { label: 'Buat Tender', to: '/buyer/tenders/create', icon: PlusCircle, permission: 'tender:create' },
]

const supplierNav: NavItem[] = [
  { label: 'Dashboard', to: '/supplier/dashboard', icon: LayoutDashboard, permission: 'dashboard:read' },
  { label: 'Tender Tersedia', to: '/supplier/tenders', icon: Package, permission: 'tender:read' },
  { label: 'Proposal Saya', to: '/supplier/proposals', icon: ClipboardList, permission: 'proposal:read' },
]

const adminNav: NavItem[] = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard, permission: 'dashboard:read' },
  { label: 'Akun Pending', to: '/admin/accounts/pending', icon: Clock, permission: 'account:read' },
  { label: 'Semua Akun', to: '/admin/accounts', icon: Users, permission: 'account:read' },
  { label: 'Tender Pending', to: '/admin/tenders/pending', icon: CheckSquare, permission: 'tender:read' },
  { label: 'Semua Tender', to: '/admin/tenders', icon: FileText, permission: 'tender:read' },
  { label: 'Role & Permission', to: '/admin/roles', icon: ShieldCheck, anyPermission: ['role:create', 'permission:assign'] },
]

interface SidebarProps {
  role: 'buyer' | 'supplier' | 'internal'
  permissions: string[]
  open?: boolean
  onClose?: () => void
}

function isVisible(item: NavItem, permissions: string[]): boolean {
  if (item.anyPermission) return hasAnyPermission(permissions, item.anyPermission)
  if (item.permission) return hasPermission(permissions, item.permission)
  return true
}

export function Sidebar({ role, permissions, open, onClose }: SidebarProps) {
  const allNav = role === 'buyer' ? buyerNav : role === 'supplier' ? supplierNav : adminNav
  const nav = allNav.filter(item => isVisible(item, permissions))
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  const content = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <FileText className="w-6 h-6 text-indigo-600" />
          <span className="font-bold text-gray-900">Tender Portal</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1 rounded hover:bg-gray-100 text-gray-400">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {nav.map(item => {
          const active = currentPath === item.to || currentPath.startsWith(item.to + '/')
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
              )}
            >
              <item.icon className={cn('w-5 h-5 shrink-0', active ? 'text-indigo-600' : 'text-gray-400')} />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )

  return (
    <>
      <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-white border-r border-gray-200 h-screen sticky top-0">
        {content}
      </aside>

      {open !== undefined && (
        <>
          <div
            className={cn(
              'fixed inset-0 z-40 bg-black/40 lg:hidden transition-opacity',
              open ? 'opacity-100' : 'opacity-0 pointer-events-none',
            )}
            onClick={onClose}
          />
          <aside
            className={cn(
              'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl lg:hidden transition-transform duration-300',
              open ? 'translate-x-0' : '-translate-x-full',
            )}
          >
            {content}
          </aside>
        </>
      )}
    </>
  )
}
