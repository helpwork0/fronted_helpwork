import { useEffect, useState } from 'react'
import { FileText, KeyRound, MonitorCog, ShieldCheck } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { http } from '@/lib/api/http'
import { ENDPOINTS } from '@/lib/api/endpoints'

type Report = { generatedAt: string; totals: Record<string, number>; rows: { requests: unknown[]; proposals: unknown[]; jobs: unknown[]; incidents: unknown[] } }
type Monitoring = { generatedAt: string; database: { status: string; latencyMs: number; error?: string | null }; integrations: Record<string, string>; note: string }
type MfaStatus = { factors: { id: string; friendlyName?: string | null; status: string }[]; currentLevel: string; nextLevel: string }
type MfaEnrollment = { id: string; qrCode: string; secret: string; uri: string }
type CmsItem = { id: string; content_key: string; content_type: string; title: string; body: string; image_url?: string | null; status: 'draft' | 'published' | 'archived'; version: number; updated_at: string }
type RecoveryCase = { id: string; user_id?: string; category: string; priority: string; status: string; sla_due_at?: string | null; appeal_status?: string; evidence_verified?: boolean; created_at: string }

function download(name: string, content: BlobPart, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const anchor = document.createElement('a')
  anchor.href = url; anchor.download = name; anchor.click(); URL.revokeObjectURL(url)
}
function csv(report: Report) {
  const rows = [['Métrica', 'Valor'], ...Object.entries(report.totals).map(([key, value]) => [key, String(value)])]
  return rows.map(row => row.map(value => `"${value.replace(/"/g, '""')}"`).join(',')).join('\n')
}
function qrSource(value: string) {
  if (value.startsWith('data:')) return value
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(value)}`
}

function cmsKeyForType(contentType: string) {
  if (contentType === 'terms') return 'terms_conditions'
  if (contentType === 'chat_policy') return 'chat_policy'
  const stamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14)
  if (contentType === 'banner') return `announcement_${stamp}`
  if (contentType === 'faq') return `faq_${stamp}`
  return `text_${stamp}`
}

export default function AdminAdvancedPage() {
  const [report, setReport] = useState<Report | null>(null)
  const [monitor, setMonitor] = useState<Monitoring | null>(null)
  const [cms, setCms] = useState<CmsItem[]>([])
  const [recovery, setRecovery] = useState<RecoveryCase[]>([])
  const [permissions, setPermissions] = useState<unknown[]>([])
  const [mfa, setMfa] = useState<MfaStatus | null>(null)
  const [enrollment, setEnrollment] = useState<MfaEnrollment | null>(null)
  const [mfaCode, setMfaCode] = useState('')
  const [mfaMessage, setMfaMessage] = useState('')
  const [cmsForm, setCmsForm] = useState({ contentKey: cmsKeyForType('banner'), contentType: 'banner', title: '', body: '', status: 'draft' as 'draft' | 'published' })
  const [cmsImage, setCmsImage] = useState<File | null>(null)
  const [cmsMessage, setCmsMessage] = useState('')

  const loadMfa = () => http.get<MfaStatus>(ENDPOINTS.auth.mfaStatus).then(setMfa).catch(() => setMfa(null))
  useEffect(() => {
    Promise.all([
      http.get<Report>(ENDPOINTS.admin.reporte), http.get<Monitoring>(ENDPOINTS.admin.monitoreo),
      http.get<CmsItem[]>(ENDPOINTS.admin.cms()), http.get<RecoveryCase[]>(ENDPOINTS.admin.recuperaciones()),
      http.get<unknown[]>(ENDPOINTS.admin.permisos), http.get<MfaStatus>(ENDPOINTS.auth.mfaStatus),
    ]).then(([reportData, monitoring, content, cases, perms, mfaData]) => {
      setReport(reportData); setMonitor(monitoring); setCms(content); setRecovery(cases); setPermissions(perms); setMfa(mfaData)
    }).catch(() => undefined)
  }, [])

  const beginMfa = async () => {
    setMfaMessage('')
    try { setEnrollment(await http.post<MfaEnrollment>(ENDPOINTS.auth.mfaEnroll, { friendlyName: 'HelpWork Admin' })) }
    catch (error) { console.error('MFA enrollment error', error); setMfaMessage(error instanceof Error ? error.message : 'No se pudo iniciar el enrolamiento. Vuelve a iniciar sesión e inténtalo de nuevo.') }
  }
  const verifyMfa = async () => {
    if (!enrollment) return
    try { await http.post(ENDPOINTS.auth.mfaVerify, { factorId: enrollment.id, code: mfaCode }); setEnrollment(null); setMfaCode(''); setMfaMessage('MFA activado correctamente.'); loadMfa() }
    catch { setMfaMessage('El código no es válido o ya expiró. Comprueba tu aplicación autenticadora.') }
  }
  const updateRecovery = async (id: string, patch: Record<string, unknown>) => {
    try { const updated = await http.patch<RecoveryCase>(ENDPOINTS.admin.recuperacion(id), patch); setRecovery(previous => previous.map(item => item.id === id ? { ...item, ...updated } : item)) } catch (error) { setCmsMessage(error instanceof Error ? error.message : 'No se pudo actualizar el caso.') }
  }
  const exportCsv = () => report && download(`helpwork-reporte-${new Date().toISOString().slice(0, 10)}.csv`, csv(report), 'text/csv;charset=utf-8')
  const exportWord = () => report && download(`helpwork-reporte-${new Date().toISOString().slice(0, 10)}.doc`, `<html><meta charset="utf-8"><body><h1>Reporte HelpWork</h1><p>Generado: ${report.generatedAt}</p><table border="1"><tr><th>Métrica</th><th>Valor</th></tr>${Object.entries(report.totals).map(([key, value]) => `<tr><td>${key}</td><td>${value}</td></tr>`).join('')}</table></body></html>`, 'application/msword')
  const guardarContenido = async (event: React.FormEvent) => {
    event.preventDefault(); setCmsMessage('Guardando…')
    try {
      let imageUrl: string | undefined
      if (cmsImage) imageUrl = (await http.postForm<{ url: string }>(ENDPOINTS.admin.cmsUpload, (() => { const data = new FormData(); data.append('file', cmsImage); return data })())).url
      const saved = await http.post<CmsItem>(ENDPOINTS.admin.cms(), { ...cmsForm, imageUrl })
      setCms(previous => [saved, ...previous]); setCmsMessage('Contenido guardado correctamente.'); setCmsForm({ contentKey: cmsKeyForType('banner'), contentType: 'banner', title: '', body: '', status: 'draft' }); setCmsImage(null)
    } catch (error) { setCmsMessage(error instanceof Error ? error.message : 'No se pudo guardar el contenido.') }
  }

  return <div className="mx-auto max-w-6xl space-y-5">
    <PageHeader titulo="Administración avanzada" descripcion="Reportes, CMS, recuperación, permisos y salud técnica." />
    <div className="flex flex-wrap gap-2"><button className="rounded-xl border border-surface-line bg-white px-4 py-2 text-sm font-semibold hover:border-brand-300 disabled:opacity-50" onClick={exportCsv} disabled={!report}>Exportar CSV</button><button className="rounded-xl border border-surface-line bg-white px-4 py-2 text-sm font-semibold hover:border-brand-300 disabled:opacity-50" onClick={exportWord} disabled={!report}>Exportar Word (.doc)</button><button className="rounded-xl border border-surface-line bg-white px-4 py-2 text-sm font-semibold hover:border-brand-300 disabled:opacity-50" onClick={() => window.print()} disabled={!report}>Imprimir / PDF</button></div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><article className="panel p-4"><FileText className="text-brand-600" /><p className="mt-3 text-2xl font-extrabold">{report?.totals.requests ?? '—'}</p><p className="text-xs texto-suave">Solicitudes en reporte</p></article><article className="panel p-4"><KeyRound className="text-amber-600" /><p className="mt-3 text-2xl font-extrabold">{recovery.length}</p><p className="text-xs texto-suave">Casos de recuperación</p></article><article className="panel p-4"><ShieldCheck className="text-violet-600" /><p className="mt-3 text-2xl font-extrabold">{permissions.length}</p><p className="text-xs texto-suave">Permisos configurados</p></article><article className="panel p-4"><MonitorCog className="text-emerald-600" /><p className="mt-3 text-2xl font-extrabold">{monitor?.database.status ?? '—'}</p><p className="text-xs texto-suave">Base de datos · {monitor?.database.latencyMs ?? '—'} ms</p></article></div>
    <section className="panel p-5"><div className="flex items-center justify-between"><div><h2 className="font-bold">Recuperación y acceso</h2><p className="mt-1 text-sm texto-suave">Casos, SLA, evidencia y apelaciones; nunca se muestran contraseñas.</p></div><span className="text-xs texto-suave">{recovery.length} casos</span></div><div className="mt-4 space-y-2">{recovery.length ? recovery.slice(0, 20).map(item => <article key={item.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-surface-line p-3"><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{item.category} · {item.priority}</p><p className="text-xs texto-suave">Usuario: {item.user_id || '—'} · Creado {new Date(item.created_at).toLocaleDateString('es-EC')}</p></div><select className="rounded-lg border px-2 py-1 text-xs" value={item.status} onChange={event => updateRecovery(item.id, { status: event.target.value })}><option value="open">Abierto</option><option value="in_review">En revisión</option><option value="waiting_user">Esperando usuario</option><option value="resolved">Resuelto</option><option value="closed">Cerrado</option></select><button type="button" className="rounded-lg border px-2 py-1 text-xs" onClick={() => updateRecovery(item.id, { evidence_verified: !item.evidence_verified })}>{item.evidence_verified ? 'Evidencia verificada' : 'Verificar evidencia'}</button></article>) : <p className="text-sm texto-suave">No hay casos de recuperación registrados.</p>}</div></section>
    <section className="panel p-5"><h2 className="font-bold">Autenticación multifactor (TOTP)</h2><p className="mt-1 text-sm texto-suave">Protege esta cuenta administrativa con Google Authenticator, Microsoft Authenticator o 1Password.</p><p className="mt-3 text-sm">Estado: <strong>{mfa?.factors.some(factor => factor.status === 'verified') ? 'activado' : 'no activado'}</strong></p>{!enrollment && !mfa?.factors.some(factor => factor.status === 'verified') && <button className="mt-3 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700" onClick={beginMfa}>Configurar MFA</button>}{enrollment && <div className="mt-4 max-w-md space-y-3"><p className="text-sm">Escanea el QR con tu aplicación y escribe el código de 6 dígitos.</p><img className="h-48 w-48 rounded-lg border bg-white p-2" src={qrSource(enrollment.qrCode)} alt="Código QR para MFA" /><p className="break-all text-xs texto-suave">Si no puedes escanearlo, usa esta clave manual: {enrollment.secret}</p><input className="w-full rounded-xl border border-surface-line bg-white px-3 py-2" inputMode="numeric" maxLength={6} value={mfaCode} onChange={event => setMfaCode(event.target.value.replace(/\D/g, ''))} placeholder="Código de 6 dígitos" /><button className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50" onClick={verifyMfa} disabled={mfaCode.length !== 6}>Verificar y activar</button></div>}{mfaMessage && <p className="mt-3 text-sm">{mfaMessage}</p>}</section>
    <section className="panel p-5"><h2 className="font-bold">CMS y versiones</h2><p className="mt-1 text-sm texto-suave">Publica anuncios para ambos dashboards, términos de registro o la política inicial del chat. La clave se genera automáticamente según el tipo.</p><form onSubmit={guardarContenido} className="mt-4 grid gap-3 md:grid-cols-2"><div className="rounded-xl border border-surface-line bg-slate-50 px-3 py-2 text-sm"><span className="mr-2 text-xs texto-suave">Clave automática</span><strong>{cmsForm.contentKey}</strong></div><select className="rounded-xl border border-surface-line px-3 py-2" value={cmsForm.contentType} onChange={event => { const contentType = event.target.value; setCmsForm({ ...cmsForm, contentType, contentKey: cmsKeyForType(contentType) }) }}><option value="banner">Anuncio / banner</option><option value="terms">Términos y condiciones</option><option value="chat_policy">Política del chat</option><option value="text">Texto</option><option value="faq">FAQ</option></select><input className="rounded-xl border border-surface-line px-3 py-2" value={cmsForm.title} onChange={event => setCmsForm({ ...cmsForm, title: event.target.value })} placeholder="Título" required /><select className="rounded-xl border border-surface-line px-3 py-2" value={cmsForm.status} onChange={event => setCmsForm({ ...cmsForm, status: event.target.value as 'draft' | 'published' })}><option value="draft">Borrador</option><option value="published">Publicar ahora</option></select><textarea className="min-h-28 rounded-xl border border-surface-line px-3 py-2 md:col-span-2" value={cmsForm.body} onChange={event => setCmsForm({ ...cmsForm, body: event.target.value })} placeholder="Contenido visible para el usuario" required /><input className="rounded-xl border border-surface-line px-3 py-2 text-sm md:col-span-2" type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={event => setCmsImage(event.target.files?.[0] ?? null)} /><button className="w-fit rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white md:col-span-2" type="submit">Guardar versión</button></form>{cmsMessage && <p className="mt-3 text-sm">{cmsMessage}</p>}<div className="mt-5 space-y-2">{cms.length ? cms.slice(0, 8).map(item => <article key={item.id} className="rounded-xl border border-surface-line bg-white/60 p-3"><div className="flex flex-wrap items-center justify-between gap-2"><strong>{item.title}</strong><span className="text-xs texto-suave">{item.content_key} · v{item.version} · {item.status}</span></div><p className="mt-1 line-clamp-2 text-sm texto-suave">{item.body}</p></article>) : <p className="text-sm texto-suave">Todavía no hay contenido CMS. Crea el primer anuncio o publica los términos.</p>}</div></section>
    <section className="panel p-5"><h2 className="font-bold">Observabilidad</h2><div className="mt-3 grid gap-2 sm:grid-cols-3">{Object.entries(monitor?.integrations ?? {}).map(([key, value]) => <div key={key} className="rounded-xl border border-surface-line bg-white/60 p-3"><p className="text-xs uppercase text-ink-muted">{key}</p><p className="mt-1 font-semibold">{value}</p></div>)}</div><p className="mt-3 text-xs texto-suave">{monitor?.note}</p></section>
  </div>
}
