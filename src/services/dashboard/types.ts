export interface AdminDashboardData {
  status: string;
  kpi: {
    total_ships: number;
    total_owners: number;
    total_catches: number;
    total_volume_kg: number;
    total_pnbp: number;
  };
  monthly_pnbp_chart: Array<{
    month: string;
    label: string;
    total_volume_kg: number;
    total_pnbp: number;
    record_count: number;
    is_prediction: boolean;
  }>;
  wpp_distribution: Array<{
    wpp_code: string;
    wpp_name: string;
    total_volume_kg: number;
    transaction_count: number;
  }>;
  critical_quota_ships: Array<{
    id: number;
    name: string;
    registration_number: string;
    remaining_quota_kg: number;
    total_quota_kg: number;
    quota_percentage: number;
    status: "Kritis" | "Waspada" | "Aman" | string;
  }>;
  blockchain: {
    total_blocks: number;
    last_block_index: number;
    last_block_hash: string | null;
    is_valid: boolean;
  };
}

export interface RegulatorDashboardData {
  status: string;
  kpi: {
    total_ships_supervised: number;
    critical_ships_count: number;
    warning_ships_count: number;
    compliance_rate: number;
    active_scales_count: number;
    pending_readings_count: number;
    total_blocks: number;
    total_transactions: number;
  };
  vessels_radar: Array<{
    ship_id: number;
    name: string;
    reg: string;
    wpp_code: string;
    quota_percentage: number;
    remaining_quota_kg: number;
    status: "Kritis" | "Waspada" | "Aman" | string;
  }>;
}

export interface OwnerDashboardData {
  status: string;
  owner: {
    id: number | null;
    name: string;
  };
  kpi: {
    ships_count: number;
    unassigned_captains_count: number;
    catches_count: number;
    total_volume_kg: number;
    total_pnbp: number;
    average_quota_pct: number;
  };
  fleet: Array<{
    id: number;
    name: string;
    registration_number: string;
    captain_name: string | null;
    active: boolean;
    has_quota: boolean;
    quota_percentage: number | null;
    remaining_quota_kg: number | null;
    total_quota_kg: number | null;
  }>;
}

export interface CaptainDashboardData {
  status: string;
  ship: {
    id: number;
    name: string;
    registration_number: string;
    gross_tonnage: number;
    length: number | null;
    width: number | null;
    year_built: number | null;
    home_port: string | null;
    active: boolean;
  } | null;
  quota: {
    year: number;
    total_quota_kg: number;
    used_quota_kg: number;
    remaining_quota_kg: number;
    quota_percentage: number;
  } | null;
  recent_catches: Array<{
    date: string;
    species: string;
    quantity: number;
    unit: string;
    pnbp: number;
  }>;
  blockchain: {
    last_block_index: number;
    last_block_hash: string | null;
    total_transactions: number;
  };
}
