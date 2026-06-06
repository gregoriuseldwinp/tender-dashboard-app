import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { authApi } from './api'
import { QUERY_KEYS } from '../../lib/constants'
import { useToast } from '../../components/ui/toast'

export function useLogin() {
  const qc = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (user) => {
      qc.setQueryData(QUERY_KEYS.AUTH_ME, user)
      const status = user.account?.status
      const type = user.account?.accountType
      if (status === 'pending') { navigate({ to: '/account/pending' }); return }
      if (status === 'rejected') { navigate({ to: '/account/rejected' }); return }
      if (status === 'suspended') { navigate({ to: '/account/suspended' }); return }
      if (type === 'buyer') { navigate({ to: '/buyer/dashboard' }); return }
      if (type === 'supplier') { navigate({ to: '/supplier/dashboard' }); return }
      if (type === 'internal') { navigate({ to: '/admin/dashboard' }); return }
    },
  })
}

export function useRegisterBuyer() {
  return useMutation({ mutationFn: authApi.registerBuyer })
}

export function useRegisterSupplier() {
  return useMutation({ mutationFn: authApi.registerSupplier })
}

export function usePermissions(): string[] {
  const { data: permData } = useQuery({
    queryKey: ['auth', 'permissions'],
    queryFn: () => authApi.getPermissions(),
    retry: false,
    staleTime: 5 * 60 * 1000,
  })

  return permData?.permissions ?? []
}

export function useLogout() {
  const qc = useQueryClient()
  const navigate = useNavigate()
  const { success } = useToast()

  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      qc.clear()
      success('Berhasil keluar')
      navigate({ to: '/login' })
    },
  })
}
