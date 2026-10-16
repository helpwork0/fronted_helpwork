import { useEffect, useState } from 'react'
import { http } from '@/lib/api/http'
import { ENDPOINTS } from '@/lib/api/endpoints'

/** Indicadores reactivos por sondeo ligero: no cargan listas completas ni requieren recargar la página. */
export function useProposalIndicators(role: 'requester' | 'provider') {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let active = true
    const refresh = async () => {
      try {
        if (role === 'requester') {
          const value = await http.get<{ pendientes: number }>(ENDPOINTS.propuestas.requesterSummary)
          if (active) setCount(value.pendientes)
        } else {
          const value = await http.get<{ trabajosNuevos: number }>(ENDPOINTS.propuestas.providerSummary)
          if (active) setCount(value.trabajosNuevos)
        }
      } catch { if (active) setCount(0) }
    }
    refresh().catch(() => undefined)
    const timer = window.setInterval(() => refresh().catch(() => undefined), 10000)
    window.addEventListener('helpwork:propuestas-actualizadas', refresh)
    return () => { active = false; window.clearInterval(timer); window.removeEventListener('helpwork:propuestas-actualizadas', refresh) }
  }, [role])
  return count
}
