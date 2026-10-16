import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarClock, CheckCircle2, ChevronLeft, ChevronRight, CircleAlert, Clock3, GripVertical, PanelRightClose, PanelRightOpen, Plus, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { http } from '@/lib/api/http'
import { ENDPOINTS } from '@/lib/api/endpoints'
import type { ApiTask } from '@/lib/api/helpwork.types'

const estado: Record<ApiTask['status'], { label: string; className: string }> = {
  pending: { label: 'Programada', className: 'bg-amber-100 text-amber-600' }, queued: { label: 'En cola', className: 'bg-brand-50 text-brand-600' }, processing: { label: 'Procesando', className: 'bg-violet-100 text-violet-600' }, completed: { label: 'Completada', className: 'bg-success-100 text-success-600' }, failed: { label: 'Fallida', className: 'bg-red-100 text-red-600' },
}
const week = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const localDate = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
const monthLabel = (date: Date) => new Intl.DateTimeFormat('es-EC', { month: 'long', year: 'numeric' }).format(date)
const taskDate = (task: ApiTask) => localDate(new Date(task.scheduled_for))

/** Calendario visual nativo: la fecha/hora se traduce al mismo payload que ya consume Celery. */
export default function CalendarPage() {
  const [tasks, setTasks] = useState<ApiTask[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedDate, setSelectedDate] = useState(localDate())
  const [selectedTime, setSelectedTime] = useState('09:00')
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [openSidebar, setOpenSidebar] = useState(true)
  const cargar = () => http.get<ApiTask[]>(ENDPOINTS.tareas.list).then(setTasks).catch(() => setTasks([]))
  useEffect(() => { cargar(); const timer = window.setInterval(cargar, 15000); return () => window.clearInterval(timer) }, [])
  const scheduledFor = `${selectedDate}T${selectedTime}`
  const crear = async (event: React.FormEvent) => {
    event.preventDefault(); setError('')
    if (!title || !selectedDate || !selectedTime) { setError('Indica título, fecha y hora.'); return }
    if (new Date(scheduledFor).getTime() <= Date.now()) { setError('El recordatorio debe programarse en una fecha y hora futura.'); return }
    setSaving(true)
    try { await http.post<ApiTask>(ENDPOINTS.tareas.create, { title, description, taskType: 'reminder', scheduledFor: new Date(scheduledFor).toISOString() }); setTitle(''); setDescription(''); await cargar() } catch (cause) { setError(cause instanceof Error ? cause.message : 'No se pudo crear la tarea.') } finally { setSaving(false) }
  }
  const eliminar = async (id: string) => { if (!window.confirm('¿Eliminar este recordatorio?')) return; await http.del(ENDPOINTS.tareas.remove(id)); await cargar() }
  const days = useMemo(() => {
    const firstWeekday = (month.getDay() + 6) % 7
    const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
    return Array.from({ length: 42 }, (_, index) => { const day = index - firstWeekday + 1; return day > 0 && day <= count ? new Date(month.getFullYear(), month.getMonth(), day) : null })
  }, [month])
  const tasksByDate = useMemo(() => tasks.reduce<Record<string, ApiTask[]>>((result, task) => { const key = taskDate(task); (result[key] ??= []).push(task); return result }, {}), [tasks])
  const selectedLabel = new Intl.DateTimeFormat('es-EC', { dateStyle: 'full' }).format(new Date(`${selectedDate}T12:00:00`))
  return <div className="mx-auto max-w-[1400px] space-y-5">
    <PageHeader titulo="Calendario y recordatorios" descripcion="Elige un día, configura la hora y Celery procesará tu recordatorio." />
    <div className={`grid gap-5 transition-[grid-template-columns] duration-500 ${openSidebar ? 'xl:grid-cols-[minmax(0,1fr)_340px]' : 'xl:grid-cols-[minmax(0,1fr)_56px]'}`}>
      <section className="relative min-w-0 overflow-hidden rounded-[28px] border border-white/75 bg-white/55 p-4 shadow-soft backdrop-blur-2xl sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-3"><Button variant="ghost" size="sm" onClick={() => setMonth(current => new Date(current.getFullYear(), current.getMonth() - 1, 1))}><ChevronLeft size={16} /> Anterior</Button><h2 className="capitalize text-[19px] font-bold sm:text-[22px]">{monthLabel(month)}</h2><Button variant="ghost" size="sm" onClick={() => setMonth(current => new Date(current.getFullYear(), current.getMonth() + 1, 1))}>Siguiente <ChevronRight size={16} /></Button></div>
        <div className="grid grid-cols-7 border-l border-t border-white/70">{week.map(day => <div key={day} className="border-b border-r border-white/70 bg-white/35 py-2 text-center text-[11px] font-bold uppercase tracking-wide text-ink-muted">{day}</div>)}{days.map((day, index) => { const key = day ? localDate(day) : `blank-${index}`; const daily = day ? tasksByDate[key] ?? [] : []; const selected = key === selectedDate; const today = key === localDate(); return <button key={key} type="button" disabled={!day} onClick={() => day && setSelectedDate(key)} className={`group relative min-h-[78px] border-b border-r border-white/70 p-2 text-left transition sm:min-h-[112px] ${day ? 'hover:bg-brand-50/70' : 'bg-white/15'} ${selected ? 'bg-brand-100/65 ring-1 ring-inset ring-brand-300' : ''}`}><span className={`grid h-7 w-7 place-items-center rounded-full text-[13px] font-semibold ${today ? 'bg-brand-600 text-white' : selected ? 'bg-white text-brand-700' : 'text-ink-soft'}`}>{day?.getDate()}</span><div className="mt-1.5 space-y-1 overflow-hidden">{daily.slice(0, 2).map(task => <span key={task.id} title={task.title} className={`block truncate rounded-md px-1.5 py-1 text-[10px] font-semibold ${task.status === 'completed' ? 'bg-success-100 text-success-700' : 'bg-brand-100 text-brand-700'}`}>{task.title}</span>)}{daily.length > 2 && <span className="block text-[10px] font-semibold text-brand-600">+{daily.length - 2} más</span>}</div></button>})}</div>
        <motion.form drag dragMomentum={false} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} onSubmit={crear} className="relative mt-5 rounded-2xl border border-white/80 bg-white/80 p-4 shadow-lift backdrop-blur-2xl lg:absolute lg:bottom-6 lg:left-6 lg:z-10 lg:w-[390px]"><div className="mb-3 flex items-center gap-1 text-[12px] font-semibold text-ink-muted"><GripVertical size={15} /> Puedes mover este panel</div><p className="text-[13px] font-semibold capitalize text-brand-700">{selectedLabel}</p><div className="mt-3 grid gap-3 sm:grid-cols-[1fr_120px] lg:grid-cols-[1fr_110px]"><label><span className="mb-1 block text-[12px] font-medium text-ink-soft">Título</span><input value={title} onChange={event => setTitle(event.target.value)} placeholder="Preparar tutoría" className="h-10 w-full rounded-xl border border-white/90 bg-white/80 px-3 text-[13.5px] outline-none focus:border-brand-400" /></label><label><span className="mb-1 block text-[12px] font-medium text-ink-soft">Hora</span><input type="time" value={selectedTime} onChange={event => setSelectedTime(event.target.value)} className="h-10 w-full rounded-xl border border-white/90 bg-white/80 px-3 text-[13.5px] outline-none focus:border-brand-400" /></label></div><label className="mt-3 block"><span className="mb-1 block text-[12px] font-medium text-ink-soft">Descripción opcional</span><textarea value={description} onChange={event => setDescription(event.target.value)} rows={2} className="w-full rounded-xl border border-white/90 bg-white/80 px-3 py-2 text-[13.5px] outline-none focus:border-brand-400" /></label><div className="mt-3 flex flex-wrap items-center gap-2"><Button type="submit" size="sm" disabled={saving}><Plus size={14} /> {saving ? 'Programando…' : 'Programar recordatorio'}</Button>{error && <p className="text-[12px] text-red-600">{error}</p>}</div></motion.form>
      </section>
      <aside className={`overflow-hidden rounded-[28px] border border-white/75 bg-white/60 shadow-soft backdrop-blur-2xl transition-all duration-500 ${openSidebar ? 'p-4 sm:p-5' : 'p-2'}`}><button onClick={() => setOpenSidebar(current => !current)} aria-label={openSidebar ? 'Contraer recordatorios' : 'Expandir recordatorios'} className="ml-auto grid h-10 w-10 place-items-center rounded-xl text-brand-600 transition hover:bg-brand-50">{openSidebar ? <PanelRightClose size={19} /> : <PanelRightOpen size={19} />}</button>{openSidebar && <div className="mt-2"><div className="mb-4"><h2 className="text-[17px] font-bold">Mis recordatorios</h2><p className="text-[12.5px] texto-suave">Programados y completados.</p></div>{!tasks.length ? <EmptyState titulo="Sin recordatorios" texto="Selecciona un día para crear el primero." /> : <div className="max-h-[610px] space-y-2 overflow-y-auto pr-1">{tasks.map(task => { const current = estado[task.status] ?? { label: 'En proceso', className: 'bg-slate-100 text-slate-600' }; const Icon = task.status === 'completed' ? CheckCircle2 : task.status === 'failed' ? CircleAlert : Clock3; return <motion.article key={task.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="rounded-2xl border border-white/80 bg-white/70 p-3"><div className="flex gap-2"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600"><CalendarClock size={15} /></span><div className="min-w-0 flex-1"><div className="flex items-center gap-1.5"><h3 className="truncate text-[13px] font-bold">{task.title}</h3><span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold ${current.className}`}>{current.label}</span></div><p className="mt-1 text-[11px] texto-suave">{new Date(task.scheduled_for).toLocaleString('es-EC')}</p>{task.description && <p className="mt-1 line-clamp-2 text-[11px] text-ink-muted">{task.description}</p>}</div><div className="flex flex-col items-center gap-1"><Icon size={14} className="text-ink-muted" /><button aria-label="Eliminar recordatorio" onClick={() => eliminar(task.id).catch(cause => setError(cause instanceof Error ? cause.message : 'No se pudo eliminar.'))} className="rounded-lg p-1 text-ink-muted transition hover:bg-red-50 hover:text-red-600"><Trash2 size={14} /></button></div></div></motion.article> })}</div>}</div>}</aside>
    </div>
  </div>
}
