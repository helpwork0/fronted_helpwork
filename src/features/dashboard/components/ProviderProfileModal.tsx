import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarClock, Heart, Lightbulb, MapPin, MessageSquare, UserRound, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { http } from '@/lib/api/http'
import { ENDPOINTS } from '@/lib/api/endpoints'
import type { ApiPublicProviderProfile, ApiReview } from '@/lib/api/helpwork.types'

type CatalogItem = { code: string; name: string }
type Props = {
  providerId: string | null
  favorite?: boolean
  onClose: () => void
  onFavoriteChange?: (favorite: boolean) => Promise<void>
}

const dias = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
const modalidad = (value?: string) => value === 'online' ? 'En línea' : value === 'onsite' ? 'Presencial' : value === 'hybrid' ? 'Híbrida' : value || '—'
const hora = (value: string) => new Date(`2000-01-01T${value}`).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })

/** Modal reutilizable de lectura pública. La reseña solo se habilita cuando existe una solicitud real. */
export function ProviderProfileModal({ providerId, favorite = false, onClose, onFavoriteChange }: Props) {
  const [profile, setProfile] = useState<ApiPublicProviderProfile | null>(null)
  const [reviews, setReviews] = useState<ApiReview[]>([])
  const [fields, setFields] = useState<CatalogItem[]>([])
  const [types, setTypes] = useState<CatalogItem[]>([])
  const [topics, setTopics] = useState<CatalogItem[]>([])
  const [loading, setLoading] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [savingReview, setSavingReview] = useState(false)
  const [error, setError] = useState('')
  const [heartBurst, setHeartBurst] = useState(false)
  const [isFavorite, setIsFavorite] = useState(favorite)

  useEffect(() => { setIsFavorite(favorite) }, [favorite, providerId])

  useEffect(() => {
    if (!providerId) return
    let active = true
    setLoading(true); setError(''); setProfile(null); setReviews([]); setRating(0); setComment('')
    Promise.all([
      http.get<ApiPublicProviderProfile>(ENDPOINTS.usuarios.perfilPublicoProveedor(providerId)),
      http.get<ApiReview[]>(ENDPOINTS.moderacion.resenasProveedor(providerId)),
      http.get<CatalogItem[]>(ENDPOINTS.catalogo.campos),
      http.get<CatalogItem[]>(ENDPOINTS.catalogo.tiposServicio),
    ]).then(async ([loadedProfile, loadedReviews, loadedFields, loadedTypes]) => {
      const fieldCode = loadedProfile.servicios[0]?.field_code
      const loadedTopics = fieldCode ? await http.get<CatalogItem[]>(ENDPOINTS.catalogo.temas(fieldCode)).catch(() => []) : []
      if (!active) return
      setProfile(loadedProfile); setReviews(loadedReviews); setFields(loadedFields); setTypes(loadedTypes); setTopics(loadedTopics)
    }).catch(cause => active && setError(cause instanceof Error ? cause.message : 'No se pudo cargar el perfil.')).finally(() => active && setLoading(false))
    return () => { active = false }
  }, [providerId])

  const promedio = useMemo(() => reviews.length ? reviews.reduce((sum, review) => sum + Number(review.rating), 0) / reviews.length : Number(profile?.perfilProveedor.average_rating ?? 0), [reviews, profile])
  const fieldName = (code?: string) => fields.find(item => item.code === code)?.name ?? code ?? '—'
  const typeName = (code?: string) => types.find(item => item.code === code)?.name ?? code ?? '—'
  const topicName = (code?: string) => topics.find(item => item.code === code)?.name ?? code ?? '—'
  const service = profile?.servicios[0]

  const toggleFavorite = async () => {
    if (!onFavoriteChange) return
    const next = !isFavorite
    setError('')
    try {
      await onFavoriteChange(next); setIsFavorite(next)
      if (next) { setHeartBurst(true); window.setTimeout(() => setHeartBurst(false), 700) }
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'No se pudo actualizar favoritos.') }
  }
  const submitReview = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!providerId || !rating) { setError('Selecciona de 1 a 5 focos para valorar.'); return }
    setSavingReview(true); setError('')
    try {
      await http.post(ENDPOINTS.moderacion.crearResena, { providerId, rating, comment: comment.trim() || undefined })
      setReviews(await http.get<ApiReview[]>(ENDPOINTS.moderacion.resenasProveedor(providerId)))
      setComment('')
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'No se pudo guardar la reseña.') } finally { setSavingReview(false) }
  }

  return <AnimatePresence>{providerId && <motion.div className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/25 p-0 backdrop-blur-md sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose} role="dialog" aria-modal="true" aria-label="Perfil público del HelpWorker">
    <motion.section initial={{ opacity: 0, y: 28, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: .98 }} transition={{ type: 'spring', damping: 25, stiffness: 280 }} onMouseDown={event => event.stopPropagation()} className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-[28px] border border-white/80 bg-white/90 shadow-2xl backdrop-blur-2xl sm:rounded-[28px]">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-surface-line bg-white/80 px-5 py-4 backdrop-blur-xl sm:px-7"><p className="font-display text-[17px] font-bold">Perfil público</p><div className="flex items-center gap-1"><button aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'} onClick={toggleFavorite} className="relative grid h-10 w-10 place-items-center rounded-full text-red-500 transition hover:bg-red-50"><Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />{heartBurst && <motion.span initial={{ opacity: .9, scale: .3 }} animate={{ opacity: 0, scale: 3.2 }} transition={{ duration: .65 }} className="pointer-events-none absolute"><Heart size={34} fill="currentColor" /></motion.span>}</button><button aria-label="Cerrar perfil" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full text-ink-muted transition hover:bg-brand-50 hover:text-brand-600"><X size={20} /></button></div></div>
      {loading ? <div className="grid min-h-72 place-items-center"><div className="h-9 w-9 animate-spin rounded-full border-4 border-brand-100 border-t-brand-500" /></div> : error && !profile ? <div className="p-8 text-center text-red-600">{error}</div> : profile && <div className="space-y-6 p-5 sm:p-7">
        <header className="flex flex-wrap items-center gap-4"><div>{profile.usuario.avatar_url ? <img src={profile.usuario.avatar_url} alt="" className="h-20 w-20 rounded-full object-cover ring-4 ring-brand-50" /> : <span className="grid h-20 w-20 place-items-center rounded-full bg-brand-50 text-brand-600"><UserRound size={34} /></span>}</div><div className="min-w-0 flex-1"><h2 className="truncate text-[25px] font-extrabold">{profile.perfilProveedor.display_name || profile.usuario.full_name || 'HelpWorker'}</h2><p className="mt-1 flex items-center gap-1.5 text-[14px] texto-suave"><MapPin size={14} />{fieldName(service?.field_code)} · {profile.perfilProveedor.city || 'Ciudad por definir'}</p><div className="mt-2 flex items-center gap-1.5 text-[14px] font-semibold"><Lightbulbs value={promedio} size={16} /><span>{promedio.toFixed(1)} · {reviews.length || Number(profile.perfilProveedor.review_count ?? 0)} reseñas</span></div></div></header>
        <section className="rounded-2xl border border-brand-100 bg-brand-50/45 p-4"><h3 className="font-bold">Presentación</h3><dl className="mt-3 grid gap-3 text-[13.5px] sm:grid-cols-2"><Info label="Nombre público" value={profile.perfilProveedor.display_name || profile.usuario.full_name || '—'} /><Info label="Ciudad" value={profile.perfilProveedor.city || '—'} /></dl></section>
        <section><h3 className="text-[17px] font-bold">Servicio que ofrece</h3><div className="mt-3 grid gap-3 sm:grid-cols-2"><Info label="Campo" value={fieldName(service?.field_code)} /><Info label="Tema" value={(service?.topic_codes ?? []).map(topicName).join(', ') || '—'} /><Info label="Tipo de servicio" value={typeName(service?.service_type_code)} /><Info label="Modalidad" value={(service?.modalities ?? []).map(modalidad).join(', ') || '—'} /><Info label="Tarifa desde" value={service?.price_min != null ? `$${service.price_min}` : 'Por definir'} /><Info label="Tarifa hasta" value={service?.price_max != null ? `$${service.price_max}` : 'Por definir'} /></div></section>
        <section><h3 className="text-[17px] font-bold">Disponibilidad y capacidad</h3><div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Info label="Horas por semana" value={String(profile.disponibilidad?.hours_per_week ?? 0)} /><Info label="Horas comprometidas" value={String(profile.disponibilidad?.committed_hours ?? 0)} /><Info label="Máx. servicios" value={String(profile.disponibilidad?.max_concurrent_services ?? 0)} /><Info label="Respuesta (min)" value={String(profile.disponibilidad?.response_window_minutes ?? '—')} /></div><div className="mt-3 rounded-2xl bg-slate-50 p-4"><p className="flex items-center gap-2 text-[13px] font-semibold"><CalendarClock size={15} className="text-brand-600" />Franjas semanales</p><div className="mt-3 grid gap-2 sm:grid-cols-2">{profile.disponibilidad?.weekly_slots?.length ? profile.disponibilidad.weekly_slots.map((slot, index) => <p key={`${slot.dia}-${index}`} className="rounded-xl bg-white px-3 py-2 text-[13px]"><b>{dias[slot.dia] || 'Día'}</b> · {hora(slot.inicio)} – {hora(slot.fin)}</p>) : <p className="text-[13px] texto-suave">No registró franjas todavía.</p>}</div><p className="mt-3 text-[12px] texto-suave">Zona horaria: {profile.disponibilidad?.timezone || 'America/Guayaquil'}.</p></div></section>
        <section><h3 className="text-[17px] font-bold">Reseñas</h3>{reviews.length ? <div className="mt-3 space-y-3">{reviews.map(review => <article key={review.id} className="rounded-2xl border border-surface-line bg-white/70 p-4"><div className="flex gap-3"><div>{review.users?.avatar_url ? <img src={review.users.avatar_url} alt="" className="h-9 w-9 rounded-full object-cover" /> : <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-50 text-brand-600"><UserRound size={16} /></span>}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><b className="text-[14px]">{review.users?.full_name || 'HelpSeeker'}</b><span className="text-[12px] texto-suave">{new Date(review.created_at).toLocaleDateString('es-EC')}</span></div><div className="mt-1"><Lightbulbs value={Number(review.rating)} size={13} /></div><p className="mt-2 text-[13.5px] text-ink-soft">{review.comment || 'Sin comentario adicional.'}</p></div></div></article>)}</div> : <p className="mt-2 text-[13.5px] texto-suave">Aún no tiene reseñas publicadas.</p>}</section>
        <form onSubmit={submitReview} className="rounded-2xl border border-brand-100 bg-brand-50/40 p-4"><h3 className="font-bold">Tu valoración</h3><p className="mt-1 text-[13px] texto-suave">Elige de 1 a 5 focos y deja un comentario opcional.</p><div className="mt-3 flex gap-1">{[1,2,3,4,5].map(value => <button key={value} type="button" onClick={() => setRating(value)} aria-label={`${value} focos`} className="rounded-lg p-1 text-brand-500 transition hover:bg-brand-100"><Lightbulb size={25} fill={value <= rating ? 'currentColor' : 'none'} /></button>)}</div><textarea value={comment} onChange={event => setComment(event.target.value)} rows={3} placeholder="Cuéntale a otras personas cómo fue tu experiencia." className="mt-3 w-full rounded-xl border border-white/90 bg-white/80 px-3 py-2.5 text-[14px] outline-none focus:border-brand-400" />{error && <p className="mt-2 text-[13px] text-red-600">{error}</p>}<Button type="submit" size="sm" className="mt-3" disabled={savingReview}>{savingReview ? 'Guardando…' : 'Guardar valoración'}</Button></form>
        <div className="flex justify-end border-t border-surface-line pt-5"><Button variant="secondary" onClick={onClose}><MessageSquare size={15} /> Cerrar perfil</Button></div>
      </div>}
    </motion.section>
  </motion.div>}</AnimatePresence>
}

function Info({ label, value }: { label: string; value: string }) { return <div className="rounded-xl border border-surface-line bg-white/65 px-3.5 py-3"><p className="text-[11.5px] text-ink-muted">{label}</p><p className="mt-0.5 break-words text-[14px] font-semibold">{value}</p></div> }
function Lightbulbs({ value, size }: { value: number; size: number }) { return <span className="inline-flex gap-0.5 text-brand-500">{[1, 2, 3, 4, 5].map(index => <Lightbulb key={index} size={size} fill={index <= Math.round(value) ? 'currentColor' : 'none'} />)}</span> }
