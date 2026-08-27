import { motion } from 'framer-motion'

/** Cabecera común de las pantallas internas: título, bajada y acciones. */
export function PageHeader({
  titulo, descripcion, children,
}: { titulo: string; descripcion?: string; children?: React.ReactNode }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
      className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        <h1 className="text-[26px] font-extrabold leading-tight">{titulo}</h1>
        {descripcion && <p className="mt-1 text-[14.5px] texto-suave">{descripcion}</p>}
      </div>
      {children && <div className="flex shrink-0 flex-wrap gap-2">{children}</div>}
    </motion.header>
  )
}
