/**
 * API Configuration
 * Base URL defaults to https://api.fishpro.id
 * Can be overridden with VITE_API_BASE_URL in environment.
 */
export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'https://api.fishpro.id'
).replace(/\/+$/, '')

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login/`,
    REGISTER: `${API_BASE_URL}/api/auth/register/`,
    USER: `${API_BASE_URL}/api/auth/user/`,
  },
  SHIPS: `${API_BASE_URL}/api/ships/`,
  CATCHES: `${API_BASE_URL}/api/catches/`,
  REGIONS: `${API_BASE_URL}/api/regions/`,
  IOT_SCALES: `${API_BASE_URL}/api/iot-scales/`,
  PNBP: `${API_BASE_URL}/api/pnbp/`,
}

export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${cleanPath}`
}
