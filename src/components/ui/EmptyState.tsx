import { Mascot } from '@/components/mascot/Mascot'

/** Estado vacío con la mascota, para que "no hay nada" no se sienta un error. */
export function EmptyState({
  titulo, texto, children,
}: { titulo: string; texto: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      <Mascot pose="guia" animation="none" className="w-24 opacity-90" />
      <h3 className="text-[17px] font-bold">{titulo}</h3>
      <p className="max-w-sm text-[14px] texto-suave">{texto}</p>
      {children}
    </div>
  )
}
