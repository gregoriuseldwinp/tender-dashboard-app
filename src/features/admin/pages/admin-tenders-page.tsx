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
import { MoneyText } from '../../../components/shared/money-text'
import { DateText } from '../../../components/shared/date-text'
import type { Tender } from '../api'

export function AdminTendersPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const { data: tenders = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.ADMIN_TENDERS,
    queryFn: adminApi.getTenders,
  })

  const filtered = tenders.filter(t => {
    const q = search.toLowerCase()
    const matchSearch = !q || t.title.toLowerCase().includes(q) || (t.category ?? '').toLowerCase().includes(q)
    const matchStatus = !statusFilter || t.status === statusFilter
    return matchSearch && matchStatus
  })

  const columns: Column<Tender>[] = [
    { key: 'title', header: 'Judul', render: t => (
      <Link to="/admin/tenders/$id" params={{ id: t.id }} className="font-medium text-indigo-600 hover:underline">{t.title}</Link>
    )},
    { key: 'account', header: 'Buyer', render: t => t.account?.companyName ?? '-' },
    { key: 'category', header: 'Kategori', render: t => t.category ?? '-' },
    { key: 'budget', header: 'Budget', render: t => <MoneyText value={t.budgetEstimate} /> },
    { key: 'status', header: 'Status', render: t => <StatusBadge status={t.status} type="tender" /> },
    { key: 'createdAt', header: 'Dibuat', render: t => <DateText value={t.createdAt} /> },
    { key: 'action', header: '', render: t => (
      <Link to="/admin/tenders/$id" params={{ id: t.id }}>
        <Button size="sm" variant="outline">Detail</Button>
      </Link>
    )},
  ]

  return (
    <DashboardLayout role="internal">
      <PageHeader title="Semua Tender" />
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Cari judul atau kategori..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="sm:w-44">
          <option value="">Semua Status</option>
          <option value="pending_review">Menunggu Review</option>
          <option value="published">Published</option>
          <option value="rejected">Ditolak</option>
          <option value="closed">Ditutup</option>
          <option value="cancelled">Dibatalkan</option>
        </Select>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <DataTable
          columns={columns}
          data={filtered}
          loading={isLoading}
          keyExtractor={t => t.id}
          emptyTitle="Tidak ada tender"
          mobileRender={t => (
            <div className="space-y-2">
              <Link to="/admin/tenders/$id" params={{ id: t.id }}>
                <p className="font-semibold text-indigo-600">{t.title}</p>
              </Link>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{t.account?.companyName ?? '-'}</span>
                <StatusBadge status={t.status} type="tender" />
              </div>
            </div>
          )}
        />
      </div>
    </DashboardLayout>
  )
}
