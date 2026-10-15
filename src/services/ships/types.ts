export interface QuotaInfo {
  year: number
  total_quota: number | string
  remaining_quota: number | string
  used_quota: number | string
  quota_percentage: number
}

export interface Ship {
  id: number
  name: string
  registration_number: string
  owner?: number | null
  owner_name?: string | null
  captain?: number | null
  captain_name?: string | null
  length?: number | string | null
  width?: number | string | null
  gross_tonnage?: number | string | null
  year_built?: number | null
  home_port?: string | null
  active: boolean
  current_year_quota?: QuotaInfo | null
  created_at?: string
  updated_at?: string
}

export interface CreateShipPayload {
  name: string
  registration_number: string
  owner?: number | null
  captain?: number | null
  length?: number | string | null
  width?: number | string | null
  gross_tonnage?: number | string | null
  year_built?: number | null
  home_port?: string | null
  active?: boolean
}

export interface ShipRecommendation {
  id: number
  name: string
  registration_number: string
  owner: string
  captain?: string | null
  total_catch: number
  average_catch: number
  catch_trend: string
  catch_efficiency: number
  best_fishing_location?: {
    latitude: number | null
    longitude: number | null
  }
  best_fishing_months: string[]
}
