import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { BadgeCheck, Plus, Star, Trash2, UserRound } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/features/auth/AuthContext'
import { http } from '@/lib/api/http'
import { ENDPOINTS } from '@/lib/api/endpoints'
import type { ApiProfileBundle, ApiProviderAvailability, ApiProviderService } from '@/lib/api/helpwork.types'

type Catalog = { code: string; name: string }
const labelModalidad = (value: string) => value === 'online' ? 'En línea' : value === 'onsite' ? 'Presencial' : value

/** Perfil real del HelpWorker: su servicio y su agenda alimentan directamente el matching. */
export default function ProfilePage() {
  const { usuario } = useAuth()
  const [bundle, setBundle] = useState<ApiProfileBundle | null>(null)
  const [fields, setFields] = useState<Catalog[]>([]); const [topics, setTopics] = useState<Catalog[]>([]); const [types, setTypes] = useState<Catalog[]>([])
  const [service, setService] = useState<Partial<ApiProviderService>>({ academic_levels: ['grado'], modalities: ['online'], languages: ['es'], topic_codes: [], price_min: 10, price_max: 20, specialization_score: .8, opportunity_interest_score: .8, semantic_score: .7, excluded_topic_codes: [] })
  const [availability, setAvailability] = useState<ApiProviderAvailability>({ availability_status: 'available', timezone: 'America/Guayaquil', weekly_slots: [], hours_per_week: 8, committed_hours: 0, max_concurrent_services: 2, response_window_minutes: 60 })
  const [name, setName] = useState(''); const [city, setCity] = useState(''); const [saving, setSaving] = useState(false); const [message, setMessage] = useState('')
  const provider = bundle?.perfilProveedor
  const cargar = async () => {
    if (!usuario) return
    const [profile, catalogFields, catalogTypes, savedServices, savedAvailability] = await Promise.all([http.get<ApiProfileBundle>(ENDPOINTS.usuarios.perfilPropio), http.get<Catalog[]>(ENDPOINTS.catalogo.campos), http.get<Catalog[]>(ENDPOINTS.catalogo.tiposServicio), http.get<ApiProviderService[]>(ENDPOINTS.proveedores.servicios(usuario.id)), http.get<ApiProviderAvailability | null>(ENDPOINTS.proveedores.disponibilidad(usuario.id))])
    setBundle(profile); setFields(catalogFields.filter(item => item.code.length === 4)); setTypes(catalogTypes)
    setName(profile.perfilProveedor?.display_name ?? profile.usuario.full_name ?? ''); setCity(profile.perfilProveedor?.city ?? '')
    const existing = savedServices[0]; if (existing) { setService(existing); const topicRows = await http.get<Catalog[]>(ENDPOINTS.catalogo.temas(existing.field_code)); setTopics(topicRows) }
    if (savedAvailability) setAvailability(savedAvailability)
  }
  useEffect(() => { cargar().catch(() => setMessage('No se pudo cargar el perfil.')) }, [usuario?.id])
  const fieldName = useMemo(() => fields.find(item => item.code === service.field_code)?.name ?? 'Completa tu especialidad', [fields, service.field_code])
  const changeField = async (fieldCode: string) => { setService(current => ({ ...current, field_code: fieldCode, topic_codes: [] })); setTopics(await http.get<Catalog[]>(ENDPOINTS.catalogo.temas(fieldCode))) }
  const save = async () => {
    if (!usuario || !name || !service.field_code || !service.service_type_code || !service.topic_codes?.length) { setMessage('Completa nombre, campo, tema y tipo de servicio.'); return }
    setSaving(true); setMessage('')
    try {
      await Promise.all([
        http.put(ENDPOINTS.usuarios.perfilProveedor(usuario.id), { display_name: name, city }),
        http.put(ENDPOINTS.proveedores.servicios(usuario.id), service),
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
    <div className="mt-5 grid gap-5 lg:grid-cols-2"><section className="panel space-y-4 p-5"><h3 className="text-[17px] font-bold">Presentación</h3><Input label="Nombre público" value={name} onChange={event => setName(event.target.value)} /><Input label="Ciudad" value={city} onChange={event => setCity(event.target.value)} /><p className="text-[12px] texto-suave">La foto se toma de tu cuenta autenticada. Si entras con Google, se sincroniza automáticamente.</p></section>
      <section className="panel space-y-4 p-5"><h3 className="text-[17px] font-bold">Servicio que ofreces</h3><Select label="Campo" value={service.field_code ?? ''} onChange={event => changeField(event.target.value)} options={fields} /><Select label="Tema" value={service.topic_codes?.[0] ?? ''} onChange={event => setService(current => ({ ...current, topic_codes: [event.target.value] }))} options={topics} /><Select label="Tipo de servicio" value={service.service_type_code ?? ''} onChange={event => setService(current => ({ ...current, service_type_code: event.target.value }))} options={types} /><div className="grid gap-4 sm:grid-cols-2"><Input label="Tarifa desde ($/h)" type="number" value={String(service.price_min ?? '')} onChange={event => setService(current => ({ ...current, price_min: Number(event.target.value) }))} /><Input label="Tarifa hasta ($/h)" type="number" value={String(service.price_max ?? '')} onChange={event => setService(current => ({ ...current, price_max: Number(event.target.value) }))} /></div><label className="block"><span className="mb-1.5 block text-sm font-medium text-ink-soft">Modalidad</span><select value={service.modalities?.[0] ?? 'online'} onChange={event => setService(current => ({ ...current, modalities: [event.target.value] }))} className="h-12 w-full rounded-xl border border-white/80 bg-white/70 px-3 text-[15px]"><option value="online">En línea</option><option value="onsite">Presencial</option><option value="hybrid">Híbrida</option></select><p className="mt-1 text-[11px] texto-suave">Actual: {labelModalidad(service.modalities?.[0] ?? 'online')}</p></label></section>
      <section className="panel space-y-4 p-5 lg:col-span-2"><h3 className="text-[17px] font-bold">Disponibilidad y capacidad</h3><div className="grid gap-4 sm:grid-cols-4"><Input label="Horas por semana" type="number" value={String(availability.hours_per_week ?? 0)} onChange={event => setAvailability(current => ({ ...current, hours_per_week: Number(event.target.value) }))} /><Input label="Horas comprometidas" type="number" value={String(availability.committed_hours ?? 0)} onChange={event => setAvailability(current => ({ ...current, committed_hours: Number(event.target.value) }))} /><Input label="Máx. servicios" type="number" value={String(availability.max_concurrent_services ?? 1)} onChange={event => setAvailability(current => ({ ...current, max_concurrent_services: Number(event.target.value) }))} /><Input label="Respuesta (min)" type="number" value={String(availability.response_window_minutes ?? 60)} onChange={event => setAvailability(current => ({ ...current, response_window_minutes: Number(event.target.value) }))} /></div><div className="border-t border-white/60 pt-4"><div className="mb-3 flex items-center justify-between"><div><h4 className="font-bold">Franjas semanales</h4><p className="text-[12px] texto-suave">El matching cruza estas horas con las solicitadas.</p></div><Button type="button" size="sm" variant="secondary" onClick={agregarFranja}><Plus size={14} /> Agregar franja</Button></div>{slots.length ? <div className="space-y-2">{slots.map((slot, index) => <div key={`${slot.dia}-${index}`} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 rounded-xl bg-white/60 p-2"><select aria-label="Día" value={slot.dia} onChange={event => actualizarFranja(index, 'dia', event.target.value)} className="rounded-lg border border-white/80 bg-white px-2 text-[13px]">{['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'].map((day, dayIndex) => <option key={day} value={dayIndex + 1}>{day}</option>)}</select><input aria-label="Hora inicio" type="time" value={slot.inicio} onChange={event => actualizarFranja(index, 'inicio', event.target.value)} className="rounded-lg border border-white/80 bg-white px-2 text-[13px]" /><input aria-label="Hora fin" type="time" value={slot.fin} onChange={event => actualizarFranja(index, 'fin', event.target.value)} className="rounded-lg border border-white/80 bg-white px-2 text-[13px]" /><button type="button" aria-label="Quitar franja" onClick={() => quitarFranja(index)} className="grid h-9 w-9 place-items-center rounded-lg text-red-600 hover:bg-red-50"><Trash2 size={15} /></button></div>)}</div> : <p className="rounded-xl border border-dashed border-white/80 px-3 py-4 text-[13px] texto-suave">No has agregado franjas todavía.</p>}</div><p className="text-[13px] texto-suave">Zona horaria: {availability.timezone ?? 'America/Guayaquil'}.</p>{message && <p className="text-[13px] text-brand-600">{message}</p>}</section></div>
  </div>
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: Catalog[]; onChange: React.ChangeEventHandler<HTMLSelectElement> }) { return <label className="block"><span className="mb-1.5 block text-sm font-medium text-ink-soft">{label}</span><select value={value} onChange={onChange} className="h-12 w-full rounded-xl border border-white/80 bg-white/70 px-3 text-[15px]"><option value="">Selecciona una opción</option>{options.map(option => <option key={option.code} value={option.code}>{option.name}</option>)}</select></label> }
