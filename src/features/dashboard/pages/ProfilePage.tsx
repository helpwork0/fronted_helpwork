import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { BadgeCheck, Check, Plus, Star, Trash2, UserRound } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/features/auth/AuthContext'
import { http } from '@/lib/api/http'
import { ENDPOINTS } from '@/lib/api/endpoints'
import type { ApiProfileBundle, ApiProviderAvailability, ApiProviderService } from '@/lib/api/helpwork.types'

type Catalog = { code: string; name: string; parent_code?: string | null }

/** Perfil real del HelpWorker: su servicio y su agenda alimentan directamente el matching. */
export default function ProfilePage() {
  const { usuario } = useAuth()
  const [bundle, setBundle] = useState<ApiProfileBundle | null>(null)
  const [areas, setAreas] = useState<Catalog[]>([]); const [types, setTypes] = useState<Catalog[]>([])
  const [services, setServices] = useState<Array<Partial<ApiProviderService> & { area_code?: string }>>([])
  const [materiasByArea, setMateriasByArea] = useState<Record<string, Catalog[]>>({}); const [topicsByMatter, setTopicsByMatter] = useState<Record<string, Catalog[]>>({})
  const [availability, setAvailability] = useState<ApiProviderAvailability>({ availability_status: 'available', timezone: 'America/Guayaquil', weekly_slots: [], hours_per_week: 8, committed_hours: 0, max_concurrent_services: 2, response_window_minutes: 60 })
  const [name, setName] = useState(''); const [city, setCity] = useState(''); const [university, setUniversity] = useState(''); const [saving, setSaving] = useState(false); const [message, setMessage] = useState('')
  const provider = bundle?.perfilProveedor
  const cargar = async () => {
    if (!usuario) return
    const [profile, catalogAreas, catalogTypes, savedServices, savedAvailability] = await Promise.all([http.get<ApiProfileBundle>(ENDPOINTS.usuarios.perfilPropio), http.get<Catalog[]>(ENDPOINTS.catalogo.campos), http.get<Catalog[]>(ENDPOINTS.catalogo.tiposServicio), http.get<ApiProviderService[]>(ENDPOINTS.proveedores.servicios(usuario.id)), http.get<ApiProviderAvailability | null>(ENDPOINTS.proveedores.disponibilidad(usuario.id))])
    setBundle(profile); setAreas(catalogAreas); setTypes(catalogTypes)
    setName(profile.perfilProveedor?.display_name ?? profile.usuario.full_name ?? ''); setCity(profile.perfilProveedor?.city ?? ''); setUniversity(profile.perfilProveedor?.university ?? '')
    const activeServices = savedServices.filter(item => item.active !== false).slice(0, 2)
    setServices(activeServices.length ? activeServices : [newService()])
    await Promise.all(activeServices.map(async item => {
      const rows = await http.get<Catalog[]>(ENDPOINTS.catalogo.temas(item.field_code)); setTopicsByMatter(current => ({ ...current, [item.field_code]: rows }))
    }))
    if (savedAvailability) setAvailability(savedAvailability)
  }
  useEffect(() => { cargar().catch(() => setMessage('No se pudo cargar el perfil.')) }, [usuario?.id])
  const fieldName = useMemo(() => services.map(item => item.field_code).filter(Boolean).join(', ') || 'Completa tu especialidad', [services])
  const changeArea = async (index: number, areaCode: string) => {
    const materias = materiasByArea[areaCode] ?? await http.get<Catalog[]>(ENDPOINTS.catalogo.materias(areaCode))
    setMateriasByArea(current => ({ ...current, [areaCode]: materias }))
    setServices(current => current.map((item, position) => position === index ? { ...item, area_code: areaCode, field_code: '', topic_codes: [] } : item))
  }
  const changeMatter = async (index: number, matterCode: string) => {
    const topics = topicsByMatter[matterCode] ?? await http.get<Catalog[]>(ENDPOINTS.catalogo.temas(matterCode))
    setTopicsByMatter(current => ({ ...current, [matterCode]: topics }))
    setServices(current => current.map((item, position) => position === index ? { ...item, field_code: matterCode, topic_codes: [] } : item))
  }
  const updateService = (index: number, update: Partial<ApiProviderService>) => setServices(current => current.map((item, position) => position === index ? { ...item, ...update } : item))
  const removeService = async (index: number) => {
    const service = services[index]
    if (usuario && service.id) await http.del(ENDPOINTS.proveedores.servicio(usuario.id, service.id))
    setServices(current => current.filter((_, position) => position !== index))
  }
  const toggleTopic = (index: number, code: string) => {
    const selected = services[index]?.topic_codes ?? []; const next = selected.includes(code) ? selected.filter(item => item !== code) : selected.length < 2 ? [...selected, code] : selected
    updateService(index, { topic_codes: next })
  }
  const save = async () => {
    if (!usuario || !name || !services.length || services.some(service => !service.field_code || !service.topic_codes?.length || !service.service_type_code)) { setMessage('Completa materia, hasta dos temas y tipo de ayuda en cada especialidad.'); return }
    setSaving(true); setMessage('')
    try {
      await Promise.all([
        http.put(ENDPOINTS.usuarios.perfilProveedor(usuario.id), { display_name: name, city, university }),
        ...services.map(service => http.put(ENDPOINTS.proveedores.servicios(usuario.id), service)),
        http.put(ENDPOINTS.proveedores.disponibilidad(usuario.id), availability),
      ])
      setMessage('Perfil, servicio y disponibilidad guardados. El próximo matching usará estos datos.'); await cargar()
    } catch (cause) { setMessage(cause instanceof Error ? cause.message : 'No se pudo guardar el perfil.') } finally { setSaving(false) }
  }
  const slots = availability.weekly_slots ?? []
  const agregarFranja = () => setAvailability(current => ({ ...current, weekly_slots: [...(current.weekly_slots ?? []), { dia: 1, inicio: '09:00', fin: '12:00' }] }))
  const actualizarFranja = (index: number, field: 'dia' | 'inicio' | 'fin', value: string) => setAvailability(current => ({ ...current, weekly_slots: (current.weekly_slots ?? []).map((slot, position) => position === index ? { ...slot, [field]: field === 'dia' ? Number(value) : value } : slot) }))
  const quitarFranja = (index: number) => setAvailability(current => ({ ...current, weekly_slots: (current.weekly_slots ?? []).filter((_, position) => position !== index) }))
  const rating = Number(provider?.average_rating ?? 0); const reviews = Number(provider?.review_count ?? 0)
  return <div className="mx-auto max-w-4xl"><PageHeader titulo="Perfil público" descripcion="Tu perfil, servicios y agenda determinan las oportunidades que recibes."><Button size="sm" onClick={save} disabled={saving}>{saving ? 'Guardando…' : 'Guardar cambios'}</Button></PageHeader>
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="panel overflow-hidden"><div className="h-28 bg-gradient-to-r from-brand-400 via-brand-500 to-violet-400" /><div className="flex gap-4 px-6 pb-6"><div className="-mt-12 grid h-24 w-24 place-items-center overflow-hidden rounded-full bg-brand-50 text-brand-600 ring-4 ring-white">{usuario?.avatarUrl ? <img src={usuario.avatarUrl} alt="" className="h-full w-full object-cover" /> : <UserRound size={36} />}</div><div className="pt-3"><h2 className="flex items-center gap-1.5 text-[22px] font-extrabold">{name || usuario?.nombre}<BadgeCheck size={19} className="text-brand-500" /></h2><p className="text-[14px] texto-suave">{fieldName} · {city || 'Ciudad por definir'}</p><p className="mt-1 text-[13px] text-ink-muted"><Star size={12} className="inline text-amber-500" fill="currentColor" /> {rating.toFixed(1)} · {reviews} reseñas</p></div></div></motion.section>
    <div className="mt-5 grid gap-5 lg:grid-cols-2"><section className="panel space-y-4 p-5"><h3 className="text-[17px] font-bold">Presentación</h3><Input label="Nombre público" value={name} onChange={event => setName(event.target.value)} /><Input label="Ciudad" value={city} onChange={event => setCity(event.target.value)} /><Input label="Universidad o institución" value={university} onChange={event => setUniversity(event.target.value)} /><p className="text-[12px] texto-suave">La foto se toma de tu cuenta autenticada. Si entras con Google, se sincroniza automáticamente.</p></section>
      <section className="panel space-y-4 p-5 lg:col-span-2"><div className="flex flex-wrap items-start justify-between gap-2"><div><h3 className="text-[17px] font-bold">Áreas y materias de especialidad</h3><p className="text-[13px] texto-suave">Selecciona hasta dos materias y hasta dos temas por cada una. El matching solo te ofrecerá combinaciones que confirmes aquí.</p></div>{services.length < 2 && <Button type="button" size="sm" variant="secondary" onClick={() => setServices(current => [...current, newService()])}><Plus size={14} /> Añadir especialidad</Button>}</div>
        <div className="grid gap-4 lg:grid-cols-2">{services.map((service, index) => <section key={service.id ?? `new-${index}`} className="rounded-2xl border border-brand-100 bg-white/55 p-4"><div className="mb-3 flex items-center justify-between"><h4 className="font-bold">Especialidad {index + 1}</h4>{services.length > 1 && <button type="button" onClick={() => removeService(index).catch(() => setMessage('No se pudo quitar la especialidad.'))} className="text-xs font-semibold text-red-600">Quitar</button>}</div><p className="mb-2 text-xs font-semibold text-ink-soft">Área</p><div className="mb-4 flex flex-wrap gap-2">{areas.map(area => <button type="button" key={area.code} onClick={() => changeArea(index, area.code)} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${service.area_code === area.code ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-ink-soft ring-1 ring-slate-100 hover:bg-brand-50'}`}>{service.area_code === area.code && <Check size={12} className="mr-1 inline" />}{area.name}</button>)}</div><Select label="Materia" value={service.field_code ?? ''} onChange={event => changeMatter(index, event.target.value)} options={materiasByArea[service.area_code ?? ''] ?? (service.field_code ? [{ code: service.field_code, name: service.field_code }] : [])} /><p className="mb-2 mt-4 text-xs font-semibold text-ink-soft">Temas (máximo 2)</p><div className="flex flex-wrap gap-2">{(topicsByMatter[service.field_code ?? ''] ?? []).map(topic => <button type="button" key={topic.code} onClick={() => toggleTopic(index, topic.code)} className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${service.topic_codes?.includes(topic.code) ? 'bg-brand-600 text-white' : 'bg-white text-ink-soft ring-1 ring-slate-100'}`}>{topic.name}</button>)}</div><div className="mt-4 grid gap-4 sm:grid-cols-2"><Select label="Tipo de ayuda principal" value={service.service_type_code ?? ''} onChange={event => updateService(index, { service_type_code: event.target.value, help_type_codes: [event.target.value] })} options={types} /><label className="block"><span className="mb-1.5 block text-sm font-medium text-ink-soft">Modalidad</span><select value={service.modalities?.[0] ?? 'online'} onChange={event => updateService(index, { modalities: [event.target.value] })} className="h-12 w-full rounded-xl border border-white/80 bg-white/70 px-3 text-[15px]"><option value="online">En línea</option><option value="presencial">Presencial</option><option value="hibrida">Híbrida</option></select></label><Input label="Tarifa desde ($/h)" type="number" value={String(service.price_min ?? '')} onChange={event => updateService(index, { price_min: Number(event.target.value) })} /><Input label="Tarifa hasta ($/h)" type="number" value={String(service.price_max ?? '')} onChange={event => updateService(index, { price_max: Number(event.target.value) })} /></div></section>)}</div></section>
      <section className="panel space-y-4 p-5 lg:col-span-2"><h3 className="text-[17px] font-bold">Disponibilidad y capacidad</h3><div className="grid gap-4 sm:grid-cols-4"><Input label="Horas por semana" type="number" value={String(availability.hours_per_week ?? 0)} onChange={event => setAvailability(current => ({ ...current, hours_per_week: Number(event.target.value) }))} /><Input label="Horas comprometidas" type="number" value={String(availability.committed_hours ?? 0)} onChange={event => setAvailability(current => ({ ...current, committed_hours: Number(event.target.value) }))} /><Input label="Máx. servicios" type="number" value={String(availability.max_concurrent_services ?? 1)} onChange={event => setAvailability(current => ({ ...current, max_concurrent_services: Number(event.target.value) }))} /><Input label="Respuesta (min)" type="number" value={String(availability.response_window_minutes ?? 60)} onChange={event => setAvailability(current => ({ ...current, response_window_minutes: Number(event.target.value) }))} /></div><div className="border-t border-white/60 pt-4"><div className="mb-3 flex items-center justify-between"><div><h4 className="font-bold">Franjas semanales</h4><p className="text-[12px] texto-suave">El matching cruza estas horas con las solicitadas.</p></div><Button type="button" size="sm" variant="secondary" onClick={agregarFranja}><Plus size={14} /> Agregar franja</Button></div>{slots.length ? <div className="space-y-2">{slots.map((slot, index) => <div key={`${slot.dia}-${index}`} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 rounded-xl bg-white/60 p-2"><select aria-label="Día" value={slot.dia} onChange={event => actualizarFranja(index, 'dia', event.target.value)} className="rounded-lg border border-white/80 bg-white px-2 text-[13px]">{['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'].map((day, dayIndex) => <option key={day} value={dayIndex + 1}>{day}</option>)}</select><input aria-label="Hora inicio" type="time" value={slot.inicio} onChange={event => actualizarFranja(index, 'inicio', event.target.value)} className="rounded-lg border border-white/80 bg-white px-2 text-[13px]" /><input aria-label="Hora fin" type="time" value={slot.fin} onChange={event => actualizarFranja(index, 'fin', event.target.value)} className="rounded-lg border border-white/80 bg-white px-2 text-[13px]" /><button type="button" aria-label="Quitar franja" onClick={() => quitarFranja(index)} className="grid h-9 w-9 place-items-center rounded-lg text-red-600 hover:bg-red-50"><Trash2 size={15} /></button></div>)}</div> : <p className="rounded-xl border border-dashed border-white/80 px-3 py-4 text-[13px] texto-suave">No has agregado franjas todavía.</p>}</div><p className="text-[13px] texto-suave">Zona horaria: {availability.timezone ?? 'America/Guayaquil'}.</p>{message && <p className="text-[13px] text-brand-600">{message}</p>}</section></div>
  </div>
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: Catalog[]; onChange: React.ChangeEventHandler<HTMLSelectElement> }) { return <label className="block"><span className="mb-1.5 block text-sm font-medium text-ink-soft">{label}</span><select value={value} onChange={onChange} className="h-12 w-full rounded-xl border border-white/80 bg-white/70 px-3 text-[15px]"><option value="">Selecciona una opción</option>{options.map(option => <option key={option.code} value={option.code}>{option.name}</option>)}</select></label> }

function newService(): Partial<ApiProviderService> { return { academic_levels: ['grado'], modalities: ['online'], languages: ['es'], topic_codes: [], price_min: 10, price_max: 20, specialization_score: .8, opportunity_interest_score: .8, semantic_score: .7, excluded_topic_codes: [], help_type_codes: [], format_codes: [] } }
