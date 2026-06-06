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
import { DateText } from '../../../components/shared/date-text'
import { ConfirmDialog } from '../../../components/shared/confirm-dialog'
import { ReasonDialog } from '../../../components/shared/reason-dialog'
import { useToast } from '../../../components/ui/toast'
import { usePermissions } from '../../auth/hooks'
import { hasPermission } from '../../../lib/auth'
import type { Account } from '../api'

export function AdminPendingAccountsPage() {
  const qc = useQueryClient()
  const { success, error: toastError } = useToast()
  const [approveId, setApproveId] = useState<string | null>(null)
  const [rejectId, setRejectId] = useState<string | null>(null)
  const permissions = usePermissions()
  const canApprove = hasPermission(permissions, 'account:approve')
  const canReject = hasPermission(permissions, 'account:reject')

  const { data: accounts = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.ADMIN_ACCOUNTS_PENDING,
    queryFn: adminApi.getPendingAccounts,
  })

  const approve = useMutation({
    mutationFn: (id: string) => adminApi.approveAccount(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_ACCOUNTS_PENDING })
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_ACCOUNTS })
      success('Akun disetujui.')
      setApproveId(null)
    },
    onError: (e: Error) => { toastError(e.message); setApproveId(null) },
  })

  const reject = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => adminApi.rejectAccount(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_ACCOUNTS_PENDING })
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_ACCOUNTS })
      success('Akun ditolak.')
      setRejectId(null)
    },
    onError: (e: Error) => { toastError(e.message); setRejectId(null) },
  })

  const columns: Column<Account>[] = [
    { key: 'company', header: 'Perusahaan', render: a => (
      <Link to="/admin/accounts/$id" params={{ id: a.id }} className="font-medium text-indigo-600 hover:underline">
        {a.companyName}
      </Link>
    )},
    { key: 'type', header: 'Tipe', render: a => (
      <span className="capitalize">{a.accountType}</span>
    )},
    { key: 'email', header: 'Email', render: a => a.email ?? '-' },
    { key: 'status', header: 'Status', render: a => <StatusBadge status={a.status} type="account" /> },
    { key: 'createdAt', header: 'Didaftarkan', render: a => <DateText value={a.createdAt} /> },
    { key: 'actions', header: '', render: a => (
      <div className="flex gap-2">
        <Link to="/admin/accounts/$id" params={{ id: a.id }}>
          <Button size="sm" variant="outline">Detail</Button>
        </Link>
        {canApprove && <Button size="sm" variant="success" onClick={() => setApproveId(a.id)}>Setujui</Button>}
        {canReject && <Button size="sm" variant="danger" onClick={() => setRejectId(a.id)}>Tolak</Button>}
      </div>
    )},
  ]

  return (
    <DashboardLayout role="internal">
      <PageHeader title="Akun Pending" description="Tinjau dan setujui atau tolak akun yang menunggu persetujuan." />

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <DataTable
          columns={columns}
          data={accounts}
          loading={isLoading}
          keyExtractor={a => a.id}
          emptyTitle="Tidak ada akun pending"
          emptyDescription="Semua akun sudah ditinjau."
          mobileRender={a => (
            <div className="space-y-2">
              <Link to="/admin/accounts/$id" params={{ id: a.id }}>
                <p className="font-semibold text-indigo-600">{a.companyName}</p>
              </Link>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 capitalize">{a.accountType}</span>
                <StatusBadge status={a.status} type="account" />
              </div>
              {(canApprove || canReject) && (
                <div className="flex gap-2 mt-2">
                  {canApprove && <Button size="sm" variant="success" onClick={() => setApproveId(a.id)} className="flex-1">Setujui</Button>}
                  {canReject && <Button size="sm" variant="danger" onClick={() => setRejectId(a.id)} className="flex-1">Tolak</Button>}
                </div>
              )}
            </div>
          )}
        />
      </div>

      <ConfirmDialog
        open={!!approveId} onClose={() => setApproveId(null)}
        onConfirm={() => approveId && approve.mutate(approveId)}
        title="Setujui Akun" description="Akun akan diaktifkan dan dapat menggunakan platform."
        confirmLabel="Setujui" variant="success" loading={approve.isPending}
      />
      <ReasonDialog
        open={!!rejectId} onClose={() => setRejectId(null)}
        onConfirm={(reason) => rejectId && reject.mutate({ id: rejectId, reason })}
        title="Tolak Akun" loading={reject.isPending}
      />
    </DashboardLayout>
  )
}
