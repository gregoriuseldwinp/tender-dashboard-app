import { type ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { FileText, Shield, Zap } from 'lucide-react'

interface PublicLayoutProps {
  children: ReactNode
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Hero side - desktop only */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-700 flex-col justify-between p-12 text-white">
        <div>
          <div className="flex items-center gap-2 mb-12">
            <FileText className="w-7 h-7" />
            <span className="text-xl font-bold">Tender Portal</span>
          </div>
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Platform Pengadaan B2B yang Mudah dan Transparan
          </h1>
          <p className="text-indigo-200 text-lg">
            Hubungkan buyer dan supplier dalam proses tender yang terstruktur, efisien, dan terpercaya.
          </p>
        </div>
        <div className="space-y-4">
          {[
            { icon: Shield, text: 'Proses terverifikasi oleh admin' },
            { icon: Zap, text: 'Negosiasi langsung dalam platform' },
            { icon: FileText, text: 'Semua dokumen dalam satu tempat' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3 text-indigo-100">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-sm">{text}</span>
            </div>
          ))}
        </div>
        <p className="text-indigo-300 text-xs">© 2026 Tender Portal. All rights reserved.</p>
      </div>

      {/* Form side */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden justify-center">
            <FileText className="w-6 h-6 text-indigo-600" />
            <span className="text-lg font-bold text-gray-900">Tender Portal</span>
          </div>

          {children}

          <div className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-gray-500">
            <Link to="/login" className="hover:text-indigo-600 transition-colors">Masuk</Link>
            <span>·</span>
            <Link to="/register/buyer" className="hover:text-indigo-600 transition-colors">Daftar sebagai Buyer</Link>
            <span>·</span>
            <Link to="/register/supplier" className="hover:text-indigo-600 transition-colors">Daftar sebagai Supplier</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
