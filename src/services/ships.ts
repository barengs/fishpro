import { apiClient, API_ENDPOINTS } from './api'
import type { PaginatedResponse } from './owners'

export interface QuotaInfo {
  year: number
  total_quota: number | string
  remaining_quota: number | string
  used_quota: number | string
  quota_percentage: number
}

export interface Ship {
  id: number
  name: string
  registration_number: string
  owner?: number | null
  owner_name?: string | null
  captain?: number | null
  captain_name?: string | null
  length?: number | string | null
  width?: number | string | null
  gross_tonnage?: number | string | null
  year_built?: number | null
  home_port?: string | null
  active: boolean
  current_year_quota?: QuotaInfo | null
  created_at?: string
  updated_at?: string
}

export interface CreateShipPayload {
  name: string
  registration_number: string
  owner?: number | null
  captain?: number | null
  length?: number | string | null
  width?: number | string | null
  gross_tonnage?: number | string | null
  year_built?: number | null
  home_port?: string | null
  active?: boolean
}

export interface ShipRecommendation {
  id: number
  name: string
  registration_number: string
  owner: string
  captain?: string | null
  total_catch: number
  average_catch: number
  catch_trend: string
  catch_efficiency: number
  best_fishing_location?: {
    latitude: number | null
    longitude: number | null
  }
  best_fishing_months: string[]
}

export const shipsService = {
  /**
   * GET /api/ships/ships/ - Mengambil semua kapal (mendukung search)
   */
  async getAll(search?: string): Promise<Ship[]> {
    const url = search
      ? `${API_ENDPOINTS.SHIPS.LIST}?search=${encodeURIComponent(search)}`
      : API_ENDPOINTS.SHIPS.LIST

    const data = await apiClient<PaginatedResponse<Ship> | Ship[]>(url)
    return Array.isArray(data) ? data : data.results || []
  },

  /**
   * GET /api/ships/ships/{id}/ - Mengambil detail satu kapal
   */
  async getById(id: number): Promise<Ship> {
    return apiClient<Ship>(`${API_ENDPOINTS.SHIPS.LIST}${id}/`)
  },

  /**
   * GET /api/ships/ships/by_owner/?owner_id={id} - Mengambil kapal berdasarkan pemilik
   */
  async getByOwner(ownerId: number): Promise<Ship[]> {
    const data = await apiClient<Ship[]>(
      `${API_ENDPOINTS.SHIPS.LIST}by_owner/?owner_id=${ownerId}`
    )
    return Array.isArray(data) ? data : []
  },

  /**
   * GET /api/ships/ships/by_captain/?captain_id={id} - Mengambil kapal berdasarkan nahkoda
   */
  async getByCaptain(captainId: number): Promise<Ship[]> {
    const data = await apiClient<Ship[]>(
      `${API_ENDPOINTS.SHIPS.LIST}by_captain/?captain_id=${captainId}`
    )
    return Array.isArray(data) ? data : []
  },

  /**
   * GET /api/ships/check-ship/?registration_number={reg}
   */
  async checkRegistration(reg: string): Promise<{ exists: boolean; ship?: Ship }> {
    return apiClient<{ exists: boolean; ship?: Ship }>(
      `${API_ENDPOINTS.SHIPS.CHECK_REGISTRATION}?registration_number=${encodeURIComponent(reg)}`
    )
  },

  /**
   * POST /api/ships/ships/ - Menambahkan kapal baru
   */
  async create(payload: CreateShipPayload): Promise<Ship> {
    return apiClient<Ship>(API_ENDPOINTS.SHIPS.LIST, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  /**
   * PUT /api/ships/ships/{id}/ - Memperbarui data kapal
   */
  async update(id: number, payload: CreateShipPayload): Promise<Ship> {
    return apiClient<Ship>(`${API_ENDPOINTS.SHIPS.LIST}${id}/`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  },

  /**
   * PATCH /api/ships/ships/{id}/ - Memperbarui sebagian data kapal
   */
  async patch(id: number, payload: Partial<CreateShipPayload>): Promise<Ship> {
    return apiClient<Ship>(`${API_ENDPOINTS.SHIPS.LIST}${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
  },

  /**
   * DELETE /api/ships/ships/{id}/ - Menghapus kapal
   */
  async delete(id: number): Promise<void> {
    await apiClient(`${API_ENDPOINTS.SHIPS.LIST}${id}/`, {
      method: 'DELETE',
    })
  },

  /**
   * GET /api/ships/ai-recommendations/
   */
  async getAiRecommendations(): Promise<{
    top_ships: ShipRecommendation[]
    analysis_period: string
    recommendation_factors: string
    total_ships_analyzed: number
  }> {
    return apiClient(`${API_ENDPOINTS.SHIPS.AI_RECOMMENDATIONS}`)
  },
}
