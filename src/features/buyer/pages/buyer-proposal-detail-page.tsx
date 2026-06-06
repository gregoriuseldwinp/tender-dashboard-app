import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Building2, CalendarDays, Mail, MapPin, MessageSquare, Phone, Tag, User, Wallet } from 'lucide-react'
import { buyerApi } from '../api'
import { QUERY_KEYS } from '../../../lib/constants'
import { DashboardLayout } from '../../../components/layout/dashboard-layout'
import { PageHeader } from '../../../components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Modal } from '../../../components/ui/modal'
import { Alert } from '../../../components/ui/alert'
import { StatusBadge } from '../../../components/shared/status-badge'
import { MoneyText } from '../../../components/shared/money-text'
import { DateText, DateTimeText } from '../../../components/shared/date-text'
import { ConfirmDialog } from '../../../components/shared/confirm-dialog'
import { SkeletonCard } from '../../../components/ui/skeleton'
import { useToast } from '../../../components/ui/toast'
import { usePermissions } from '../../auth/hooks'
import { hasPermission } from '../../../lib/auth'
import type { ProposalSupplier, ProposalSubmittedBy } from '../api'

interface Props { id: string }

function InfoRow({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div className="flex gap-3 text-sm">
      <Icon className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
      <div className="min-w-0">
        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
        <p className="text-gray-800 font-medium break-words">{value}</p>
      </div>
    </div>
  )
}

function SupplierModal({
  open,
  onClose,
  supplier,
  submittedBy,
}: {
  open: boolean
  onClose: () => void
  supplier: ProposalSupplier
  submittedBy?: ProposalSubmittedBy | null
}) {
  const initials = supplier.companyName
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()

  return (
    <Modal open={open} onClose={onClose} title="Profil Supplier" className="max-w-lg">
      {/* Avatar + name */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center shrink-0">
          <span className="text-lg font-bold text-indigo-600">{initials}</span>
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-base">{supplier.companyName}</p>
          {supplier.legalName && supplier.legalName !== supplier.companyName && (
            <p className="text-sm text-gray-500 mt-0.5">{supplier.legalName}</p>
          )}
        </div>
      </div>

      {/* Contact info */}
      <div className="space-y-3 mb-6">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Kontak</p>
        <InfoRow icon={Mail} label="Email" value={supplier.email} />
        <InfoRow icon={Phone} label="Telepon" value={supplier.phone} />
        <InfoRow icon={MapPin} label="Alamat" value={supplier.address} />
      </div>

      {/* Submitted by */}
      {submittedBy && (
        <>
          <div className="border-t border-gray-100 my-5" />
          <div className="space-y-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Diajukan oleh</p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{submittedBy.name}</p>
                <p className="text-xs text-gray-500">{submittedBy.email}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </Modal>
  )
}

export function BuyerProposalDetailPage({ id }: Props) {
  const qc = useQueryClient()
  const { success, error: toastError } = useToast()
  const permissions = usePermissions()
  const canApprove = hasPermission(permissions, 'proposal:approve')
  const canReject = hasPermission(permissions, 'proposal:reject')
  const canNegotiate = hasPermission(permissions, 'negotiation:create')

  const [dialog, setDialog] = useState<'shortlist' | 'reject' | 'accept' | null>(null)
  const [supplierModalOpen, setSupplierModalOpen] = useState(false)

  const { data: proposal, isLoading } = useQuery({
    queryKey: QUERY_KEYS.BUYER_PROPOSAL(id),
    queryFn: () => buyerApi.getProposal(id),
  })

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: QUERY_KEYS.BUYER_PROPOSAL(id) })
    if (proposal?.tender?.id) {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.BUYER_TENDER_PROPOSALS(proposal.tender.id) })
    }
  }

  const shortlist = useMutation({
    mutationFn: () => buyerApi.shortlistProposal(id),
    onSuccess: () => { invalidate(); success('Proposal di-shortlist.'); setDialog(null) },
    onError: (e: Error) => { toastError(e.message); setDialog(null) },
  })
  const reject = useMutation({
    mutationFn: () => buyerApi.rejectProposal(id),
    onSuccess: () => { invalidate(); success('Proposal ditolak.'); setDialog(null) },
    onError: (e: Error) => { toastError(e.message); setDialog(null) },
  })
  const accept = useMutation({
    mutationFn: () => buyerApi.acceptProposal(id),
    onSuccess: () => { invalidate(); success('Proposal diterima!'); setDialog(null) },
    onError: (e: Error) => { toastError(e.message); setDialog(null) },
  })

  if (isLoading) return <DashboardLayout role="buyer"><SkeletonCard /></DashboardLayout>
  if (!proposal) return <DashboardLayout role="buyer"><Alert variant="danger">Proposal tidak ditemukan.</Alert></DashboardLayout>

  const tender = proposal.tender

  return (
    <DashboardLayout role="buyer">
      <PageHeader
        title={proposal.title}
        breadcrumbs={[
          { label: 'Tender Saya', to: '/buyer/tenders' },
          tender?.id
            ? { label: tender.title ?? 'Detail Tender', to: `/buyer/tenders/${tender.id}` }
            : { label: 'Proposal' },
          { label: proposal.title },
        ]}
        action={
          <div className="flex flex-wrap gap-2">
            {canNegotiate && (
              <Link to="/buyer/proposals/$id/negotiations" params={{ id }}>
                <Button variant="outline"><MessageSquare className="w-4 h-4" /> Negosiasi</Button>
              </Link>
            )}
            {proposal.status !== 'rejected' && proposal.status !== 'accepted' && proposal.status !== 'withdrawn' && (
              <>
                {canApprove && <Button variant="secondary" onClick={() => setDialog('shortlist')}>Shortlist</Button>}
                {canReject && <Button variant="danger" onClick={() => setDialog('reject')}>Tolak</Button>}
                {canApprove && <Button variant="success" onClick={() => setDialog('accept')}>Terima</Button>}
              </>
            )}
          </div>
        }
      />

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* Main content */}
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

          {/* Tender context */}
          {tender && (
            <Card>
              <CardHeader>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Tender Terkait</p>
                <CardTitle className="text-base">{tender.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
                {tender.category && (
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <Tag className="w-4 h-4 text-gray-400" />
                    {tender.category}
                  </div>
                )}
                {tender.budgetEstimate && (
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <Wallet className="w-4 h-4 text-gray-400" />
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

          {/* Supplier card */}
          {proposal.supplier ? (
            <Card>
              <CardHeader>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Supplier</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{proposal.supplier.companyName}</p>
                    {proposal.supplier.email && (
                      <p className="text-xs text-gray-500 truncate">{proposal.supplier.email}</p>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                {proposal.supplier.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>{proposal.supplier.phone}</span>
                  </div>
                )}
                {proposal.submittedBy && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">via <span className="font-medium">{proposal.submittedBy.name}</span></span>
                  </div>
                )}
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setSupplierModalOpen(true)}
                  >
                    Lihat Profil Lengkap
                  </Button>
                </div>
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
        </div>
      </div>

      {/* Supplier profile modal */}
      {proposal.supplier && (
        <SupplierModal
          open={supplierModalOpen}
          onClose={() => setSupplierModalOpen(false)}
          supplier={proposal.supplier}
          submittedBy={proposal.submittedBy}
        />
      )}

      <ConfirmDialog open={dialog === 'shortlist'} onClose={() => setDialog(null)}
        onConfirm={() => shortlist.mutate()} title="Shortlist Proposal"
        description="Tandai proposal ini sebagai shortlisted?" loading={shortlist.isPending} />
      <ConfirmDialog open={dialog === 'reject'} onClose={() => setDialog(null)}
        onConfirm={() => reject.mutate()} title="Tolak Proposal"
        description="Apakah Anda yakin ingin menolak proposal ini?" variant="danger"
        confirmLabel="Tolak" loading={reject.isPending} />
      <ConfirmDialog open={dialog === 'accept'} onClose={() => setDialog(null)}
        onConfirm={() => accept.mutate()} title="Terima Proposal"
        description="Apakah Anda yakin ingin menerima proposal ini?" variant="success"
        confirmLabel="Terima" loading={accept.isPending} />
    </DashboardLayout>
  )
}
