import { useEffect, useState } from "react";
import { ClipboardList, Coins, Fish, Ship } from "lucide-react";
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
      {/* Page Header (LemonLead Modern Style) */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-soft mb-1">
            <span>Dashboard</span>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className="text-fco-blue font-semibold">Ringkasan Nasional</span>
          </div>
          <h1 className="m-0 text-2xl sm:text-3xl font-extrabold tracking-tight text-strong">
            Dashboard Overview
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full surface-card border border-slate-200/80 dark:border-fco-border-dark text-xs font-medium text-soft shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-strong font-semibold">Live Data</span>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span>WPP-NRI Terpadu</span>
          </div>
        </div>
      </div>

      {/* 4 Realtime Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard
          label="Kapal Aktif"
          value={formatNumber(metrics.activeShipsCount)}
          delta={`${metrics.totalShipsCount} armada nasional`}
          color="blue"
          Icon={Ship}
          loading={loading}
          href="/admin/ships"
          linkText="Lihat Detail Kapal"
        />
        <KpiCard
          label="Total Volume Tangkapan"
          value={metrics.totalVolumeStr}
          delta="Akumulasi produksi nasional"
          color="amber"
          Icon={Fish}
          loading={loading}
          href="/admin/catches"
          linkText="Lihat Detail Tangkapan"
        />
        <KpiCard
          label="Total Laporan Tangkapan"
          value={formatNumber(metrics.totalCatchesCount)}
          delta={
            metrics.totalCatchesCount > 0
              ? "Tercatat di blockchain"
              : "Belum ada laporan"
          }
          color="emerald"
          Icon={ClipboardList}
          loading={loading}
          href="/admin/catches"
          linkText="Lihat Detail Laporan"
        />
        <KpiCard
          label="PNBP Terhitung"
          value={metrics.totalPnbpStr}
          delta="Penerimaan resmi negara"
          color="rose"
          Icon={Coins}
          loading={loading}
          href="/admin/quota"
          linkText="Lihat Detail PNBP"
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
