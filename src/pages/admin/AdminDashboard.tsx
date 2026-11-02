import { useEffect, useState } from "react";
import { Ship, Fish, ClipboardList, Coins, ShieldCheck, UserCheck } from "lucide-react";
import { KpiCard } from "../../components/KpiCard";
import { PnbpChart } from "./components/PnbpChart";
import { BlockchainCard } from "./components/BlockchainCard";
import { CriticalQuotaTable } from "./components/CriticalQuotaTable";
import { WppBarChart } from "./components/WppBarChart";
import { shipsService } from "../../services/ships";
import { catchesService } from "../../services/catches";
import { pnbpService } from "../../services/pnbp";
import { authService } from "../../services/auth";
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
  volumeSparkline?: number[];
  pnbpSparkline?: number[];
  volumeTrendUp?: boolean;
  pnbpTrendUp?: boolean;
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

        // Extract real time-series numbers for time-sensitive metrics
        const history = chartRes?.charts_data?.historical_pnbp?.data || [];
        const pnbpHistory = history
          .map((h) => Number(h.pnbp ?? h.total_pnbp ?? 0))
          .filter((v) => !isNaN(v) && v > 0);

        const volumeHistory = history
          .map((h) => Number(h.total_volume ?? h.total_catch_weight ?? 0))
          .filter((v) => !isNaN(v) && v > 0);

        let volumeSparkline = volumeHistory;
        let pnbpSparkline = pnbpHistory;

        // Fallback: derive time series from catches if historical aggregate lacks points
        if (volumeSparkline.length < 2 && catches.length > 0) {
          const sorted = [...catches]
            .filter((c) => c.catch_date)
            .sort((a, b) => new Date(a.catch_date).getTime() - new Date(b.catch_date).getTime());

          const volByDate: Record<string, number> = {};
          const pnbpByDate: Record<string, number> = {};

          for (const c of sorted) {
            const key = c.catch_date.slice(0, 10);
            const vol = (c.catch_details || []).reduce((acc, d) => acc + (Number(d.quantity) || 0), 0);
            const pnbp = (c.catch_details || []).reduce((acc, d) => acc + (Number(d.pnbp) || 0), 0);
            volByDate[key] = (volByDate[key] || 0) + vol;
            if (pnbp > 0) pnbpByDate[key] = (pnbpByDate[key] || 0) + pnbp;
          }

          const volVals = Object.values(volByDate);
          if (volVals.length >= 2) volumeSparkline = volVals;
          const pnbpVals = Object.values(pnbpByDate);
          if (pnbpVals.length >= 2) pnbpSparkline = pnbpVals;
        }

        const volumeTrendUp =
          volumeSparkline.length >= 2
            ? volumeSparkline[volumeSparkline.length - 1] >= volumeSparkline[0]
            : true;

        const pnbpTrendUp =
          pnbpSparkline.length >= 2
            ? pnbpSparkline[pnbpSparkline.length - 1] >= pnbpSparkline[0]
            : true;

        setMetrics({
          activeShipsCount: activeShips,
          totalShipsCount: ships.length,
          totalCatchesCount: totalCatches,
          totalVolumeStr,
          totalPnbpStr,
          volumeSparkline,
          pnbpSparkline,
          volumeTrendUp,
          pnbpTrendUp,
        });
      } catch {
        // Keeps 0 metrics on error
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const isSuperAdmin = authService.isSuperAdmin();

  return (
    <div>
      {/* Page Header (LemonLead Modern Style) */}
      <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-soft mb-1">
            <span>Dashboard</span>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className="text-fco-blue font-semibold">
              {isSuperAdmin
                ? "Tata Kelola & Ringkasan Nasional"
                : "Pelayanan & Operasional Harian"}
            </span>
          </div>
          <h1 className="m-0 text-2xl sm:text-3xl font-extrabold tracking-tight text-strong">
            {isSuperAdmin
              ? "Dashboard Overview (Super Admin)"
              : "Dashboard Staf Operasional"}
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full surface-card border border-slate-200/80 dark:border-fco-border-dark text-xs font-medium text-soft shadow-2xs">
            <span
              className={`w-2 h-2 rounded-full ${
                isSuperAdmin ? "bg-purple-500" : "bg-emerald-500"
              } animate-pulse`}
            />
            <span className="text-strong font-semibold flex items-center gap-1.5">
              {isSuperAdmin ? (
                <>
                  <ShieldCheck size={14} className="text-purple-600" />
                  <span>Super Admin</span>
                </>
              ) : (
                <>
                  <UserCheck size={14} className="text-emerald-600" />
                  <span>Staf Admin</span>
                </>
              )}
            </span>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span>{isSuperAdmin ? "Akses Tata Kelola Penuh" : "Akses Operasional"}</span>
          </div>
        </div>
      </div>

      {/* Role Banner Indicator */}
      {!isSuperAdmin && (
        <div className="mb-6 p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 flex items-start gap-3 text-xs text-slate-700 dark:text-slate-300">
          <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-fco-blue flex items-center justify-center shrink-0 font-bold mt-0.5">
            i
          </div>
          <div className="flex-1 leading-relaxed">
            <strong className="text-strong font-semibold">
              Ruang Lingkup Staf Pelayanan:
            </strong>{" "}
            Anda memiliki akses operasional untuk memverifikasi kapal armada,
            administrasi pemilik & nahkoda, pencatatan tangkapan, serta katalog
            spesies dan zona WPP. Modul penetapan tarif kuota, audit
            blockchain, dan hak akses RBAC dikelola khusus oleh{" "}
            <strong>Super Administrator</strong>.
          </div>
        </div>
      )}

      {/* 4 Realtime Cards (Sparkline only on Volume & PNBP time-series) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard
          label="Kapal Aktif"
          value={formatNumber(metrics.activeShipsCount)}
          delta={`${metrics.totalShipsCount} armada nasional`}
          showSparkline={false}
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
          showSparkline={true}
          sparklineData={metrics.volumeSparkline}
          trendUp={metrics.volumeTrendUp}
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
          showSparkline={false}
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
          showSparkline={true}
          sparklineData={metrics.pnbpSparkline}
          trendUp={metrics.pnbpTrendUp}
          color="rose"
          Icon={Coins}
          loading={loading}
          href={isSuperAdmin ? "/admin/quota" : "/admin/catches"}
          linkText={
            isSuperAdmin ? "Lihat Detail Kebijakan" : "Lihat Laporan Tangkapan"
          }
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
