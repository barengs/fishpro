export interface BlockchainStatus {
  valid: boolean;
  message: string;
  block_count: number;
  transaction_count: number;
}

export interface BlockchainBlock {
  index: number;
  timestamp: string;
  data: string;
  previous_hash: string;
  hash: string;
  nonce: number;
}

export interface BlockchainTransactionBlockData {
  index: number;
  hash: string;
  timestamp: string;
}

export interface BlockchainTransactionQuota {
  id: number;
  year: number;
  quota: number | string;
  remaining_quota: number | string;
}

export interface FishCatchTransaction {
  id: number;
  fish_catch_id: number;
  timestamp: string;
  ship_registration_number: string;
  fishing_area_code: string;
  fish_species_code: string;
  fish_name: string;
  quantity: string | number;
  unit: string;
  catch_date: string;
  tarif_index?: string | number | null;
  pnkp?: string | number | null;
  pnbp?: string | number | null;
  quota?: BlockchainTransactionQuota | null;
  block_id: number;
  block_data?: BlockchainTransactionBlockData;
}
