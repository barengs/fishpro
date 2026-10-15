import type { OwnerShip } from '../owners/types'

export interface Captain {
  id: number
  full_name: string
  license_number: string
  owner: number
  owner_name?: string
  user?: number | null
  date_of_birth?: string | null
  contact_info?: string | null
  email?: string | null
  phone?: string | null
  address?: string | null
  years_of_experience?: number | null
  ships?: OwnerShip[]
  created_at?: string
  updated_at?: string
}

export interface CreateCaptainPayload {
  full_name: string
  license_number: string
  owner: number
  user?: number | null
  date_of_birth?: string | null
  contact_info?: string | null
  email?: string | null
  phone?: string | null
  address?: string | null
  years_of_experience?: number | null
}
