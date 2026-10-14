import { apiClient, API_ENDPOINTS } from './api'

export interface OwnerShip {
  id: number
  name: string
  registration_number: string
  active: boolean
}

export interface OwnerCaptain {
  id: number
  name: string
  license_number: string
}

export interface Owner {
  id: number
  full_name: string
  owner_type: 'individual' | 'company' | string
  contact_info?: string | null
  email?: string | null
  phone?: string | null
  address?: string | null
  ships?: OwnerShip[]
  captains?: OwnerCaptain[]
  created_at?: string
  updated_at?: string
}

export interface CreateOwnerPayload {
  full_name: string
  owner_type: 'individual' | 'company'
  contact_info?: string
  email?: string
  phone?: string
  address?: string
}

export interface Captain {
  id: number
  full_name: string
  license_number: string
  owner: number
  owner_name?: string
  date_of_birth?: string | null
  contact_info?: string | null
  email?: string | null
  phone?: string | null
  address?: string | null
  years_of_experience?: number | null
  ships?: OwnerShip[]
  created_at?: string
  updated_at?: string
}

export interface CreateCaptainPayload {
  full_name: string
  license_number: string
  owner: number
  date_of_birth?: string | null
  contact_info?: string | null
  email?: string | null
  phone?: string | null
  address?: string | null
  years_of_experience?: number | null
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

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
