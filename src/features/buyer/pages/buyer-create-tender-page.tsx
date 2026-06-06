import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
import { useToast } from '../../../components/ui/toast'
import { buyerApi } from '../api'
import { tenderSchema } from '../schemas'
import { QUERY_KEYS } from '../../../lib/constants'
import { parseZodErrors } from '../../../lib/validation'

export function BuyerCreateTenderPage() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const { success, error: toastError } = useToast()

  const [form, setForm] = useState({
    title: '', description: '', needs: '', openTender: true,
    category: '', budgetEstimate: '', deadline: '', deliveryLocation: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }))

  const mutation = useMutation({
    mutationFn: buyerApi.createTender,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.BUYER_TENDERS })
      success('Tender berhasil dibuat dan sedang menunggu review admin.')
      navigate({ to: '/buyer/tenders' })
    },
    onError: (err: Error) => toastError(err.message || 'Terjadi kesalahan, coba lagi.'),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const result = tenderSchema.safeParse(form)
    if (!result.success) { setErrors(parseZodErrors(result.error)); return }
    setErrors({})

    const payload: Record<string, unknown> = {
      title: form.title,
      description: form.description,
      needs: form.needs,
      openTender: form.openTender,
    }
    if (form.category) payload.category = form.category
    if (form.budgetEstimate) payload.budgetEstimate = parseFloat(form.budgetEstimate)
    if (form.deadline) payload.deadline = new Date(form.deadline).toISOString()
    if (form.deliveryLocation) payload.deliveryLocation = form.deliveryLocation

    mutation.mutate(payload as unknown as Parameters<typeof buyerApi.createTender>[0])
  }

  return (
    <DashboardLayout role="buyer">
      <PageHeader
        title="Buat Tender Baru"
        breadcrumbs={[{ label: 'Tender Saya', to: '/buyer/tenders' }, { label: 'Buat Tender' }]}
      />

      <Alert variant="info" className="mb-6">
        Tender yang dibuat akan diperiksa admin sebelum ditampilkan ke supplier.
      </Alert>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <Card>
          <CardHeader><CardTitle>Informasi Tender</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField label="Judul Tender" htmlFor="title" error={errors.title} required>
              <Input id="title" placeholder="Pengadaan Jasa IT Support 2026" value={form.title} onChange={set('title')} error={!!errors.title} />
            </FormField>
            <FormField label="Deskripsi" htmlFor="description" error={errors.description} required>
              <Textarea id="description" placeholder="Jelaskan latar belakang dan tujuan tender ini..." value={form.description} onChange={set('description')} error={!!errors.description} minRows={4} />
            </FormField>
            <FormField label="Kategori" htmlFor="category">
              <Input id="category" placeholder="IT, Logistik, Konstruksi..." value={form.category} onChange={set('category')} />
            </FormField>
            <Checkbox
              id="openTender"
              label="Tender terbuka (semua supplier dapat melihat)"
              checked={form.openTender}
              onChange={e => setForm(f => ({ ...f, openTender: e.target.checked }))}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Kebutuhan</CardTitle></CardHeader>
          <CardContent>
            <FormField label="Detail Kebutuhan" htmlFor="needs" error={errors.needs} required
              helper="Jelaskan spesifikasi atau persyaratan yang dibutuhkan dari supplier.">
              <Textarea id="needs" placeholder="Kami membutuhkan..." value={form.needs} onChange={set('needs')} error={!!errors.needs} minRows={4} />
            </FormField>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Budget & Deadline</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField label="Estimasi Budget (IDR)" htmlFor="budget" error={errors.budgetEstimate}>
              <Input id="budget" type="number" placeholder="50000000" value={form.budgetEstimate} onChange={set('budgetEstimate')} error={!!errors.budgetEstimate} min={0} />
            </FormField>
            <FormField label="Deadline Pengajuan Proposal" htmlFor="deadline" error={errors.deadline}>
              <Input id="deadline" type="datetime-local" value={form.deadline} onChange={set('deadline')} error={!!errors.deadline} />
            </FormField>
            <FormField label="Lokasi Pengiriman" htmlFor="deliveryLocation" error={errors.deliveryLocation}>
              <Input id="deliveryLocation" placeholder="Jakarta Selatan" value={form.deliveryLocation} onChange={set('deliveryLocation')} />
            </FormField>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Lampiran</CardTitle></CardHeader>
          <CardContent>
            <DisabledUploadField />
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => navigate({ to: '/buyer/tenders' })}>Batal</Button>
          <Button type="submit" loading={mutation.isPending}>Buat Tender</Button>
        </div>
      </form>
    </DashboardLayout>
  )
}
