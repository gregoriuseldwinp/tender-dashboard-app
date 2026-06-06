import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Banknote, Building2, CalendarDays, Tag, Truck } from 'lucide-react'
import { buyerApi } from '../api'
import type { NegotiationMessage } from '../api'
import { authApi } from '../../auth/api'
import { QUERY_KEYS } from '../../../lib/constants'
import { DashboardLayout } from '../../../components/layout/dashboard-layout'
import { PageHeader } from '../../../components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { NegotiationThread } from '../../../components/shared/negotiation-thread'
import { StatusBadge } from '../../../components/shared/status-badge'
import { MoneyText } from '../../../components/shared/money-text'
import { DateText } from '../../../components/shared/date-text'
import { SkeletonCard } from '../../../components/ui/skeleton'
import { useToast } from '../../../components/ui/toast'

interface Props { proposalId: string }

export function BuyerNegotiationPage({ proposalId }: Props) {
  const qc = useQueryClient()
  const { error: toastError } = useToast()

  const { data: user } = useQuery({
    queryKey: QUERY_KEYS.AUTH_ME,
    queryFn: () => authApi.me(),
  })

  const { data: proposal, isLoading: proposalLoading } = useQuery({
    queryKey: QUERY_KEYS.BUYER_PROPOSAL(proposalId),
    queryFn: () => buyerApi.getProposal(proposalId),
  })

  const { data: messages = [], isLoading: msgLoading, refetch } = useQuery({
    queryKey: QUERY_KEYS.BUYER_PROPOSAL_NEGOTIATIONS(proposalId),
    queryFn: () => buyerApi.getNegotiations(proposalId),
  })

  const send = useMutation({
    mutationFn: (msg: string) => buyerApi.sendNegotiation(proposalId, msg),
    onSuccess: (newMsg) => {
      qc.setQueryData(
        QUERY_KEYS.BUYER_PROPOSAL_NEGOTIATIONS(proposalId),
        (old: NegotiationMessage[] = []) => [...old, newMsg],
      )
    },
    onError: (e: Error) => toastError(e.message),
  })

  const tender = proposal?.tender

  return (
    <DashboardLayout role="buyer">
      <PageHeader
        title="Negosiasi"
        breadcrumbs={[
          { label: 'Tender Saya', to: '/buyer/tenders' },
          { label: proposal?.title ?? 'Proposal', to: `/buyer/proposals/${proposalId}` },
          { label: 'Negosiasi' },
        ]}
      />

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* Chat */}
        <div className="lg:col-span-2">
          {msgLoading ? <SkeletonCard /> : (
            <Card>
              <CardContent className="py-6">
                <NegotiationThread
                  messages={messages}
                  currentAccountId={user?.account?.id}
                  onSend={async (msg) => { await send.mutateAsync(msg) }}
                  onRefresh={() => refetch()}
                  sending={send.isPending}
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
                      <span>{proposal.supplier.companyName}</span>
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
