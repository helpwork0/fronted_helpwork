import { useState } from 'react'
import { motion } from 'framer-motion'
import { BadgeCheck, Camera, Plus, Star, X } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ProgressRing } from '../components/ProgressRing'
import { useAuth } from '@/features/auth/AuthContext'
import { RESENAS } from '@/data/appData'

export default function ProfilePage() {
  const { usuario } = useAuth()
  const [habilidades, setHabilidades] = useState(['Matemáticas', 'Cálculo', 'Álgebra Lineal', 'Estadística'])
  const [nueva, setNueva] = useState('')

  const agregar = () => {
    const h = nueva.trim()
    if (h && !habilidades.includes(h)) setHabilidades(hs => [...hs, h])
    setNueva('')
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader titulo="Perfil público" descripcion="Así te ven quienes buscan ayuda.">
        <Button size="sm">Guardar cambios</Button>
      </PageHeader>

      {/* Portada */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="panel overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-brand-400 via-brand-500 to-violet-400" />
        <div className="flex flex-col gap-4 px-6 pb-6 sm:flex-row sm:items-end">
          <div className="relative -mt-12 shrink-0">
            <img
              src={usuario?.avatarUrl ?? 'https://i.pravatar.cc/160?u=joaquin'}
              alt="" className="h-24 w-24 rounded-full object-cover ring-4 ring-white"
            />
            <button aria-label="Cambiar foto"
              className="absolute bottom-1 right-1 grid h-8 w-8 place-items-center rounded-full bg-brand-600 text-white ring-2 ring-white transition hover:bg-brand-500">
              <Camera size={14} />
            </button>
          </div>

          <div className="min-w-0 flex-1 pt-2">
            <h2 className="flex items-center gap-1.5 text-[22px] font-extrabold">
              {usuario?.nombre ?? 'Joaquín Quintero'}
              <BadgeCheck size={19} className="text-brand-500" />
            </h2>
            <p className="text-[14px] texto-suave">Ingeniero Matemático · Loja, Ecuador</p>
            <p className="mt-1 text-[13px] text-ink-muted">
              <Star size={12} className="inline text-amber-500" fill="currentColor" /> 4.9 · {RESENAS.length} reseñas · 6 años de experiencia
            </p>
          </div>

          <div className="shrink-0 text-center">
            <ProgressRing valor={85} tamano={64} color="#2563EB" />
            <p className="mt-1 text-[11.5px] texto-suave">completado</p>
          </div>
        </div>
      </motion.div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {/* Datos */}
        <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="panel space-y-4 p-5">
          <h3 className="text-[17px] font-bold">Información</h3>
          <Input label="Titular" defaultValue="Ingeniero Matemático" />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-soft">Sobre mí</label>
            <textarea
              rows={5}
              defaultValue="Ingeniero matemático con 6 años dando clases a nivel universitario. Me especializo en cálculo, álgebra lineal y estadística aplicada. Preparo material propio según lo que cada estudiante necesita."
              className="w-full rounded-xl border border-white/80 bg-white/70 px-4 py-3 text-[14.5px] leading-relaxed outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Tarifa desde ($/h)" type="number" defaultValue="10" />
            <Input label="Tarifa hasta ($/h)" type="number" defaultValue="15" />
          </div>
        </motion.section>

        {/* Habilidades */}
        <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="panel space-y-4 p-5">
          <div>
            <h3 className="text-[17px] font-bold">Habilidades</h3>
            <p className="mt-0.5 text-[13px] texto-suave">Son la base del match: mientras más precisas, mejores oportunidades.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {habilidades.map(h => (
              <motion.span
                key={h} layout
                initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 py-1.5 pl-3.5 pr-2 text-[13px] font-medium text-brand-600"
              >
                {h}
                <button onClick={() => setHabilidades(hs => hs.filter(x => x !== h))} aria-label={`Quitar ${h}`}
                  className="grid h-5 w-5 place-items-center rounded-full transition hover:bg-brand-200">
                  <X size={12} />
                </button>
              </motion.span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              value={nueva} onChange={e => setNueva(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') agregar() }}
              placeholder="Agregar habilidad"
              className="h-11 min-w-0 flex-1 rounded-xl border border-white/80 bg-white/70 px-4 text-[14px] outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
            />
            <Button size="sm" onClick={agregar}><Plus size={15} /> Añadir</Button>
          </div>

          <div className="border-t border-white/60 pt-4">
            <h4 className="text-[14.5px] font-bold">Disponibilidad</h4>
            <div className="mt-2.5 grid gap-3 sm:grid-cols-2">
              <Input label="Desde" type="time" defaultValue="08:00" />
              <Input label="Hasta" type="time" defaultValue="20:00" />
            </div>
            <Input label="Horas por semana" type="number" defaultValue="15" className="mt-3" />
          </div>
        </motion.section>
      </div>
    </div>
  )
}
