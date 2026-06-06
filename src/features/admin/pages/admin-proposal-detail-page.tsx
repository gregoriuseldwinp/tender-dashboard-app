import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Banknote, Building2, CalendarDays, Mail, MapPin, MessageSquare, Phone, Tag, User } from 'lucide-react'
import { adminApi } from '../api'
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

interface Props { proposalId: string }

function InfoRow({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div className="flex gap-3 text-sm">
      <Icon className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
      <div>
        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
        <p className="text-gray-800 font-medium break-words">{value}</p>
      </div>
    </div>
  )
}

export function AdminProposalDetailPage({ proposalId }: Props) {
  const { data: proposal, isLoading } = useQuery({
    queryKey: QUERY_KEYS.ADMIN_PROPOSAL(proposalId),
    queryFn: () => adminApi.getProposal(proposalId),
  })

  if (isLoading) return <DashboardLayout role="internal"><SkeletonCard /></DashboardLayout>
  if (!proposal) return <DashboardLayout role="internal"><Alert variant="danger">Proposal tidak ditemukan.</Alert></DashboardLayout>

  const tender = proposal.tender

  return (
    <DashboardLayout role="internal">
      <PageHeader
        title={proposal.title}
        breadcrumbs={[
          { label: 'Semua Tender', to: '/admin/tenders' },
          tender?.id
            ? { label: tender.title ?? 'Detail Tender', to: `/admin/tenders/${tender.id}` }
            : { label: 'Proposal' },
          { label: proposal.title },
        ]}
        action={
          <Link to="/admin/proposals/$proposalId/negotiations" params={{ proposalId }}>
            <Button variant="outline">
              <MessageSquare className="w-4 h-4" />
              Lihat Negosiasi
            </Button>
          </Link>
        }
      />

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Proposal detail */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Detail Proposal</CardTitle>
                <StatusBadge status={proposal.status} type="proposal" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Deskripsi</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{proposal.description}</p>
              </div>
              {proposal.termsAndConditions && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Syarat & Ketentuan</p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{proposal.termsAndConditions}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tender context */}
          {tender && (
            <Card>
              <CardHeader>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Tender Terkait</p>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">{tender.title}</CardTitle>
                  {tender.id && (
                    <Link to="/admin/tenders/$id" params={{ id: tender.id }}>
                      <Button size="sm" variant="outline">Lihat Tender</Button>
                    </Link>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
                {tender.account?.companyName && (
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    {tender.account.companyName}
                  </div>
                )}
                {tender.category && (
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <Tag className="w-4 h-4 text-gray-400" />
                    {tender.category}
                  </div>
                )}
                {tender.budgetEstimate && (
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <Banknote className="w-4 h-4 text-gray-400" />
                    <MoneyText value={tender.budgetEstimate} />
                  </div>
                )}
                {tender.deadline && (
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <CalendarDays className="w-4 h-4 text-gray-400" />
                    Deadline <DateText value={tender.deadline} />
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Penawaran */}
          <Card>
            <CardHeader><CardTitle className="text-sm">Penawaran</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Harga</span>
                <span className="font-semibold text-gray-900"><MoneyText value={proposal.priceOffer} /></span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Est. Pengiriman</span>
                <span className="font-medium text-gray-700">{proposal.estimatedDeliveryTime ?? '-'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Diajukan</span>
                <span className="font-medium text-gray-700"><DateTimeText value={proposal.createdAt} /></span>
              </div>
            </CardContent>
          </Card>

          {/* Supplier */}
          {proposal.supplier ? (
            <Card>
              <CardHeader>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Supplier</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{proposal.supplier.companyName}</p>
                    {proposal.supplier.legalName && proposal.supplier.legalName !== proposal.supplier.companyName && (
                      <p className="text-xs text-gray-500 truncate">{proposal.supplier.legalName}</p>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2.5 pt-0">
                <InfoRow icon={Mail} label="Email" value={proposal.supplier.email} />
                <InfoRow icon={Phone} label="Telepon" value={proposal.supplier.phone} />
                <InfoRow icon={MapPin} label="Alamat" value={proposal.supplier.address} />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Supplier</span>
                  <span className="text-gray-400">-</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submitted by */}
          {proposal.submittedBy && (
            <Card>
              <CardHeader>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Diajukan Oleh</p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{proposal.submittedBy.name}</p>
                    <p className="text-xs text-gray-500">{proposal.submittedBy.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
