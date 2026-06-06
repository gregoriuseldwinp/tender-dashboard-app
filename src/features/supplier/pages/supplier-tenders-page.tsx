import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Search } from 'lucide-react'
import { supplierApi } from '../api'
import { QUERY_KEYS } from '../../../lib/constants'
import { DashboardLayout } from '../../../components/layout/dashboard-layout'
import { PageHeader } from '../../../components/layout/page-header'
import { Input } from '../../../components/ui/input'
import { Button } from '../../../components/ui/button'
import { DataTable, type Column } from '../../../components/shared/data-table'
import { MoneyText } from '../../../components/shared/money-text'
import { DateText } from '../../../components/shared/date-text'
import { Badge } from '../../../components/ui/badge'
import type { Tender } from '../api'

export function SupplierTendersPage() {
  const [search, setSearch] = useState('')

  const { data: tenders = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.SUPPLIER_TENDERS,
    queryFn: supplierApi.getTenders,
  })

  const filtered = tenders.filter(t => {
    const q = search.toLowerCase()
    return !q || t.title.toLowerCase().includes(q) ||
      (t.category ?? '').toLowerCase().includes(q) ||
      (t.deliveryLocation ?? '').toLowerCase().includes(q)
  })

  const columns: Column<Tender>[] = [
    { key: 'title', header: 'Judul', render: t => (
      <Link to="/supplier/tenders/$id" params={{ id: t.id }} className="font-medium text-indigo-600 hover:underline">
        {t.title}
      </Link>
    )},
    { key: 'category', header: 'Kategori', render: t => t.category ?? '-' },
    { key: 'type', header: 'Tipe', render: t => (
      <Badge variant={t.openTender ? 'success' : 'neutral'}>{t.openTender ? 'Terbuka' : 'Tertutup'}</Badge>
    )},
    { key: 'budget', header: 'Estimasi Budget', render: t => <MoneyText value={t.budgetEstimate} /> },
    { key: 'deadline', header: 'Deadline', render: t => <DateText value={t.deadline} /> },
    { key: 'location', header: 'Lokasi', render: t => t.deliveryLocation ?? '-' },
    { key: 'action', header: '', render: t => (
      <Link to="/supplier/tenders/$id" params={{ id: t.id }}>
        <Button size="sm" variant="outline">Lihat Tender</Button>
      </Link>
    )},
  ]

  return (
    <DashboardLayout role="supplier">
      <PageHeader title="Tender Tersedia" description="Temukan tender yang sesuai dengan kemampuan Anda." />

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Cari judul, kategori, atau lokasi..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <DataTable
          columns={columns}
          data={filtered}
          loading={isLoading}
          keyExtractor={t => t.id}
          emptyTitle="Belum ada tender tersedia saat ini"
          emptyDescription="Cek kembali nanti untuk tender terbaru."
          mobileRender={t => (
            <div className="space-y-2">
              <Link to="/supplier/tenders/$id" params={{ id: t.id }}>
                <p className="font-semibold text-indigo-600">{t.title}</p>
              </Link>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{t.category ?? '-'}</span>
                <span>·</span>
                <Badge variant={t.openTender ? 'success' : 'neutral'} className="text-xs">
                  {t.openTender ? 'Terbuka' : 'Tertutup'}
                </Badge>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <MoneyText value={t.budgetEstimate} />
                <DateText value={t.deadline} />
              </div>
              <Link to="/supplier/tenders/$id" params={{ id: t.id }}>
                <Button size="sm" variant="outline" className="w-full mt-2">Lihat Tender</Button>
              </Link>
            </div>
          )}
        />
      </div>
    </DashboardLayout>
  )
}
