import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { FileText, Clock, CheckCircle, XCircle, PlusCircle } from 'lucide-react'
import { buyerApi } from '../api'
import { QUERY_KEYS } from '../../../lib/constants'
import { DashboardLayout } from '../../../components/layout/dashboard-layout'
import { PageHeader } from '../../../components/layout/page-header'
import { Card, CardContent } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { StatusBadge } from '../../../components/shared/status-badge'
import { DateText } from '../../../components/shared/date-text'
import { SkeletonCard } from '../../../components/ui/skeleton'
import { usePermissions } from '../../auth/hooks'
import { hasPermission } from '../../../lib/auth'

function StatCard({ icon: Icon, label, value, color }: { icon: typeof FileText; label: string; value: number; color: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export function BuyerDashboardPage() {
  const permissions = usePermissions()
  const canCreate = hasPermission(permissions, 'tender:create')

  const { data: tenders = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.BUYER_TENDERS,
    queryFn: buyerApi.getTenders,
  })

  const stats = {
    total: tenders.length,
    pending: tenders.filter(t => t.status === 'pending_review').length,
    published: tenders.filter(t => t.status === 'published').length,
    rejected: tenders.filter(t => t.status === 'rejected').length,
  }

  const latest = tenders.slice(0, 5)

  return (
    <DashboardLayout role="buyer">
      <PageHeader
        title="Dashboard Buyer"
        description="Selamat datang di Tender Portal. Kelola tender Anda di sini."
        action={
          canCreate ? (
            <Link to="/buyer/tenders/create">
              <Button><PlusCircle className="w-4 h-4" /> Buat Tender</Button>
            </Link>
          ) : undefined
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={FileText} label="Total Tender" value={stats.total} color="bg-indigo-50 text-indigo-600" />
          <StatCard icon={Clock} label="Pending Review" value={stats.pending} color="bg-amber-50 text-amber-600" />
          <StatCard icon={CheckCircle} label="Published" value={stats.published} color="bg-green-50 text-green-600" />
          <StatCard icon={XCircle} label="Ditolak" value={stats.rejected} color="bg-red-50 text-red-600" />
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Tender Terbaru</h2>
              <Link to="/buyer/tenders" className="text-sm text-indigo-600 hover:underline">Lihat semua</Link>
            </div>
            <div className="divide-y divide-gray-50">
              {isLoading ? (
                <div className="p-6 space-y-3">
                  {[1,2,3].map(i => <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />)}
                </div>
              ) : latest.length === 0 ? (
                <div className="p-8 text-center text-sm text-gray-500">Belum ada tender</div>
              ) : (
                latest.map(t => (
                  <Link key={t.id} to="/buyer/tenders/$id" params={{ id: t.id }}
                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">{t.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5"><DateText value={t.createdAt} /></p>
                    </div>
                    <StatusBadge status={t.status} type="tender" />
                  </Link>
                ))
              )}
            </div>
          </Card>
        </div>

        {canCreate && (
          <div>
            <Card>
              <CardContent>
                <div className="text-center py-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mx-auto mb-3">
                    <PlusCircle className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Buat Tender Baru</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Buat tender baru untuk mulai mencari supplier terbaik.
                  </p>
                  <Link to="/buyer/tenders/create">
                    <Button className="w-full">Buat Tender</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
