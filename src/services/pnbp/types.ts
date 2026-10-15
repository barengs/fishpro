export interface PnbpHistoryRecord {
  year?: number;
  month?: number | string;
  total_pnbp?: number | string;
  total_catch_weight?: number | string;
  record_count?: number;
  date?: string;
  pnbp?: number;
  nama_kapal?: string;
  total_volume?: number;
}

export interface PnbpHistoryResponse {
  status: string;
  source: string;
  data_count: number;
  historical_data: PnbpHistoryRecord[];
}

export interface MonthlyForecast {
  month: string;
  month_name?: string;
  predicted_pnbp: number;
  method?: string;
}

export interface ModelPredictionDetail {
  model_name?: string;
  r2_score?: number;
  mae?: number;
  rmse?: number;
  predictions?: number[] | MonthlyForecast[];
  monthly_predictions?: Record<string, number>;
}

export interface PnbpPredictionsData {
  timestamp?: string;
  prediction_period?: string;
  models?: {
    linear_regression?: ModelPredictionDetail;
    neural_network?: ModelPredictionDetail;
    nsga_iii?: ModelPredictionDetail;
    time_series?: ModelPredictionDetail;
  };
  ensemble_prediction?: {
    monthly_forecasts?: MonthlyForecast[];
    total_predicted_pnbp?: number;
  };
  monthly_forecasts?: MonthlyForecast[];
  summary?: {
    average_monthly_pnbp?: number;
    highest_month?: string;
    lowest_month?: string;
  };
  [key: string]: unknown;
}

export interface PnbpLatestPredictionsResponse {
  status: string;
  message?: string;
  predictions: PnbpPredictionsData;
}

export interface PredictPnbpPayload {
  use_database_data?: boolean;
  historical_data?: unknown[];
  ships_data?: unknown[];
}

export interface UnifiedChartSummaryStats {
  total_historical_records?: number;
  total_pnbp_sum?: number;
  avg_pnbp_per_record?: number;
  max_pnbp?: number;
  min_pnbp?: number;
  total_volume_sum?: number;
  avg_volume_per_record?: number;
  unique_ships?: number;
  [key: string]: unknown;
}

export interface UnifiedChartDataResponse {
  status: string;
  charts_data: {
    historical_pnbp?: {
      data?: PnbpHistoryRecord[];
      count?: number;
      chart_type?: string;
      title?: string;
      [key: string]: unknown;
    };
    pnbp_predictions?: {
      data?: PnbpPredictionsData | null;
      available?: boolean;
      chart_type?: string;
      title?: string;
      [key: string]: unknown;
    };
    quota_predictions?: {
      data?: {
        ship_name?: string;
        ship_registration?: string;
        predictions?: unknown;
      } | null;
      available?: boolean;
      chart_type?: string;
      title?: string;
      [key: string]: unknown;
    };
    summary_stats?: UnifiedChartSummaryStats;
    [key: string]: unknown;
  };
}
