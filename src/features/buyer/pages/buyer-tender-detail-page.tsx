import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Edit, Users } from 'lucide-react'
import { buyerApi } from '../api'
import { QUERY_KEYS } from '../../../lib/constants'
import { DashboardLayout } from '../../../components/layout/dashboard-layout'
import { PageHeader } from '../../../components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Alert } from '../../../components/ui/alert'
import { StatusBadge } from '../../../components/shared/status-badge'
import { MoneyText } from '../../../components/shared/money-text'
import { DateText, DateTimeText } from '../../../components/shared/date-text'
import { SkeletonCard } from '../../../components/ui/skeleton'
import { usePermissions } from '../../auth/hooks'
import { hasPermission } from '../../../lib/auth'

interface Props { id: string }

export function BuyerTenderDetailPage({ id }: Props) {
  const permissions = usePermissions()
  const canEdit = hasPermission(permissions, 'tender:update')
  const canViewProposals = hasPermission(permissions, 'proposal:read')

  const { data: tender, isLoading } = useQuery({
    queryKey: QUERY_KEYS.BUYER_TENDER(id),
    queryFn: () => buyerApi.getTender(id),
  })

  if (isLoading) return (
    <DashboardLayout role="buyer">
      <div className="space-y-4"><SkeletonCard /><SkeletonCard /></div>
    </DashboardLayout>
  )

  if (!tender) return (
    <DashboardLayout role="buyer">
      <Alert variant="danger">Tender tidak ditemukan.</Alert>
    </DashboardLayout>
  )

  return (
    <DashboardLayout role="buyer">
      <PageHeader
        title={tender.title}
        breadcrumbs={[{ label: 'Tender Saya', to: '/buyer/tenders' }, { label: tender.title }]}
        action={
          <div className="flex gap-2">
            {canEdit && (tender.status === 'draft' || tender.status === 'rejected') && (
              <Link to="/buyer/tenders/$id/edit" params={{ id }}>
                <Button variant="outline"><Edit className="w-4 h-4" /> Edit</Button>
              </Link>
            )}
            {canViewProposals && tender.status === 'published' && (
              <Link to="/buyer/tenders/$id/proposals" params={{ id }}>
                <Button><Users className="w-4 h-4" /> Lihat Proposal Masuk</Button>
              </Link>
            )}
          </div>
        }
      />

      {tender.status === 'rejected' && tender.rejectionReason && (
        <Alert variant="danger" title="Tender Ditolak" className="mb-6">
          {tender.rejectionReason}
        </Alert>
      )}

      {tender.status !== 'published' && tender.status !== 'draft' && tender.status !== 'rejected' && (
        <Alert variant="info" className="mb-6">
          Proposal akan tersedia setelah tender disetujui dan dipublikasikan oleh admin.
        </Alert>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <CardTitle>Detail Tender</CardTitle>
                <StatusBadge status={tender.status} type="tender" />
              </div>
            </CardHeader>
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
                <span className="font-medium text-gray-800">{tender.category ?? '-'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Estimasi Budget</span>
                <span className="font-medium text-gray-800"><MoneyText value={tender.budgetEstimate} /></span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Deadline</span>
                <span className="font-medium text-gray-800"><DateText value={tender.deadline} /></span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tipe</span>
                <span className="font-medium text-gray-800">{tender.openTender ? 'Terbuka' : 'Tertutup'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Dibuat</span>
                <span className="font-medium text-gray-800"><DateTimeText value={tender.createdAt} /></span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
