import { motion } from 'framer-motion'
import { Circle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { Presencia } from '@/data/appData'
import { cn } from '@/lib/cn'

const ESTADOS = {
  en_linea: { color: 'bg-success-500', texto: 'En línea' },
  ocupado:  { color: 'bg-amber-500',   texto: 'Ocupado' },
  ausente:  { color: 'bg-black/25',    texto: 'Ausente' },
}

/**
 * "Quién está activo ahora".
 *
 * Es el mismo componente para los dos paneles, pero muestra gente
 * distinta: el HelpSeeker ve HelpWorkers disponibles, y el HelpWorker
 * ve HelpSeekers que acaban de publicar. Lo que cambia es la lista y
 * el texto del botón, no el componente.
 */
export function PresenceList({
  titulo, gente, textoBoton, onAccion, verTodos,
}: {
  titulo: string
  gente: Presencia[]
  textoBoton: string
  onAccion: (id: string) => void
  verTodos?: string
}) {
  const enLinea = gente.filter(g => g.estado === 'en_linea').length

  return (
    <section className="panel p-5">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-[18px] font-bold">{titulo}</h2>
          <p className="mt-0.5 flex items-center gap-1.5 text-[12.5px] texto-suave">
            <motion.span
              animate={{ opacity: [1, 0.35, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-block h-2 w-2 rounded-full bg-success-500"
            />
            {enLinea} en línea ahora
          </p>
        </div>
        {verTodos && <Button variant="ghost" size="sm" to={verTodos}>Ver todos</Button>}
      </header>

      <ul className="space-y-1">
        {gente.map((g, i) => (
          <motion.li
            key={g.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.07 }}
            className="group flex items-center gap-3 rounded-xl2 p-2 transition-colors hover:bg-white/70"
          >
            <div className="relative shrink-0">
              <img src={g.avatarUrl} alt="" className="h-11 w-11 rounded-full object-cover" />
              <span className={cn('absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full ring-2 ring-white', ESTADOS[g.estado].color)} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[14.5px] font-bold">{g.nombre}</p>
              <p className="truncate text-[12.5px] texto-suave">{g.detalle}</p>
            </div>

            <span className="hidden shrink-0 rounded-full bg-brand-50 px-2.5 py-1 text-[11.5px] font-semibold text-brand-600 sm:block">
              {g.etiqueta}
            </span>

            <Button
              size="sm"
              variant={g.estado === 'en_linea' ? 'primary' : 'secondary'}
              className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
              onClick={() => onAccion(g.id)}
            >
              {textoBoton}
            </Button>
          </motion.li>
        ))}
      </ul>

      <p className="mt-3 flex items-center gap-3 border-t border-white/60 pt-3 text-[11.5px] texto-suave">
        {Object.values(ESTADOS).map(e => (
          <span key={e.texto} className="inline-flex items-center gap-1.5">
            <Circle size={8} className={cn('rounded-full', e.color)} fill="currentColor" strokeWidth={0} />
            {e.texto}
          </span>
        ))}
      </p>
    </section>
  )
}
