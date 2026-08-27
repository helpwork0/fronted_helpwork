import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { fadeUp } from '@/lib/motion/variants'
import { cn } from '@/lib/cn'

interface Props {
  icon: LucideIcon
  label: string
  valor: string
  nota?: string
  tono?: 'brand' | 'success' | 'amber' | 'violet'
}

const tonos = {
  brand:   'bg-brand-50 text-brand-600',
  success: 'bg-success-100 text-success-500',
  amber:   'bg-amber-100 text-amber-500',
  violet:  'bg-violet-100 text-violet-600',
}

export function StatCard({ icon: Icon, label, valor, nota, tono = 'brand' }: Props) {
  return (
    <motion.div variants={fadeUp}>
      <Card hover className="flex items-center gap-4 p-5">
        <span className={cn('grid h-12 w-12 shrink-0 place-items-center rounded-2xl', tonos[tono])}>
          <Icon size={22} />
        </span>
        <div className="min-w-0">
          <p className="truncate text-[13px] text-ink-muted">{label}</p>
          <p className="text-[22px] font-extrabold leading-tight">{valor}</p>
          {nota && <p className="text-[12.5px] text-ink-muted">{nota}</p>}
        </div>
      </Card>
    </motion.div>
  )
}
