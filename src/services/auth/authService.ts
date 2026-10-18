import { apiClient, API_ENDPOINTS } from "../api";
import type {
  LoginCredentials,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  StoredUser,
} from "./types";

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const data = await apiClient<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (data.token) {
      const usernameLower = (data.username || "").toLowerCase();
      const rawUserAs = (data.user_as || "").toLowerCase();
      const rolesList = (data.roles || []).map((r) => r.toLowerCase());

      let detectedRole = data.user_as || "owner";
      if (
        rawUserAs === "admin" ||
        rolesList.includes("admin") ||
        usernameLower.startsWith("admin")
      ) {
        detectedRole = "admin";
      } else if (
        rawUserAs === "regulator" ||
        rolesList.includes("regulator") ||
        usernameLower.includes("regulator")
      ) {
        detectedRole = "regulator";
      } else if (
        rawUserAs === "captain" ||
        rolesList.includes("captain") ||
        usernameLower.includes("captain")
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
    const usernameLower = (user?.username || "").toLowerCase();
    const rawRole = (user?.role || storedUserAs || "").toLowerCase();
    const rolesList = (user?.roles || []).map((r) => r.toLowerCase());

    if (
      rawRole === "admin" ||
      rolesList.includes("admin") ||
      usernameLower.startsWith("admin")
    ) {
      return "admin";
    }
    if (
      rawRole === "regulator" ||
      rolesList.includes("regulator") ||
      usernameLower.includes("regulator")
    ) {
      return "regulator";
    }
    if (
      rawRole === "captain" ||
      rolesList.includes("captain") ||
      usernameLower.includes("captain")
    ) {
      return "captain";
    }
    if (rawRole === "owner" || rolesList.includes("owner")) {
      return "owner";
    }
    return storedUserAs || null;
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
};
