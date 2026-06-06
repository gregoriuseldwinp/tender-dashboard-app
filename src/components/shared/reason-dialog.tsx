import { useState } from 'react'
import { Modal } from '../ui/modal'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { FormField } from './form-field'

interface ReasonDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: (reason: string) => void
  title: string
  description?: string
  loading?: boolean
}

export function ReasonDialog({ open, onClose, onConfirm, title, description, loading = false }: ReasonDialogProps) {
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  const handleConfirm = () => {
    if (reason.trim().length < 5) {
      setError('Alasan minimal 5 karakter')
      return
    }
    setError('')
    onConfirm(reason.trim())
  }

  const handleClose = () => {
    setReason('')
    setError('')
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title={title}>
      {description && <p className="text-sm text-gray-600 mb-4">{description}</p>}
      <FormField label="Alasan" error={error} required>
        <Textarea
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="Tuliskan alasan penolakan..."
          minRows={3}
          error={!!error}
        />
      </FormField>
      <div className="flex justify-end gap-3 mt-4">
        <Button variant="outline" onClick={handleClose} disabled={loading}>Batal</Button>
        <Button variant="danger" onClick={handleConfirm} loading={loading}>Konfirmasi</Button>
      </div>
    </Modal>
  )
}
