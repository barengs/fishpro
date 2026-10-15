import { apiClient, API_ENDPOINTS } from '../api'
import type {
  PnbpHistoryResponse,
  PnbpLatestPredictionsResponse,
  PredictPnbpPayload,
  UnifiedChartDataResponse,
} from './types'

export const pnbpService = {
  /**
   * GET /api/catches/pnbp/history/ - Dapatkan data historis PNBP
   * @param source 'database' atau 'file' (default: 'database')
   */
  async getHistory(source: 'database' | 'file' = 'database'): Promise<PnbpHistoryResponse> {
    return apiClient<PnbpHistoryResponse>(
      `${API_ENDPOINTS.CATCHES.PNBP_HISTORY}?source=${source}`
    )
  },

  /**
   * GET /api/catches/pnbp/latest-predictions/ - Dapatkan hasil prediksi PNBP terakhir
   */
  async getLatestPredictions(): Promise<PnbpLatestPredictionsResponse> {
    return apiClient<PnbpLatestPredictionsResponse>(
      API_ENDPOINTS.CATCHES.PNBP_LATEST_PREDICTIONS
    )
  },

  /**
   * POST /api/catches/pnbp/predict/ - Prediksi PNBP masa depan menggunakan 4 metode
   * (Linear Regression, Neural Network MLP, NSGA-III, Time Series ARIMA)
   */
  async predictFuture(payload: PredictPnbpPayload = { use_database_data: true }): Promise<{
    status: string
    message: string
    predictions: unknown
  }> {
    return apiClient(API_ENDPOINTS.CATCHES.PNBP_PREDICT, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  /**
   * GET /api/catches/charts/unified/ - Data terpadu untuk semua grafik dashboard
   */
  async getUnifiedChartData(): Promise<UnifiedChartDataResponse> {
    return apiClient<UnifiedChartDataResponse>(API_ENDPOINTS.CATCHES.CHARTS_UNIFIED)
  },
}
