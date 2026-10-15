import { apiClient, API_ENDPOINTS } from '../api'
import type { PaginatedResponse } from '../types'
import type { AdminUser, RegisterAdminPayload, RegisterRegulatorPayload } from './types'

export const adminUsersService = {
  /**
   * GET /api/admin/admin-users/ - Daftar semua pengguna admin
   */
  async getAll(search?: string): Promise<AdminUser[]> {
    const url = search
      ? `${API_ENDPOINTS.ADMIN.ADMIN_USERS}?search=${encodeURIComponent(search)}`
      : API_ENDPOINTS.ADMIN.ADMIN_USERS
    const data = await apiClient<PaginatedResponse<AdminUser> | AdminUser[]>(url)
    return Array.isArray(data) ? data : data.results || []
  },

  /**
   * POST /api/admin/admin-users/register/ - Daftarkan admin baru
   */
  async registerAdmin(payload: RegisterAdminPayload): Promise<AdminUser> {
    return apiClient<AdminUser>(`${API_ENDPOINTS.ADMIN.ADMIN_USERS}register/`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  /**
   * POST /api/admin/admin-users/register_regulator/ - Daftarkan regulator baru
   */
  async registerRegulator(payload: RegisterRegulatorPayload): Promise<{
    message: string
    user_id: number
    username: string
    role: string
    full_name: string
    email: string
  }> {
    return apiClient(`${API_ENDPOINTS.ADMIN.ADMIN_USERS}register_regulator/`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
}
