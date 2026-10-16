import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Send, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { http } from '@/lib/api/http'
import { ENDPOINTS } from '@/lib/api/endpoints'
import type { ApiProviderCompatibleRequest } from '@/lib/api/helpwork.types'

/** Modal breve: enviar una oferta no necesita volver a abrir todo el detalle de la solicitud. */
export function SendProposalModal({ item, onClose, onSent }: { item: ApiProviderCompatibleRequest | null; onClose: () => void; onSent: () => void }) {
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  useEffect(() => { if (item) { setPrice(''); setDescription(''); setError('') } }, [item?.request_id])
  const send = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!item || !Number.isFinite(Number(price)) || Number(price) <= 0) { setError('Indica el precio que cobrarás.'); return }
    setSaving(true); setError('')
    try {
      await http.post(ENDPOINTS.propuestas.create, { requestId: item.request_id, precio: Number(price), descripcion: description.trim() || undefined })
      window.dispatchEvent(new Event('helpwork:propuestas-actualizadas'))
      window.dispatchEvent(new Event('helpwork:notificaciones-actualizadas'))
      onSent(); onClose()
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'No se pudo enviar la propuesta.') } finally { setSaving(false) }
  }
  const title = item?.service_request?.description_free?.slice(0, 70) || 'esta solicitud'
  return <AnimatePresence>{item && <motion.div onMouseDown={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] grid place-items-center bg-slate-950/30 p-5 backdrop-blur-md"><motion.form onMouseDown={event => event.stopPropagation()} onSubmit={send} initial={{ opacity: 0, scale: .94, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .96, y: 12 }} transition={{ type: 'spring', stiffness: 320, damping: 26 }} className="w-full max-w-md rounded-[28px] border border-white/80 bg-white/95 p-6 shadow-2xl backdrop-blur-2xl"><div className="flex items-start justify-between gap-4"><div><p className="font-display text-[19px] font-extrabold">Enviar propuesta</p><p className="mt-1 text-[13px] texto-suave">Para {title}</p></div><button type="button" aria-label="Cerrar" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full text-ink-muted transition hover:bg-brand-50 hover:text-brand-600"><X size={18} /></button></div><label className="mt-5 block text-[13px] font-semibold text-ink-soft">Tu precio por el servicio (USD)<input autoFocus min="0.01" step="0.01" type="number" value={price} onChange={event => setPrice(event.target.value)} placeholder="Ej. 30" className="mt-1.5 w-full rounded-xl border border-surface-line bg-slate-50 px-3 py-3 text-[15px] outline-none focus:border-brand-400" /></label><label className="mt-4 block text-[13px] font-semibold text-ink-soft">Mensaje para el HelpSeeker<textarea rows={5} maxLength={2000} value={description} onChange={event => setDescription(event.target.value)} placeholder="Cuéntale cómo puedes ayudarle." className="mt-1.5 w-full resize-none rounded-xl border border-surface-line bg-slate-50 px-3 py-3 text-[14px] font-normal outline-none focus:border-brand-400" /></label>{error && <p className="mt-3 text-[12.5px] text-red-600">{error}</p>}<Button type="submit" fullWidth className="mt-5" disabled={saving}>{saving ? 'Enviando…' : <><Send size={15} /> Enviar propuesta</>}</Button></motion.form></motion.div>}</AnimatePresence>
}
