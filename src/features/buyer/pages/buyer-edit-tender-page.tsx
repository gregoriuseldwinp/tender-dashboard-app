import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { DashboardLayout } from '../../../components/layout/dashboard-layout'
import { PageHeader } from '../../../components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Textarea } from '../../../components/ui/textarea'
import { Checkbox } from '../../../components/ui/checkbox'
import { FormField } from '../../../components/shared/form-field'
import { DisabledUploadField } from '../../../components/shared/disabled-upload-field'
import { Alert } from '../../../components/ui/alert'
import { SkeletonCard } from '../../../components/ui/skeleton'
import { useToast } from '../../../components/ui/toast'
import { buyerApi } from '../api'
import { tenderSchema } from '../schemas'
import { QUERY_KEYS } from '../../../lib/constants'
import { parseZodErrors } from '../../../lib/validation'

interface Props { id: string }

export function BuyerEditTenderPage({ id }: Props) {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const { success, error: toastError } = useToast()

  const { data: tender, isLoading } = useQuery({
    queryKey: QUERY_KEYS.BUYER_TENDER(id),
    queryFn: () => buyerApi.getTender(id),
  })

  const [form, setForm] = useState({
    title: '', description: '', needs: '', openTender: true,
    category: '', budgetEstimate: '', deadline: '', deliveryLocation: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (tender) {
      setForm({
        title: tender.title,
        description: tender.description,
        needs: tender.needs,
        openTender: tender.openTender,
        category: tender.category ?? '',
        budgetEstimate: tender.budgetEstimate ? String(tender.budgetEstimate) : '',
        deadline: tender.deadline ? tender.deadline.slice(0, 16) : '',
        deliveryLocation: tender.deliveryLocation ?? '',
      })
    }
  }, [tender])

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }))

  const mutation = useMutation({
    mutationFn: (data: Parameters<typeof buyerApi.updateTender>[1]) => buyerApi.updateTender(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.BUYER_TENDER(id) })
      qc.invalidateQueries({ queryKey: QUERY_KEYS.BUYER_TENDERS })
      success('Tender berhasil diperbarui.')
      navigate({ to: '/buyer/tenders/$id', params: { id } })
    },
    onError: (err: Error) => toastError(err.message || 'Terjadi kesalahan.'),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const result = tenderSchema.safeParse(form)
    if (!result.success) { setErrors(parseZodErrors(result.error)); return }
    setErrors({})

    const payload: Record<string, unknown> = {
      title: form.title, description: form.description,
      needs: form.needs, openTender: form.openTender,
    }
    if (form.category) payload.category = form.category
    if (form.budgetEstimate) payload.budgetEstimate = parseFloat(form.budgetEstimate)
    if (form.deadline) payload.deadline = new Date(form.deadline).toISOString()
    if (form.deliveryLocation) payload.deliveryLocation = form.deliveryLocation

    mutation.mutate(payload as Parameters<typeof buyerApi.updateTender>[1])
  }

  if (isLoading) return <DashboardLayout role="buyer"><SkeletonCard /></DashboardLayout>

  if (!tender || (tender.status !== 'draft' && tender.status !== 'rejected')) {
    return (
      <DashboardLayout role="buyer">
        <Alert variant="warning">Tender ini tidak dapat diedit.</Alert>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="buyer">
      <PageHeader
        title="Edit Tender"
        breadcrumbs={[
          { label: 'Tender Saya', to: '/buyer/tenders' },
          { label: tender.title, to: `/buyer/tenders/${id}` },
          { label: 'Edit' },
        ]}
      />
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <Card>
          <CardHeader><CardTitle>Informasi Tender</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField label="Judul" htmlFor="title" error={errors.title} required>
              <Input id="title" value={form.title} onChange={set('title')} error={!!errors.title} />
            </FormField>
            <FormField label="Deskripsi" htmlFor="description" error={errors.description} required>
              <Textarea id="description" value={form.description} onChange={set('description')} error={!!errors.description} minRows={4} />
            </FormField>
            <FormField label="Kategori" htmlFor="category">
              <Input id="category" value={form.category} onChange={set('category')} />
            </FormField>
            <Checkbox id="openTender" label="Tender terbuka" checked={form.openTender}
              onChange={e => setForm(f => ({ ...f, openTender: e.target.checked }))} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Kebutuhan</CardTitle></CardHeader>
          <CardContent>
            <FormField label="Detail Kebutuhan" htmlFor="needs" error={errors.needs} required>
              <Textarea id="needs" value={form.needs} onChange={set('needs')} error={!!errors.needs} minRows={4} />
            </FormField>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Budget & Deadline</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField label="Estimasi Budget (IDR)" htmlFor="budget">
              <Input id="budget" type="number" value={form.budgetEstimate} onChange={set('budgetEstimate')} min={0} />
            </FormField>
            <FormField label="Deadline" htmlFor="deadline">
              <Input id="deadline" type="datetime-local" value={form.deadline} onChange={set('deadline')} />
            </FormField>
            <FormField label="Lokasi Pengiriman" htmlFor="deliveryLocation">
              <Input id="deliveryLocation" value={form.deliveryLocation} onChange={set('deliveryLocation')} />
            </FormField>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Lampiran</CardTitle></CardHeader>
          <CardContent><DisabledUploadField /></CardContent>
        </Card>
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => navigate({ to: '/buyer/tenders/$id', params: { id } })}>Batal</Button>
          <Button type="submit" loading={mutation.isPending}>Simpan Perubahan</Button>
        </div>
      </form>
    </DashboardLayout>
  )
}
