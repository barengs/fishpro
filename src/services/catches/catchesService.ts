import { apiClient, API_ENDPOINTS } from "../api";
import type { PaginatedResponse } from "../types";
import type {
  CatchDetail,
  CreateCatchDetailPayload,
  CreateFishCatchPayload,
  CreateFishCatchWithDetailsPayload,
  FishCatch,
  FishCatchWithDetails,
} from "./types";

export const catchesService = {
  /**
   * GET /api/catches/fish-catches/ - Daftar semua laporan tangkapan ikan
   * Mendukung filter: ship_id, start_date, end_date
   */
  async getAll(params?: {
    ship_id?: number | string;
    start_date?: string;
    end_date?: string;
    search?: string;
  }): Promise<FishCatch[]> {
    let url: string = API_ENDPOINTS.CATCHES.LIST;
    if (params) {
      const searchParams = new URLSearchParams();
      if (params.ship_id)
        searchParams.append("ship_id", String(params.ship_id));
      if (params.start_date)
        searchParams.append("start_date", params.start_date);
      if (params.end_date) searchParams.append("end_date", params.end_date);
      if (params.search) searchParams.append("search", params.search);
      const queryString = searchParams.toString();
      if (queryString) url = `${url}?${queryString}`;
    }

    const data = await apiClient<PaginatedResponse<FishCatch> | FishCatch[]>(
      url,
    );
    return Array.isArray(data) ? data : data.results || [];
  },

  /**
   * GET /api/catches/fish-catches/{id}/ - Ambil laporan tangkapan ikan
   */
  async getById(id: number): Promise<FishCatch> {
    return apiClient<FishCatch>(`${API_ENDPOINTS.CATCHES.LIST}${id}/`);
  },

  /**
   * POST /api/catches/fish-catches/ - Buat laporan tangkapan ikan
   */
  async create(payload: CreateFishCatchPayload): Promise<FishCatch> {
    return apiClient<FishCatch>(API_ENDPOINTS.CATCHES.LIST, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * POST /api/catches/fish-catches-with-details/ - Buat laporan tangkapan ikan dengan detail
   */
  async createWithDetails(
    payload: CreateFishCatchWithDetailsPayload,
  ): Promise<FishCatchWithDetails> {
    return apiClient<FishCatchWithDetails>(API_ENDPOINTS.CATCHES.WITH_DETAILS, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * PUT /api/catches/fish-catches/{id}/ - Perbarui laporan tangkapan ikan
   */
  async update(
    id: number,
    payload: CreateFishCatchPayload,
  ): Promise<FishCatch> {
    return apiClient<FishCatch>(`${API_ENDPOINTS.CATCHES.LIST}${id}/`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  /**
   * PUT /api/catches/fish-catches-with-details/{id}/ - Perbarui laporan tangkapan ikan dengan detail
   */
  async updateWithDetails(
    id: number,
    payload: CreateFishCatchWithDetailsPayload,
  ): Promise<FishCatchWithDetails> {
    return apiClient<FishCatchWithDetails>(
      `${API_ENDPOINTS.CATCHES.WITH_DETAILS}${id}/`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      },
    );
  },

  /**
   * PATCH /api/catches/fish-catches/{id}/ - Perbarui sebagian laporan tangkapan ikan
   */
  async patch(
    id: number,
    payload: Partial<CreateFishCatchPayload>,
  ): Promise<FishCatch> {
    return apiClient<FishCatch>(`${API_ENDPOINTS.CATCHES.LIST}${id}/`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  /**
   * POST /api/catches/fish-catches-with-details/import_csv/ - Impor data tangkapan massal dari CSV
   */
  async importCsv(
    csvData: string,
    dryRun: boolean = false,
  ): Promise<{
    message?: string;
    created_count?: number;
    total_processed?: number;
    errors?: string[];
  }> {
    return apiClient<{
      message?: string;
      created_count?: number;
      total_processed?: number;
      errors?: string[];
    }>(`${API_ENDPOINTS.CATCHES.WITH_DETAILS}import_csv/`, {
      method: "POST",
      body: JSON.stringify({ csv_data: csvData, dry_run: dryRun }),
    });
  },

  /**
   * URL untuk mengunduh template CSV tangkapan
   */
  getTemplateUrl(): string {
    return `${API_ENDPOINTS.CATCHES.WITH_DETAILS}download_template/`;
  },

  /**
   * DELETE /api/catches/fish-catches/{id}/ - Hapus laporan tangkapan ikan
   */
  async delete(id: number): Promise<void> {
    await apiClient(`${API_ENDPOINTS.CATCHES.LIST}${id}/`, {
      method: "DELETE",
    });
  },
};

export const catchDetailsService = {
  /**
   * GET /api/catches/catch-details/ - Daftar semua detail tangkapan
   */
  async getAll(): Promise<CatchDetail[]> {
    const data = await apiClient<
      PaginatedResponse<CatchDetail> | CatchDetail[]
    >(API_ENDPOINTS.CATCHES.DETAILS);
    return Array.isArray(data) ? data : data.results || [];
  },

  /**
   * GET /api/catches/catch-details/{id}/ - Ambil detail tangkapan
   */
  async getById(id: number): Promise<CatchDetail> {
    return apiClient<CatchDetail>(`${API_ENDPOINTS.CATCHES.DETAILS}${id}/`);
  },

  /**
   * POST /api/catches/catch-details/ - Buat detail tangkapan
   */
  async create(
    payload: CreateCatchDetailPayload & { fish_catch: number },
  ): Promise<CatchDetail> {
    return apiClient<CatchDetail>(API_ENDPOINTS.CATCHES.DETAILS, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * PUT /api/catches/catch-details/{id}/ - Perbarui detail tangkapan
   */
  async update(
    id: number,
    payload: CreateCatchDetailPayload & { fish_catch: number },
  ): Promise<CatchDetail> {
    return apiClient<CatchDetail>(`${API_ENDPOINTS.CATCHES.DETAILS}${id}/`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  /**
   * PATCH /api/catches/catch-details/{id}/ - Perbarui sebagian detail tangkapan
   */
  async patch(
    id: number,
    payload: Partial<CreateCatchDetailPayload>,
  ): Promise<CatchDetail> {
    return apiClient<CatchDetail>(`${API_ENDPOINTS.CATCHES.DETAILS}${id}/`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  /**
   * DELETE /api/catches/catch-details/{id}/ - Hapus detail tangkapan
   */
  async delete(id: number): Promise<void> {
    await apiClient(`${API_ENDPOINTS.CATCHES.DETAILS}${id}/`, {
      method: "DELETE",
    });
  },
};
