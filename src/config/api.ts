/**
 * FCO Backend API Configuration & Endpoints
 * Base URL defaults to https://api.fishpro.id
 * Can be overridden with VITE_API_BASE_URL environment variable.
 */
export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'https://api.fishpro.id'
).replace(/\/+$/, '')

export const API_ENDPOINTS = {
  // 1. Authentication
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login/`,
    REFRESH: `${API_BASE_URL}/api/auth/refresh/`,
    REGISTER: `${API_BASE_URL}/api/auth/`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout/`,
  },

  // 2. Owners & Captains
  OWNERS: {
    LIST: `${API_BASE_URL}/api/owners/owners/`,
    CAPTAINS: `${API_BASE_URL}/api/owners/captains/`,
  },

  // 3. Ships & Quota
  SHIPS: {
    LIST: `${API_BASE_URL}/api/ships/ships/`,
    CHECK_REGISTRATION: `${API_BASE_URL}/api/ships/check-ship/`,
    AI_RECOMMENDATIONS: `${API_BASE_URL}/api/ships/ai-recommendations/`,
    PREDICT_QUOTA: `${API_BASE_URL}/api/ships/predict-quota/`,
    REGULATOR_MANUAL_QUOTA: `${API_BASE_URL}/api/ships/regulator/manual-quota/`,
  },

  // 4. Fish & Species
  FISH: {
    LIST: `${API_BASE_URL}/api/fish/fish/`,
    SPECIES: `${API_BASE_URL}/api/fish/fish-species/`,
  },

  // 5. Catches & PNBP Predictions
  CATCHES: {
    LIST: `${API_BASE_URL}/api/catches/fish-catches/`,
    DETAILS: `${API_BASE_URL}/api/catches/catch-details/`,
    WITH_DETAILS: `${API_BASE_URL}/api/catches/fish-catches-with-details/`,
    PNBP_PREDICT: `${API_BASE_URL}/api/catches/pnbp/predict/`,
    PNBP_HISTORY: `${API_BASE_URL}/api/catches/pnbp/history/`,
    PNBP_LATEST_PREDICTIONS: `${API_BASE_URL}/api/catches/pnbp/latest-predictions/`,
    CHARTS_UNIFIED: `${API_BASE_URL}/api/catches/charts/unified/`,
  },

  // 6. Fishing Areas / Regions
  REGIONS: {
    FISHING_AREAS: `${API_BASE_URL}/api/regions/fishing-areas/`,
  },

  // 7. Admin Module
  ADMIN: {
    ROLES: `${API_BASE_URL}/api/admin/roles/`,
    USER_ROLES: `${API_BASE_URL}/api/admin/user-roles/`,
    MENUS: `${API_BASE_URL}/api/admin/menus/`,
    ROLE_MENUS: `${API_BASE_URL}/api/admin/role-menus/`,
    ADMIN_USERS: `${API_BASE_URL}/api/admin/admin-users/`,
  },

  // 8. Blockchain
  BLOCKCHAIN: {
    STATUS: `${API_BASE_URL}/api/blockchain/status/`,
    TRANSACTIONS: `${API_BASE_URL}/api/blockchain/transactions/`,
    BLOCKS: `${API_BASE_URL}/api/blockchain/blocks/`,
  },

  // 9. Smart IoT Scales
  IOT: {
    DEVICES: `${API_BASE_URL}/api/iot/devices/`,
    RECEIVE_WEIGHT: `${API_BASE_URL}/api/iot/receive-weight/`,
    STREAM: `${API_BASE_URL}/api/iot/stream/`,
    LATEST: `${API_BASE_URL}/api/iot/latest/`,
    READINGS: `${API_BASE_URL}/api/iot/readings/`,
    SAVE_CATCH: `${API_BASE_URL}/api/iot/save-catch/`,
  },

  // Documentation & Schema
  DOCS: {
    SCHEMA: `${API_BASE_URL}/api/schema/`,
    SWAGGER: `${API_BASE_URL}/api/docs/`,
    REDOC: `${API_BASE_URL}/api/docs/redoc/`,
  },
} as const

/**
 * Helper to build custom or dynamic API URL
 */
export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${cleanPath}`
}
