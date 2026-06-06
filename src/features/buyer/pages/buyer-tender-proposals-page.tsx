import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Mail, Phone } from 'lucide-react'
import { buyerApi } from '../api'
import { QUERY_KEYS } from '../../../lib/constants'
import { DashboardLayout } from '../../../components/layout/dashboard-layout'
import { PageHeader } from '../../../components/layout/page-header'
import { Button } from '../../../components/ui/button'
import { DataTable, type Column } from '../../../components/shared/data-table'
import { StatusBadge } from '../../../components/shared/status-badge'
import { MoneyText } from '../../../components/shared/money-text'
import { DateText } from '../../../components/shared/date-text'
import type { Proposal } from '../api'

interface Props { id: string }

export function BuyerTenderProposalsPage({ id }: Props) {
  const { data: proposals = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.BUYER_TENDER_PROPOSALS(id),
    queryFn: () => buyerApi.getTenderProposals(id),
  })

  const columns: Column<Proposal>[] = [
    { key: 'supplier', header: 'Supplier', render: p => p.supplier ? (
      <div className="space-y-0.5 min-w-0">
        <p className="font-medium text-gray-900 text-sm">{p.supplier.companyName}</p>
        {p.supplier.legalName && p.supplier.legalName !== p.supplier.companyName && (
          <p className="text-xs text-gray-400 truncate">{p.supplier.legalName}</p>
        )}
        {p.supplier.email && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Mail className="w-3 h-3 shrink-0" />
            <span className="truncate">{p.supplier.email}</span>
          </div>
        )}
        {!p.supplier.email && p.supplier.phone && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Phone className="w-3 h-3 shrink-0" />
            <span>{p.supplier.phone}</span>
          </div>
        )}
      </div>
    ) : <span className="text-gray-400 text-sm">-</span> },
    { key: 'title', header: 'Judul Proposal', render: p => (
      <Link to="/buyer/proposals/$id" params={{ id: p.id }} className="font-medium text-indigo-600 hover:underline">
        {p.title}
      </Link>
    )},
    { key: 'price', header: 'Harga Penawaran', render: p => <MoneyText value={p.priceOffer} /> },
    { key: 'delivery', header: 'Est. Pengiriman', render: p => p.estimatedDeliveryTime ?? '-' },
    { key: 'status', header: 'Status', render: p => <StatusBadge status={p.status} type="proposal" /> },
    { key: 'createdAt', header: 'Diajukan', render: p => <DateText value={p.createdAt} /> },
    { key: 'action', header: '', render: p => (
      <Link to="/buyer/proposals/$id" params={{ id: p.id }}>
        <Button size="sm" variant="outline">Lihat Detail</Button>
      </Link>
    )},
  ]

  return (
    <DashboardLayout role="buyer">
      <PageHeader
        title="Proposal Masuk"
        breadcrumbs={[
          { label: 'Tender Saya', to: '/buyer/tenders' },
          { label: 'Detail Tender', to: `/buyer/tenders/${id}` },
          { label: 'Proposal' },
        ]}
      />
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <DataTable
          columns={columns}
          data={proposals}
          loading={isLoading}
          keyExtractor={p => p.id}
          emptyTitle="Belum ada proposal masuk"
          emptyDescription="Belum ada supplier yang mengajukan proposal untuk tender ini."
          mobileRender={p => (
            <div className="space-y-2">
              <Link to="/buyer/proposals/$id" params={{ id: p.id }}>
                <p className="font-semibold text-indigo-600">{p.title}</p>
              </Link>
              {p.supplier ? (
                <div>
                  <p className="text-sm font-medium text-gray-800">{p.supplier.companyName}</p>
                  {p.supplier.email && (
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                      <Mail className="w-3 h-3 shrink-0" />
                      <span>{p.supplier.email}</span>
                    </div>
                  )}
                  {!p.supplier.email && p.supplier.phone && (
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                      <Phone className="w-3 h-3 shrink-0" />
                      <span>{p.supplier.phone}</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-400">Supplier tidak diketahui</p>
              )}
              <div className="flex items-center justify-between">
                <MoneyText value={p.priceOffer} />
                <StatusBadge status={p.status} type="proposal" />
              </div>
              <Link to="/buyer/proposals/$id" params={{ id: p.id }}>
                <Button size="sm" variant="outline" className="w-full mt-2">Lihat Detail</Button>
              </Link>
            </div>
          )}
        />
      </div>
    </DashboardLayout>
  )
}
