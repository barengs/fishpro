import { apiClient, API_ENDPOINTS } from "../api";
import type { PaginatedResponse } from "../types";
import type { CreateRolePayload, Role, UserRole } from "./types";

export const rolesService = {
  /**
   * GET /api/admin/roles/ - Daftar semua peran
   */
  async getAll(search?: string): Promise<Role[]> {
    const url = search
      ? `${API_ENDPOINTS.ADMIN.ROLES}?search=${encodeURIComponent(search)}`
      : API_ENDPOINTS.ADMIN.ROLES;
    const data = await apiClient<PaginatedResponse<Role> | Role[]>(url);
    return Array.isArray(data) ? data : data.results || [];
  },

  /**
   * GET /api/admin/roles/{id}/ - Ambil peran
   */
  async getById(id: number): Promise<Role> {
    return apiClient<Role>(`${API_ENDPOINTS.ADMIN.ROLES}${id}/`);
  },

  /**
   * POST /api/admin/roles/ - Buat peran baru
   */
  async create(payload: CreateRolePayload): Promise<Role> {
    return apiClient<Role>(API_ENDPOINTS.ADMIN.ROLES, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * PUT /api/admin/roles/{id}/ - Perbarui peran
   */
  async update(id: number, payload: CreateRolePayload): Promise<Role> {
    return apiClient<Role>(`${API_ENDPOINTS.ADMIN.ROLES}${id}/`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  /**
   * PATCH /api/admin/roles/{id}/ - Perbarui sebagian peran
   */
  async patch(id: number, payload: Partial<CreateRolePayload>): Promise<Role> {
    return apiClient<Role>(`${API_ENDPOINTS.ADMIN.ROLES}${id}/`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  /**
   * DELETE /api/admin/roles/{id}/ - Hapus peran
   */
  async delete(id: number): Promise<void> {
    await apiClient(`${API_ENDPOINTS.ADMIN.ROLES}${id}/`, {
      method: "DELETE",
    });
  },

  /**
   * POST /api/admin/roles/{id}/assign_permission/ - Tetapkan izin ke peran
   */
  async assignPermission(
    roleId: number,
    permissionId: number,
  ): Promise<{ message: string }> {
    return apiClient<{ message: string }>(
      `${API_ENDPOINTS.ADMIN.ROLES}${roleId}/assign_permission/`,
      {
        method: "POST",
        body: JSON.stringify({ permission_id: permissionId }),
      },
    );
  },
};

export const userRolesService = {
  /**
   * GET /api/admin/user-roles/ - Daftar semua hubungan pengguna-peran
   */
  async getAll(): Promise<UserRole[]> {
    const data = await apiClient<PaginatedResponse<UserRole> | UserRole[]>(
      API_ENDPOINTS.ADMIN.USER_ROLES,
    );
    return Array.isArray(data) ? data : data.results || [];
  },

  /**
   * GET /api/admin/user-roles/{id}/ - Ambil hubungan pengguna-peran
   */
  async getById(id: number): Promise<UserRole> {
    return apiClient<UserRole>(`${API_ENDPOINTS.ADMIN.USER_ROLES}${id}/`);
  },

  /**
   * DELETE /api/admin/user-roles/{id}/ - Hapus hubungan pengguna-peran
   */
  async delete(id: number): Promise<void> {
    await apiClient(`${API_ENDPOINTS.ADMIN.USER_ROLES}${id}/`, {
      method: "DELETE",
    });
  },

  /**
   * POST /api/admin/user-roles/assign_role/ - Tetapkan peran ke pengguna
   */
  async assignRole(
    userId: number,
    roleId: number,
  ): Promise<{ message: string }> {
    return apiClient<{ message: string }>(
      `${API_ENDPOINTS.ADMIN.USER_ROLES}assign_role/`,
      {
        method: "POST",
        body: JSON.stringify({ user_id: userId, role_id: roleId }),
      },
    );
  },
};
