import { API_BASE_URL, API_ENDPOINTS, getApiUrl } from "../config/api";

interface RequestOptions extends RequestInit {
  token?: string | null;
  bypassCache?: boolean;
  maxAge?: number;
  staleAge?: number;
  silentStatusCodes?: number[];
}

interface CacheEntry<T = unknown> {
  data: T;
  timestamp: number;
}

// In-memory SWR (Stale-While-Revalidate) cache
const apiCache = new Map<string, CacheEntry>();
const inFlightRequests = new Map<string, Promise<unknown>>();
const subscribers = new Set<(key: string, data: unknown) => void>();

// Default SWR timings (milliseconds)
const DEFAULT_MAX_AGE = 15_000; // 15 seconds: completely fresh
const DEFAULT_STALE_AGE = 120_000; // 2 minutes: stale-while-revalidate window

/**
 * Clear in-memory API cache. If prefix is provided, only matching keys are cleared.
 */
export function clearApiCache(prefix?: string): void {
  if (!prefix) {
    apiCache.clear();
    return;
  }
  for (const key of apiCache.keys()) {
    if (key.includes(prefix)) {
      apiCache.delete(key);
    }
  }
}

/**
 * Subscribe to background revalidation updates.
 */
export function subscribeApiCache(
  callback: (key: string, data: unknown) => void,
): () => void {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
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
 * Asynchronously revalidates stale cache in the background.
 */
function revalidateInBackground(
  cacheKey: string,
  url: string,
  options: RequestOptions,
  headers: Record<string, string>,
) {
  if (inFlightRequests.has(cacheKey)) return;

  const promise = (async () => {
    try {
      const response = await fetch(url, { ...options, headers });
      if (!response.ok) return;
      const data =
        response.status === 204 ? {} : await response.json().catch(() => null);
      if (data !== null) {
        apiCache.set(cacheKey, { data, timestamp: Date.now() });
        for (const sub of subscribers) {
          sub(cacheKey, data);
        }
      }
    } catch {
      // Background revalidation silently fails; preserves stale data
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  })();

  inFlightRequests.set(cacheKey, promise);
}

/**
 * Universal API Client with automatic JSON parsing, Token Authorization,
 * and Stale-While-Revalidate (SWR) in-memory caching for GET requests.
 */
export async function apiClient<T = unknown>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const url = endpoint.startsWith("http") ? endpoint : getApiUrl(endpoint);
  const method = (options.method || "GET").toUpperCase();
  const isGet = method === "GET";
  const cacheKey = `${method}:${url}`;

  const maxAge = options.maxAge ?? DEFAULT_MAX_AGE;
  const staleAge = options.staleAge ?? DEFAULT_STALE_AGE;

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

  // 1. SWR Cache check for GET requests
  if (isGet && !options.bypassCache) {
    const cached = apiCache.get(cacheKey);
    if (cached) {
      const age = Date.now() - cached.timestamp;
      if (age < maxAge) {
        // Completely fresh response
        return cached.data as T;
      }
      if (age < staleAge) {
        // Stale-While-Revalidate: Return stale data instantly, revalidate in background
        revalidateInBackground(cacheKey, url, options, headers);
        return cached.data as T;
      }
      // Expired: delete and fall through to fresh fetch
      apiCache.delete(cacheKey);
    }

    // Deduplicate simultaneous in-flight GET requests
    if (inFlightRequests.has(cacheKey)) {
      return (await inFlightRequests.get(cacheKey)) as T;
    }
  }

  // 2. Network execution with deduplication tracking
  const executeFetch = async (): Promise<T> => {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Mutations invalidate relevant GET cache immediately
    if (!isGet) {
      clearApiCache();
    }

    if (response.status === 204) {
      return {} as T;
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      if (options.silentStatusCodes?.includes(response.status)) {
        return null as T;
      }
      const parsed = parseErrorMessage(data);
      const errorMsg =
        parsed || `HTTP Error ${response.status}: ${response.statusText}`;
      throw new Error(errorMsg);
    }

    // Cache successful GET requests
    if (isGet && !options.bypassCache && data !== null) {
      apiCache.set(cacheKey, { data, timestamp: Date.now() });
    }

    return data as T;
  };

  if (isGet && !options.bypassCache) {
    const reqPromise = executeFetch().finally(() => {
      inFlightRequests.delete(cacheKey);
    });
    inFlightRequests.set(cacheKey, reqPromise);
    return (await reqPromise) as T;
  }

  return await executeFetch();
}

export { API_BASE_URL, API_ENDPOINTS, getApiUrl };
