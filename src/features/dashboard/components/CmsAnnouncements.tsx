import { useEffect, useState } from 'react'
import { Megaphone } from 'lucide-react'
import { http } from '@/lib/api/http'
import { ENDPOINTS } from '@/lib/api/endpoints'

type Announcement = { id: string; content_key: string; title: string; body: string; image_url?: string | null; published_at?: string | null }

export function CmsAnnouncements() {
  const [items, setItems] = useState<Announcement[]>([])
  useEffect(() => { http.get<Announcement[]>(ENDPOINTS.contenido.publico()).then(rows => setItems(rows.filter(row => row.content_key.startsWith('announcement_')).slice(0, 3))).catch(() => setItems([])) }, [])
  if (!items.length) return null
  return <section className="space-y-3">{items.map(item => <article key={item.id} className="panel overflow-hidden p-0"><div className="flex flex-col sm:flex-row">{item.image_url && <img src={item.image_url} alt="" className="h-36 w-full object-cover sm:h-auto sm:w-44" />}<div className="p-5"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600"><Megaphone size={14} /> Novedad HelpWork</p><h2 className="mt-2 text-lg font-bold">{item.title}</h2><p className="mt-1 whitespace-pre-wrap text-sm leading-6 texto-suave">{item.body}</p></div></div></article>)}</section>
}
