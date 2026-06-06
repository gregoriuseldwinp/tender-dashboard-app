import { useEffect, useRef, useState } from 'react'
import { RefreshCw, Send } from 'lucide-react'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { DateTimeText } from './date-text'
import { cn } from '../../lib/cn'
import type { NegotiationMessage } from '../../features/buyer/api'

interface NegotiationThreadProps {
  messages: NegotiationMessage[]
  currentAccountId?: string
  readOnly?: boolean
  onSend?: (message: string) => Promise<void>
  onRefresh?: () => void
  sending?: boolean
}

const LABEL: Record<string, string> = {
  buyer: 'Buyer',
  supplier: 'Supplier',
  internal: 'Admin',
}

const BADGE_STYLE: Record<string, string> = {
  buyer: 'bg-blue-100 text-blue-700',
  supplier: 'bg-emerald-100 text-emerald-700',
  internal: 'bg-purple-100 text-purple-700',
}

const BORDER_COLOR: Record<string, string> = {
  buyer: 'border-l-blue-400',
  supplier: 'border-l-emerald-400',
  internal: 'border-l-purple-400',
}

const AVATAR_COLOR: Record<string, string> = {
  buyer: 'bg-blue-100 text-blue-700',
  supplier: 'bg-emerald-100 text-emerald-700',
  internal: 'bg-purple-100 text-purple-700',
}

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0] ?? '')
    .join('')
    .toUpperCase()
}

export function NegotiationThread({
  messages,
  currentAccountId,
  readOnly = false,
  onSend,
  onRefresh,
  sending = false,
}: NegotiationThreadProps) {
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!text.trim()) { setError('Pesan tidak boleh kosong'); return }
    if (text.trim().length > 5000) { setError('Pesan maksimal 5000 karakter'); return }
    setError('')
    await onSend?.(text.trim())
    setText('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      handleSend()
    }
  }

  const emptyState = (
    <div className="flex flex-col items-center justify-center text-center py-16">
      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-3">
        <Send className="w-5 h-5 text-gray-400" />
      </div>
      <p className="text-sm font-medium text-gray-500">Belum ada pesan</p>
      {!readOnly && <p className="text-xs text-gray-400 mt-1">Mulai diskusi dengan mengirim pesan pertama.</p>}
    </div>
  )

  return (
    <div className="flex flex-col">
      {/* Toolbar */}
      {onRefresh && (
        <div className="flex justify-end mb-3">
          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>
      )}

      {readOnly ? (
        /* Admin badge-timeline view */
        <div className="min-h-[320px] max-h-[540px] overflow-y-auto space-y-2.5">
          {messages.length === 0 ? emptyState : messages.map(msg => {
            const accountType = msg.sender?.accountType ?? 'buyer'
            const displayName = msg.sender?.name ?? msg.sender?.companyName ?? LABEL[accountType] ?? 'Unknown'
            const showCompany = msg.sender?.name && msg.sender?.companyName
              ? msg.sender.companyName
              : null

            return (
              <div
                key={msg.id}
                className={cn('border rounded-lg overflow-hidden border-l-4', BORDER_COLOR[accountType] ?? 'border-l-gray-300')}
              >
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-b border-gray-100 flex-wrap">
                  <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium shrink-0', BADGE_STYLE[accountType] ?? 'bg-gray-100 text-gray-600')}>
                    {LABEL[accountType] ?? accountType}
                  </span>
                  <span className="text-sm font-semibold text-gray-800">{displayName}</span>
                  {showCompany && <span className="text-xs text-gray-500">· {showCompany}</span>}
                  <span className="text-xs text-gray-400 ml-auto">
                    <DateTimeText value={msg.createdAt} />
                  </span>
                </div>
                <div className="px-3 py-2.5 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {msg.message}
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>
      ) : (
        /* WhatsApp bubble view */
        <div className="bg-gray-50 rounded-xl min-h-[320px] max-h-[520px] overflow-y-auto p-4 flex flex-col gap-3">
          {messages.length === 0 ? emptyState : messages.map(msg => {
            const isOwn = currentAccountId
              ? msg.sender?.accountId === currentAccountId
              : false
            const accountType = msg.sender?.accountType ?? 'buyer'
            const displayName = msg.sender?.name ?? msg.sender?.companyName ?? LABEL[accountType] ?? 'Unknown'
            const showCompany = msg.sender?.name && msg.sender?.companyName
              ? msg.sender.companyName
              : null
            const initials = getInitials(displayName)

            return (
              <div
                key={msg.id}
                className={cn('flex items-end gap-2', isOwn ? 'flex-row-reverse' : 'flex-row')}
              >
                {/* Avatar — other party only */}
                {!isOwn && (
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                    showCompany ? 'mb-11' : 'mb-6',
                    AVATAR_COLOR[accountType] ?? 'bg-gray-200 text-gray-600',
                  )}>
                    {initials}
                  </div>
                )}

                {/* Bubble group */}
                <div className={cn('flex flex-col max-w-[72%]', isOwn ? 'items-end' : 'items-start')}>
                  {/* Sender info — other party only */}
                  {!isOwn && (
                    <div className="mb-1 px-1">
                      <p className="text-xs font-semibold text-gray-600 leading-tight">{displayName}</p>
                      {showCompany && <p className="text-xs text-gray-400 leading-tight">{showCompany}</p>}
                    </div>
                  )}

                  {/* Bubble */}
                  <div className={cn(
                    'px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words shadow-sm',
                    isOwn
                      ? 'bg-indigo-600 text-white rounded-2xl rounded-br-sm'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-bl-sm',
                  )}>
                    {msg.message}
                  </div>

                  {/* Timestamp */}
                  <span className="text-xs text-gray-400 mt-1 px-1">
                    <DateTimeText value={msg.createdAt} />
                  </span>
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>
      )}

      {/* Input area */}
      {!readOnly && (
        <div className="mt-3 space-y-2">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Textarea
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tulis pesan…"
                minRows={2}
                error={!!error}
                disabled={sending}
              />
            </div>
            <Button
              onClick={handleSend}
              loading={sending}
              disabled={!text.trim()}
              className="shrink-0 mb-0.5"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex justify-between items-center px-0.5">
            {error
              ? <p className="text-xs text-red-600">{error}</p>
              : <p className="text-xs text-gray-400">Ctrl+Enter untuk kirim</p>
            }
            <span className="text-xs text-gray-400">{text.length}/5000</span>
          </div>
        </div>
      )}
    </div>
  )
}
