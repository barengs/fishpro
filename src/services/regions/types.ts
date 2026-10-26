export interface FishingArea {
  id: number;
  nama: string;
  code: string;
  deskripsi?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateFishingAreaPayload {
  nama: string;
  code: string;
  deskripsi?: string | null;
}

export interface ImportAreasResponse {
  message: string;
  created: number;
  updated: number;
  errors: number;
  error_details?: string[] | null;
}
