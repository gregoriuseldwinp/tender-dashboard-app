import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { PlusCircle, Search } from 'lucide-react'
import { buyerApi } from '../api'
import { QUERY_KEYS } from '../../../lib/constants'
import { DashboardLayout } from '../../../components/layout/dashboard-layout'
import { PageHeader } from '../../../components/layout/page-header'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Select } from '../../../components/ui/select'
import { DataTable, type Column } from '../../../components/shared/data-table'
import { StatusBadge } from '../../../components/shared/status-badge'
import { MoneyText } from '../../../components/shared/money-text'
import { DateText } from '../../../components/shared/date-text'
import { usePermissions } from '../../auth/hooks'
import { hasPermission } from '../../../lib/auth'
import type { Tender } from '../api'

export function BuyerTendersPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const permissions = usePermissions()
  const canCreate = hasPermission(permissions, 'tender:create')

  const { data: tenders = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.BUYER_TENDERS,
    queryFn: buyerApi.getTenders,
  })

  const filtered = tenders.filter(t => {
    const q = search.toLowerCase()
    const matchSearch = !q || t.title.toLowerCase().includes(q) || (t.category ?? '').toLowerCase().includes(q)
    const matchStatus = !statusFilter || t.status === statusFilter
    return matchSearch && matchStatus
  })

  const columns: Column<Tender>[] = [
    { key: 'title', header: 'Judul', render: t => (
      <Link to="/buyer/tenders/$id" params={{ id: t.id }} className="font-medium text-indigo-600 hover:underline">
        {t.title}
      </Link>
    )},
    { key: 'category', header: 'Kategori', render: t => t.category ?? '-' },
    { key: 'budget', header: 'Estimasi Budget', render: t => <MoneyText value={t.budgetEstimate} /> },
    { key: 'deadline', header: 'Deadline', render: t => <DateText value={t.deadline} /> },
    { key: 'status', header: 'Status', render: t => <StatusBadge status={t.status} type="tender" /> },
    { key: 'createdAt', header: 'Dibuat', render: t => <DateText value={t.createdAt} /> },
  ]

  return (
    <DashboardLayout role="buyer">
      <PageHeader
        title="Tender Saya"
        description="Daftar semua tender yang telah Anda buat."
        action={
          canCreate ? (
            <Link to="/buyer/tenders/create">
              <Button><PlusCircle className="w-4 h-4" /> Buat Tender</Button>
            </Link>
          ) : undefined
        }
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Cari judul atau kategori..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="sm:w-48">
          <option value="">Semua Status</option>
          <option value="draft">Draft</option>
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
          emptyTitle="Belum ada tender"
          emptyDescription="Buat tender pertama Anda untuk mulai mencari supplier."
          emptyAction={
            canCreate ? (
              <Link to="/buyer/tenders/create">
                <Button size="sm"><PlusCircle className="w-4 h-4" /> Buat Tender</Button>
              </Link>
            ) : undefined
          }
          mobileRender={t => (
            <div className="space-y-2">
              <Link to="/buyer/tenders/$id" params={{ id: t.id }}>
                <p className="font-semibold text-indigo-600">{t.title}</p>
              </Link>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{t.category ?? 'Tanpa kategori'}</span>
                <StatusBadge status={t.status} type="tender" />
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span><MoneyText value={t.budgetEstimate} /></span>
                <span><DateText value={t.createdAt} /></span>
              </div>
            </div>
          )}
        />
      </div>
    </DashboardLayout>
  )
}
