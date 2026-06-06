import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Edit, MessageSquare } from 'lucide-react'
import { supplierApi } from '../api'
import { QUERY_KEYS } from '../../../lib/constants'
import { DashboardLayout } from '../../../components/layout/dashboard-layout'
import { PageHeader } from '../../../components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Alert } from '../../../components/ui/alert'
import { StatusBadge } from '../../../components/shared/status-badge'
import { MoneyText } from '../../../components/shared/money-text'
import { DateTimeText } from '../../../components/shared/date-text'
import { ConfirmDialog } from '../../../components/shared/confirm-dialog'
import { SkeletonCard } from '../../../components/ui/skeleton'
import { useToast } from '../../../components/ui/toast'
import { usePermissions } from '../../auth/hooks'
import { hasPermission } from '../../../lib/auth'

interface Props { id: string }

export function SupplierProposalDetailPage({ id }: Props) {
  const qc = useQueryClient()
  const { success, error: toastError } = useToast()
  const [confirmWithdraw, setConfirmWithdraw] = useState(false)
  const permissions = usePermissions()
  const canUpdate = hasPermission(permissions, 'proposal:update')
  const canNegotiate = hasPermission(permissions, 'negotiation:reply')

  const { data: proposal, isLoading } = useQuery({
    queryKey: QUERY_KEYS.SUPPLIER_PROPOSAL(id),
    queryFn: () => supplierApi.getProposal(id),
  })

  const withdraw = useMutation({
    mutationFn: () => supplierApi.withdrawProposal(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.SUPPLIER_PROPOSAL(id) })
      qc.invalidateQueries({ queryKey: QUERY_KEYS.SUPPLIER_PROPOSALS })
      success('Proposal berhasil ditarik.')
      setConfirmWithdraw(false)
    },
    onError: (e: Error) => { toastError(e.message); setConfirmWithdraw(false) },
  })

  if (isLoading) return <DashboardLayout role="supplier"><SkeletonCard /></DashboardLayout>
  if (!proposal) return <DashboardLayout role="supplier"><Alert variant="danger">Proposal tidak ditemukan.</Alert></DashboardLayout>

  const canEdit = canUpdate && proposal.status === 'submitted'

  return (
    <DashboardLayout role="supplier">
      <PageHeader
        title={proposal.title}
        breadcrumbs={[{ label: 'Proposal Saya', to: '/supplier/proposals' }, { label: proposal.title }]}
        action={
          <div className="flex flex-wrap gap-2">
            {canNegotiate && (
              <Link to="/supplier/proposals/$id/negotiations" params={{ id }}>
                <Button variant="outline"><MessageSquare className="w-4 h-4" /> Negosiasi</Button>
              </Link>
            )}
            {canEdit && (
              <>
                <Link to="/supplier/proposals/$id/edit" params={{ id }}>
                  <Button variant="outline"><Edit className="w-4 h-4" /> Edit</Button>
                </Link>
                <Button variant="danger" onClick={() => setConfirmWithdraw(true)}>Tarik Proposal</Button>
              </>
            )}
          </div>
        }
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
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
        </div>
        <div>
          <Card>
            <CardContent className="pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Harga Penawaran</span>
                <span className="font-medium"><MoneyText value={proposal.priceOffer} /></span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Est. Pengiriman</span>
                <span className="font-medium">{proposal.estimatedDeliveryTime ?? '-'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Diajukan</span>
                <span className="font-medium"><DateTimeText value={proposal.createdAt} /></span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={confirmWithdraw}
        onClose={() => setConfirmWithdraw(false)}
        onConfirm={() => withdraw.mutate()}
        title="Tarik Proposal"
        description="Apakah Anda yakin ingin menarik proposal ini?"
        variant="danger"
        confirmLabel="Tarik Proposal"
        loading={withdraw.isPending}
      />
    </DashboardLayout>
  )
}
