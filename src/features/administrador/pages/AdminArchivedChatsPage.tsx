import { useEffect, useState } from 'react'
import { Archive, ChevronDown, Search, UserRound } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { http } from '@/lib/api/http'
import { ENDPOINTS } from '@/lib/api/endpoints'

type DirectoryUser = { id: string; full_name?: string | null; email?: string | null; avatar_url?: string | null }
type DirectoryResponse = { items: DirectoryUser[]; nextOffset: number | null; total: number }
type Archived = { id: string; body: string; sender_id?: string | null; is_system?: boolean; created_at: string; archived_at: string }

function UserChoice({ user, selected, onClick }: { user: DirectoryUser; selected: boolean; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={`flex w-full items-center gap-3 border-b border-surface-line/70 px-3 py-2.5 text-left transition ${selected ? 'bg-brand-50 ring-1 ring-inset ring-brand-300' : 'hover:bg-white/70'}`}>
    {user.avatar_url ? <img src={user.avatar_url} alt="" className="h-8 w-8 rounded-full object-cover" /> : <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-100 text-brand-700"><UserRound size={15} /></span>}
    <span className="min-w-0"><span className="block truncate text-[13px] font-semibold text-ink">{user.full_name || 'Usuario sin nombre'}</span><span className="block truncate text-[11px] text-ink-muted">{user.email || user.id}</span></span>
  </button>
}

export default function AdminArchivedChatsPage() {
  const [providers, setProviders] = useState<DirectoryUser[]>([])
  const [requesters, setRequesters] = useState<DirectoryUser[]>([])
  const [providerNext, setProviderNext] = useState<number | null>(null)
  const [requesterNext, setRequesterNext] = useState<number | null>(null)
  const [selectedProvider, setSelectedProvider] = useState<DirectoryUser | null>(null)
  const [selectedRequester, setSelectedRequester] = useState<DirectoryUser | null>(null)
  const [directoryLoading, setDirectoryLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState<'provider' | 'requester' | null>(null)
  const [items, setItems] = useState<Archived[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const loadDirectory = async (role: 'provider' | 'requester', offset: number, append = false) => {
    const result = await http.get<DirectoryResponse>(ENDPOINTS.admin.usuarios(role, offset, 100))
    if (role === 'provider') { setProviders(previous => append ? [...previous, ...result.items] : result.items); setProviderNext(result.nextOffset) }
    else { setRequesters(previous => append ? [...previous, ...result.items] : result.items); setRequesterNext(result.nextOffset) }
  }
  useEffect(() => {
    Promise.all([loadDirectory('provider', 0), loadDirectory('requester', 0)])
      .catch(cause => setMessage(cause instanceof Error ? cause.message : 'No se pudo cargar el directorio de auditoría.'))
      .finally(() => setDirectoryLoading(false))
  }, [])
  const loadMore = async (role: 'provider' | 'requester') => {
    const offset = role === 'provider' ? providerNext : requesterNext
    if (offset === null) return
    setLoadingMore(role)
    try { await loadDirectory(role, offset, true) } catch (cause) { setMessage(cause instanceof Error ? cause.message : 'No se pudo cargar el siguiente lote.') } finally { setLoadingMore(null) }
  }
  const consultar = async () => {
    if (!selectedProvider || !selectedRequester) { setMessage('Selecciona un HelpWorker y un HelpSeeker para continuar.'); return }
    setLoading(true); setMessage('')
    try {
      const result = await http.get<{ items: Archived[] }>(ENDPOINTS.admin.mensajesArchivados(selectedProvider.id, selectedRequester.id))
      setItems(result.items)
      if (!result.items.length) setMessage('No hay mensajes archivados para esta pareja de usuarios.')
    } catch (cause) { setMessage(cause instanceof Error ? cause.message : 'No se pudo consultar el archivo.') } finally { setLoading(false) }
  }
  const directory = (title: string, role: 'provider' | 'requester', users: DirectoryUser[], selected: DirectoryUser | null, choose: (user: DirectoryUser) => void, next: number | null) => <section className="overflow-hidden rounded-2xl border border-surface-line bg-white/55"><header className="border-b border-surface-line bg-white/45 px-4 py-3"><p className="text-[13px] font-bold">{title}</p><p className="mt-0.5 text-[11px] texto-suave">Selecciona una persona</p></header><div className="max-h-[390px] overflow-y-auto">{directoryLoading ? <p className="p-5 text-center text-sm texto-suave">Cargando primeros 100 usuarios…</p> : users.length ? users.map(user => <UserChoice key={user.id} user={user} selected={selected?.id === user.id} onClick={() => choose(user)} />) : <p className="p-5 text-center text-sm texto-suave">No hay usuarios registrados.</p>}</div>{next !== null && <button type="button" onClick={() => loadMore(role)} disabled={loadingMore === role} className="flex w-full items-center justify-center gap-1 border-t border-surface-line px-3 py-3 text-[12px] font-bold text-brand-600 hover:bg-brand-50 disabled:opacity-60"><ChevronDown size={15} />{loadingMore === role ? 'Cargando…' : 'Cargar 100 más'}</button>}</section>
  return <div className="mx-auto max-w-6xl"><PageHeader titulo="Chats archivados" descripcion="Elige una pareja concreta. La auditoría conserva los mensajes vencidos sin exponer directorios completos en una sola carga." />
    <div className="panel p-4 sm:p-5"><div className="grid gap-4 lg:grid-cols-2">{directory('HelpWorkers', 'provider', providers, selectedProvider, setSelectedProvider, providerNext)}{directory('HelpSeekers', 'requester', requesters, selectedRequester, setSelectedRequester, requesterNext)}</div><div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-brand-50/70 px-4 py-3"><p className="text-sm text-ink-soft">{selectedProvider ? `HelpWorker: ${selectedProvider.full_name || selectedProvider.email}` : 'Selecciona un HelpWorker'} <span className="mx-1 text-ink-muted">·</span> {selectedRequester ? `HelpSeeker: ${selectedRequester.full_name || selectedRequester.email}` : 'Selecciona un HelpSeeker'}</p><Button onClick={consultar} disabled={loading || !selectedProvider || !selectedRequester}>{loading ? <><Archive size={15} /> Consultando…</> : <><Search size={15} /> Buscar conversación</>}</Button></div></div>
    {message && <p className="mt-4 text-sm texto-suave">{message}</p>}
    {items.length > 0 && <section className="panel mt-5 space-y-3 p-5">{items.map(item => <article key={item.id} className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${item.is_system ? 'mx-auto bg-slate-100 text-slate-600' : item.sender_id === selectedProvider?.id ? 'ml-auto bg-brand-600 text-white' : 'bg-white/80 text-ink-soft'}`}><p>{item.body}</p><time className="mt-1 block text-[10px] opacity-70">{new Date(item.created_at).toLocaleString('es-EC')}</time></article>)}</section>}
  </div>
}
