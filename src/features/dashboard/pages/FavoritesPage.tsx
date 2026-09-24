import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Lightbulb, MessageSquare, UserRound } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { useMessages } from '@/features/messages/MessagesContext'
import { http } from '@/lib/api/http'
import { ENDPOINTS } from '@/lib/api/endpoints'
import type { ApiFavoriteProvider } from '@/lib/api/helpwork.types'
import { staggerContainer, fadeUp } from '@/lib/motion/variants'
import { ProviderProfileModal } from '../components/ProviderProfileModal'

/** Favoritos persistidos por el solicitante. No contiene datos de prueba ni localStorage. */
export default function FavoritesPage() {
  const { abrirChat } = useMessages()
  const [favorites, setFavorites] = useState<ApiFavoriteProvider[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string | null>(null)
  const [error, setError] = useState('')
  const cargar = () => http.get<ApiFavoriteProvider[]>(ENDPOINTS.usuarios.favoritosProveedores).then(setFavorites).catch(cause => { setFavorites([]); setError(cause instanceof Error ? cause.message : 'No se pudieron cargar favoritos.') }).finally(() => setLoading(false))
  useEffect(() => { cargar() }, [])
  const remove = async (providerId: string) => { await http.del(ENDPOINTS.usuarios.favoritoProveedor(providerId)); setFavorites(current => current.filter(item => item.provider_id !== providerId)); if (selected === providerId) setSelected(null) }
  return <div>
    <PageHeader titulo="Favoritos" descripcion="Los HelpWorkers que guardaste para volver a contratar." />
    {loading ? <div className="panel grid min-h-48 place-items-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-100 border-t-brand-500" /></div> : !favorites.length ? <div className="panel"><EmptyState titulo="Aún no tienes favoritos" texto="Desde Matching puedes guardar HelpWorkers con el corazón para verlos aquí." /></div> : <motion.div variants={staggerContainer(0.08)} initial="hidden" animate="show" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {favorites.map((item, index) => { const profile = item.perfil; const service = profile.servicios[0]; const name = profile.perfilProveedor.display_name || profile.usuario.full_name || 'HelpWorker'; const rating = Number(profile.perfilProveedor.average_rating ?? 0); const count = Number(profile.perfilProveedor.review_count ?? 0); return <motion.article key={item.provider_id} variants={fadeUp} className="panel panel-hover flex min-w-0 flex-col p-5"><div className="flex items-start gap-3"><div className="relative shrink-0">{profile.usuario.avatar_url ? <img src={profile.usuario.avatar_url} alt="" className="h-14 w-14 rounded-full object-cover" /> : <span className="grid h-14 w-14 place-items-center rounded-full bg-brand-50 text-brand-600"><UserRound size={25} /></span>}<span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-success-500 ring-2 ring-white" /></div><div className="min-w-0 flex-1"><h3 className="truncate text-[16px] font-bold">{name}</h3><p className="truncate text-[13px] texto-suave">HelpWorker · {profile.perfilProveedor.city || 'Ciudad por definir'}</p><p className="mt-1 flex items-center gap-1 text-[12.5px] text-ink-muted"><Lightbulb size={12} className="text-brand-500" fill="currentColor" /> {rating.toFixed(1)} · {count} reseñas</p></div><button aria-label="Quitar de favoritos" onClick={() => remove(item.provider_id).catch(cause => setError(cause instanceof Error ? cause.message : 'No se pudo quitar favorito.'))} className="shrink-0 rounded-lg p-1.5 text-red-500 transition hover:bg-red-50"><Heart size={18} fill="currentColor" /></button></div><div className="mt-3 flex flex-wrap gap-1.5">{(service?.topic_codes ?? []).slice(0, 3).map(topic => <span key={topic} className="max-w-full truncate rounded-full bg-brand-50 px-2.5 py-1 text-[12px] font-medium text-brand-600">{topic}</span>)}</div><p className="mt-3 text-[14px] font-semibold">{service?.price_min != null || service?.price_max != null ? `$${service?.price_min ?? 0} – $${service?.price_max ?? 0}` : 'Tarifa por definir'}</p><div className="mt-4 flex gap-2 border-t border-white/60 pt-4"><Button size="sm" variant="secondary" fullWidth onClick={() => setSelected(item.provider_id)}>Ver perfil</Button><Button size="sm" fullWidth onClick={() => abrirChat(`favorito-${index}`)}><MessageSquare size={14} /> Chat</Button></div></motion.article> })}
    </motion.div>}
    {error && <p className="mt-3 text-[13px] text-red-600">{error}</p>}
    <ProviderProfileModal providerId={selected} favorite onClose={() => setSelected(null)} onFavoriteChange={async isFavorite => { if (!selected) return; if (!isFavorite) await remove(selected) }} />
  </div>
}
