import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Search } from 'lucide-react'
import { adminApi } from '../api'
import { QUERY_KEYS } from '../../../lib/constants'
import { DashboardLayout } from '../../../components/layout/dashboard-layout'
import { PageHeader } from '../../../components/layout/page-header'
import { Input } from '../../../components/ui/input'
import { Select } from '../../../components/ui/select'
import { Button } from '../../../components/ui/button'
import { DataTable, type Column } from '../../../components/shared/data-table'
import { StatusBadge } from '../../../components/shared/status-badge'
import { DateText } from '../../../components/shared/date-text'
import type { Account } from '../api'

export function AdminAccountsPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const { data: accounts = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.ADMIN_ACCOUNTS,
    queryFn: adminApi.getAccounts,
  })

  const filtered = accounts.filter(a => {
    const q = search.toLowerCase()
    const matchSearch = !q || a.companyName.toLowerCase().includes(q) || (a.email ?? '').toLowerCase().includes(q)
    const matchType = !typeFilter || a.accountType === typeFilter
    const matchStatus = !statusFilter || a.status === statusFilter
    return matchSearch && matchType && matchStatus
  })

  const columns: Column<Account>[] = [
    { key: 'company', header: 'Perusahaan', render: a => (
      <Link to="/admin/accounts/$id" params={{ id: a.id }} className="font-medium text-indigo-600 hover:underline">
        {a.companyName}
      </Link>
    )},
    { key: 'type', header: 'Tipe', render: a => <span className="capitalize">{a.accountType}</span> },
    { key: 'email', header: 'Email', render: a => a.email ?? '-' },
    { key: 'status', header: 'Status', render: a => <StatusBadge status={a.status} type="account" /> },
    { key: 'createdAt', header: 'Didaftarkan', render: a => <DateText value={a.createdAt} /> },
    { key: 'action', header: '', render: a => (
      <Link to="/admin/accounts/$id" params={{ id: a.id }}>
        <Button size="sm" variant="outline">Detail</Button>
      </Link>
    )},
  ]

  return (
    <DashboardLayout role="internal">
      <PageHeader title="Semua Akun" />
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Cari nama perusahaan atau email..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="sm:w-36">
          <option value="">Semua Tipe</option>
          <option value="buyer">Buyer</option>
          <option value="supplier">Supplier</option>
          <option value="internal">Internal</option>
        </Select>
        <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="sm:w-44">
          <option value="">Semua Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Aktif</option>
          <option value="rejected">Ditolak</option>
          <option value="suspended">Disuspend</option>
        </Select>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <DataTable
          columns={columns}
          data={filtered}
          loading={isLoading}
          keyExtractor={a => a.id}
          emptyTitle="Tidak ada akun"
          mobileRender={a => (
            <div className="space-y-2">
              <Link to="/admin/accounts/$id" params={{ id: a.id }}>
                <p className="font-semibold text-indigo-600">{a.companyName}</p>
              </Link>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 capitalize">{a.accountType}</span>
                <StatusBadge status={a.status} type="account" />
              </div>
            </div>
          )}
        />
      </div>
    </DashboardLayout>
  )
}
