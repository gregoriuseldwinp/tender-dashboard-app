import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Users, FileText, ChevronRight } from 'lucide-react'
import { adminApi } from '../api'
import { QUERY_KEYS } from '../../../lib/constants'
import { DashboardLayout } from '../../../components/layout/dashboard-layout'
import { PageHeader } from '../../../components/layout/page-header'
import { Card, CardContent } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { SkeletonCard } from '../../../components/ui/skeleton'

export function AdminDashboardPage() {
  const { data: pendingAccounts = [], isLoading: loadingAccounts } = useQuery({
    queryKey: QUERY_KEYS.ADMIN_ACCOUNTS_PENDING,
    queryFn: adminApi.getPendingAccounts,
  })
  const { data: pendingTenders = [], isLoading: loadingTenders } = useQuery({
    queryKey: QUERY_KEYS.ADMIN_TENDERS_PENDING,
    queryFn: adminApi.getPendingTenders,
  })

  const isLoading = loadingAccounts || loadingTenders

  return (
    <DashboardLayout role="internal">
      <PageHeader
        title="Dashboard Admin"
        description="Pastikan akun dan tender yang masuk sudah valid sebelum diberi akses ke marketplace."
      />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <SkeletonCard /><SkeletonCard />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{pendingAccounts.length}</p>
                <p className="text-sm text-gray-500">Akun Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{pendingTenders.length}</p>
                <p className="text-sm text-gray-500">Tender Pending Review</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-6">
        <Card>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Review Akun</h3>
              <Link to="/admin/accounts/pending" className="text-sm text-indigo-600 hover:underline flex items-center gap-1">
                Lihat semua <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              {pendingAccounts.length} akun menunggu persetujuan Anda.
            </p>
            <Link to="/admin/accounts/pending">
              <Button variant="outline" className="w-full"><Users className="w-4 h-4" /> Review Akun</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Review Tender</h3>
              <Link to="/admin/tenders/pending" className="text-sm text-indigo-600 hover:underline flex items-center gap-1">
                Lihat semua <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              {pendingTenders.length} tender menunggu review Anda.
            </p>
            <Link to="/admin/tenders/pending">
              <Button variant="outline" className="w-full"><FileText className="w-4 h-4" /> Review Tender</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
