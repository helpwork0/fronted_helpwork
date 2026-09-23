import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Lightbulb, UserRound } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { AnimatedNumber } from '../components/AnimatedNumber'
import { EmptyState } from '@/components/ui/EmptyState'
import { http } from '@/lib/api/http'
import { ENDPOINTS } from '@/lib/api/endpoints'
import type { ApiReview } from '@/lib/api/helpwork.types'
import { staggerContainer, fadeUp } from '@/lib/motion/variants'

/** Las reseñas son lectura real del proveedor; el rating mostrado alimenta el matching. */
export default function ReviewsPage({ modo = 'helpworker' }: { modo?: 'helpworker' | 'solicitante' }) {
  const [reviews, setReviews] = useState<ApiReview[]>([]); const [loading, setLoading] = useState(true)
  useEffect(() => { http.get<ApiReview[]>(modo === 'solicitante' ? ENDPOINTS.moderacion.resenasSolicitanteMias : ENDPOINTS.moderacion.resenasMias).then(setReviews).catch(() => setReviews([])).finally(() => setLoading(false)) }, [modo])
  const average = useMemo(() => reviews.length ? reviews.reduce((sum, review) => sum + Number(review.rating), 0) / reviews.length : 0, [reviews])
  const distribution = [5, 4, 3, 2, 1].map(stars => ({ stars, count: reviews.filter(review => Number(review.rating) === stars).length }))
  return <div><PageHeader titulo="Reseñas" descripcion={modo === 'solicitante' ? 'Comentarios de HelpWorkers sobre tu comunicación y responsabilidad.' : 'Comentarios reales de quienes trabajaron contigo.'} />
    {loading ? <div className="panel grid min-h-48 place-items-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-100 border-t-brand-500" /></div> : <div className="grid gap-5 lg:grid-cols-[300px_1fr]"><aside className="panel h-fit p-6 text-center"><p className="text-[52px] font-extrabold leading-none"><AnimatedNumber valor={average} decimales={1} /></p><div className="mt-2 flex justify-center gap-0.5">{[1,2,3,4,5].map(star => <Lightbulb key={star} size={18} className="text-brand-500" fill={star <= Math.round(average) ? 'currentColor' : 'none'} />)}</div><p className="mt-1.5 text-[13.5px] texto-suave">{reviews.length} reseñas publicadas</p><div className="mt-5 space-y-2 border-t border-white/60 pt-4">{distribution.map(item => <div key={item.stars} className="flex items-center gap-2 text-[12.5px]"><span className="w-3 text-right texto-suave">{item.stars}</span><Lightbulb size={11} className="text-brand-500" fill="currentColor" /><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-black/[.07]"><motion.div className="h-full rounded-full bg-brand-500" initial={{ width: 0 }} animate={{ width: `${reviews.length ? (item.count / reviews.length) * 100 : 0}%` }} /></div><span className="w-4 text-ink-muted">{item.count}</span></div>)}</div></aside>
      {!reviews.length ? <div className="panel"><EmptyState titulo="Aún no tienes reseñas" texto="Cuando una persona publique una reseña sobre un servicio terminado, aparecerá aquí y actualizará tu reputación." /></div> : <motion.div variants={staggerContainer(.08)} initial="hidden" animate="show" className="grid gap-3">{reviews.map(review => <motion.article key={review.id} variants={fadeUp} className="panel panel-hover p-5"><div className="flex gap-3.5">{review.users?.avatar_url ? <img src={review.users.avatar_url} alt="" className="h-12 w-12 rounded-full object-cover" /> : <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-50 text-brand-600"><UserRound size={20} /></span>}<div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-bold">{review.users?.full_name ?? 'Usuario Help Work'}</h3><span className="text-[12px] text-ink-muted">{new Date(review.created_at).toLocaleDateString('es-EC')}</span></div><div className="mt-1 flex gap-.5">{[1,2,3,4,5].map(star => <Lightbulb key={star} size={13} className="text-brand-500" fill={star <= review.rating ? 'currentColor' : 'none'} />)}</div><p className="mt-2.5 text-[14px] leading-relaxed text-ink-soft">{review.comment || 'Sin comentario adicional.'}</p></div></div></motion.article>)}</motion.div>}</div>}
  </div>
}
