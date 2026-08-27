import { motion } from 'framer-motion'
import { EASE } from '@/lib/motion/variants'
import { cn } from '@/lib/cn'

/** Fondo de paisaje + tarjeta centrada. Lo comparten login, registro y rol. */
export function AuthShell({ children, wide }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="relative grid min-h-screen place-items-center px-5 py-[calc(var(--nav-h)+2rem)]">
      <img src="/assets/hero-bg.jpg" alt="" className="fixed inset-0 -z-10 h-full w-full object-cover" />
      <div className="fixed inset-0 -z-10 bg-white/25 backdrop-blur-[2px]" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.65, ease: EASE }}
        className={cn(
          'w-full rounded-xl3 bg-white p-8 shadow-[0_30px_80px_rgba(11,27,58,.22)] sm:p-10',
          wide ? 'max-w-[880px]' : 'max-w-[470px]',
        )}
      >
        {children}
      </motion.div>
    </div>
  )
}
