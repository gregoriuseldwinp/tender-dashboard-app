import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Package, FileText, Star, CheckCircle } from 'lucide-react'
import { supplierApi } from '../api'
import { QUERY_KEYS } from '../../../lib/constants'
import { DashboardLayout } from '../../../components/layout/dashboard-layout'
import { PageHeader } from '../../../components/layout/page-header'
import { Card, CardContent } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { MoneyText } from '../../../components/shared/money-text'
import { DateText } from '../../../components/shared/date-text'
import { SkeletonCard } from '../../../components/ui/skeleton'

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

export function SupplierDashboardPage() {
  const { data: tenders = [], isLoading: loadingTenders } = useQuery({
    queryKey: QUERY_KEYS.SUPPLIER_TENDERS,
    queryFn: supplierApi.getTenders,
  })
  const { data: proposals = [], isLoading: loadingProposals } = useQuery({
    queryKey: QUERY_KEYS.SUPPLIER_PROPOSALS,
    queryFn: supplierApi.getProposals,
  })

  const isLoading = loadingTenders || loadingProposals

  const stats = {
    tenders: tenders.length,
    proposals: proposals.length,
    shortlisted: proposals.filter(p => p.status === 'shortlisted').length,
    accepted: proposals.filter(p => p.status === 'accepted').length,
  }

  return (
    <DashboardLayout role="supplier">
      <PageHeader
        title="Dashboard Supplier"
        description="Cari tender yang cocok dan ajukan proposal terbaik Anda."
      />

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Package} label="Tender Tersedia" value={stats.tenders} color="bg-indigo-50 text-indigo-600" />
          <StatCard icon={FileText} label="Proposal Diajukan" value={stats.proposals} color="bg-blue-50 text-blue-600" />
          <StatCard icon={Star} label="Shortlisted" value={stats.shortlisted} color="bg-amber-50 text-amber-600" />
          <StatCard icon={CheckCircle} label="Diterima" value={stats.accepted} color="bg-green-50 text-green-600" />
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Tender Terbaru</h2>
              <Link to="/supplier/tenders" className="text-sm text-indigo-600 hover:underline">Lihat semua</Link>
            </div>
            <div className="divide-y divide-gray-50">
              {loadingTenders ? (
                <div className="p-6 space-y-3">
                  {[1,2,3].map(i => <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />)}
                </div>
              ) : tenders.slice(0, 5).map(t => (
                <Link key={t.id} to="/supplier/tenders/$id" params={{ id: t.id }}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">{t.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {t.category ?? ''} · <MoneyText value={t.budgetEstimate} /> · <DateText value={t.deadline} />
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </div>

        <div>
          <Card>
            <CardContent>
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mx-auto mb-3">
                  <Package className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Cari Tender</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Cari tender yang cocok dan ajukan proposal terbaik Anda.
                </p>
                <Link to="/supplier/tenders">
                  <Button className="w-full">Lihat Tender</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
