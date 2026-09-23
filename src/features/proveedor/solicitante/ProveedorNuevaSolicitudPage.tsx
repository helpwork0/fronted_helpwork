import NewRequestPage from '@/features/dashboard/pages/NewRequestPage'
import { ROUTES } from '@/config/site.config'
/** Misma interfaz que solicitante, retorno exclusivo al área HelpWorker. */
export default function ProveedorNuevaSolicitudPage() { return <NewRequestPage volverA={ROUTES.proveedorSolicitudes} /> }
