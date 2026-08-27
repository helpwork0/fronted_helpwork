import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Mascot } from '@/components/mascot/Mascot'
import { ROUTES } from '@/config/site.config'
import { cn } from '@/lib/cn'

const PASOS = ['Qué necesitas', 'Detalles', 'Presupuesto', 'Revisar'] as const
const CATEGORIAS = ['Clases particulares', 'Redacción de tesis', 'Proyectos / Prácticas', 'Diseño / Creación', 'Programación', 'Marketing']
const MODALIDADES = ['En línea', 'Presencial', 'Cualquiera']

/** Formulario por pasos para publicar una solicitud. */
export default function NewRequestPage() {
  const [paso, setPaso] = useState(0)
  const navigate = useNavigate()
  const [f, setF] = useState({
    titulo: '', categoria: '', descripcion: '', modalidad: 'En línea',
    fecha: '', min: '', max: '', unidad: 'hora',
  })

  const puedeSeguir =
    paso === 0 ? f.titulo.trim() && f.categoria :
    paso === 1 ? f.descripcion.trim().length > 15 :
    paso === 2 ? f.min && f.max : true

  const avanzar = () => {
    if (paso < PASOS.length - 1) setPaso(p => p + 1)
    // TODO backend: await http.post(ENDPOINTS.solicitudes.list, f)
    else navigate(ROUTES.solicitudes)
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader titulo="Nueva solicitud" descripcion="Cuéntanos qué necesitas y deja que las propuestas lleguen a ti." />

      {/* Progreso */}
      <ol className="mb-6 flex items-center">
        {PASOS.map((p, i) => (
          <li key={p} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <span className={cn('grid h-9 w-9 place-items-center rounded-full text-[13px] font-bold transition-colors',
                i < paso ? 'bg-success-500 text-white' : i === paso ? 'bg-brand-600 text-white' : 'border border-white/80 bg-white/70 text-ink-muted')}>
                {i < paso ? <Check size={16} /> : i + 1}
              </span>
              <span className={cn('hidden text-[12px] font-semibold sm:block', i === paso ? 'text-brand-600' : 'texto-suave')}>{p}</span>
            </div>
            {i < PASOS.length - 1 && (
              <span className="relative mx-2 mb-5 h-[2px] flex-1 bg-black/10">
                <motion.span className="absolute inset-y-0 left-0 bg-success-500"
                  initial={{ width: 0 }} animate={{ width: i < paso ? '100%' : 0 }} transition={{ duration: 0.4 }} />
              </span>
            )}
          </li>
        ))}
      </ol>

      <div className="panel p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={paso}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {paso === 0 && (
              <>
                <Input label="¿Qué necesitas?" placeholder="Ej. Clases de cálculo diferencial"
                  value={f.titulo} onChange={e => setF({ ...f, titulo: e.target.value })} />
                <div>
                  <p className="mb-2 text-sm font-medium text-ink-soft">Categoría</p>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIAS.map(c => (
                      <button key={c} onClick={() => setF({ ...f, categoria: c })}
                        className={cn('rounded-full border px-4 py-2 text-[13.5px] font-medium transition',
                          f.categoria === c ? 'border-brand-500 bg-brand-600 text-white' : 'border-white/80 bg-white/60 texto-suave hover:border-brand-300')}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {paso === 1 && (
              <>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-soft">Describe con detalle</label>
                  <textarea
                    rows={6} value={f.descripcion} onChange={e => setF({ ...f, descripcion: e.target.value })}
                    placeholder="Mientras más contexto des, mejores propuestas recibirás. Menciona el nivel, los temas concretos y para cuándo lo necesitas."
                    className="w-full rounded-xl border border-white/80 bg-white/70 px-4 py-3 text-[15px] outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                  />
                  <p className="mt-1 text-[12px] text-ink-muted">{f.descripcion.length} caracteres · mínimo recomendado 80</p>
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-ink-soft">Modalidad</p>
                  <div className="flex flex-wrap gap-2">
                    {MODALIDADES.map(m => (
                      <button key={m} onClick={() => setF({ ...f, modalidad: m })}
                        className={cn('rounded-full border px-4 py-2 text-[13.5px] font-medium transition',
                          f.modalidad === m ? 'border-brand-500 bg-brand-600 text-white' : 'border-white/80 bg-white/60 texto-suave hover:border-brand-300')}>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
                <Input label="¿Para cuándo?" type="date" value={f.fecha} onChange={e => setF({ ...f, fecha: e.target.value })} />
              </>
            )}

            {paso === 2 && (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input label="Desde ($)" type="number" placeholder="10" value={f.min} onChange={e => setF({ ...f, min: e.target.value })} />
                  <Input label="Hasta ($)" type="number" placeholder="15" value={f.max} onChange={e => setF({ ...f, max: e.target.value })} />
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-ink-soft">Se cobra por</p>
                  <div className="flex gap-2">
                    {['hora', 'proyecto'].map(u => (
                      <button key={u} onClick={() => setF({ ...f, unidad: u })}
                        className={cn('rounded-full border px-5 py-2 text-[13.5px] font-medium capitalize transition',
                          f.unidad === u ? 'border-brand-500 bg-brand-600 text-white' : 'border-white/80 bg-white/60 texto-suave hover:border-brand-300')}>
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 rounded-xl2 bg-brand-50/70 p-4">
                  <Sparkles size={18} className="mt-0.5 shrink-0 text-brand-500" />
                  <p className="text-[13.5px] texto-suave">
                    Un rango realista atrae más propuestas. Para tutorías universitarias en Loja
                    lo habitual está entre <strong className="font-semibold text-ink">$10 y $18 por hora</strong>.
                  </p>
                </div>
              </>
            )}

            {paso === 3 && (
              <div className="flex gap-5">
                <Mascot pose="libro" animation="none" className="hidden w-24 shrink-0 sm:block" />
                <div className="min-w-0 flex-1 space-y-3">
                  <h3 className="text-[18px] font-bold">{f.titulo || 'Sin título'}</h3>
                  <p className="text-[14px] texto-suave">{f.descripcion || 'Sin descripción'}</p>
                  <dl className="grid gap-2 text-[13.5px] sm:grid-cols-2">
                    <Dato k="Categoría" v={f.categoria || '—'} />
                    <Dato k="Modalidad" v={f.modalidad} />
                    <Dato k="Fecha" v={f.fecha || 'Flexible'} />
                    <Dato k="Presupuesto" v={f.min && f.max ? `$${f.min} – $${f.max} / ${f.unidad}` : '—'} />
                  </dl>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-7 flex items-center justify-between gap-3 border-t border-white/60 pt-5">
          <Button variant="ghost" onClick={() => paso === 0 ? navigate(-1) : setPaso(p => p - 1)}>
            <ArrowLeft size={16} /> {paso === 0 ? 'Cancelar' : 'Atrás'}
          </Button>
          <Button onClick={avanzar} disabled={!puedeSeguir}>
            {paso === PASOS.length - 1 ? 'Publicar solicitud' : 'Continuar'} <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  )
}

function Dato({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-xl bg-white/60 px-3 py-2">
      <dt className="text-[12px] text-ink-muted">{k}</dt>
      <dd className="font-semibold">{v}</dd>
    </div>
  )
}
