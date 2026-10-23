import { apiClient, API_ENDPOINTS } from "../api";
import { captainsService } from "../captains";
import type { PaginatedResponse } from "../types";
import type {
  CreateShipPayload,
  ManualQuotaInputPayload,
  ManualQuotaInputResponse,
  PredictShipQuotaPayload,
  PredictShipQuotaResponse,
  Ship,
  ShipRecommendation,
} from "./types";

export const shipsService = {
  /**
   * GET /api/ships/ships/ - Mengambil semua kapal (mendukung search)
   */
  async getAll(search?: string): Promise<Ship[]> {
    const url = search
      ? `${API_ENDPOINTS.SHIPS.LIST}?search=${encodeURIComponent(search)}`
      : API_ENDPOINTS.SHIPS.LIST;

    const data = await apiClient<PaginatedResponse<Ship> | Ship[]>(url);
    return Array.isArray(data) ? data : data.results || [];
  },

  /**
   * GET /api/ships/ships/{id}/ - Mengambil detail satu kapal
   */
  async getById(id: number): Promise<Ship> {
    return apiClient<Ship>(`${API_ENDPOINTS.SHIPS.LIST}${id}/`);
  },

  /**
   * GET /api/ships/ships/by_owner/?owner_id={id} - Mengambil kapal berdasarkan pemilik
   */
  async getByOwner(ownerId?: number | null): Promise<Ship[]> {
    const url = ownerId
      ? `${API_ENDPOINTS.SHIPS.LIST}by_owner/?owner_id=${ownerId}`
      : `${API_ENDPOINTS.SHIPS.LIST}by_owner/`;
    const data = await apiClient<Ship[]>(url);
    return Array.isArray(data) ? data : [];
  },

  /**
   * Mengambil seluruh armada kapal milik pemilik (Owner) yang sedang login saat ini.
   * Melakukan pencocokan multi-jalur: owner_id profil, user_id, dan nama pemilik.
   */
  async getFleetForOwner(
    user: {
      id?: number;
      username?: string;
      profile?: {
        id?: number;
        owner_id?: number;
        name?: string;
        full_name?: string;
      };
    } | null,
    searchQuery?: string,
  ): Promise<Ship[]> {
    if (!user) return [];

    const ownerProfileId = user.profile?.owner_id || user.profile?.id;
    const userId = user.id;
    const ownerName = (
      user.profile?.name ||
      user.profile?.full_name ||
      user.username ||
      ""
    )
      .toLowerCase()
      .trim();

    // 1. Coba ambil langsung dari endpoint by_owner dengan ID owner profil
    let ships: Ship[] = [];
    if (ownerProfileId) {
      ships = await this.getByOwner(ownerProfileId).catch(() => []);
    }

    // 2. Jika belum dapat, coba gunakan user.id
    if (ships.length === 0 && userId) {
      ships = await this.getByOwner(userId).catch(() => []);
    }

    // 3. Fallback: ambil semua kapal dan cocokkan dengan identitas pemilik
    if (ships.length === 0) {
      const allShips = await this.getAll(searchQuery).catch(() => []);
      ships = allShips.filter((s) => {
        if (ownerProfileId && s.owner === ownerProfileId) return true;
        if (userId && s.owner === userId) return true;
        if (
          ownerName &&
          s.owner_name &&
          s.owner_name.toLowerCase().trim() === ownerName
        ) {
          return true;
        }
        return false;
      });
      return ships;
    }

    // Terapkan query pencarian lokal jika ada
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      return ships.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.registration_number.toLowerCase().includes(q) ||
          (s.captain_name && s.captain_name.toLowerCase().includes(q)),
      );
    }

    return ships;
  },

  /**
   * GET /api/ships/ships/by_captain/?captain_id={id} - Mengambil kapal berdasarkan nahkoda
   */
  async getByCaptain(captainId: number): Promise<Ship[]> {
    const data = await apiClient<Ship[]>(
      `${API_ENDPOINTS.SHIPS.LIST}by_captain/?captain_id=${captainId}`,
    );
    return Array.isArray(data) ? data : [];
  },

  /**
   * Mengambil kapal yang ditugaskan kepada nahkoda yang sedang login saat ini.
   * Melakukan pencocokan: ID relasional, nomor lisensi, atau nama profil/nahkoda.
   */
  async getShipForCaptain(
    user: {
      id?: number;
      username?: string;
      profile?: {
        name?: string;
        full_name?: string;
        license_number?: string;
      };
    } | null,
  ): Promise<Ship | null> {
    if (!user) return null;

    const userFullName = (
      user.profile?.name ||
      user.profile?.full_name ||
      user.username ||
      ""
    )
      .toLowerCase()
      .trim();
    const userLicense = (user.profile?.license_number || "")
      .toLowerCase()
      .trim();
    const userId = user.id;

    // Ambil daftar nahkoda dan kapal secara paralel
    const [captains, allShips] = await Promise.all([
      captainsService.getAll().catch(() => []),
      this.getAll().catch(() => []),
    ]);

    // 1. Cari profil nahkoda yang sesuai dengan akun user
    const matchedCaptain = captains.find(
      (c) =>
        (userId && c.user === userId) ||
        (userLicense &&
          c.license_number?.toLowerCase().trim() === userLicense) ||
        (userFullName && c.full_name?.toLowerCase().trim() === userFullName),
    );

    if (matchedCaptain) {
      const shipByCaptainId = allShips.find(
        (s) => s.captain === matchedCaptain.id,
      );
      if (shipByCaptainId) return shipByCaptainId;
    }

    // 2. Fallback pencocokan nama nahkoda di kapal
    if (userFullName) {
      const shipByName = allShips.find(
        (s) => s.captain_name?.toLowerCase().trim() === userFullName,
      );
      if (shipByName) return shipByName;
    }

    if (user.username) {
      const usernameLower = user.username.toLowerCase().trim();
      const shipByUsername = allShips.find(
        (s) => s.captain_name?.toLowerCase().trim() === usernameLower,
      );
      if (shipByUsername) return shipByUsername;
    }

    return null;
  },

  /**
   * GET /api/ships/check-ship/?registration_number={reg}
   */
  async checkRegistration(
    reg: string,
  ): Promise<{ exists: boolean; ship?: Ship }> {
    return apiClient<{ exists: boolean; ship?: Ship }>(
      `${API_ENDPOINTS.SHIPS.CHECK_REGISTRATION}?registration_number=${encodeURIComponent(reg)}`,
    );
  },

  /**
   * POST /api/ships/ships/ - Menambahkan kapal baru
   */
  async create(payload: CreateShipPayload): Promise<Ship> {
    return apiClient<Ship>(API_ENDPOINTS.SHIPS.LIST, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * PATCH/PUT /api/ships/ships/{id}/ - Memperbarui data kapal
   */
  async update(id: number, payload: Partial<CreateShipPayload>): Promise<Ship> {
    return apiClient<Ship>(`${API_ENDPOINTS.SHIPS.LIST}${id}/`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  /**
   * PATCH /api/ships/ships/{id}/ - Memperbarui sebagian data kapal
   */
  async patch(id: number, payload: Partial<CreateShipPayload>): Promise<Ship> {
    return apiClient<Ship>(`${API_ENDPOINTS.SHIPS.LIST}${id}/`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  /**
   * DELETE /api/ships/ships/{id}/ - Menghapus kapal
   */
  async delete(id: number): Promise<void> {
    await apiClient(`${API_ENDPOINTS.SHIPS.LIST}${id}/`, {
      method: "DELETE",
    });
  },

  /**
   * GET /api/ships/ai-recommendations/
   */
  async getAiRecommendations(): Promise<{
    top_ships: ShipRecommendation[];
    analysis_period: string;
    recommendation_factors: string;
    total_ships_analyzed: number;
  }> {
    return apiClient(`${API_ENDPOINTS.SHIPS.AI_RECOMMENDATIONS}`);
  },

  /**
   * POST /api/ships/predict-quota/ - Prediksi Kuota Kapal dengan LSTM dan NSGA-III
   */
  async predictQuota(
    payload: PredictShipQuotaPayload,
  ): Promise<PredictShipQuotaResponse> {
    return apiClient<PredictShipQuotaResponse>(
      API_ENDPOINTS.SHIPS.PREDICT_QUOTA,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
  },

  /**
   * POST /api/ships/regulator/manual-quota/ - Input Kuota Manual oleh Regulator
   */
  async regulatorManualQuota(
    payload: ManualQuotaInputPayload,
  ): Promise<ManualQuotaInputResponse> {
    return apiClient<ManualQuotaInputResponse>(
      API_ENDPOINTS.SHIPS.REGULATOR_MANUAL_QUOTA,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
  },
};
