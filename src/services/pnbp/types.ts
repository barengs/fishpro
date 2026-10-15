export interface PnbpHistoryRecord {
  year?: number
  month?: number | string
  total_pnbp?: number | string
  total_catch_weight?: number | string
  record_count?: number
  date?: string
  pnbp?: number
}

export interface PnbpHistoryResponse {
  status: string
  source: string
  data_count: number
  historical_data: PnbpHistoryRecord[]
}

export interface MonthlyForecast {
  month: string
  month_name?: string
  predicted_pnbp: number
  method?: string
}

export interface ModelPredictionDetail {
  model_name?: string
  r2_score?: number
  mae?: number
  rmse?: number
  predictions?: number[] | MonthlyForecast[]
  monthly_predictions?: Record<string, number>
}

export interface PnbpPredictionsData {
  timestamp?: string
  prediction_period?: string
  models?: {
    linear_regression?: ModelPredictionDetail
    neural_network?: ModelPredictionDetail
    nsga_iii?: ModelPredictionDetail
    time_series?: ModelPredictionDetail
  }
  ensemble_prediction?: {
    monthly_forecasts?: MonthlyForecast[]
    total_predicted_pnbp?: number
  }
  monthly_forecasts?: MonthlyForecast[]
  summary?: {
    average_monthly_pnbp?: number
    highest_month?: string
    lowest_month?: string
  }
  [key: string]: unknown
}

export interface PnbpLatestPredictionsResponse {
  status: string
  message?: string
  predictions: PnbpPredictionsData
}

export interface PredictPnbpPayload {
  use_database_data?: boolean
  historical_data?: unknown[]
  ships_data?: unknown[]
}

export interface UnifiedChartDataResponse {
  status: string
  charts_data: {
    historical_pnbp?: {
      labels?: string[]
      data?: number[]
      [key: string]: unknown
    }
    pnbp_predictions?: {
      labels?: string[]
      data?: number[]
      [key: string]: unknown
    }
    quota_predictions?: unknown
    summary_stats?: {
      total_historical_pnbp?: number
      total_predicted_pnbp?: number
      growth_rate?: number
      [key: string]: unknown
    }
    [key: string]: unknown
  }
}
