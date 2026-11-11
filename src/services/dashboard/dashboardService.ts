import { apiClient } from "../api";
import { API_ENDPOINTS } from "../../config/api";
import type {
  AdminDashboardData,
  RegulatorDashboardData,
  OwnerDashboardData,
  CaptainDashboardData,
  WppPotentialItem,
} from "./types";

export const dashboardService = {
  async getAdminDashboard(): Promise<AdminDashboardData> {
    return apiClient<AdminDashboardData>(API_ENDPOINTS.DASHBOARD.ADMIN);
  },

  async getRegulatorDashboard(): Promise<RegulatorDashboardData> {
    return apiClient<RegulatorDashboardData>(API_ENDPOINTS.DASHBOARD.REGULATOR);
  },

  async getOwnerDashboard(ownerId?: number): Promise<OwnerDashboardData> {
    const url = ownerId
      ? `${API_ENDPOINTS.DASHBOARD.OWNER}?owner_id=${ownerId}`
      : API_ENDPOINTS.DASHBOARD.OWNER;
    return apiClient<OwnerDashboardData>(url);
  },

  async getCaptainDashboard(): Promise<CaptainDashboardData> {
    return apiClient<CaptainDashboardData>(API_ENDPOINTS.DASHBOARD.CAPTAIN);
  },

  async getWppPotentialForecast(): Promise<{
    status: string;
    top_recommendation: WppPotentialItem;
    rankings: WppPotentialItem[];
  }> {
    return apiClient<{
      status: string;
      top_recommendation: WppPotentialItem;
      rankings: WppPotentialItem[];
    }>(API_ENDPOINTS.DASHBOARD.WPP_POTENTIAL);
  },
};
