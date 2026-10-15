import { apiClient, API_ENDPOINTS } from '../api'
import type { PaginatedResponse } from '../types'
import type { CreateOwnerPayload, Owner } from './types'

export const ownersService = {
  /**
   * GET /api/owners/owners/ - Mengambil daftar semua pemilik kapal
   */
  async getAll(search?: string): Promise<Owner[]> {
    const url = search
      ? `${API_ENDPOINTS.OWNERS.LIST}?search=${encodeURIComponent(search)}`
      : API_ENDPOINTS.OWNERS.LIST

    const data = await apiClient<PaginatedResponse<Owner> | Owner[]>(url)
    return Array.isArray(data) ? data : data.results || []
  },

  /**
   * GET /api/owners/owners/{id}/ - Mengambil detail pemilik berdasarkan ID
   */
  async getById(id: number): Promise<Owner> {
    return apiClient<Owner>(`${API_ENDPOINTS.OWNERS.LIST}${id}/`)
  },

  /**
   * POST /api/owners/owners/ - Membuat pemilik kapal baru
   */
  async create(payload: CreateOwnerPayload): Promise<Owner> {
    return apiClient<Owner>(API_ENDPOINTS.OWNERS.LIST, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  /**
   * PUT /api/owners/owners/{id}/ - Memperbarui seluruh data pemilik
   */
  async update(id: number, payload: CreateOwnerPayload): Promise<Owner> {
    return apiClient<Owner>(`${API_ENDPOINTS.OWNERS.LIST}${id}/`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  },

  /**
   * PATCH /api/owners/owners/{id}/ - Memperbarui sebagian data pemilik
   */
  async patch(id: number, payload: Partial<CreateOwnerPayload>): Promise<Owner> {
    return apiClient<Owner>(`${API_ENDPOINTS.OWNERS.LIST}${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
  },

  /**
   * DELETE /api/owners/owners/{id}/ - Menghapus pemilik
   */
  async delete(id: number): Promise<void> {
    await apiClient(`${API_ENDPOINTS.OWNERS.LIST}${id}/`, {
      method: 'DELETE',
    })
  },
}
