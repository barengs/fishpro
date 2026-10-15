export interface FishSpecies {
  id: number
  name: string
  scientific_name?: string | null
  description?: string | null
  created_at?: string
  updated_at?: string
}

export interface CreateFishSpeciesPayload {
  name: string
  scientific_name?: string | null
  description?: string | null
}

export interface Fish {
  id: number
  species: number
  species_name?: string
  name?: string | null
  weight?: string | number | null
  notes?: string | null
  created_at?: string
  updated_at?: string
}

export interface CreateFishPayload {
  species: number
  name?: string | null
  weight?: string | number | null
  notes?: string | null
}

export interface ImportCsvResponse {
  message: string
  created: number
  updated: number
  errors: number
  error_details?: string[] | null
}
