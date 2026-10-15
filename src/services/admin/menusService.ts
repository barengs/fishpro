import { apiClient, API_ENDPOINTS } from "../api";
import type { PaginatedResponse } from "../types";
import type {
  AssignMenuPayload,
  CreateMenuPayload,
  Menu,
  RoleMenu,
} from "./types";

export const menusService = {
  /**
   * GET /api/admin/menus/ - Daftar semua menu aktif
   */
  async getAll(): Promise<Menu[]> {
    const data = await apiClient<PaginatedResponse<Menu> | Menu[]>(
      API_ENDPOINTS.ADMIN.MENUS,
    );
    return Array.isArray(data) ? data : data.results || [];
  },

  /**
   * GET /api/admin/menus/{id}/ - Ambil menu
   */
  async getById(id: number): Promise<Menu> {
    return apiClient<Menu>(`${API_ENDPOINTS.ADMIN.MENUS}${id}/`);
  },

  /**
   * POST /api/admin/menus/ - Buat menu baru
   */
  async create(payload: CreateMenuPayload): Promise<Menu> {
    return apiClient<Menu>(API_ENDPOINTS.ADMIN.MENUS, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * PUT /api/admin/menus/{id}/ - Perbarui menu
   */
  async update(id: number, payload: CreateMenuPayload): Promise<Menu> {
    return apiClient<Menu>(`${API_ENDPOINTS.ADMIN.MENUS}${id}/`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  /**
   * PATCH /api/admin/menus/{id}/ - Perbarui sebagian menu
   */
  async patch(id: number, payload: Partial<CreateMenuPayload>): Promise<Menu> {
    return apiClient<Menu>(`${API_ENDPOINTS.ADMIN.MENUS}${id}/`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  /**
   * DELETE /api/admin/menus/{id}/ - Hapus menu
   */
  async delete(id: number): Promise<void> {
    await apiClient(`${API_ENDPOINTS.ADMIN.MENUS}${id}/`, {
      method: "DELETE",
    });
  },
};

export const roleMenusService = {
  /**
   * GET /api/admin/role-menus/ - Daftar semua hubungan peran-menu
   */
  async getAll(): Promise<RoleMenu[]> {
    const data = await apiClient<PaginatedResponse<RoleMenu> | RoleMenu[]>(
      API_ENDPOINTS.ADMIN.ROLE_MENUS,
    );
    return Array.isArray(data) ? data : data.results || [];
  },

  /**
   * GET /api/admin/role-menus/{id}/ - Ambil hubungan peran-menu
   */
  async getById(id: number): Promise<RoleMenu> {
    return apiClient<RoleMenu>(`${API_ENDPOINTS.ADMIN.ROLE_MENUS}${id}/`);
  },

  /**
   * DELETE /api/admin/role-menus/{id}/ - Hapus hubungan peran-menu
   */
  async delete(id: number): Promise<void> {
    await apiClient(`${API_ENDPOINTS.ADMIN.ROLE_MENUS}${id}/`, {
      method: "DELETE",
    });
  },

  /**
   * POST /api/admin/role-menus/assign_menu/ - Tetapkan menu ke peran
   */
  async assignMenu(payload: AssignMenuPayload): Promise<{ message: string }> {
    return apiClient<{ message: string }>(
      `${API_ENDPOINTS.ADMIN.ROLE_MENUS}assign_menu/`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
  },
};
