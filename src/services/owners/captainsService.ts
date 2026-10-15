import { apiClient, API_ENDPOINTS } from '../api'
import type { PaginatedResponse } from '../types'
import type { Captain, CreateCaptainPayload } from './types'

export const captainsService = {
  /**
   * GET /api/owners/captains/ - Mengambil daftar semua nahkoda kapal
   */
  async getAll(search?: string): Promise<Captain[]> {
    const url = search
      ? `${API_ENDPOINTS.OWNERS.CAPTAINS}?search=${encodeURIComponent(search)}`
      : API_ENDPOINTS.OWNERS.CAPTAINS

    const data = await apiClient<PaginatedResponse<Captain> | Captain[]>(url)
    return Array.isArray(data) ? data : data.results || []
  },

  /**
   * GET /api/owners/captains/{id}/ - Mengambil detail nahkoda
   */
  async getById(id: number): Promise<Captain> {
    return apiClient<Captain>(`${API_ENDPOINTS.OWNERS.CAPTAINS}${id}/`)
  },

  /**
   * POST /api/owners/captains/ - Membuat nahkoda baru
   */
  async create(payload: CreateCaptainPayload): Promise<Captain> {
    return apiClient<Captain>(API_ENDPOINTS.OWNERS.CAPTAINS, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  /**
   * PUT /api/owners/captains/{id}/ - Memperbarui seluruh data nahkoda
   */
  async update(id: number, payload: CreateCaptainPayload): Promise<Captain> {
    return apiClient<Captain>(`${API_ENDPOINTS.OWNERS.CAPTAINS}${id}/`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  },

  /**
   * PATCH /api/owners/captains/{id}/ - Memperbarui sebagian data nahkoda
   */
  async patch(id: number, payload: Partial<CreateCaptainPayload>): Promise<Captain> {
    return apiClient<Captain>(`${API_ENDPOINTS.OWNERS.CAPTAINS}${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
  },

  /**
   * DELETE /api/owners/captains/{id}/ - Menghapus nahkoda
   */
  async delete(id: number): Promise<void> {
    await apiClient(`${API_ENDPOINTS.OWNERS.CAPTAINS}${id}/`, {
      method: 'DELETE',
    })
  },
}
