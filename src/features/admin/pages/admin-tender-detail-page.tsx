import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Building2, FileText, Mail, MapPin, Phone, User } from 'lucide-react'
import { adminApi } from '../api'
import type { TenderProposal } from '../api'
import { QUERY_KEYS } from '../../../lib/constants'
import { DashboardLayout } from '../../../components/layout/dashboard-layout'
import { PageHeader } from '../../../components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Alert } from '../../../components/ui/alert'
import { StatusBadge } from '../../../components/shared/status-badge'
import { MoneyText } from '../../../components/shared/money-text'
import { DateText, DateTimeText } from '../../../components/shared/date-text'
import { DataTable, type Column } from '../../../components/shared/data-table'
import { ConfirmDialog } from '../../../components/shared/confirm-dialog'
import { ReasonDialog } from '../../../components/shared/reason-dialog'
import { SkeletonCard } from '../../../components/ui/skeleton'
import { useToast } from '../../../components/ui/toast'
import { usePermissions } from '../../auth/hooks'
import { hasPermission } from '../../../lib/auth'

interface Props { id: string }

function ProposalsTable({ proposals = [], proposalCount }: { proposals?: TenderProposal[]; proposalCount?: number }) {
  const columns: Column<TenderProposal>[] = [
    { key: 'supplier', header: 'Supplier', render: p => p.supplier ? (
      <div>
        <p className="font-medium text-gray-900 text-sm">{p.supplier.companyName}</p>
        {p.supplier.email && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
            <Mail className="w-3 h-3 shrink-0" />
            <span className="truncate">{p.supplier.email}</span>
          </div>
        )}
      </div>
    ) : <span className="text-gray-400 text-sm">-</span> },
    { key: 'title', header: 'Judul Proposal', render: p => (
      <Link to="/admin/proposals/$proposalId" params={{ proposalId: p.id }} className="font-medium text-indigo-600 hover:underline">
        {p.title}
      </Link>
    )},
    { key: 'price', header: 'Harga Penawaran', render: p => <MoneyText value={p.priceOffer} /> },
    { key: 'delivery', header: 'Est. Waktu', render: p => p.estimatedDeliveryTime ?? '-' },
    { key: 'status', header: 'Status', render: p => <StatusBadge status={p.status} type="proposal" /> },
    { key: 'submittedBy', header: 'Diajukan Oleh', render: p => p.submittedBy ? (
      <div className="flex items-center gap-1.5 text-sm text-gray-700">
        <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <span>{p.submittedBy.name}</span>
      </div>
    ) : <span className="text-gray-400">-</span> },
    { key: 'createdAt', header: 'Tanggal', render: p => <DateText value={p.createdAt} /> },
    { key: 'action', header: '', render: p => (
      <Link to="/admin/proposals/$proposalId" params={{ proposalId: p.id }}>
        <Button size="sm" variant="outline"><FileText className="w-3.5 h-3.5" /> Detail</Button>
      </Link>
    )},
  ]

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-gray-900">
          Proposal Masuk
          {proposalCount !== undefined && (
            <span className="ml-2 text-sm font-normal text-gray-500">({proposalCount})</span>
          )}
        </h2>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <DataTable
          columns={columns}
          data={proposals}
          loading={false}
          keyExtractor={p => p.id}
          emptyTitle="Belum ada proposal"
          emptyDescription="Belum ada supplier yang mengajukan proposal untuk tender ini."
          mobileRender={p => (
            <div className="space-y-2">
              <Link to="/admin/proposals/$proposalId" params={{ proposalId: p.id }}>
                <p className="font-semibold text-indigo-600">{p.title}</p>
              </Link>
              <p className="text-sm text-gray-700">{p.supplier?.companyName ?? '-'}</p>
              <div className="flex items-center justify-between">
                <MoneyText value={p.priceOffer} />
                <StatusBadge status={p.status} type="proposal" />
              </div>
              {p.submittedBy && (
                <p className="text-xs text-gray-500">via {p.submittedBy.name}</p>
              )}
              <Link to="/admin/proposals/$proposalId" params={{ proposalId: p.id }}>
                <Button size="sm" variant="outline" className="w-full mt-1">Lihat Detail</Button>
              </Link>
            </div>
          )}
        />
      </div>
    </div>
  )
}

export function AdminTenderDetailPage({ id }: Props) {
  const qc = useQueryClient()
  const { success, error: toastError } = useToast()
  const [dialog, setDialog] = useState<'approve' | 'reject' | 'close' | 'cancel' | null>(null)
  const permissions = usePermissions()
  const canApprove = hasPermission(permissions, 'tender:approve')
  const canReject = hasPermission(permissions, 'tender:reject')

  const { data: tender, isLoading } = useQuery({
    queryKey: QUERY_KEYS.ADMIN_TENDER(id),
    queryFn: () => adminApi.getTender(id),
  })

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_TENDER(id) })
    qc.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_TENDERS })
    qc.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_TENDERS_PENDING })
  }

  const approve = useMutation({
    mutationFn: () => adminApi.approveTender(id),
    onSuccess: () => { invalidate(); success('Tender dipublikasikan.'); setDialog(null) },
    onError: (e: Error) => { toastError(e.message); setDialog(null) },
  })
  const reject = useMutation({
    mutationFn: (reason: string) => adminApi.rejectTender(id, reason),
    onSuccess: () => { invalidate(); success('Tender ditolak.'); setDialog(null) },
    onError: (e: Error) => { toastError(e.message); setDialog(null) },
  })
  const close = useMutation({
    mutationFn: () => adminApi.closeTender(id),
    onSuccess: () => { invalidate(); success('Tender ditutup.'); setDialog(null) },
    onError: (e: Error) => { toastError(e.message); setDialog(null) },
  })
  const cancel = useMutation({
    mutationFn: () => adminApi.cancelTender(id),
    onSuccess: () => { invalidate(); success('Tender dibatalkan.'); setDialog(null) },
    onError: (e: Error) => { toastError(e.message); setDialog(null) },
  })

  if (isLoading) return <DashboardLayout role="internal"><SkeletonCard /></DashboardLayout>
  if (!tender) return <DashboardLayout role="internal"><Alert variant="danger">Tender tidak ditemukan.</Alert></DashboardLayout>

  return (
    <DashboardLayout role="internal">
      <PageHeader
        title={tender.title}
        breadcrumbs={[{ label: 'Semua Tender', to: '/admin/tenders' }, { label: tender.title }]}
        action={
          <div className="flex flex-wrap gap-2">
            {tender.status === 'pending_review' && (
              <>
                {canApprove && <Button variant="success" onClick={() => setDialog('approve')}>Publish</Button>}
                {canReject && <Button variant="danger" onClick={() => setDialog('reject')}>Tolak</Button>}
              </>
            )}
            {tender.status === 'published' && canApprove && (
              <>
                <Button variant="outline" onClick={() => setDialog('close')}>Tutup Tender</Button>
                <Button variant="danger" onClick={() => setDialog('cancel')}>Batalkan</Button>
              </>
            )}
          </div>
        }
      />

      {tender.status === 'rejected' && tender.rejectionReason && (
        <Alert variant="danger" title="Tender Ditolak" className="mb-6">{tender.rejectionReason}</Alert>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Detail Tender</CardTitle>
                <StatusBadge status={tender.status} type="tender" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Deskripsi</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{tender.description}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Kebutuhan</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{tender.needs}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4">
          {/* Tender meta */}
          <Card>
            <CardContent className="pt-4 space-y-3">
              <div className="flex justify-between text-sm"><span className="text-gray-500">Kategori</span><span className="font-medium">{tender.category ?? '-'}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Budget</span><span className="font-medium"><MoneyText value={tender.budgetEstimate} /></span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Deadline</span><span className="font-medium"><DateText value={tender.deadline} /></span></div>
              {tender.deliveryLocation && (
                <div className="flex justify-between text-sm"><span className="text-gray-500">Lokasi</span><span className="font-medium">{tender.deliveryLocation}</span></div>
              )}
              <div className="flex justify-between text-sm"><span className="text-gray-500">Dibuat</span><span className="font-medium"><DateTimeText value={tender.createdAt} /></span></div>
            </CardContent>
          </Card>

          {/* Buyer company */}
          {(tender.buyer ?? tender.account) && (
            <Card>
              <CardHeader>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Buyer</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">
                      {tender.buyer?.companyName ?? tender.account?.companyName}
                    </p>
                    {tender.buyer?.legalName && tender.buyer.legalName !== tender.buyer.companyName && (
                      <p className="text-xs text-gray-500 truncate">{tender.buyer.legalName}</p>
                    )}
                  </div>
                </div>
              </CardHeader>
              {tender.buyer && (
                <CardContent className="pt-0 space-y-2">
                  {tender.buyer.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">{tender.buyer.email}</span>
                    </div>
                  )}
                  {tender.buyer.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{tender.buyer.phone}</span>
                    </div>
                  )}
                  {tender.buyer.address && (
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                      <span className="break-words">{tender.buyer.address}</span>
                    </div>
                  )}
                  {tender.createdBy && (
                    <>
                      <div className="border-t border-gray-100 my-2" />
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                          <User className="w-3.5 h-3.5 text-gray-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-gray-800">{tender.createdBy.name}</p>
                          <p className="text-xs text-gray-500 truncate">{tender.createdBy.email}</p>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              )}
            </Card>
          )}
        </div>
      </div>

      {/* Proposals section */}
      <ProposalsTable proposals={tender.proposals} proposalCount={tender.proposalCount} />

      <ConfirmDialog open={dialog === 'approve'} onClose={() => setDialog(null)} onConfirm={() => approve.mutate()}
        title="Publish Tender" description="Tender akan dipublikasikan ke semua supplier."
        confirmLabel="Publish" variant="success" loading={approve.isPending} />
      <ReasonDialog open={dialog === 'reject'} onClose={() => setDialog(null)}
        onConfirm={reject.mutate} title="Tolak Tender" loading={reject.isPending} />
      <ConfirmDialog open={dialog === 'close'} onClose={() => setDialog(null)} onConfirm={() => close.mutate()}
        title="Tutup Tender" description="Tender tidak akan menerima proposal baru."
        confirmLabel="Tutup" loading={close.isPending} />
      <ConfirmDialog open={dialog === 'cancel'} onClose={() => setDialog(null)} onConfirm={() => cancel.mutate()}
        title="Batalkan Tender" description="Tender akan dibatalkan permanen."
        confirmLabel="Batalkan" variant="danger" loading={cancel.isPending} />
    </DashboardLayout>
  )
}
