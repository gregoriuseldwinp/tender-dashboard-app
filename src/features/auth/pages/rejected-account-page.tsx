import { XCircle } from 'lucide-react'
import { PublicLayout } from '../../../components/layout/public-layout'
import { Button } from '../../../components/ui/button'
import { Card, CardContent } from '../../../components/ui/card'
import { useLogout } from '../hooks'

export function RejectedAccountPage() {
  const logout = useLogout()
  return (
    <PublicLayout>
      <Card>
        <CardContent className="pt-6 text-center">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Akun Ditolak</h2>
          <p className="text-sm text-gray-600 mb-6 max-w-sm mx-auto">
            Maaf, pendaftaran akun Anda tidak dapat disetujui. Silakan hubungi tim kami untuk informasi lebih lanjut.
          </p>
          <Button variant="outline" onClick={() => logout.mutate()} loading={logout.isPending}>
            Keluar
          </Button>
        </CardContent>
      </Card>
    </PublicLayout>
  )
}
