import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarClock, CheckCircle2, CircleAlert, Clock3, Plus, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { EmptyState } from '@/components/ui/EmptyState'
import { http } from '@/lib/api/http'
import { ENDPOINTS } from '@/lib/api/endpoints'
import type { ApiTask } from '@/lib/api/helpwork.types'

const estado: Record<ApiTask['status'], { label: string; className: string }> = {
  pending: { label: 'Programada', className: 'bg-amber-100 text-amber-600' }, queued: { label: 'En cola', className: 'bg-brand-50 text-brand-600' }, processing: { label: 'Procesando', className: 'bg-violet-100 text-violet-600' }, completed: { label: 'Completada', className: 'bg-success-100 text-success-600' }, failed: { label: 'Fallida', className: 'bg-red-100 text-red-600' },
}

/** Tareas persistidas: Celery cambia sus estados; esta pantalla solo las programa y consulta. */
export default function CalendarPage() {
  const [tasks, setTasks] = useState<ApiTask[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [scheduledFor, setScheduledFor] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const cargar = () => http.get<ApiTask[]>(ENDPOINTS.tareas.list).then(setTasks).catch(() => setTasks([]))
  useEffect(() => { cargar(); const timer = window.setInterval(cargar, 15000); return () => window.clearInterval(timer) }, [])
  const crear = async (event: React.FormEvent) => {
    event.preventDefault(); setError('')
    if (!title || !scheduledFor) { setError('Indica título y fecha/hora.'); return }
    setSaving(true)
    try { await http.post<ApiTask>(ENDPOINTS.tareas.create, { title, description, taskType: 'reminder', scheduledFor: new Date(scheduledFor).toISOString() }); setTitle(''); setDescription(''); setScheduledFor(''); await cargar() } catch (cause) { setError(cause instanceof Error ? cause.message : 'No se pudo crear la tarea.') } finally { setSaving(false) }
  }
  const eliminar = async (id: string) => { if (!window.confirm('¿Eliminar este recordatorio?')) return; await http.del(ENDPOINTS.tareas.remove(id)); await cargar() }
  return <div className="mx-auto max-w-4xl space-y-5">
    <PageHeader titulo="Calendario y recordatorios" descripcion="Programa recordatorios. Celery los procesará a la hora indicada." />
    <motion.form initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} onSubmit={crear} className="panel grid gap-4 p-5 md:grid-cols-2">
      <Input label="Título" value={title} onChange={event => setTitle(event.target.value)} placeholder="Preparar tutoría" />
      <Input label="Fecha y hora" type="datetime-local" value={scheduledFor} onChange={event => setScheduledFor(event.target.value)} />
      <label className="md:col-span-2"><span className="mb-1.5 block text-sm font-medium text-ink-soft">Descripción opcional</span><textarea value={description} onChange={event => setDescription(event.target.value)} rows={2} className="w-full rounded-xl border border-white/80 bg-white/70 px-4 py-3 text-[14px] outline-none focus:border-brand-400" /></label>
      <div className="flex items-center gap-3 md:col-span-2"><Button type="submit" disabled={saving}><Plus size={15} /> {saving ? 'Programando…' : 'Programar recordatorio'}</Button>{error && <p className="text-[13px] text-red-600">{error}</p>}</div>
    </motion.form>
    {!tasks.length ? <div className="panel"><EmptyState titulo="No tienes recordatorios" texto="Crea uno y el worker Celery lo recogerá cuando llegue su fecha." /></div> : <div className="grid gap-3">{tasks.map(task => { const current = estado[task.status]; const Icon = task.status === 'completed' ? CheckCircle2 : task.status === 'failed' ? CircleAlert : Clock3; return <motion.article key={task.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="panel flex gap-4 p-5"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600"><CalendarClock size={18} /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="font-bold">{task.title}</h2><span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${current.className}`}>{current.label}</span></div><p className="mt-1 text-[13px] texto-suave">{task.description || 'Sin descripción'} · {new Date(task.scheduled_for).toLocaleString('es-EC')}</p>{task.last_error && <p className="mt-2 text-[12px] text-red-600">{task.last_error}</p>}</div><Icon size={19} className="shrink-0 text-ink-muted" /><button aria-label="Eliminar recordatorio" onClick={() => eliminar(task.id).catch(cause => setError(cause instanceof Error ? cause.message : 'No se pudo eliminar.'))} className="grid h-9 w-9 place-items-center rounded-lg text-ink-muted transition hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button></motion.article> })}</div>}
  </div>
}
