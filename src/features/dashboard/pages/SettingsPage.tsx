import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Globe, Lock, RefreshCw, Trash2, UserCog } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/features/auth/AuthContext'
import { reiniciarGuias } from '@/components/onboarding/useAutoTour'
import { cn } from '@/lib/cn'

export default function SettingsPage() {
  const { usuario } = useAuth()
  const [avisos, setAvisos] = useState({ correo: true, whatsapp: true, propuestas: true, mensajes: true, resumen: false })

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <PageHeader titulo="Ajustes" descripcion="Tu cuenta, tus avisos y tus preferencias." />

      <Bloque icon={UserCog} titulo="Cuenta">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Nombre" defaultValue={usuario?.nombre ?? 'Joaquín Quintero'} />
          <Input label="Correo" type="email" defaultValue={usuario?.email ?? 'correo@ejemplo.com'} />
          <Input label="Teléfono" defaultValue="+593 98 987 7633" />
          <Input label="Ciudad" defaultValue="Loja, Ecuador" />
        </div>
        <Button size="sm" className="mt-4">Guardar</Button>
      </Bloque>

      <Bloque icon={Bell} titulo="Notificaciones">
        <div className="space-y-1">
          <Interruptor label="Avisos por correo" descripcion="Resumen de lo importante en tu bandeja"
            activo={avisos.correo} onChange={v => setAvisos({ ...avisos, correo: v })} />
          <Interruptor label="Avisos por WhatsApp" descripcion="Para lo urgente, como propuestas nuevas"
            activo={avisos.whatsapp} onChange={v => setAvisos({ ...avisos, whatsapp: v })} />
          <Interruptor label="Propuestas recibidas" descripcion="Cada vez que alguien responde a tu solicitud"
            activo={avisos.propuestas} onChange={v => setAvisos({ ...avisos, propuestas: v })} />
          <Interruptor label="Mensajes nuevos" descripcion="Cuando te escriben por el chat"
            activo={avisos.mensajes} onChange={v => setAvisos({ ...avisos, mensajes: v })} />
          <Interruptor label="Resumen semanal" descripcion="Un correo los lunes con tu actividad"
            activo={avisos.resumen} onChange={v => setAvisos({ ...avisos, resumen: v })} />
        </div>
      </Bloque>

      <Bloque icon={Globe} titulo="Preferencias">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-soft">Idioma</label>
            <select className="h-12 w-full rounded-xl border border-white/80 bg-white/70 px-3 text-[15px] outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100">
              <option>Español</option><option>English</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-soft">Moneda</label>
            <select className="h-12 w-full rounded-xl border border-white/80 bg-white/70 px-3 text-[15px] outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100">
              <option>USD ($)</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => { reiniciarGuias(); window.location.reload() }}
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-4 py-2.5 text-[13.5px] font-semibold text-brand-600 transition hover:border-brand-300"
        >
          <RefreshCw size={15} /> Volver a ver las guías de la app
        </button>
      </Bloque>

      <Bloque icon={Lock} titulo="Seguridad">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Contraseña actual" type="password" placeholder="••••••••" />
          <Input label="Contraseña nueva" type="password" placeholder="••••••••" />
        </div>
        <Button size="sm" className="mt-4">Cambiar contraseña</Button>
      </Bloque>

      <Bloque icon={Trash2} titulo="Zona sensible" peligro>
        <p className="text-[13.5px] texto-suave">
          Al eliminar tu cuenta se borran tus solicitudes, mensajes e historial. Esta acción no se puede deshacer.
        </p>
        <button className="mt-4 rounded-full border border-red-200 bg-red-50 px-4 py-2.5 text-[13.5px] font-semibold text-red-600 transition hover:bg-red-100">
          Eliminar mi cuenta
        </button>
      </Bloque>
    </div>
  )
}

function Bloque({ icon: Icon, titulo, peligro, children }: {
  icon: typeof Bell; titulo: string; peligro?: boolean; children: React.ReactNode
}) {
  return (
    <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="panel p-5">
      <h2 className="mb-4 flex items-center gap-2.5 text-[17px] font-bold">
        <span className={cn('grid h-9 w-9 place-items-center rounded-xl',
          peligro ? 'bg-red-50 text-red-600' : 'bg-brand-50 text-brand-600')}>
          <Icon size={17} />
        </span>
        {titulo}
      </h2>
      {children}
    </motion.section>
  )
}

function Interruptor({ label, descripcion, activo, onChange }: {
  label: string; descripcion: string; activo: boolean; onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl px-1 py-2.5 transition hover:bg-white/50">
      <div className="min-w-0 flex-1">
        <p className="text-[14.5px] font-medium">{label}</p>
        <p className="text-[12.5px] texto-suave">{descripcion}</p>
      </div>
      <button
        role="switch" aria-checked={activo} aria-label={label}
        onClick={() => onChange(!activo)}
        className={cn('relative h-6 w-11 shrink-0 rounded-full transition-colors', activo ? 'bg-success-500' : 'bg-black/15')}
      >
        <motion.span layout transition={{ type: 'spring', stiffness: 500, damping: 32 }}
          className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm', activo ? 'right-0.5' : 'left-0.5')} />
      </button>
    </div>
  )
}
