import { apiClient, API_ENDPOINTS } from "../api";
import type { PaginatedResponse } from "../types";
import type {
  CreateFishingAreaPayload,
  FishingArea,
  ImportAreasResponse,
} from "./types";

export const regionsService = {
  /**
   * GET /api/regions/fishing-areas/ - Daftar semua area penangkapan
   */
  async getAll(search?: string): Promise<FishingArea[]> {
    let url: string = API_ENDPOINTS.REGIONS.FISHING_AREAS;
    if (search) {
      url = `${url}?search=${encodeURIComponent(search)}`;
    }

    const data = await apiClient<
      PaginatedResponse<FishingArea> | FishingArea[]
    >(url);
    return Array.isArray(data) ? data : data.results || [];
  },

  /**
   * GET /api/regions/fishing-areas/{id}/ - Ambil area penangkapan
   */
  async getById(id: number): Promise<FishingArea> {
    return apiClient<FishingArea>(
      `${API_ENDPOINTS.REGIONS.FISHING_AREAS}${id}/`,
    );
  },

  /**
   * POST /api/regions/fishing-areas/ - Buat area penangkapan
   */
  async create(payload: CreateFishingAreaPayload): Promise<FishingArea> {
    return apiClient<FishingArea>(API_ENDPOINTS.REGIONS.FISHING_AREAS, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * PUT /api/regions/fishing-areas/{id}/ - Perbarui area penangkapan
   */
  async update(
    id: number,
    payload: CreateFishingAreaPayload,
  ): Promise<FishingArea> {
    return apiClient<FishingArea>(
      `${API_ENDPOINTS.REGIONS.FISHING_AREAS}${id}/`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      },
    );
  },

  /**
   * PATCH /api/regions/fishing-areas/{id}/ - Perbarui sebagian area penangkapan
   */
  async patch(
    id: number,
    payload: Partial<CreateFishingAreaPayload>,
  ): Promise<FishingArea> {
    return apiClient<FishingArea>(
      `${API_ENDPOINTS.REGIONS.FISHING_AREAS}${id}/`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
    );
  },

  /**
   * DELETE /api/regions/fishing-areas/{id}/ - Hapus area penangkapan
   */
  async delete(id: number): Promise<void> {
    await apiClient(`${API_ENDPOINTS.REGIONS.FISHING_AREAS}${id}/`, {
      method: "DELETE",
    });
  },

  /**
   * GET /api/regions/fishing-areas/download_template/ - Download template CSV/Excel area penangkapan langsung dari backend
   */
  getDownloadTemplateUrl(format: "csv" | "excel" = "csv"): string {
    if (format === "excel") {
      return `${API_ENDPOINTS.REGIONS.FISHING_AREAS}download_template/?type=excel`;
    }
    return `${API_ENDPOINTS.REGIONS.FISHING_AREAS}download_template/`;
  },

  /**
   * POST /api/regions/fishing-areas/import_areas/ - Impor area penangkapan dari CSV/Excel
   */
  async importAreas(
    csvData: string,
    clearExisting = false,
  ): Promise<ImportAreasResponse> {
    return apiClient<ImportAreasResponse>(
      `${API_ENDPOINTS.REGIONS.FISHING_AREAS}import_areas/`,
      {
        method: "POST",
        body: JSON.stringify({
          csv_data: csvData,
          clear_existing: clearExisting,
        }),
      },
    );
  },
};
