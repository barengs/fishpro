import { apiClient } from "../api";
import { API_ENDPOINTS } from "../../config/api";
import type {
  CreateSmartScalePayload,
  SaveScaleCatchPayload,
  SaveScaleCatchResponse,
  ScaleReading,
  SendIoTWeightPayload,
  SendIoTWeightResponse,
  SmartScale,
} from "./types";

export const iotService = {
  /**
   * GET /api/iot/devices/ - Daftar semua timbangan pintar
   */
  async getDevices(): Promise<SmartScale[]> {
    const data = await apiClient<SmartScale[] | { results?: SmartScale[] }>(
      API_ENDPOINTS.IOT.DEVICES,
    );
    return Array.isArray(data) ? data : data.results || [];
  },

  /**
   * POST /api/iot/devices/ - Daftarkan timbangan pintar baru
   */
  async createDevice(payload: CreateSmartScalePayload): Promise<SmartScale> {
    return apiClient<SmartScale>(API_ENDPOINTS.IOT.DEVICES, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * PATCH /api/iot/devices/{id}/ - Perbarui timbangan pintar
   */
  async updateDevice(
    id: number,
    payload: Partial<CreateSmartScalePayload>,
  ): Promise<SmartScale> {
    return apiClient<SmartScale>(`${API_ENDPOINTS.IOT.DEVICES}${id}/`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  /**
   * DELETE /api/iot/devices/{id}/ - Hapus timbangan pintar
   */
  async deleteDevice(id: number): Promise<void> {
    return apiClient<void>(`${API_ENDPOINTS.IOT.DEVICES}${id}/`, {
      method: "DELETE",
    });
  },

  /**
   * GET /api/iot/latest/ - Ambil pembacaan berat timbangan terakhir
   */
  async getLatestReading(
    deviceId?: string,
    status: "pending" | "saved" | "discarded" = "pending",
  ): Promise<ScaleReading | null> {
    const params = new URLSearchParams();
    if (deviceId) params.append("device_id", deviceId);
    if (status) params.append("status", status);

    const query = params.toString();
    const url = query
      ? `${API_ENDPOINTS.IOT.LATEST}?${query}`
      : API_ENDPOINTS.IOT.LATEST;

    try {
      const res = await apiClient<ScaleReading | { message: string } | null>(
        url,
        {
          bypassCache: true,
          silentStatusCodes: [404],
        },
      );
      if (!res) return null;
      if ("message" in res && !("id" in res)) {
        return null;
      }
      return res as ScaleReading;
    } catch {
      return null;
    }
  },

  /**
   * GET /api/iot/readings/ - Riwayat log pembacaan timbangan
   */
  async getReadings(
    deviceId?: string,
    status?: "pending" | "saved" | "discarded",
  ): Promise<ScaleReading[]> {
    const params = new URLSearchParams();
    if (deviceId) params.append("device_id", deviceId);
    if (status) params.append("status", status);

    const query = params.toString();
    const url = query
      ? `${API_ENDPOINTS.IOT.READINGS}?${query}`
      : API_ENDPOINTS.IOT.READINGS;

    const data = await apiClient<ScaleReading[] | { results?: ScaleReading[] }>(
      url,
      { bypassCache: true },
    );
    return Array.isArray(data) ? data : data.results || [];
  },

  /**
   * POST /api/iot/save-catch/ - Simpan tangkapan oleh operator pelabuhan dari hasil timbangan IoT
   */
  async saveCatch(
    payload: SaveScaleCatchPayload,
  ): Promise<SaveScaleCatchResponse> {
    return apiClient<SaveScaleCatchResponse>(API_ENDPOINTS.IOT.SAVE_CATCH, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * POST /api/iot/receive-weight/ - Kirim data berat (dipakai sensor fisik atau simulator testing frontend)
   */
  async sendWeight(
    payload: SendIoTWeightPayload,
  ): Promise<SendIoTWeightResponse> {
    return apiClient<SendIoTWeightResponse>(API_ENDPOINTS.IOT.RECEIVE_WEIGHT, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Helper SSE Stream URL
   */
  getStreamUrl(deviceId?: string): string {
    return deviceId
      ? `${API_ENDPOINTS.IOT.STREAM}?device_id=${encodeURIComponent(deviceId)}`
      : API_ENDPOINTS.IOT.STREAM;
  },
};
