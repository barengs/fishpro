import { API_BASE_URL, API_ENDPOINTS, getApiUrl } from "../config/api";

interface RequestOptions extends RequestInit {
  token?: string | null;
}

function parseErrorMessage(data: unknown): string {
  if (!data) return "";
  if (typeof data === "string") return data;
  if (typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (obj.detail && typeof obj.detail === "string") return obj.detail;
    if (obj.message && typeof obj.message === "string") return obj.message;
    if (obj.error) return parseErrorMessage(obj.error);

    // Parse serializer field errors object: { field: ["error message"] }
    const parts: string[] = [];
    for (const [key, val] of Object.entries(obj)) {
      const prefix = key === "non_field_errors" ? "" : `${key}: `;
      if (Array.isArray(val)) {
        parts.push(`${prefix}${val.join(", ")}`);
      } else if (typeof val === "string") {
        parts.push(`${prefix}${val}`);
      } else if (val && typeof val === "object") {
        parts.push(`${prefix}${parseErrorMessage(val)}`);
      }
    }
    if (parts.length > 0) return parts.join(" | ");
  }
  return "";
}

/**
 * Universal API Client with automatic JSON parsing and Token Authorization
 */
export async function apiClient<T = unknown>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const url = endpoint.startsWith("http") ? endpoint : getApiUrl(endpoint);
  const storedToken =
    options.token !== undefined
      ? options.token
      : localStorage.getItem("token") || localStorage.getItem("auth_token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (storedToken) {
    headers["Authorization"] = `Token ${storedToken}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle No Content response
  if (response.status === 204) {
    return {} as T;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const parsed = parseErrorMessage(data);
    const errorMsg =
      parsed || `HTTP Error ${response.status}: ${response.statusText}`;
    throw new Error(errorMsg);
  }

  return data as T;
}

export { API_BASE_URL, API_ENDPOINTS, getApiUrl };
