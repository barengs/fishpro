import { apiClient, API_ENDPOINTS } from "../api";
import type { PaginatedResponse } from "../types";
import type { Captain, CreateCaptainPayload } from "./types";

export const captainsService = {
  /**
   * GET /api/owners/captains/ - Daftar semua nahkoda
   * Mengambil daftar semua nahkoda kapal (informasi lisensi dan pengalaman)
   */
  async getAll(search?: string): Promise<Captain[]> {
    const url = search
      ? `${API_ENDPOINTS.CAPTAINS.LIST}?search=${encodeURIComponent(search)}`
      : API_ENDPOINTS.CAPTAINS.LIST;

    const data = await apiClient<PaginatedResponse<Captain> | Captain[]>(url);
    return Array.isArray(data) ? data : data.results || [];
  },

  /**
   * GET /api/owners/captains/{id}/ - Ambil nahkoda
   * Mengambil nahkoda tertentu berdasarkan ID
   */
  async getById(id: number): Promise<Captain> {
    return apiClient<Captain>(`${API_ENDPOINTS.CAPTAINS.LIST}${id}/`);
  },

  /**
   * POST /api/owners/captains/ - Buat nahkoda
   * Membuat nahkoda kapal baru
   */
  async create(payload: CreateCaptainPayload): Promise<Captain> {
    return apiClient<Captain>(API_ENDPOINTS.CAPTAINS.LIST, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * PUT /api/owners/captains/{id}/ - Perbarui nahkoda
   * Memperbarui seluruh data nahkoda yang ada
   */
  async update(id: number, payload: CreateCaptainPayload): Promise<Captain> {
    return apiClient<Captain>(`${API_ENDPOINTS.CAPTAINS.LIST}${id}/`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  /**
   * PATCH /api/owners/captains/{id}/ - Perbarui sebagian nahkoda
   * Memperbarui sebagian informasi nahkoda yang ada
   */
  async patch(
    id: number,
    payload: Partial<CreateCaptainPayload>,
  ): Promise<Captain> {
    return apiClient<Captain>(`${API_ENDPOINTS.CAPTAINS.LIST}${id}/`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  /**
   * DELETE /api/owners/captains/{id}/ - Hapus nahkoda
   * Menghapus nahkoda dari sistem
   */
  async delete(id: number): Promise<void> {
    await apiClient(`${API_ENDPOINTS.CAPTAINS.LIST}${id}/`, {
      method: "DELETE",
    });
  },
};
