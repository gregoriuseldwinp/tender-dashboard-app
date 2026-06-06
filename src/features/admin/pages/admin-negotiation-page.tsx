import { useQuery } from '@tanstack/react-query'
import { Banknote, Building2, CalendarDays, Tag, Truck } from 'lucide-react'
import { adminApi } from '../api'
import { QUERY_KEYS } from '../../../lib/constants'

import { DashboardLayout } from '../../../components/layout/dashboard-layout'
import { PageHeader } from '../../../components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { NegotiationThread } from '../../../components/shared/negotiation-thread'
import { StatusBadge } from '../../../components/shared/status-badge'
import { MoneyText } from '../../../components/shared/money-text'
import { DateText } from '../../../components/shared/date-text'
import { SkeletonCard } from '../../../components/ui/skeleton'

interface Props { proposalId: string }

export function AdminNegotiationPage({ proposalId }: Props) {
  const { data: proposal, isLoading: proposalLoading } = useQuery({
    queryKey: QUERY_KEYS.ADMIN_PROPOSAL(proposalId),
    queryFn: () => adminApi.getProposal(proposalId),
  })

  const { data: messages = [], isLoading: msgLoading, refetch } = useQuery({
    queryKey: QUERY_KEYS.ADMIN_PROPOSAL_NEGOTIATIONS(proposalId),
    queryFn: () => adminApi.getNegotiations(proposalId),
  })

  const tender = proposal?.tender

  return (
    <DashboardLayout role="internal">
      <PageHeader
        title="Thread Negosiasi"
        breadcrumbs={[
          { label: 'Semua Tender', to: '/admin/tenders' },
          { label: proposal?.title ?? 'Proposal', to: `/admin/tenders` },
          { label: 'Negosiasi' },
        ]}
        description="Tampilan read-only thread negosiasi."
      />

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* Chat */}
        <div className="lg:col-span-2">
          {msgLoading ? <SkeletonCard /> : (
            <Card>
              <CardContent className="py-6">
                <NegotiationThread
                  messages={messages}
                  readOnly
                  onRefresh={() => refetch()}
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Info sidebar */}
        <div className="lg:sticky lg:top-6 space-y-4">
          {proposalLoading ? <SkeletonCard /> : proposal ? (
            <>
              {/* Proposal card */}
              <Card>
                <CardHeader>
                  <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">Proposal</p>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base leading-snug">{proposal.title}</CardTitle>
                    <StatusBadge status={proposal.status} type="proposal" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {proposal.supplier && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building2 className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="font-medium">{proposal.supplier.companyName}</span>
                    </div>
                  )}
                  {proposal.priceOffer && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Banknote className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>Penawaran <span className="font-medium text-gray-800"><MoneyText value={proposal.priceOffer} /></span></span>
                    </div>
                  )}
                  {proposal.estimatedDeliveryTime && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Truck className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>{proposal.estimatedDeliveryTime}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tender card */}
              {tender && (
                <Card>
                  <CardHeader>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Tender Terkait</p>
                    <CardTitle className="text-base leading-snug">{tender.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2.5">
                    {tender.account?.companyName && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building2 className="w-4 h-4 text-gray-400 shrink-0" />
                        <span>Buyer: <span className="font-medium text-gray-800">{tender.account.companyName}</span></span>
                      </div>
                    )}
                    {tender.category && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Tag className="w-4 h-4 text-gray-400 shrink-0" />
                        <span>{tender.category}</span>
                      </div>
                    )}
                    {tender.budgetEstimate && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Banknote className="w-4 h-4 text-gray-400 shrink-0" />
                        <span>Budget <span className="font-medium text-gray-800"><MoneyText value={tender.budgetEstimate} /></span></span>
                      </div>
                    )}
                    {tender.deadline && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CalendarDays className="w-4 h-4 text-gray-400 shrink-0" />
                        <span>Deadline <span className="font-medium text-gray-800"><DateText value={tender.deadline} /></span></span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          ) : null}
        </div>
      </div>
    </DashboardLayout>
  )
}
