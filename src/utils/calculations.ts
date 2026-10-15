import type { FishCatch } from "../services/catches/types";
import type { Ship } from "../services/ships/types";

/**
 * Utilitas kalkulasi bisnis untuk analitik dan metrik dashboard FISHPRO.
 */

/**
 * Menghitung total volume tangkapan (kg) dari daftar laporan penangkapan ikan.
 */
export function calculateCatchTotalVolume(catches: FishCatch[]): number {
  if (!catches || catches.length === 0) return 0;

  return catches.reduce((acc, c) => {
    const details = c.catch_details || [];
    const catchVolume = details.reduce((sum, d) => {
      const qty =
        typeof d.quantity === "number"
          ? d.quantity
          : parseFloat(String(d.quantity)) || 0;
      // Normalisasi jika satuan adalah ton
      const multiplier = (d.unit || "").toLowerCase() === "ton" ? 1000 : 1;
      return sum + qty * multiplier;
    }, 0);
    return acc + catchVolume;
  }, 0);
}

/**
 * Menghitung rata-rata persentase sisa kuota dari armada kapal.
 */
export function calculateAverageRemainingQuota(ships: Ship[]): number {
  if (!ships || ships.length === 0) return 0;

  const totalPct = ships.reduce((acc, s) => {
    const quotaPct = s.current_year_quota?.quota_percentage;
    return acc + (typeof quotaPct === "number" ? quotaPct : 0);
  }, 0);

  return Math.round(totalPct / ships.length);
}

/**
 * Menghitung akumulasi berat (kg) dan total PNBP (Rp) dari tabel laporan tangkapan nahkoda.
 */
export function extractCatchReportMetrics(
  reports: Array<{ qty?: string; pnbp?: string }>,
): {
  totalWeightKg: number;
  totalPnbpSum: number;
} {
  if (!reports || reports.length === 0) {
    return { totalWeightKg: 0, totalPnbpSum: 0 };
  }

  let totalWeightKg = 0;
  let totalPnbpSum = 0;

  for (const r of reports) {
    if (r.qty) {
      const num = parseFloat(r.qty) || 0;
      const isTon = r.qty.toLowerCase().includes("ton");
      totalWeightKg += isTon ? num * 1000 : num;
    }
    if (r.pnbp) {
      const cleanNum = r.pnbp.replace(/[^0-9]/g, "");
      totalPnbpSum += Number(cleanNum) || 0;
    }
  }

  return { totalWeightKg, totalPnbpSum };
}
