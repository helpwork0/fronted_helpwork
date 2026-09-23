import { DragEvent, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ArrowLeft, ArrowRight, Sparkles, UploadCloud, FileText, Image, X, LoaderCircle } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Mascot } from '@/components/mascot/Mascot'
import { ROUTES } from '@/config/site.config'
import { cn } from '@/lib/cn'
import { http } from '@/lib/api/http'
import { ENDPOINTS } from '@/lib/api/endpoints'
import type { ApiRequest, ApiRequestAttachment } from '@/lib/api/helpwork.types'

const PASOS = ['Qué necesitas', 'Detalles', 'Presupuesto', 'Adjuntos', 'Revisar'] as const
const MODALIDADES = ['En línea', 'Presencial', 'Cualquiera']
const MAX_SIZE = 10 * 1024 * 1024

type FileKind = 'pdf' | 'word' | 'image'
const kindOf = (file: File): FileKind | null => file.type === 'application/pdf' ? 'pdf' : ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type) ? 'word' : ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type) ? 'image' : null
const iconFor = (kind: FileKind) => kind === 'image' ? Image : FileText
const isoDeadline = (date: string, time: string) => date && time ? new Date(`${date}T${time}:00`).toISOString() : undefined
const deadlineInEcuador = (value?: string | null) => {
  if (!value) return { date: '', time: '' }
  const values = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Guayaquil', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date(value)).filter(part => part.type !== 'literal').map(part => [part.type, part.value]))
  return { date: `${values.year}-${values.month}-${values.day}`, time: `${values.hour}:${values.minute}` }
}

/** Formulario por pasos para publicar una solicitud, incluyendo adjuntos privados. */
export default function NewRequestPage({ volverA = ROUTES.solicitudes }: { volverA?: string }) {
  const [paso, setPaso] = useState(0)
  const navigate = useNavigate()
  const { state } = useLocation() as { state?: { request?: ApiRequest } }
  const editando = state?.request
  const [f, setF] = useState({ titulo: '', categoria: '', descripcion: '', modalidad: 'En línea', fecha: '', hora: '', min: '', max: '', campoCodigo: '', temaCodigo: '', tipoServicioCodigo: 'tutoria' })
  const [campos, setCampos] = useState<{ code: string; name: string; level: string }[]>([])
  const [temas, setTemas] = useState<{ code: string; name: string }[]>([])
  const [tipos, setTipos] = useState<{ code: string; name: string }[]>([])
  const [files, setFiles] = useState<File[]>([])
  const [existing, setExisting] = useState<ApiRequestAttachment[]>([])
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { Promise.all([http.get<{ code: string; name: string; level: string }[]>(ENDPOINTS.catalogo.campos), http.get<{ code: string; name: string }[]>(ENDPOINTS.catalogo.tiposServicio)]).then(([allCampos, allTipos]) => { setCampos(allCampos.filter(item => item.level === 'detailed')); setTipos(allTipos) }).catch(() => setError('No se pudo cargar el catálogo.')) }, [])
  useEffect(() => { if (!f.campoCodigo) { setTemas([]); return }; http.get<{ code: string; name: string }[]>(ENDPOINTS.catalogo.temas(f.campoCodigo)).then(setTemas).catch(() => setTemas([])) }, [f.campoCodigo])
  useEffect(() => {
    if (!editando) return
    const deadline = deadlineInEcuador(editando.expires_at)
    setF({ titulo: editando.description_free?.split('.')[0] ?? '', categoria: editando.field_code, descripcion: editando.description_free ?? '', modalidad: editando.modality === 'presencial' ? 'Presencial' : editando.modality === 'hibrida' ? 'Cualquiera' : 'En línea', fecha: deadline.date, hora: deadline.time, min: String(editando.budget_min ?? ''), max: String(editando.budget_max ?? ''), campoCodigo: editando.field_code, temaCodigo: editando.request_topics?.[0]?.topic_code ?? '', tipoServicioCodigo: editando.service_type_code })
    http.get<ApiRequestAttachment[]>(ENDPOINTS.solicitudes.attachments(editando.id)).then(setExisting).catch(() => setError('No se pudieron cargar los adjuntos existentes.'))
  }, [editando])

  const canContinue = paso === 0 ? f.titulo.trim() && f.campoCodigo && f.temaCodigo && f.tipoServicioCodigo : paso === 1 ? f.descripcion.trim().length > 15 && f.fecha && f.hora : paso === 2 ? f.min && f.max : true
  const counts = [...existing.map(item => item.file_kind), ...files.map(kindOf).filter(Boolean) as FileKind[]].reduce((total, kind) => ({ ...total, [kind]: total[kind] + 1 }), { pdf: 0, word: 0, image: 0 })
  const attachmentBytes = existing.reduce((total, item) => total + Number(item.size_bytes), 0) + files.reduce((total, file) => total + file.size, 0)

  const addFiles = (selection: FileList | File[]) => {
    setError('')
    const next = [...files]
    const current = { ...counts }
    let currentBytes = attachmentBytes
    for (const file of Array.from(selection)) {
      const kind = kindOf(file)
      if (!kind) { setError('Solo se admiten PDF, Word (.doc/.docx) e imágenes JPG, JPEG, PNG, GIF o WEBP.'); continue }
      if (file.size > MAX_SIZE) { setError(`${file.name} supera el límite de 10 MB.`); continue }
      if (currentBytes + file.size > MAX_SIZE) { setError('El total de PDF, Word e imágenes no puede superar 10 MB por solicitud.'); continue }
      const limit = kind === 'image' ? 3 : 1
      if (current[kind] >= limit) { setError(`Ya alcanzaste el límite: ${kind === 'image' ? '3 imágenes' : `1 ${kind === 'pdf' ? 'PDF' : 'archivo Word'}`}.`); continue }
      current[kind] += 1; currentBytes += file.size; next.push(file)
    }
    setFiles(next)
  }
  const onDrop = (event: DragEvent<HTMLDivElement>) => { event.preventDefault(); addFiles(event.dataTransfer.files) }
  const removeExisting = async (attachment: ApiRequestAttachment) => { if (!editando) return; await http.del(ENDPOINTS.solicitudes.attachment(editando.id, attachment.id)); setExisting(items => items.filter(item => item.id !== attachment.id)) }

  const save = async () => {
    if (attachmentBytes > MAX_SIZE) { setError('El total de adjuntos no puede superar 10 MB.'); return }
    const deadline = isoDeadline(f.fecha, f.hora)
    if (!deadline || new Date(deadline).getTime() <= Date.now()) {
      setError('La fecha y hora límite debe estar en el futuro.'); return
    }
    setEnviando(true); setError('')
    try {
      const payload = { descripcionLibre: `${f.titulo}. ${f.descripcion}`, campoCodigo: f.campoCodigo, temasCodigos: [f.temaCodigo], tipoServicioCodigo: f.tipoServicioCodigo, nivelAcademico: 'grado', modalidad: f.modalidad === 'Presencial' ? 'presencial' : f.modalidad === 'Cualquiera' ? 'hibrida' : 'online', ciudad: 'Loja', idiomas: ['es'], presupuestoMinimo: Number(f.min), presupuestoMaximo: Number(f.max), fechaNecesaria: deadline, venceEn: deadline, horasEstimadas: 1 }
      const request = editando ? await http.patch<ApiRequest>(ENDPOINTS.solicitudes.byId(editando.id), payload) : await http.post<ApiRequest>(ENDPOINTS.solicitudes.list, payload)
      if (files.length) { const body = new FormData(); files.forEach(file => body.append('files', file)); await http.postForm(ENDPOINTS.solicitudes.attachments(request.id), body) }
      navigate(volverA)
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'No se pudo publicar la solicitud.') } finally { setEnviando(false) }
  }
  const advance = () => paso < PASOS.length - 1 ? setPaso(current => current + 1) : save()

  return <div className="mx-auto max-w-3xl"><PageHeader titulo={editando ? 'Editar solicitud' : 'Nueva solicitud'} descripcion="Cuéntanos qué necesitas y deja que las propuestas lleguen a ti." />
    <ol className="mb-6 flex items-center">{PASOS.map((label, index) => <li key={label} className="flex flex-1 items-center last:flex-none"><div className="flex flex-col items-center gap-1.5"><span className={cn('grid h-9 w-9 place-items-center rounded-full text-[13px] font-bold transition-colors', index < paso ? 'bg-success-500 text-white' : index === paso ? 'bg-brand-600 text-white' : 'border border-white/80 bg-white/70 text-ink-muted')}>{index < paso ? <Check size={16} /> : index + 1}</span><span className={cn('hidden text-[12px] font-semibold sm:block', index === paso ? 'text-brand-600' : 'texto-suave')}>{label}</span></div>{index < PASOS.length - 1 && <span className="relative mx-2 mb-5 h-[2px] flex-1 bg-black/10"><motion.span className="absolute inset-y-0 left-0 bg-success-500" initial={{ width: 0 }} animate={{ width: index < paso ? '100%' : 0 }} transition={{ duration: .4 }} /></span>}</li>)}</ol>
    <div className="panel relative p-6"><AnimatePresence mode="wait"><motion.div key={paso} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: .25 }} className="space-y-4">
      {paso === 0 && <><Input label="¿Qué necesitas?" placeholder="Ej. Clases de cálculo diferencial" value={f.titulo} onChange={e => setF({ ...f, titulo: e.target.value })} /><Selector label="Categoría" items={campos} selected={f.campoCodigo} onPick={code => { const item = campos.find(field => field.code === code); setF({ ...f, categoria: item?.name ?? '', campoCodigo: code, temaCodigo: '' }) }} />{temas.length > 0 && <Selector label="Tema" items={temas} selected={f.temaCodigo} onPick={temaCodigo => setF({ ...f, temaCodigo })} />}<Selector label="Tipo de ayuda" items={tipos} selected={f.tipoServicioCodigo} onPick={tipoServicioCodigo => setF({ ...f, tipoServicioCodigo })} /></>}
      {paso === 1 && <><div><label className="mb-1.5 block text-sm font-medium text-ink-soft">Describe con detalle</label><textarea rows={6} value={f.descripcion} onChange={e => setF({ ...f, descripcion: e.target.value })} placeholder="Mientras más contexto des, mejores propuestas recibirás." className="w-full rounded-xl border border-white/80 bg-white/70 px-4 py-3 text-[15px] outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100" /><p className="mt-1 text-[12px] text-ink-muted">{f.descripcion.length} caracteres · mínimo recomendado 80</p></div><div><p className="mb-2 text-sm font-medium text-ink-soft">Modalidad</p><div className="flex flex-wrap gap-2">{MODALIDADES.map(item => <button key={item} onClick={() => setF({ ...f, modalidad: item })} className={cn('rounded-full border px-4 py-2 text-[13.5px] font-medium transition', f.modalidad === item ? 'border-brand-500 bg-brand-600 text-white' : 'border-white/80 bg-white/60 texto-suave hover:border-brand-300')}>{item}</button>)}</div></div><div className="grid gap-4 sm:grid-cols-2"><Input label="¿Para qué fecha?" type="date" value={f.fecha} onChange={e => setF({ ...f, fecha: e.target.value })} /><Input label="Hora límite" type="time" value={f.hora} onChange={e => setF({ ...f, hora: e.target.value })} /></div></>}
      {paso === 2 && <><div className="grid gap-4 sm:grid-cols-2"><Input label="Presupuesto mínimo ($)" type="number" placeholder="10" value={f.min} onChange={e => setF({ ...f, min: e.target.value })} /><Input label="Presupuesto máximo ($)" type="number" placeholder="15" value={f.max} onChange={e => setF({ ...f, max: e.target.value })} /></div><div className="flex gap-3 rounded-xl2 bg-brand-50/70 p-4"><Sparkles size={18} className="mt-.5 shrink-0 text-brand-500" /><p className="text-[13.5px] texto-suave">Define el presupuesto total que estás dispuesto a pagar por este trabajo. No se cobra por hora.</p></div></>}
      {paso === 3 && <><div onDragOver={event => event.preventDefault()} onDrop={onDrop} className="rounded-2xl border-2 border-dashed border-brand-200 bg-brand-50/40 p-7 text-center"><UploadCloud className="mx-auto text-brand-500" size={32} /><h3 className="mt-2 font-bold">Adjunta material de apoyo</h3><p className="mt-1 text-[13px] texto-suave">Arrastra archivos aquí o selecciónalos. Máximo: 1 PDF, 1 Word y 3 imágenes; 10 MB entre todos los adjuntos.</p><label className="mt-4 inline-flex cursor-pointer items-center rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white"><UploadCloud size={15} className="mr-2" /> Seleccionar archivos<input className="hidden" type="file" multiple accept=".pdf,.doc,.docx,image/jpeg,image/png,image/gif,image/webp" onChange={event => event.target.files && addFiles(event.target.files)} /></label></div><div className="grid gap-2">{[...existing.map(item => ({ key: item.id, name: item.original_name, kind: item.file_kind, remove: () => removeExisting(item) })), ...files.map((file, index) => ({ key: `${file.name}-${index}`, name: file.name, kind: kindOf(file)!, remove: async () => setFiles(current => current.filter((_, currentIndex) => currentIndex !== index)) }))].map(item => { const Icon = iconFor(item.kind); return <div key={item.key} className="flex items-center gap-3 rounded-xl bg-white/60 px-3 py-2"><Icon size={17} className="text-brand-500" /><span className="min-w-0 flex-1 truncate text-[13px] font-medium">{item.name}</span><button aria-label={`Quitar ${item.name}`} onClick={() => item.remove().catch(() => setError('No se pudo quitar el adjunto.'))} className="rounded p-1 text-ink-muted hover:bg-red-50 hover:text-red-600"><X size={15} /></button></div> })}</div><p className={cn('text-center text-[12px] texto-suave', attachmentBytes > MAX_SIZE && 'text-red-600')}>Disponibles: {1 - counts.pdf} PDF · {1 - counts.word} Word · {3 - counts.image} imágenes · {(attachmentBytes / 1024 / 1024).toFixed(2)} / 10 MB</p></>}
      {paso === 4 && <div className="flex gap-5"><Mascot pose="libro" animation="none" className="hidden w-24 shrink-0 sm:block" /><div className="min-w-0 flex-1 space-y-3"><h3 className="text-[18px] font-bold">{f.titulo || 'Sin título'}</h3><p className="text-[14px] texto-suave">{f.descripcion || 'Sin descripción'}</p><dl className="grid gap-2 text-[13.5px] sm:grid-cols-2"><Dato k="Categoría" v={f.categoria || '—'} /><Dato k="Modalidad" v={f.modalidad} /><Dato k="Fecha y hora límite" v={f.fecha && f.hora ? `${f.fecha} · ${f.hora}` : '—'} /><Dato k="Presupuesto total" v={f.min && f.max ? `$${f.min} – $${f.max}` : '—'} /><Dato k="Adjuntos" v={`${existing.length + files.length} archivo(s)`} /></dl></div></div>}
    </motion.div></AnimatePresence><div className="mt-7 flex items-center justify-between gap-3 border-t border-white/60 pt-5"><Button variant="ghost" onClick={() => paso === 0 ? navigate(-1) : setPaso(current => current - 1)}><ArrowLeft size={16} /> {paso === 0 ? 'Cancelar' : 'Atrás'}</Button><Button onClick={advance} disabled={!canContinue || enviando}>{enviando ? 'Guardando…' : paso === PASOS.length - 1 ? editando ? 'Guardar cambios' : 'Publicar solicitud' : 'Continuar'} <ArrowRight size={16} /></Button></div>{error && <p className="mt-3 text-center text-[13px] text-red-600">{error}</p>}{enviando && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-20 grid place-items-center rounded-2xl bg-white/75 backdrop-blur-sm"><div className="flex flex-col items-center gap-3 rounded-2xl bg-white px-7 py-6 shadow-xl"><LoaderCircle size={30} className="animate-spin text-brand-600" /><p className="font-bold">Guardando tu solicitud…</p><p className="text-center text-[13px] texto-suave">Estamos registrando los datos y subiendo los adjuntos de forma segura.</p></div></motion.div>}</div></div>
}

function Selector({ label, items, selected, onPick }: { label: string; items: { code: string; name: string }[]; selected: string; onPick: (code: string) => void }) { return <div><p className="mb-2 text-sm font-medium text-ink-soft">{label}</p><div className="flex flex-wrap gap-2">{items.map(item => <button key={item.code} onClick={() => onPick(item.code)} className={cn('rounded-full border px-4 py-2 text-[13.5px] font-medium transition', selected === item.code ? 'border-brand-500 bg-brand-600 text-white' : 'border-white/80 bg-white/60 texto-suave hover:border-brand-300')}>{item.name}</button>)}</div></div> }
function Dato({ k, v }: { k: string; v: string }) { return <div className="rounded-xl bg-white/60 px-3 py-2"><dt className="text-[12px] text-ink-muted">{k}</dt><dd className="font-semibold">{v}</dd></div> }
