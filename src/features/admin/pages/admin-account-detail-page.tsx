import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../api'
import { QUERY_KEYS } from '../../../lib/constants'
import { DashboardLayout } from '../../../components/layout/dashboard-layout'
import { PageHeader } from '../../../components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Alert } from '../../../components/ui/alert'
import { StatusBadge } from '../../../components/shared/status-badge'
import { DateTimeText } from '../../../components/shared/date-text'
import { ConfirmDialog } from '../../../components/shared/confirm-dialog'
import { ReasonDialog } from '../../../components/shared/reason-dialog'
import { SkeletonCard } from '../../../components/ui/skeleton'
import { useToast } from '../../../components/ui/toast'
import { usePermissions } from '../../auth/hooks'
import { hasPermission } from '../../../lib/auth'

interface Props { id: string }

export function AdminAccountDetailPage({ id }: Props) {
  const qc = useQueryClient()
  const { success, error: toastError } = useToast()
  const [dialog, setDialog] = useState<'approve' | 'reject' | 'suspend' | null>(null)
  const permissions = usePermissions()
  const canApprove = hasPermission(permissions, 'account:approve')
  const canReject = hasPermission(permissions, 'account:reject')

  const { data: account, isLoading } = useQuery({
    queryKey: QUERY_KEYS.ADMIN_ACCOUNT(id),
    queryFn: () => adminApi.getAccount(id),
  })

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_ACCOUNT(id) })
    qc.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_ACCOUNTS })
    qc.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_ACCOUNTS_PENDING })
  }

  const approve = useMutation({
    mutationFn: () => adminApi.approveAccount(id),
    onSuccess: () => { invalidate(); success('Akun disetujui.'); setDialog(null) },
    onError: (e: Error) => { toastError(e.message); setDialog(null) },
  })
  const reject = useMutation({
    mutationFn: (reason: string) => adminApi.rejectAccount(id, reason),
    onSuccess: () => { invalidate(); success('Akun ditolak.'); setDialog(null) },
    onError: (e: Error) => { toastError(e.message); setDialog(null) },
  })
  const suspend = useMutation({
    mutationFn: () => adminApi.suspendAccount(id),
    onSuccess: () => { invalidate(); success('Akun disuspend.'); setDialog(null) },
    onError: (e: Error) => { toastError(e.message); setDialog(null) },
  })

  if (isLoading) return <DashboardLayout role="internal"><SkeletonCard /></DashboardLayout>
  if (!account) return <DashboardLayout role="internal"><Alert variant="danger">Akun tidak ditemukan.</Alert></DashboardLayout>

  return (
    <DashboardLayout role="internal">
      <PageHeader
        title={account.companyName}
        breadcrumbs={[{ label: 'Semua Akun', to: '/admin/accounts' }, { label: account.companyName }]}
        action={
          <div className="flex gap-2">
            {account.status === 'pending' && (
              <>
                {canApprove && <Button variant="success" onClick={() => setDialog('approve')}>Setujui</Button>}
                {canReject && <Button variant="danger" onClick={() => setDialog('reject')}>Tolak</Button>}
              </>
            )}
            {account.status === 'approved' && canApprove && (
              <Button variant="danger" onClick={() => setDialog('suspend')}>Suspend</Button>
            )}
          </div>
        }
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Profil Akun</CardTitle>
                <StatusBadge status={account.status} type="account" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-500">Nama Legal</span><p className="font-medium">{account.legalName ?? '-'}</p></div>
                <div><span className="text-gray-500">Tipe</span><p className="font-medium capitalize">{account.accountType}</p></div>
                <div><span className="text-gray-500">Email</span><p className="font-medium">{account.email ?? '-'}</p></div>
                <div><span className="text-gray-500">Telepon</span><p className="font-medium">{account.phone ?? '-'}</p></div>
                <div className="col-span-2"><span className="text-gray-500">Alamat</span><p className="font-medium">{account.address ?? '-'}</p></div>
                <div><span className="text-gray-500">Terdaftar</span><p className="font-medium"><DateTimeText value={account.createdAt} /></p></div>
              </div>
            </CardContent>
          </Card>

          {account.users && account.users.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Pengguna</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {account.users.map(u => (
                    <div key={u.id} className="flex items-center justify-between text-sm py-2 border-b border-gray-50 last:border-0">
                      <span className="font-medium">{u.name}</span>
                      <span className="text-gray-500">{u.email}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <ConfirmDialog open={dialog === 'approve'} onClose={() => setDialog(null)}
        onConfirm={() => approve.mutate()} title="Setujui Akun"
        description="Akun akan diaktifkan." variant="success" confirmLabel="Setujui" loading={approve.isPending} />
      <ReasonDialog open={dialog === 'reject'} onClose={() => setDialog(null)}
        onConfirm={reject.mutate} title="Tolak Akun" loading={reject.isPending} />
      <ConfirmDialog open={dialog === 'suspend'} onClose={() => setDialog(null)}
        onConfirm={() => suspend.mutate()} title="Suspend Akun"
        description="Akun akan ditangguhkan." variant="danger" confirmLabel="Suspend" loading={suspend.isPending} />
    </DashboardLayout>
  )
}
