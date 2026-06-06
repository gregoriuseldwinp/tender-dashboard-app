import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CalendarDays, MapPin, Tag, Wallet } from 'lucide-react'
import { DashboardLayout } from '../../../components/layout/dashboard-layout'
import { PageHeader } from '../../../components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Textarea } from '../../../components/ui/textarea'
import { FormField } from '../../../components/shared/form-field'
import { DisabledUploadField } from '../../../components/shared/disabled-upload-field'
import { MoneyText } from '../../../components/shared/money-text'
import { DateText } from '../../../components/shared/date-text'
import { SkeletonCard } from '../../../components/ui/skeleton'
import { useToast } from '../../../components/ui/toast'
import { supplierApi } from '../api'
import { proposalSchema } from '../schemas'
import { QUERY_KEYS } from '../../../lib/constants'
import { parseZodErrors } from '../../../lib/validation'
import { ConflictError } from '../../../lib/api'

interface Props { tenderId: string }

export function SupplierCreateProposalPage({ tenderId }: Props) {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const { success, error: toastError } = useToast()

  const [form, setForm] = useState({
    title: '', description: '', priceOffer: '',
    estimatedDeliveryTime: '', termsAndConditions: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data: tender, isLoading: tenderLoading } = useQuery({
    queryKey: QUERY_KEYS.SUPPLIER_TENDER(tenderId),
    queryFn: () => supplierApi.getTender(tenderId),
  })

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }))

  const mutation = useMutation({
    mutationFn: (data: Parameters<typeof supplierApi.createProposal>[1]) =>
      supplierApi.createProposal(tenderId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.SUPPLIER_PROPOSALS })
      success('Proposal berhasil diajukan.')
      navigate({ to: '/supplier/proposals' })
    },
    onError: (err: Error) => {
      if (err instanceof ConflictError) {
        toastError('Anda sudah mengajukan proposal untuk tender ini.')
      } else {
        toastError(err.message || 'Terjadi kesalahan.')
      }
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const result = proposalSchema.safeParse(form)
    if (!result.success) { setErrors(parseZodErrors(result.error)); return }
    setErrors({})

    const payload: Record<string, unknown> = {
      title: form.title,
      description: form.description,
    }
    if (form.priceOffer) payload.priceOffer = parseFloat(form.priceOffer)
    if (form.estimatedDeliveryTime) payload.estimatedDeliveryTime = form.estimatedDeliveryTime
    if (form.termsAndConditions) payload.termsAndConditions = form.termsAndConditions

    mutation.mutate(payload as unknown as Parameters<typeof supplierApi.createProposal>[1])
  }

  return (
    <DashboardLayout role="supplier">
      <PageHeader
        title="Ajukan Proposal"
        breadcrumbs={[
          { label: 'Tender Tersedia', to: '/supplier/tenders' },
          { label: tender?.title ?? 'Detail Tender', to: `/supplier/tenders/${tenderId}` },
          { label: 'Ajukan Proposal' },
        ]}
      />

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Informasi Proposal</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <FormField label="Judul Proposal" htmlFor="title" error={errors.title} required>
                <Input id="title" placeholder="Penawaran Jasa IT Support 2026" value={form.title} onChange={set('title')} error={!!errors.title} />
              </FormField>
              <FormField label="Deskripsi" htmlFor="description" error={errors.description} required>
                <Textarea id="description" placeholder="Jelaskan solusi dan pendekatan Anda..." value={form.description} onChange={set('description')} error={!!errors.description} minRows={4} />
              </FormField>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Penawaran</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <FormField label="Harga Penawaran (IDR)" htmlFor="price">
                <Input id="price" type="number" placeholder="45000000" value={form.priceOffer} onChange={set('priceOffer')} min={0} />
              </FormField>
              <FormField label="Estimasi Waktu Pengiriman" htmlFor="delivery">
                <Input id="delivery" placeholder="30 hari kerja" value={form.estimatedDeliveryTime} onChange={set('estimatedDeliveryTime')} />
              </FormField>
              <FormField label="Syarat & Ketentuan" htmlFor="terms">
                <Textarea id="terms" placeholder="Tuliskan syarat dan ketentuan penawaran Anda..." value={form.termsAndConditions} onChange={set('termsAndConditions')} minRows={3} />
              </FormField>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Lampiran</CardTitle></CardHeader>
            <CardContent><DisabledUploadField /></CardContent>
          </Card>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => navigate({ to: `/supplier/tenders/${tenderId}` as never })}>Batal</Button>
            <Button type="submit" loading={mutation.isPending}>Ajukan Proposal</Button>
          </div>
        </form>

        {/* Tender info sidebar */}
        <div className="lg:sticky lg:top-6 space-y-4">
          {tenderLoading ? (
            <SkeletonCard />
          ) : tender ? (
            <>
              <Card>
                <CardHeader>
                  <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">Anda melamar untuk</p>
                  <CardTitle className="text-base leading-snug">{tender.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {tender.category && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Tag className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>{tender.category}</span>
                    </div>
                  )}
                  {tender.budgetEstimate && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Wallet className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>Estimasi <span className="font-medium text-gray-800"><MoneyText value={tender.budgetEstimate} /></span></span>
                    </div>
                  )}
                  {tender.deadline && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CalendarDays className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>Deadline <span className="font-medium text-gray-800"><DateText value={tender.deadline} /></span></span>
                    </div>
                  )}
                  {tender.deliveryLocation && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>{tender.deliveryLocation}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-sm">Deskripsi Tender</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap line-clamp-6">{tender.description}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-sm">Kebutuhan</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap line-clamp-6">{tender.needs}</p>
                </CardContent>
              </Card>
            </>
          ) : null}
        </div>
      </div>
    </DashboardLayout>
  )
}
