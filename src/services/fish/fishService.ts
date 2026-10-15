import { apiClient, API_ENDPOINTS } from '../api'
import type { PaginatedResponse } from '../types'
import type {
  CreateFishPayload,
  CreateFishSpeciesPayload,
  Fish,
  FishSpecies,
  ImportCsvResponse,
} from './types'

export const fishSpeciesService = {
  /**
   * GET /api/fish/fish-species/ - Daftar semua spesies ikan
   */
  async getAll(search?: string): Promise<FishSpecies[]> {
    const url = search
      ? `${API_ENDPOINTS.FISH.SPECIES}?search=${encodeURIComponent(search)}`
      : API_ENDPOINTS.FISH.SPECIES

    const data = await apiClient<PaginatedResponse<FishSpecies> | FishSpecies[]>(url)
    return Array.isArray(data) ? data : data.results || []
  },

  /**
   * GET /api/fish/fish-species/{id}/ - Ambil spesies ikan
   */
  async getById(id: number): Promise<FishSpecies> {
    return apiClient<FishSpecies>(`${API_ENDPOINTS.FISH.SPECIES}${id}/`)
  },

  /**
   * POST /api/fish/fish-species/ - Buat spesies ikan
   */
  async create(payload: CreateFishSpeciesPayload): Promise<FishSpecies> {
    return apiClient<FishSpecies>(API_ENDPOINTS.FISH.SPECIES, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  /**
   * PUT /api/fish/fish-species/{id}/ - Perbarui spesies ikan
   */
  async update(id: number, payload: CreateFishSpeciesPayload): Promise<FishSpecies> {
    return apiClient<FishSpecies>(`${API_ENDPOINTS.FISH.SPECIES}${id}/`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  },

  /**
   * PATCH /api/fish/fish-species/{id}/ - Perbarui sebagian spesies ikan
   */
  async patch(id: number, payload: Partial<CreateFishSpeciesPayload>): Promise<FishSpecies> {
    return apiClient<FishSpecies>(`${API_ENDPOINTS.FISH.SPECIES}${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
  },

  /**
   * DELETE /api/fish/fish-species/{id}/ - Hapus spesies ikan
   */
  async delete(id: number): Promise<void> {
    await apiClient(`${API_ENDPOINTS.FISH.SPECIES}${id}/`, {
      method: 'DELETE',
    })
  },

  /**
   * GET /api/fish/fish-species/download_template/ - Download template CSV spesies
   */
  getTemplateUrl(): string {
    return `${API_ENDPOINTS.FISH.SPECIES}download_template/`
  },

  /**
   * GET /api/fish/fish-species/download_fish_template/ - Download template CSV ikan
   */
  getFishTemplateUrl(): string {
    return `${API_ENDPOINTS.FISH.SPECIES}download_fish_template/`
  },

  /**
   * POST /api/fish/fish-species/import_species/ - Impor spesies ikan dari CSV
   */
  async importSpecies(csvData: string, clearExisting = false): Promise<ImportCsvResponse> {
    return apiClient<ImportCsvResponse>(`${API_ENDPOINTS.FISH.SPECIES}import_species/`, {
      method: 'POST',
      body: JSON.stringify({
        csv_data: csvData,
        clear_existing: clearExisting,
      }),
    })
  },
}

export const fishService = {
  /**
   * GET /api/fish/fish/ - Daftar semua ikan individual
   */
  async getAll(speciesId?: number): Promise<Fish[]> {
    const url = speciesId
      ? `${API_ENDPOINTS.FISH.LIST}?species_id=${speciesId}`
      : API_ENDPOINTS.FISH.LIST

    const data = await apiClient<PaginatedResponse<Fish> | Fish[]>(url)
    return Array.isArray(data) ? data : data.results || []
  },

  /**
   * GET /api/fish/fish/{id}/ - Ambil detail ikan
   */
  async getById(id: number): Promise<Fish> {
    return apiClient<Fish>(`${API_ENDPOINTS.FISH.LIST}${id}/`)
  },

  /**
   * POST /api/fish/fish/ - Buat ikan baru
   */
  async create(payload: CreateFishPayload): Promise<Fish> {
    return apiClient<Fish>(API_ENDPOINTS.FISH.LIST, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  /**
   * PUT /api/fish/fish/{id}/ - Perbarui ikan
   */
  async update(id: number, payload: CreateFishPayload): Promise<Fish> {
    return apiClient<Fish>(`${API_ENDPOINTS.FISH.LIST}${id}/`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  },

  /**
   * PATCH /api/fish/fish/{id}/ - Perbarui sebagian ikan
   */
  async patch(id: number, payload: Partial<CreateFishPayload>): Promise<Fish> {
    return apiClient<Fish>(`${API_ENDPOINTS.FISH.LIST}${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
  },

  /**
   * DELETE /api/fish/fish/{id}/ - Hapus ikan
   */
  async delete(id: number): Promise<void> {
    await apiClient(`${API_ENDPOINTS.FISH.LIST}${id}/`, {
      method: 'DELETE',
    })
  },

  /**
   * POST /api/fish/fish/import_fish/ - Impor ikan dari CSV
   */
  async importFish(csvData: string, clearExisting = false): Promise<ImportCsvResponse> {
    return apiClient<ImportCsvResponse>(`${API_ENDPOINTS.FISH.LIST}import_fish/`, {
      method: 'POST',
      body: JSON.stringify({
        csv_data: csvData,
        clear_existing: clearExisting,
      }),
    })
  },
}
