import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { PlusCircle } from 'lucide-react'
import { supplierApi } from '../api'
import { QUERY_KEYS } from '../../../lib/constants'
import { DashboardLayout } from '../../../components/layout/dashboard-layout'
import { PageHeader } from '../../../components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Alert } from '../../../components/ui/alert'
import { MoneyText } from '../../../components/shared/money-text'
import { DateText, DateTimeText } from '../../../components/shared/date-text'
import { SkeletonCard } from '../../../components/ui/skeleton'
import { Badge } from '../../../components/ui/badge'
import { usePermissions } from '../../auth/hooks'
import { hasPermission } from '../../../lib/auth'

interface Props { id: string }

export function SupplierTenderDetailPage({ id }: Props) {
  const permissions = usePermissions()
  const canCreateProposal = hasPermission(permissions, 'proposal:create')

  const { data: tender, isLoading } = useQuery({
    queryKey: QUERY_KEYS.SUPPLIER_TENDER(id),
    queryFn: () => supplierApi.getTender(id),
  })

  if (isLoading) return <DashboardLayout role="supplier"><SkeletonCard /></DashboardLayout>
  if (!tender) return <DashboardLayout role="supplier"><Alert variant="danger">Tender tidak ditemukan.</Alert></DashboardLayout>

  return (
    <DashboardLayout role="supplier">
      <PageHeader
        title={tender.title}
        breadcrumbs={[{ label: 'Tender Tersedia', to: '/supplier/tenders' }, { label: tender.title }]}
        action={
          canCreateProposal ? (
            <Link to="/supplier/tenders/$id/proposals/create" params={{ id }}>
              <Button><PlusCircle className="w-4 h-4" /> Ajukan Proposal</Button>
            </Link>
          ) : undefined
        }
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Detail Tender</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Deskripsi</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{tender.description}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Kebutuhan</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{tender.needs}</p>
              </div>
              {tender.deliveryLocation && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Lokasi Pengiriman</p>
                  <p className="text-sm text-gray-700">{tender.deliveryLocation}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardContent className="pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Kategori</span>
                <span className="font-medium">{tender.category ?? '-'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tipe</span>
                <Badge variant={tender.openTender ? 'success' : 'neutral'}>
                  {tender.openTender ? 'Terbuka' : 'Tertutup'}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Estimasi Budget</span>
                <span className="font-medium"><MoneyText value={tender.budgetEstimate} /></span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Deadline</span>
                <span className="font-medium"><DateText value={tender.deadline} /></span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Dibuat</span>
                <span className="font-medium"><DateTimeText value={tender.createdAt} /></span>
              </div>
            </CardContent>
          </Card>
          {canCreateProposal && (
            <Link to="/supplier/tenders/$id/proposals/create" params={{ id }}>
              <Button className="w-full"><PlusCircle className="w-4 h-4" /> Ajukan Proposal</Button>
            </Link>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
