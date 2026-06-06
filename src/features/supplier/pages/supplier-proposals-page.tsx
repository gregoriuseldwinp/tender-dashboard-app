import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Search } from 'lucide-react'
import { supplierApi } from '../api'
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
import { shortId } from '../../../lib/formatter'
import type { Proposal } from '../api'

export function SupplierProposalsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const { data: proposals = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.SUPPLIER_PROPOSALS,
    queryFn: supplierApi.getProposals,
  })

  const filtered = proposals.filter(p => {
    const q = search.toLowerCase()
    const matchSearch = !q || p.title.toLowerCase().includes(q)
    const matchStatus = !statusFilter || p.status === statusFilter
    return matchSearch && matchStatus
  })

  const columns: Column<Proposal>[] = [
    { key: 'title', header: 'Judul', render: p => (
      <Link to="/supplier/proposals/$id" params={{ id: p.id }} className="font-medium text-indigo-600 hover:underline">
        {p.title}
      </Link>
    )},
    { key: 'tender', header: 'Tender', render: p => p.tender?.title ?? shortId(p.id) },
    { key: 'price', header: 'Harga Penawaran', render: p => <MoneyText value={p.priceOffer} /> },
    { key: 'status', header: 'Status', render: p => <StatusBadge status={p.status} type="proposal" /> },
    { key: 'createdAt', header: 'Diajukan', render: p => <DateText value={p.createdAt} /> },
    { key: 'action', header: '', render: p => (
      <Link to="/supplier/proposals/$id" params={{ id: p.id }}>
        <Button size="sm" variant="outline">Lihat Detail</Button>
      </Link>
    )},
  ]

  return (
    <DashboardLayout role="supplier">
      <PageHeader title="Proposal Saya" description="Daftar semua proposal yang telah Anda ajukan." />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Cari judul proposal..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="sm:w-48">
          <option value="">Semua Status</option>
          <option value="submitted">Diajukan</option>
          <option value="under_review">Direview</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="accepted">Diterima</option>
          <option value="rejected">Ditolak</option>
          <option value="withdrawn">Ditarik</option>
        </Select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <DataTable
          columns={columns}
          data={filtered}
          loading={isLoading}
          keyExtractor={p => p.id}
          emptyTitle="Belum ada proposal"
          emptyDescription="Ajukan proposal pertama Anda untuk tender yang tersedia."
          mobileRender={p => (
            <div className="space-y-2">
              <Link to="/supplier/proposals/$id" params={{ id: p.id }}>
                <p className="font-semibold text-indigo-600">{p.title}</p>
              </Link>
              <div className="flex items-center justify-between">
                <MoneyText value={p.priceOffer} />
                <StatusBadge status={p.status} type="proposal" />
              </div>
              <Link to="/supplier/proposals/$id" params={{ id: p.id }}>
                <Button size="sm" variant="outline" className="w-full mt-2">Lihat Detail</Button>
              </Link>
            </div>
          )}
        />
      </div>
    </DashboardLayout>
  )
}
