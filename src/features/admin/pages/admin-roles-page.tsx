import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { PlusCircle, Edit, Trash2, Shield } from 'lucide-react'
import { adminApi } from '../api'
import { QUERY_KEYS } from '../../../lib/constants'
import { DashboardLayout } from '../../../components/layout/dashboard-layout'
import { PageHeader } from '../../../components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Modal } from '../../../components/ui/modal'
import { Input } from '../../../components/ui/input'
import { Textarea } from '../../../components/ui/textarea'
import { Checkbox } from '../../../components/ui/checkbox'
import { FormField } from '../../../components/shared/form-field'
import { Badge } from '../../../components/ui/badge'
import { ConfirmDialog } from '../../../components/shared/confirm-dialog'
import { SkeletonCard } from '../../../components/ui/skeleton'
import { useToast } from '../../../components/ui/toast'
import { roleSchema } from '../schemas'
import { parseZodErrors } from '../../../lib/validation'
import { usePermissions } from '../../auth/hooks'
import { hasPermission as checkAuthPermission } from '../../../lib/auth'
import type { Role, Permission } from '../api'

export function AdminRolesPage() {
  const qc = useQueryClient()
  const { success, error: toastError } = useToast()

  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editRole, setEditRole] = useState<Role | null>(null)
  const [deleteRole, setDeleteRole] = useState<Role | null>(null)
  const [form, setForm] = useState({ name: '', description: '' })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const permissions = usePermissions()
  const canCreate = checkAuthPermission(permissions, 'role:create')
  const canUpdate = checkAuthPermission(permissions, 'role:update')
  const canDelete = checkAuthPermission(permissions, 'role:delete')
  const canAssign = checkAuthPermission(permissions, 'permission:assign')

  const { data: roles = [], isLoading: loadingRoles } = useQuery({
    queryKey: QUERY_KEYS.ADMIN_ROLES,
    queryFn: adminApi.getRoles,
  })
  const { data: allPermissions = [] } = useQuery({
    queryKey: QUERY_KEYS.ADMIN_PERMISSIONS,
    queryFn: adminApi.getPermissions,
  })

  const invalidateRoles = () => qc.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_ROLES })

  const createMut = useMutation({
    mutationFn: adminApi.createRole,
    onSuccess: () => { invalidateRoles(); success('Role dibuat.'); setFormOpen(false); setForm({ name: '', description: '' }) },
    onError: (e: Error) => toastError(e.message),
  })
  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string; description?: string } }) => adminApi.updateRole(id, data),
    onSuccess: () => { invalidateRoles(); success('Role diperbarui.'); setEditRole(null); setForm({ name: '', description: '' }) },
    onError: (e: Error) => toastError(e.message),
  })
  const deleteMut = useMutation({
    mutationFn: (id: string) => adminApi.deleteRole(id),
    onSuccess: () => { invalidateRoles(); success('Role dihapus.'); setDeleteRole(null) },
    onError: (e: Error) => { toastError(e.message); setDeleteRole(null) },
  })
  const addPermMut = useMutation({
    mutationFn: ({ roleId, permId }: { roleId: string; permId: string }) => adminApi.addPermission(roleId, permId),
    onSuccess: () => invalidateRoles(),
    onError: (e: Error) => toastError(e.message),
  })
  const removePermMut = useMutation({
    mutationFn: ({ roleId, permId }: { roleId: string; permId: string }) => adminApi.removePermission(roleId, permId),
    onSuccess: () => invalidateRoles(),
    onError: (e: Error) => toastError(e.message),
  })

  const grouped = allPermissions.reduce<Record<string, Permission[]>>((acc, p) => {
    const [prefix] = p.name.split(':')
    if (!acc[prefix]) acc[prefix] = []
    acc[prefix].push(p)
    return acc
  }, {})

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const result = roleSchema.safeParse(form)
    if (!result.success) { setFormErrors(parseZodErrors(result.error)); return }
    setFormErrors({})
    if (editRole) {
      updateMut.mutate({ id: editRole.id, data: result.data })
    } else {
      createMut.mutate(result.data)
    }
  }

  const openEdit = (role: Role) => {
    setEditRole(role)
    setForm({ name: role.name, description: role.description ?? '' })
    setFormOpen(true)
  }

  const openCreate = () => {
    setEditRole(null)
    setForm({ name: '', description: '' })
    setFormOpen(true)
  }

  const currentRolePerms = selectedRole
    ? (roles.find(r => r.id === selectedRole.id)?.permissions ?? [])
    : []

  const roleHasPerm = (permId: string) => currentRolePerms.some(p => p.id === permId)

  const togglePermission = (perm: Permission) => {
    if (!selectedRole) return
    if (roleHasPerm(perm.id)) {
      removePermMut.mutate({ roleId: selectedRole.id, permId: perm.id })
    } else {
      addPermMut.mutate({ roleId: selectedRole.id, permId: perm.id })
    }
  }

  if (loadingRoles) return <DashboardLayout role="internal"><SkeletonCard /></DashboardLayout>

  return (
    <DashboardLayout role="internal">
      <PageHeader
        title="Role & Permission"
        action={canCreate ? <Button onClick={openCreate}><PlusCircle className="w-4 h-4" /> Buat Role</Button> : undefined}
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Daftar Role</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {roles.map(role => (
                <div key={role.id}
                  className={`flex items-center justify-between px-6 py-4 cursor-pointer transition-colors ${selectedRole?.id === role.id ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}
                  onClick={() => setSelectedRole(role)}
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="font-medium text-sm text-gray-900">{role.name}</p>
                      {role.description && <p className="text-xs text-gray-500">{role.description}</p>}
                    </div>
                    {role.isSystem && <Badge variant="neutral" className="ml-2">System</Badge>}
                  </div>
                  {!role.isSystem && (canUpdate || canDelete) && (
                    <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                      {canUpdate && (
                        <button onClick={() => openEdit(role)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400">
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {canDelete && (
                        <button onClick={() => setDeleteRole(role)} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{selectedRole ? `Permissions: ${selectedRole.name}` : 'Pilih role untuk mengelola permissions'}</CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedRole ? (
              <p className="text-sm text-gray-400">Klik role di sebelah kiri untuk melihat permissions.</p>
            ) : (
              <div className="space-y-4">
                {Object.entries(grouped).map(([prefix, perms]) => (
                  <div key={prefix}>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{prefix}</p>
                    <div className="space-y-1 pl-2">
                      {perms.map(perm => (
                        <Checkbox
                          key={perm.id}
                          id={perm.id}
                          label={perm.name}
                          checked={roleHasPerm(perm.id)}
                          onChange={() => togglePermission(perm)}
                          disabled={selectedRole.isSystem || !canAssign}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Modal open={formOpen} onClose={() => { setFormOpen(false); setEditRole(null) }}
        title={editRole ? 'Edit Role' : 'Buat Role Baru'}>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <FormField label="Nama Role" htmlFor="roleName" error={formErrors.name} required>
            <Input id="roleName" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} error={!!formErrors.name} />
          </FormField>
          <FormField label="Deskripsi" htmlFor="roleDesc">
            <Textarea id="roleDesc" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} minRows={2} />
          </FormField>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => { setFormOpen(false); setEditRole(null) }}>Batal</Button>
            <Button type="submit" loading={createMut.isPending || updateMut.isPending}>
              {editRole ? 'Simpan' : 'Buat Role'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteRole} onClose={() => setDeleteRole(null)}
        onConfirm={() => deleteRole && deleteMut.mutate(deleteRole.id)}
        title="Hapus Role" description={`Apakah Anda yakin ingin menghapus role "${deleteRole?.name}"?`}
        confirmLabel="Hapus" variant="danger" loading={deleteMut.isPending} />
    </DashboardLayout>
  )
}
