export interface CatchDetail {
  id: number
  fish_catch?: number
  fish_species: number
  fish_species_name?: string
  wpp?: number | null
  wpp_name?: string | null
  quantity: number | string
  unit: string
  value?: number | string | null
  tarif_index?: number | string | null
  pnkp?: number | string | null
  pnbp?: number | string | null
  notes?: string | null
}

export interface CreateCatchDetailPayload {
  fish_species: number
  wpp?: number | null
  quantity: number
  unit?: string
  value?: number | null
  notes?: string | null
}

export interface FishCatch {
  id: number
  ship: string | number
  ship_name?: string
  catch_date: string
  catch_type: 'pelagic' | 'demersal' | 'reef' | string
  location_latitude: string | number
  location_longitude: string | number
  description?: string | null
  catch_details?: CatchDetail[]
  created_at?: string
  updated_at?: string
}

export interface FishCatchWithDetails extends FishCatch {
  catch_details_display?: CatchDetail[]
  quota?: number | string | null
  remaining_quota?: number | string | null
}

export interface CreateFishCatchPayload {
  ship: string // Ship registration_number
  catch_date: string
  catch_type: 'pelagic' | 'demersal' | 'reef' | string
  location_latitude: string | number
  location_longitude: string | number
  description?: string
}

export interface CreateFishCatchWithDetailsPayload extends CreateFishCatchPayload {
  catch_details: CreateCatchDetailPayload[]
}
