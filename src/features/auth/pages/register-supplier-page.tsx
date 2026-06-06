import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { CheckCircle } from 'lucide-react'
import { PublicLayout } from '../../../components/layout/public-layout'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { FormField } from '../../../components/shared/form-field'
import { PasswordField } from '../../../components/shared/password-field'
import { Card, CardContent } from '../../../components/ui/card'
import { useRegisterSupplier } from '../hooks'
import { registerSchema } from '../schemas'
import { parseZodErrors } from '../../../lib/validation'

export function RegisterSupplierPage() {
  const [form, setForm] = useState({
    companyName: '', legalName: '', email: '', phone: '',
    address: '', ownerName: '', ownerEmail: '', ownerPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [apiError, setApiError] = useState('')
  const [success, setSuccess] = useState(false)
  const register = useRegisterSupplier()

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = registerSchema.safeParse(form)
    if (!result.success) { setErrors(parseZodErrors(result.error)); return }
    setErrors({})
    setApiError('')
    try {
      await register.mutateAsync(result.data)
      setSuccess(true)
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : 'Pendaftaran gagal, coba lagi.')
    }
  }

  if (success) {
    return (
      <PublicLayout>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Pendaftaran Berhasil!</h2>
            <p className="text-sm text-gray-600 mb-6">
              Akun supplier berhasil didaftarkan. Tim admin akan meninjau akun Anda terlebih dahulu.
            </p>
            <Link to="/login">
              <Button className="w-full">Masuk ke Portal</Button>
            </Link>
          </CardContent>
        </Card>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout>
      <Card>
        <CardContent className="pt-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Daftar sebagai Supplier</h2>
            <p className="text-sm text-gray-500 mt-1">Buat akun untuk mengikuti tender dan mengajukan proposal.</p>
          </div>

          {apiError && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Informasi Perusahaan</p>
            <FormField label="Nama Perusahaan" htmlFor="companyName" error={errors.companyName} required>
              <Input id="companyName" placeholder="CV Contoh Supplier" value={form.companyName} onChange={set('companyName')} error={!!errors.companyName} />
            </FormField>
            <FormField label="Nama Legal" htmlFor="legalName">
              <Input id="legalName" placeholder="CV Contoh Supplier Resmi" value={form.legalName} onChange={set('legalName')} />
            </FormField>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Email Perusahaan" htmlFor="companyEmail" error={errors.email}>
                <Input id="companyEmail" type="email" placeholder="info@supplier.com" value={form.email} onChange={set('email')} error={!!errors.email} />
              </FormField>
              <FormField label="Telepon" htmlFor="phone">
                <Input id="phone" placeholder="+62 xxx" value={form.phone} onChange={set('phone')} />
              </FormField>
            </div>
            <FormField label="Alamat" htmlFor="address">
              <Input id="address" placeholder="Jl. Supplier No. 2, Bandung" value={form.address} onChange={set('address')} />
            </FormField>

            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider pt-2">Informasi Pemilik Akun</p>
            <FormField label="Nama Pemilik" htmlFor="ownerName" error={errors.ownerName} required>
              <Input id="ownerName" placeholder="Siti Rahayu" value={form.ownerName} onChange={set('ownerName')} error={!!errors.ownerName} />
            </FormField>
            <FormField label="Email Pemilik" htmlFor="ownerEmail" error={errors.ownerEmail} required>
              <Input id="ownerEmail" type="email" value={form.ownerEmail} onChange={set('ownerEmail')} error={!!errors.ownerEmail} />
            </FormField>
            <FormField label="Password" htmlFor="ownerPassword" error={errors.ownerPassword} required helper="Minimal 8 karakter">
              <PasswordField id="ownerPassword" placeholder="Buat password" value={form.ownerPassword} onChange={set('ownerPassword')} error={!!errors.ownerPassword} />
            </FormField>

            <Button type="submit" className="w-full" size="lg" loading={register.isPending}>
              Daftar sebagai Supplier
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-500">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-indigo-600 font-medium hover:underline">Masuk</Link>
          </p>
        </CardContent>
      </Card>
    </PublicLayout>
  )
}
