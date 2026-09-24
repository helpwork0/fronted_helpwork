import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarClock, ChevronRight, FileText, Lightbulb, MapPin, Send, UserRound, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { http } from '@/lib/api/http'
import { ENDPOINTS } from '@/lib/api/endpoints'
import type { ApiProviderOpportunity, ApiPublicRequesterProfile, ApiRequestAttachment, ApiReview } from '@/lib/api/helpwork.types'

type Props = { item: ApiProviderOpportunity | null; onClose: () => void }
const formato = (value?: string | null) => value ? new Intl.DateTimeFormat('es-EC', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Guayaquil' }).format(new Date(value)) : 'Sin fecha límite'

/** Vista detallada privada de una oportunidad; los adjuntos llegan mediante URL temporal autorizada por asignación. */
export function RequesterProposalModal({ item, onClose }: Props) {
  const [profile, setProfile] = useState<ApiPublicRequesterProfile | null>(null)
  const [reviews, setReviews] = useState<ApiReview[]>([])
  const [attachments, setAttachments] = useState<ApiRequestAttachment[]>([])
  const [attachmentsLoading, setAttachmentsLoading] = useState(false)
  const [attachmentIndex, setAttachmentIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [attachmentError, setAttachmentError] = useState('')
  const [error, setError] = useState('')
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [savingReview, setSavingReview] = useState(false)
  const requesterId = item?.requester?.id
  const requestId = item?.request_id
  useEffect(() => {
    if (!item || !requesterId || !requestId) return
    let active = true
    setLoading(true); setAttachmentsLoading(true); setError(''); setAttachmentError(''); setAttachments([]); setAttachmentIndex(0); setRating(0); setComment('')
    Promise.all([
      http.get<ApiPublicRequesterProfile>(ENDPOINTS.usuarios.perfilPublicoSolicitante(requesterId)),
      http.get<ApiReview[]>(ENDPOINTS.moderacion.resenasSolicitante(requesterId)),
    ]).then(([loadedProfile, loadedReviews]) => { if (active) { setProfile(loadedProfile); setReviews(loadedReviews) } }).catch(cause => active && setError(cause instanceof Error ? cause.message : 'No se pudo cargar la propuesta.')).finally(() => active && setLoading(false))
    http.get<ApiRequestAttachment[]>(ENDPOINTS.solicitudes.attachmentsProvider(requestId)).then(files => active && setAttachments(files)).catch(cause => active && setAttachmentError(cause instanceof Error ? cause.message : 'No se pudieron preparar los adjuntos.')).finally(() => active && setAttachmentsLoading(false))
    return () => { active = false }
  }, [item?.id, requesterId, requestId])
  const average = useMemo(() => reviews.length ? reviews.reduce((sum, review) => sum + Number(review.rating), 0) / reviews.length : Number(profile?.perfilSolicitante?.average_rating ?? 0), [reviews, profile])
  const current = attachments[attachmentIndex]
  const submitReview = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!item || !requesterId || !rating) { setError('Selecciona de 1 a 5 focos para valorar.'); return }
    setSavingReview(true); setError('')
    try { await http.post(ENDPOINTS.moderacion.crearResenaSolicitante, { requesterId, rating, comment: comment.trim() || undefined }); setReviews(await http.get<ApiReview[]>(ENDPOINTS.moderacion.resenasSolicitante(requesterId))); setComment('') } catch (cause) { setError(cause instanceof Error ? cause.message : 'No se pudo guardar la reseña.') } finally { setSavingReview(false) }
  }
  const request = item?.service_requests
  return <AnimatePresence>{item && <motion.div role="dialog" aria-modal="true" aria-label="Propuesta de HelpSeeker" onMouseDown={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/30 p-0 backdrop-blur-md sm:items-center sm:p-6"><motion.section onMouseDown={event => event.stopPropagation()} initial={{ opacity: 0, scale: .97, y: 28 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .97, y: 18 }} transition={{ type: 'spring', damping: 25, stiffness: 280 }} className="max-h-[93vh] w-full max-w-5xl overflow-y-auto rounded-t-[30px] border border-white/80 bg-white/92 shadow-2xl backdrop-blur-2xl sm:rounded-[30px]">
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-surface-line bg-white/85 px-5 py-4 backdrop-blur-xl sm:px-7"><div><p className="font-display text-[17px] font-bold">Propuesta recibida</p><p className="text-[12px] texto-suave">Revisa el contexto antes de enviar una propuesta.</p></div><button aria-label="Cerrar propuesta" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full text-ink-muted transition hover:bg-brand-50 hover:text-brand-600"><X size={20} /></button></header>
    {loading ? <div className="grid min-h-72 place-items-center"><div className="h-9 w-9 animate-spin rounded-full border-4 border-brand-100 border-t-brand-500" /></div> : error && !profile ? <p className="p-8 text-center text-red-600">{error}</p> : <div className="grid gap-6 p-5 lg:grid-cols-[minmax(0,1fr)_330px] sm:p-7"><main className="min-w-0 space-y-6"><section className="rounded-3xl bg-gradient-to-br from-brand-50 via-white to-violet-50 p-5"><div className="flex items-start gap-3"><div>{profile?.usuario.avatar_url ? <img src={profile.usuario.avatar_url} alt="" className="h-14 w-14 rounded-2xl object-cover" /> : <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-brand-600 shadow-sm"><UserRound size={25} /></span>}</div><div className="min-w-0"><h2 className="truncate text-[21px] font-extrabold">{profile?.usuario.full_name || item.requester?.full_name || 'HelpSeeker'}</h2><p className="mt-1 flex items-center gap-1.5 text-[13.5px] texto-suave"><MapPin size={13} />{profile?.perfilSolicitante?.city || request?.city || 'Ciudad por definir'} · {profile?.perfilSolicitante?.academic_program || 'Programa no indicado'}</p><p className="mt-2 flex items-center gap-1.5 text-[13px] font-semibold"><Bulbs value={average} size={15} /> {reviews.length || Number(profile?.perfilSolicitante?.review_count ?? 0)} reseñas</p></div></div><div className="mt-5 border-t border-brand-100 pt-4"><p className="text-[12px] font-semibold uppercase tracking-wide text-brand-600">Solicitud</p><h3 className="mt-1 break-words text-[19px] font-bold">{request?.description_free || `Solicitud de ${request?.service_type_code || 'servicio'}`}</h3><p className="mt-3 whitespace-pre-wrap break-words text-[14px] leading-relaxed text-ink-soft">{request?.description_free || 'Sin descripción adicional.'}</p><div className="mt-4 flex flex-wrap gap-2 text-[12.5px]"><span className="rounded-full bg-white px-3 py-1.5 shadow-sm">{request?.modality || 'Modalidad por definir'}</span><span className="rounded-full bg-white px-3 py-1.5 shadow-sm">${request?.budget_min ?? 0} – ${request?.budget_max ?? 0}</span><span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 shadow-sm"><CalendarClock size={13} /> {formato(request?.expires_at)}</span></div></div></section>
      <section><div className="flex items-center justify-between gap-2"><div><h3 className="text-[17px] font-bold">Archivos adjuntos</h3><p className="text-[12.5px] texto-suave">Los enlaces son privados y temporales para esta oportunidad asignada.</p></div>{attachments.length > 1 && <p className="text-[12px] texto-suave">{attachmentIndex + 1} / {attachments.length}</p>}</div>{attachmentsLoading ? <div className="mt-3 grid min-h-64 place-items-center rounded-2xl border border-surface-line bg-slate-50"><div className="text-center"><div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-brand-100 border-t-brand-500" /><p className="mt-3 text-[13px] texto-suave">Preparando archivos adjuntos…</p></div></div> : attachmentError ? <p className="mt-3 rounded-xl bg-amber-50 p-3 text-[13px] text-amber-700">{attachmentError}</p> : !attachments.length ? <p className="mt-3 rounded-2xl border border-dashed border-surface-line p-5 text-[13.5px] texto-suave">No adjuntó archivos a esta solicitud.</p> : <><div className="mt-3 overflow-hidden rounded-2xl border border-surface-line bg-slate-50"><AttachmentViewer attachment={current} /></div><div className="mt-3 flex items-center justify-end gap-2">{attachments.length > 1 && <Button variant="ghost" size="sm" onClick={() => setAttachmentIndex(index => (index + 1) % attachments.length)}>Siguiente <ChevronRight size={15} /></Button>}{current?.url && <a href={current.url} target="_blank" rel="noreferrer" className="text-[13px] font-semibold text-brand-600 hover:underline">Abrir original</a>}</div></>}</section>
      <section><h3 className="text-[17px] font-bold">Reseñas sobre este HelpSeeker</h3>{reviews.length ? <div className="mt-3 space-y-3">{reviews.map(review => <article key={review.id} className="rounded-2xl border border-surface-line bg-white/70 p-4"><div className="flex items-center justify-between gap-2"><b className="text-[14px]">{review.users?.full_name || 'HelpWorker'}</b><span className="text-[12px] texto-suave">{new Date(review.created_at).toLocaleDateString('es-EC')}</span></div><div className="mt-1"><Bulbs value={Number(review.rating)} size={13} /></div><p className="mt-2 text-[13.5px] text-ink-soft">{review.comment || 'Sin comentario adicional.'}</p></article>)}</div> : <p className="mt-3 text-[13.5px] texto-suave">Aún no tiene reseñas publicadas.</p>}</section></main>
      <aside className="space-y-5"><section className="rounded-3xl border border-brand-100 bg-brand-50/45 p-5"><h3 className="font-bold">Perfil público</h3><dl className="mt-4 space-y-3 text-[13.5px]"><Detail label="Nivel académico" value={profile?.perfilSolicitante?.academic_level || request?.academic_level || '—'} /><Detail label="Idiomas" value={profile?.perfilSolicitante?.preferred_languages?.join(', ') || '—'} /><Detail label="Ciudad" value={profile?.perfilSolicitante?.city || request?.city || '—'} /></dl></section><form onSubmit={submitReview} className="rounded-3xl border border-brand-100 bg-white p-5 shadow-sm"><h3 className="font-bold">Tu valoración</h3><p className="mt-1 text-[12.5px] texto-suave">Califica responsabilidad y comunicación.</p><div className="mt-3 flex gap-1">{[1,2,3,4,5].map(value => <button key={value} type="button" aria-label={`${value} focos`} onClick={() => setRating(value)} className="rounded-lg p-1 text-brand-500 hover:bg-brand-50"><Lightbulb size={24} fill={value <= rating ? 'currentColor' : 'none'} /></button>)}</div><textarea value={comment} onChange={event => setComment(event.target.value)} rows={4} placeholder="Comentario opcional" className="mt-3 w-full rounded-xl border border-surface-line bg-slate-50 px-3 py-2.5 text-[13.5px] outline-none focus:border-brand-400" />{error && <p className="mt-2 text-[12px] text-red-600">{error}</p>}<Button type="submit" size="sm" className="mt-3 w-full" disabled={savingReview}>{savingReview ? 'Guardando…' : 'Guardar valoración'}</Button></form><Button fullWidth onClick={() => undefined}><Send size={15} /> Enviar propuesta</Button><Button variant="secondary" fullWidth onClick={onClose}>Cerrar</Button></aside>
    </div>}
  </motion.section></motion.div>}</AnimatePresence>
}

function AttachmentViewer({ attachment }: { attachment?: ApiRequestAttachment }) {
  if (!attachment) return null
  if (attachment.file_kind === 'image') return <img src={attachment.url} alt={attachment.original_name} className="mx-auto max-h-[520px] w-auto max-w-full object-contain" />
  const pdfUrl = attachment.file_kind === 'word' ? attachment.preview_url : attachment.url
  if (!pdfUrl) return <div className="grid min-h-64 place-items-center p-6 text-center"><FileText className="mb-2 text-brand-500" /><p className="text-[13px] texto-suave">El Word se está preparando como PDF. Vuelve a abrir esta oportunidad cuando termine.</p></div>
  return <iframe title={attachment.original_name} src={pdfUrl} className="h-[520px] w-full bg-white" />
}
function Detail({ label, value }: { label: string; value: string }) { return <div><dt className="text-[11.5px] text-ink-muted">{label}</dt><dd className="mt-0.5 font-semibold">{value}</dd></div> }
function Bulbs({ value, size }: { value: number; size: number }) { return <span className="inline-flex gap-0.5 text-brand-500">{[1,2,3,4,5].map(index => <Lightbulb key={index} size={size} fill={index <= Math.round(value) ? 'currentColor' : 'none'} />)}</span> }
