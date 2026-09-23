import type { MatchCandidate, ServiceRequest, User, UserRole } from '@/types'

export interface ApiUser {
  id: string
  full_name: string
  email: string
  avatar_url?: string | null
}

export interface AuthResponse { usuario: ApiUser; roles: string[]; emailConfirmationRequired?: boolean }

export interface ApiProfileBundle {
  usuario: ApiUser; roles: string[]
  perfilSolicitante?: { city?: string | null; academic_program?: string | null; academic_level?: string | null; preferred_languages?: string[] | null } | null
  perfilProveedor?: { display_name?: string | null; city?: string | null; average_rating?: number | null; review_count?: number | null; status?: string | null } | null
}

export interface ApiProviderService {
  id?: string; field_code: string; topic_codes: string[]; service_type_code: string; academic_levels: string[]; modalities: string[]; languages: string[]
  price_min?: number | null; price_max?: number | null; specialization_score?: number | null; opportunity_interest_score?: number | null; semantic_score?: number | null; excluded_topic_codes?: string[]
}
export interface ApiProviderAvailability { availability_status?: string; timezone?: string; weekly_slots?: { dia: number; inicio: string; fin: string }[]; hours_per_week?: number; committed_hours?: number; max_concurrent_services?: number; response_window_minutes?: number }
export interface ApiReview { id: string; request_id?: string; rating: number; comment?: string | null; created_at: string; users?: { full_name?: string; avatar_url?: string | null } | null }
export interface ApiBlock { blocked_id: string; reason?: string | null; created_at: string; users?: { full_name?: string; avatar_url?: string | null } | null }
export interface ApiTask { id: string; title: string; description?: string | null; task_type: string; status: 'pending' | 'queued' | 'processing' | 'completed' | 'failed'; scheduled_for: string; completed_at?: string | null; last_error?: string | null }
export interface ApiProviderOpportunity { id: string; request_id: string; status: string; rank_position: number; created_at: string; matching?: { distribution_score?: number; reciprocal_score?: number } | null; requester?: { id: string; full_name?: string; avatar_url?: string | null } | null; service_requests?: { field_code?: string; service_type_code?: string; academic_level?: string; modality?: string; city?: string | null; budget_min?: number | null; budget_max?: number | null; expires_at?: string | null; status?: string; description_free?: string | null } | null }

export const roleFromApi = (roles: string[]): UserRole => roles.includes('admin') ? 'administrador' : roles.includes('provider') ? 'helpworker' : 'solicitante'

export const userFromApi = (response: AuthResponse, esCuentaNueva = false): User & { esCuentaNueva: boolean } => ({
  id: response.usuario.id,
  nombre: response.usuario.full_name,
  email: response.usuario.email,
  rol: roleFromApi(response.roles),
  roles: response.roles.filter((role): role is 'requester' | 'provider' | 'admin' => role === 'requester' || role === 'provider' || role === 'admin').map(role => role === 'provider' ? 'helpworker' : role === 'admin' ? 'administrador' : 'solicitante'),
  avatarUrl: response.usuario.avatar_url ?? undefined,
  verificado: true,
  esCuentaNueva,
})

export interface ApiRequest {
  id: string; status: string; field_code: string; service_type_code: string; academic_level: string; modality: string; city?: string | null
  budget_min?: number | null; budget_max?: number | null; needed_at?: string | null; expires_at?: string | null; description_free?: string | null; updated_at?: string
  request_topics?: { topic_code: string }[]; recommendation_assignments?: { id: string; status: string }[]; matching_count?: number
}
export interface ApiRequestAttachment { id: string; original_name: string; mime_type: string; file_kind: 'pdf' | 'word' | 'image'; size_bytes: number; created_at: string; url?: string }

export const requestFromApi = (request: ApiRequest): ServiceRequest => ({
  id: request.id,
  titulo: request.description_free?.slice(0, 52) || `Solicitud de ${request.service_type_code}`,
  categoria: request.field_code,
  estado: request.status === 'closed' || request.status === 'expired' ? 'completado' : request.status === 'active' ? 'recibiendo' : 'publicado',
  propuestas: request.matching_count ?? request.recommendation_assignments?.length ?? 0,
  actualizadoHace: request.updated_at ? new Intl.RelativeTimeFormat('es').format(Math.round((new Date(request.updated_at).getTime() - Date.now()) / 86400000), 'day') : 'hoy',
})

export interface ApiRecommendation { id: string; provider_id: string; rank_position: number; status: string; provider_profiles?: { display_name?: string; average_rating?: number; city?: string }; matching?: { distribution_score?: number; reciprocal_score?: number; score_components?: Record<string, number> } | null }
export interface ApiEvaluation { proveedorId: string; proveedorNombre: string; scoreDistribucion?: number; scoreBilateral?: number; componentes?: Record<string, number> }

export interface ApiRankingCandidate {
  rank_position: number; provider_id: string; score: { distribution_score?: number; reciprocal_score?: number; score_components?: Record<string, number> }
  provider_profile?: { display_name?: string; average_rating?: number; review_count?: number; city?: string } | null
  avatar_url?: string | null
  service?: { topic_codes?: string[]; modalities?: string[]; price_min?: number | null; price_max?: number | null } | null
}

export const rankingFromApi = (candidate: ApiRankingCandidate): MatchCandidate => ({
  id: candidate.provider_id,
  nombre: candidate.provider_profile?.display_name ?? 'HelpWorker',
  profesion: candidate.provider_profile?.city ? `HelpWorker · ${candidate.provider_profile.city}` : 'HelpWorker recomendado',
  rating: Number(candidate.provider_profile?.average_rating ?? 0),
  reseñas: Number(candidate.provider_profile?.review_count ?? 0),
  match: Number(candidate.score.distribution_score ?? candidate.score.reciprocal_score ?? 0),
  tarifaMin: Number(candidate.service?.price_min ?? 0),
  tarifaMax: Number(candidate.service?.price_max ?? 0),
  unidad: 'hora',
  habilidades: (candidate.service?.topic_codes ?? Object.entries(candidate.score.score_components ?? {}).filter(([, value]) => value >= .7).map(([key]) => key.replace(/([A-Z])/g, ' $1'))).slice(0, 3),
  disponibilidad: 'Disponible',
  modalidad: candidate.service?.modalities?.map(item => item === 'online' ? 'En línea' : item).join(', ') ?? 'Compatible',
  avatarUrl: candidate.avatar_url ?? '',
  verificado: true,
})

export const matchFromApi = (recommendation: ApiRecommendation, evaluation?: ApiEvaluation): MatchCandidate => ({
  id: recommendation.provider_id,
  nombre: recommendation.provider_profiles?.display_name ?? evaluation?.proveedorNombre ?? 'HelpWorker',
  profesion: 'HelpWorker recomendado',
  rating: Number(recommendation.provider_profiles?.average_rating ?? 0),
  reseñas: 0,
  match: Math.round(Number(recommendation.matching?.distribution_score ?? evaluation?.scoreDistribucion ?? evaluation?.scoreBilateral ?? 0)),
  tarifaMin: 0,
  tarifaMax: 0,
  unidad: 'hora',
  habilidades: Object.entries(recommendation.matching?.score_components ?? evaluation?.componentes ?? {}).filter(([, value]) => value >= .7).slice(0, 3).map(([key]) => key.replace(/([A-Z])/g, ' $1')),
  disponibilidad: 'Compatible',
  modalidad: 'Según tu solicitud',
  avatarUrl: `https://i.pravatar.cc/120?u=${recommendation.provider_id}`,
  verificado: true,
})
