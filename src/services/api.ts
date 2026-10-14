import { API_BASE_URL, API_ENDPOINTS, getApiUrl } from '../config/api'

interface RequestOptions extends RequestInit {
  token?: string | null
}

/**
 * Universal API Client with automatic JSON parsing and Token Authorization
 */
export async function apiClient<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : getApiUrl(endpoint)
  const storedToken =
    options.token !== undefined
      ? options.token
      : localStorage.getItem('token') || localStorage.getItem('auth_token')

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  }

  if (storedToken) {
    headers['Authorization'] = `Token ${storedToken}`
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  // Handle No Content response
  if (response.status === 204) {
    return {} as T
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const errorMsg =
      data?.detail ||
      data?.message ||
      data?.error ||
      (typeof data === 'string' ? data : null) ||
      `HTTP Error ${response.status}: ${response.statusText}`
    throw new Error(errorMsg)
  }

  return data as T
}

export { API_BASE_URL, API_ENDPOINTS, getApiUrl }
