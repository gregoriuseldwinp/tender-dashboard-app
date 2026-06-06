import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { PublicLayout } from '../../../components/layout/public-layout'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { FormField } from '../../../components/shared/form-field'
import { PasswordField } from '../../../components/shared/password-field'
import { Card, CardContent } from '../../../components/ui/card'
import { useLogin } from '../hooks'
import { loginSchema } from '../schemas'
import { parseZodErrors } from '../../../lib/validation'

export function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [apiError, setApiError] = useState('')
  const login = useLogin()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = loginSchema.safeParse(form)
    if (!result.success) { setErrors(parseZodErrors(result.error)); return }
    setErrors({})
    setApiError('')
    try {
      await login.mutateAsync(result.data)
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : 'Login gagal, coba lagi.')
    }
  }

  return (
    <PublicLayout>
      <Card>
        <CardContent className="pt-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Masuk ke Tender Portal</h2>
            <p className="text-sm text-gray-500 mt-1">Kelola tender, proposal, dan negosiasi dalam satu tempat.</p>
          </div>

          {apiError && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Email" htmlFor="email" error={errors.email} required>
              <Input
                id="email"
                type="email"
                placeholder="email@perusahaan.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                error={!!errors.email}
                autoComplete="email"
              />
            </FormField>

            <FormField label="Password" htmlFor="password" error={errors.password} required>
              <PasswordField
                id="password"
                placeholder="Masukkan password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                error={!!errors.password}
                autoComplete="current-password"
              />
            </FormField>

            <Button type="submit" className="w-full" size="lg" loading={login.isPending}>
              Masuk
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Belum punya akun?{' '}
            <Link to="/register/buyer" className="text-indigo-600 font-medium hover:underline">
              Daftar sebagai Buyer
            </Link>{' '}
            atau{' '}
            <Link to="/register/supplier" className="text-indigo-600 font-medium hover:underline">
              Supplier
            </Link>
          </p>
        </CardContent>
      </Card>
    </PublicLayout>
  )
}
