import { useEffect, useState } from "react";
import { ClipboardList, Coins, Fish, Search, Ship } from "lucide-react";
import { KpiCard } from "../../components/KpiCard";
import { PnbpChart } from "./components/PnbpChart";
import { BlockchainCard } from "./components/BlockchainCard";
import { CriticalQuotaTable } from "./components/CriticalQuotaTable";
import { WppBarChart } from "./components/WppBarChart";
import { shipsService } from "../../services/ships";
import { catchesService } from "../../services/catches";
import { pnbpService } from "../../services/pnbp";
import {
  calculateCatchTotalVolume,
  formatNumber,
  formatRupiah,
  formatWeight,
} from "../../utils";

interface DashboardMetrics {
  activeShipsCount: number;
  totalShipsCount: number;
  totalCatchesCount: number;
  totalVolumeStr: string;
  totalPnbpStr: string;
}

export function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    activeShipsCount: 0,
    totalShipsCount: 0,
    totalCatchesCount: 0,
    totalVolumeStr: "0 kg",
    totalPnbpStr: "Rp 0",
  });
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      try {
        const [ships, catches, chartRes] = await Promise.all([
          shipsService.getAll().catch(() => []),
          catchesService.getAll().catch(() => []),
          pnbpService.getUnifiedChartData().catch(() => null),
        ]);

        const activeShips = ships.filter((s) => s.active !== false).length;
        const totalCatches = catches.length;
        const summary = chartRes?.charts_data?.summary_stats;

        const totalPnbpStr = formatRupiah(summary?.total_pnbp_sum);
        const rawVolume =
          summary?.total_volume_sum || calculateCatchTotalVolume(catches);
        const totalVolumeStr = formatWeight(rawVolume);

        setMetrics({
          activeShipsCount: activeShips,
          totalShipsCount: ships.length,
          totalCatchesCount: totalCatches,
          totalVolumeStr,
          totalPnbpStr,
        });
      } catch {
        // Keeps 0 metrics on error
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <div>
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-7">
        <div>
          <h1 className="m-0 text-3xl font-extrabold tracking-tight">
            Ringkasan nasional
          </h1>
          <div className="text-sm text-soft mt-1">
            Tangkapan, PNBP, dan kuota seluruh kapal terintegrasi backend.
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              size={18}
              className="text-soft absolute left-3 top-2.5 pointer-events-none"
              strokeWidth={1.8}
              aria-hidden="true"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kapal atau pemilik..."
              className="w-full sm:w-65 h-10 border rounded-fco pl-9.5 pr-3 text-sm field-input focus:outline-hidden focus:border-fco-blue transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Realtime Global KPIs from APIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <KpiCard
          label="Kapal aktif"
          value={formatNumber(metrics.activeShipsCount)}
          delta={`${metrics.totalShipsCount} total armada nasional`}
          color="blue"
          Icon={Ship}
          loading={loading}
        />
        <KpiCard
          label="Total laporan tangkapan"
          value={formatNumber(metrics.totalCatchesCount)}
          delta={
            metrics.totalCatchesCount > 0
              ? "Tercatat di blockchain"
              : "Belum ada laporan"
          }
          color="emerald"
          Icon={ClipboardList}
          loading={loading}
        />
        <KpiCard
          label="Total volume tangkapan"
          value={metrics.totalVolumeStr}
          delta="Akumulasi produksi nasional"
          color="cyan"
          Icon={Fish}
          loading={loading}
        />
        <KpiCard
          label="PNBP terhitung"
          value={metrics.totalPnbpStr}
          delta="Penerimaan resmi KKP"
          color="purple"
          Icon={Coins}
          loading={loading}
        />
      </div>

      {/* PNBP Graph & Blockchain Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2">
          <PnbpChart />
        </div>
        <div>
          <BlockchainCard />
        </div>
      </div>

      {/* Quota & WPP Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <CriticalQuotaTable />
        </div>
        <div className="lg:col-span-2">
          <WppBarChart />
        </div>
      </div>
    </div>
  );
}
