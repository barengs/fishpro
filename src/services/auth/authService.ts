import { apiClient, API_ENDPOINTS } from "../api";
import type {
  LoginCredentials,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  StoredUser,
  RefreshTokenResponse,
  PasswordResetRequestResponse,
  PasswordResetVerifyResponse,
  PasswordResetConfirmPayload,
  PasswordResetConfirmResponse,
} from "./types";

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const data = await apiClient<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (data.token) {
      const rawUserAs = (data.user_as || "").toLowerCase();
      const rolesList = (data.roles || []).map((r) => r.toLowerCase());

      let detectedRole = data.user_as || "owner";
      if (
        rawUserAs === "superadmin" ||
        rawUserAs === "super_admin" ||
        rolesList.includes("superadmin") ||
        rolesList.includes("super_admin")
      ) {
        detectedRole = "superadmin";
      } else if (
        rawUserAs === "admin" ||
        rolesList.includes("admin")
      ) {
        detectedRole = "admin";
      } else if (
        rawUserAs === "regulator" ||
        rolesList.includes("regulator")
      ) {
        detectedRole = "regulator";
      } else if (
        rawUserAs === "captain" ||
        rolesList.includes("captain")
      ) {
        detectedRole = "captain";
      } else if (rawUserAs === "owner" || rolesList.includes("owner")) {
        detectedRole = "owner";
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("auth_token", data.token);
      if (data.refresh_token) {
        localStorage.setItem("refresh_token", data.refresh_token);
      }
      localStorage.setItem("user_as", detectedRole);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.user_id,
          username: data.username,
          role: detectedRole,
          roles: data.roles || [detectedRole],
          profile: data.profile,
          menus: data.menus || [],
        }),
      );
    }

    return data;
  },

  async register(payload: RegisterPayload): Promise<RegisterResponse> {
    const data = await apiClient<RegisterResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user_as", data.role);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.user_id,
          username: data.username,
          role: data.role,
          roles: [data.role],
          profile: data.profile,
        }),
      );
    }

    return data;
  },

  async refreshToken(): Promise<RefreshTokenResponse | null> {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) return null;

    try {
      const data = await apiClient<RefreshTokenResponse>(
        API_ENDPOINTS.AUTH.REFRESH,
        {
          method: "POST",
          body: JSON.stringify({ refresh_token: refreshToken }),
        },
      );
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("auth_token", data.token);
      }
      if (data.refresh_token) {
        localStorage.setItem("refresh_token", data.refresh_token);
      }
      return data;
    } catch {
      return null;
    }
  },

  async requestPasswordReset(
    identifier: string,
  ): Promise<PasswordResetRequestResponse> {
    return apiClient<PasswordResetRequestResponse>(
      API_ENDPOINTS.AUTH.RESET_PASSWORD_REQUEST,
      {
        method: "POST",
        body: JSON.stringify({ identifier }),
      },
    );
  },

  async verifyPasswordResetOtp(
    identifier: string,
    otp: string,
  ): Promise<PasswordResetVerifyResponse> {
    return apiClient<PasswordResetVerifyResponse>(
      API_ENDPOINTS.AUTH.RESET_PASSWORD_VERIFY,
      {
        method: "POST",
        body: JSON.stringify({ identifier, otp }),
      },
    );
  },

  async confirmPasswordReset(
    payload: PasswordResetConfirmPayload,
  ): Promise<PasswordResetConfirmResponse> {
    return apiClient<PasswordResetConfirmResponse>(
      API_ENDPOINTS.AUTH.RESET_PASSWORD_CONFIRM,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
  },

  async logout(): Promise<void> {
    try {
      await apiClient(API_ENDPOINTS.AUTH.LOGOUT, {
        method: "POST",
      });
    } catch {
      // Ignored: cleanup locally even if server token is already expired
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("auth_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_as");
      localStorage.removeItem("user");
    }
  },

  getToken(): string | null {
    return localStorage.getItem("token") || localStorage.getItem("auth_token");
  },

  getUserRole(): string | null {
    const user = this.getStoredUser();
    const storedUserAs = localStorage.getItem("user_as");
    const rawRole = (user?.role || storedUserAs || "").toLowerCase();
    const rolesList = (user?.roles || []).map((r) => r.toLowerCase());

    const isAdmin =
      rawRole === "admin" ||
      rawRole === "superadmin" ||
      rawRole === "super_admin" ||
      rolesList.includes("admin") ||
      rolesList.includes("superadmin") ||
      rolesList.includes("super_admin");

    if (isAdmin) {
      return this.isSuperAdmin() ? "superadmin" : "admin";
    }
    if (rawRole === "regulator" || rolesList.includes("regulator")) {
      return "regulator";
    }
    if (rawRole === "captain" || rolesList.includes("captain")) {
      return "captain";
    }
    if (rawRole === "owner" || rolesList.includes("owner")) {
      return "owner";
    }
    return storedUserAs || null;
  },

  isSuperAdmin(): boolean {
    const user = this.getStoredUser();
    if (!user) return false;

    // Check manual simulation override for testing / presentation demos
    const simulated = localStorage.getItem("simulated_admin_role");
    if (simulated === "superadmin") return true;
    if (simulated === "admin") return false;

    const rawRole = (user.role || "").toLowerCase();
    const rolesList = (user.roles || []).map((r) => r.toLowerCase());
    const isSuperuser = Boolean(user.is_superuser);

    // Read directly from registered user role / database flags
    return (
      rawRole === "superadmin" ||
      rawRole === "super_admin" ||
      rolesList.includes("superadmin") ||
      rolesList.includes("super_admin") ||
      isSuperuser
    );
  },

  setSimulatedAdminRole(role: "superadmin" | "admin" | null): void {
    if (!role) {
      localStorage.removeItem("simulated_admin_role");
    } else {
      localStorage.setItem("simulated_admin_role", role);
    }
  },

  getSimulatedAdminRole(): "superadmin" | "admin" | null {
    const role = localStorage.getItem("simulated_admin_role");
    return role === "superadmin" || role === "admin" ? role : null;
  },

  getStoredUser(): StoredUser | null {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return Boolean(this.getToken());
  },

  getUserMenus(): import("./types").UserPermittedMenu[] {
    return this.getStoredUser()?.menus || [];
  },

  hasMenuPermission(urlPath: string): boolean {
    if (this.isSuperAdmin()) return true;
    const menus = this.getUserMenus();
    if (!menus || menus.length === 0) return true;
    return menus.some((m) => {
      if (m.can_view === false) return false;
      const cleanMenuUrl = (m.url || "").replace(/\/+$/, "");
      const cleanPath = urlPath.replace(/\/+$/, "");
      return cleanPath === cleanMenuUrl || cleanPath.startsWith(cleanMenuUrl + "/");
    });
  },

  getDashboardUrl(): string {
    return getRoleDashboardPath(this.getUserRole());
  },
};

export function getRoleDashboardPath(role?: string | null): string {
  switch (role) {
    case "superadmin":
      return "/admin";
    case "admin":
      return "/staff";
    case "regulator":
      return "/regulator";
    case "captain":
      return "/captain";
    case "owner":
    default:
      return "/owner";
  }
}
