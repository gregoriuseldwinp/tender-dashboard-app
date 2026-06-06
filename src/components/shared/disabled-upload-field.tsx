import { Paperclip } from 'lucide-react'

export function DisabledUploadField() {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Lampiran
      </label>
      <div
        title="Upload lampiran belum tersedia"
        className="flex items-center gap-2 rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-3 cursor-not-allowed opacity-60"
      >
        <Paperclip className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-400">Pilih file...</span>
      </div>
      <p className="mt-1 text-xs text-gray-400">
        Fitur upload lampiran akan tersedia setelah integrasi storage.
      </p>
    </div>
  )
}
