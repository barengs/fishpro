import { apiClient, API_ENDPOINTS } from '../api'
import type {
  BlockchainBlock,
  BlockchainStatus,
  FishCatchTransaction,
} from './types'

export const blockchainService = {
  /**
   * GET /api/blockchain/status/ - Get Blockchain Status
   * Memeriksa validitas rantai blok dan mengambil total blok serta transaksi
   */
  async getStatus(): Promise<BlockchainStatus> {
    return apiClient<BlockchainStatus>(API_ENDPOINTS.BLOCKCHAIN.STATUS)
  },

  /**
   * GET /api/blockchain/blocks/ - Get Blockchain Blocks
   * Mengambil semua blok blockchain beserta hash dan timestamp
   */
  async getBlocks(): Promise<BlockchainBlock[]> {
    const data = await apiClient<BlockchainBlock[]>(API_ENDPOINTS.BLOCKCHAIN.BLOCKS)
    return Array.isArray(data) ? data : []
  },

  /**
   * GET /api/blockchain/transactions/ - Get All Blockchain Transactions
   * Mengambil semua transaksi penangkapan ikan yang disegel ke blockchain
   */
  async getTransactions(): Promise<FishCatchTransaction[]> {
    const data = await apiClient<FishCatchTransaction[]>(
      API_ENDPOINTS.BLOCKCHAIN.TRANSACTIONS
    )
    return Array.isArray(data) ? data : []
  },
}
