import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Une clases de Tailwind resolviendo conflictos (p.ej. px-4 + px-6 => px-6). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
