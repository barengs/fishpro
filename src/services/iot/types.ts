export interface SmartScale {
  id: number;
  device_id: string;
  name: string;
  port_name: string;
  api_key?: string;
  is_active: boolean;
  last_seen: string | null;
  created_at: string;
}

export interface CreateSmartScalePayload {
  device_id: string;
  name: string;
  port_name: string;
  api_key?: string;
  is_active?: boolean;
}

export interface ScaleReading {
  id: string;
  device_id: string;
  scale_name?: string;
  port_name?: string;
  weight: number | string;
  unit: string;
  tare?: number | string;
  is_stable: boolean;
  status: "pending" | "saved" | "discarded";
  session_id?: string;
  fish_catch?: number | null;
  catch_detail?: number | null;
  operator_notes?: string | null;
  created_at: string;
}

export interface SaveScaleCatchPayload {
  reading_id: string;
  ship_registration_number: string;
  fish_species_id: number;
  wpp_id?: number | null;
  catch_type?: "pelagic" | "demersal" | "reef";
  catch_date?: string;
  location_latitude?: number | string;
  location_longitude?: number | string;
  operator_notes?: string;
}

export interface SaveScaleCatchResponse {
  status: string;
  message: string;
  catch_id: number;
  catch_detail_id: number;
  ship_registration: string;
  ship_name: string;
  fish_species: string;
  weight: number;
  unit: string;
  pnkp?: number | null;
  pnbp?: number | null;
  remaining_quota?: number | null;
  reading_id: string;
  blockchain_status: string;
}

export interface SendIoTWeightPayload {
  device_id: string;
  weight: number;
  unit?: string;
  api_key?: string;
}

export interface SendIoTWeightResponse {
  status: string;
  message: string;
  reading_id: string;
  device_id: string;
  weight: number;
  unit: string;
  is_stable: boolean;
  created_at: string;
}
