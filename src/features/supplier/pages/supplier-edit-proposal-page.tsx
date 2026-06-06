import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { DashboardLayout } from '../../../components/layout/dashboard-layout'
import { PageHeader } from '../../../components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Textarea } from '../../../components/ui/textarea'
import { FormField } from '../../../components/shared/form-field'
import { DisabledUploadField } from '../../../components/shared/disabled-upload-field'
import { Alert } from '../../../components/ui/alert'
import { SkeletonCard } from '../../../components/ui/skeleton'
import { useToast } from '../../../components/ui/toast'
import { supplierApi } from '../api'
import { proposalSchema } from '../schemas'
import { QUERY_KEYS } from '../../../lib/constants'
import { parseZodErrors } from '../../../lib/validation'

interface Props { id: string }

export function SupplierEditProposalPage({ id }: Props) {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const { success, error: toastError } = useToast()

  const { data: proposal, isLoading } = useQuery({
    queryKey: QUERY_KEYS.SUPPLIER_PROPOSAL(id),
    queryFn: () => supplierApi.getProposal(id),
  })

  const [form, setForm] = useState({
    title: '', description: '', priceOffer: '',
    estimatedDeliveryTime: '', termsAndConditions: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (proposal) {
      setForm({
        title: proposal.title,
        description: proposal.description,
        priceOffer: proposal.priceOffer ? String(proposal.priceOffer) : '',
        estimatedDeliveryTime: proposal.estimatedDeliveryTime ?? '',
        termsAndConditions: proposal.termsAndConditions ?? '',
      })
    }
  }, [proposal])

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }))

  const mutation = useMutation({
    mutationFn: (data: Parameters<typeof supplierApi.updateProposal>[1]) => supplierApi.updateProposal(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.SUPPLIER_PROPOSAL(id) })
      qc.invalidateQueries({ queryKey: QUERY_KEYS.SUPPLIER_PROPOSALS })
      success('Proposal berhasil diperbarui.')
      navigate({ to: '/supplier/proposals/$id', params: { id } })
    },
    onError: (e: Error) => toastError(e.message),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const result = proposalSchema.safeParse(form)
    if (!result.success) { setErrors(parseZodErrors(result.error)); return }
    setErrors({})

    const payload: Record<string, unknown> = {
      title: form.title, description: form.description,
    }
    if (form.priceOffer) payload.priceOffer = parseFloat(form.priceOffer)
    if (form.estimatedDeliveryTime) payload.estimatedDeliveryTime = form.estimatedDeliveryTime
    if (form.termsAndConditions) payload.termsAndConditions = form.termsAndConditions

    mutation.mutate(payload as Parameters<typeof supplierApi.updateProposal>[1])
  }

  if (isLoading) return <DashboardLayout role="supplier"><SkeletonCard /></DashboardLayout>
  if (!proposal || proposal.status !== 'submitted') {
    return <DashboardLayout role="supplier"><Alert variant="warning">Proposal ini tidak dapat diedit.</Alert></DashboardLayout>
  }

  return (
    <DashboardLayout role="supplier">
      <PageHeader
        title="Edit Proposal"
        breadcrumbs={[{ label: 'Proposal Saya', to: '/supplier/proposals' }, { label: proposal.title, to: `/supplier/proposals/${id}` }, { label: 'Edit' }]}
      />
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <Card>
          <CardHeader><CardTitle>Informasi Proposal</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField label="Judul" htmlFor="title" error={errors.title} required>
              <Input id="title" value={form.title} onChange={set('title')} error={!!errors.title} />
            </FormField>
            <FormField label="Deskripsi" htmlFor="description" error={errors.description} required>
              <Textarea id="description" value={form.description} onChange={set('description')} error={!!errors.description} minRows={4} />
            </FormField>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Penawaran</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField label="Harga Penawaran (IDR)" htmlFor="price">
              <Input id="price" type="number" value={form.priceOffer} onChange={set('priceOffer')} min={0} />
            </FormField>
            <FormField label="Estimasi Waktu Pengiriman" htmlFor="delivery">
              <Input id="delivery" value={form.estimatedDeliveryTime} onChange={set('estimatedDeliveryTime')} />
            </FormField>
            <FormField label="Syarat & Ketentuan" htmlFor="terms">
              <Textarea id="terms" value={form.termsAndConditions} onChange={set('termsAndConditions')} minRows={3} />
            </FormField>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Lampiran</CardTitle></CardHeader>
          <CardContent><DisabledUploadField /></CardContent>
        </Card>
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => navigate({ to: '/supplier/proposals/$id', params: { id } })}>Batal</Button>
          <Button type="submit" loading={mutation.isPending}>Simpan</Button>
        </div>
      </form>
    </DashboardLayout>
  )
}
