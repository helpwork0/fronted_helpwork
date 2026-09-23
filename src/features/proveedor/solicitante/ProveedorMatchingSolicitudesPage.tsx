import MatchingPage from '@/features/dashboard/pages/MatchingPage'
import { ROUTES } from '@/config/site.config'
/** Misma presentación del matching de solicitante, con navegación exclusiva del proveedor. */
export default function ProveedorMatchingSolicitudesPage() { return <MatchingPage embedded volverA={ROUTES.proveedorSolicitudes} /> }
