export interface OwnerShip {
  id: number
  name: string
  registration_number: string
  active: boolean
}

export interface OwnerCaptain {
  id: number
  name: string
  license_number: string
}

export interface Owner {
  id: number
  full_name: string
  owner_type: 'individual' | 'company' | string
  contact_info?: string | null
  email?: string | null
  phone?: string | null
  address?: string | null
  ships?: OwnerShip[]
  captains?: OwnerCaptain[]
  created_at?: string
  updated_at?: string
}

export interface CreateOwnerPayload {
  full_name: string
  owner_type: 'individual' | 'company'
  contact_info?: string
  email?: string
  phone?: string
  address?: string
}

export type { Captain, CreateCaptainPayload } from '../captains/types'
