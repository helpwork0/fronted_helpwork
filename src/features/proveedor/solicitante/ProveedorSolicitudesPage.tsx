import RequestsPage from '@/features/dashboard/pages/RequestsPage'
import { ROUTES } from '@/config/site.config'
/** Misma interfaz que solicitante, con destinos exclusivos de proveedor. */
export default function ProveedorSolicitudesPage() { return <RequestsPage rutas={{ solicitudes: ROUTES.proveedorSolicitudes, nueva: ROUTES.proveedorNuevaSolicitud, matching: ROUTES.proveedorMatchingSolicitudes }} /> }
