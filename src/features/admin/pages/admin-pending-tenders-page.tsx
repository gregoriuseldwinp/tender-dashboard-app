import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { adminApi } from '../api'
import { QUERY_KEYS } from '../../../lib/constants'
import { DashboardLayout } from '../../../components/layout/dashboard-layout'
import { PageHeader } from '../../../components/layout/page-header'
import { Button } from '../../../components/ui/button'
import { DataTable, type Column } from '../../../components/shared/data-table'
import { StatusBadge } from '../../../components/shared/status-badge'
import { MoneyText } from '../../../components/shared/money-text'
import { DateText } from '../../../components/shared/date-text'
import { ConfirmDialog } from '../../../components/shared/confirm-dialog'
import { ReasonDialog } from '../../../components/shared/reason-dialog'
import { useToast } from '../../../components/ui/toast'
import { usePermissions } from '../../auth/hooks'
import { hasPermission } from '../../../lib/auth'
import type { Tender } from '../api'

export function AdminPendingTendersPage() {
  const qc = useQueryClient()
  const { success, error: toastError } = useToast()
  const [approveId, setApproveId] = useState<string | null>(null)
  const [rejectId, setRejectId] = useState<string | null>(null)
  const permissions = usePermissions()
  const canApprove = hasPermission(permissions, 'tender:approve')
  const canReject = hasPermission(permissions, 'tender:reject')

  const { data: tenders = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.ADMIN_TENDERS_PENDING,
    queryFn: adminApi.getPendingTenders,
  })

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_TENDERS_PENDING })
    qc.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_TENDERS })
  }

  const approve = useMutation({
    mutationFn: (id: string) => adminApi.approveTender(id),
    onSuccess: () => { invalidate(); success('Tender dipublikasikan.'); setApproveId(null) },
    onError: (e: Error) => { toastError(e.message); setApproveId(null) },
  })
  const reject = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => adminApi.rejectTender(id, reason),
    onSuccess: () => { invalidate(); success('Tender ditolak.'); setRejectId(null) },
    onError: (e: Error) => { toastError(e.message); setRejectId(null) },
  })

  const columns: Column<Tender>[] = [
    { key: 'title', header: 'Judul', render: t => (
      <Link to="/admin/tenders/$id" params={{ id: t.id }} className="font-medium text-indigo-600 hover:underline">{t.title}</Link>
    )},
    { key: 'account', header: 'Buyer', render: t => t.account?.companyName ?? '-' },
    { key: 'budget', header: 'Budget', render: t => <MoneyText value={t.budgetEstimate} /> },
    { key: 'deadline', header: 'Deadline', render: t => <DateText value={t.deadline} /> },
    { key: 'status', header: 'Status', render: t => <StatusBadge status={t.status} type="tender" /> },
    { key: 'actions', header: '', render: t => (
      <div className="flex gap-2">
        {canApprove && <Button size="sm" variant="success" onClick={() => setApproveId(t.id)}>Publish</Button>}
        {canReject && <Button size="sm" variant="danger" onClick={() => setRejectId(t.id)}>Tolak</Button>}
      </div>
    )},
  ]

  return (
    <DashboardLayout role="internal">
      <PageHeader title="Tender Pending Review" />
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <DataTable
          columns={columns}
          data={tenders}
          loading={isLoading}
          keyExtractor={t => t.id}
          emptyTitle="Tidak ada tender pending"
          emptyDescription="Semua tender sudah ditinjau."
          mobileRender={t => (
            <div className="space-y-2">
              <Link to="/admin/tenders/$id" params={{ id: t.id }}>
                <p className="font-semibold text-indigo-600">{t.title}</p>
              </Link>
              <p className="text-sm text-gray-500">{t.account?.companyName ?? '-'}</p>
              {(canApprove || canReject) && (
                <div className="flex gap-2 mt-2">
                  {canApprove && <Button size="sm" variant="success" onClick={() => setApproveId(t.id)} className="flex-1">Publish</Button>}
                  {canReject && <Button size="sm" variant="danger" onClick={() => setRejectId(t.id)} className="flex-1">Tolak</Button>}
                </div>
              )}
            </div>
          )}
        />
      </div>
      <ConfirmDialog open={!!approveId} onClose={() => setApproveId(null)}
        onConfirm={() => approveId && approve.mutate(approveId)}
        title="Publish Tender" description="Tender akan dipublikasikan ke semua supplier."
        confirmLabel="Publish" variant="success" loading={approve.isPending} />
      <ReasonDialog open={!!rejectId} onClose={() => setRejectId(null)}
        onConfirm={(reason) => rejectId && reject.mutate({ id: rejectId, reason })}
        title="Tolak Tender" loading={reject.isPending} />
    </DashboardLayout>
  )
}
