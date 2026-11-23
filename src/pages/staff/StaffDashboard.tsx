import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardList,
  Fish,
  Scale,
  Ship,
} from "lucide-react";
import { KpiCard } from "../../components/KpiCard";
import { RoleBadge } from "../../components/RoleBadge";
import { WppBarChart } from "../admin/components/WppBarChart";
import { shipsService } from "../../services/ships";
import { catchesService, type FishCatch } from "../../services/catches";
import { iotService } from "../../services/iot";
import { dashboardService } from "../../services/dashboard";
import {
  calculateCatchTotalVolume,
  formatNumber,
  formatWeight,
} from "../../utils";

interface StaffMetrics {
  activeShipsCount: number;
  totalShipsCount: number;
  totalCatchesCount: number;
  totalVolumeStr: string;
  volumeSparkline?: number[];
  volumeTrendUp?: boolean;
  activeScalesCount: number;
}

export function StaffDashboard() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<StaffMetrics>({
    activeShipsCount: 0,
    totalShipsCount: 0,
    totalCatchesCount: 0,
    totalVolumeStr: "0 kg",
    activeScalesCount: 0,
  });
  const [recentCatches, setRecentCatches] = useState<FishCatch[]>([]);

  useEffect(() => {
    async function loadStaffStats() {
      setLoading(true);
      try {
        const [dashData, ships, catches, devices] = await Promise.all([
          dashboardService.getAdminDashboard().catch(() => null),
          shipsService.getAll().catch(() => []),
          catchesService.getAll().catch(() => []),
          iotService.getDevices().catch(() => []),
        ]);

        const activeShips =
          dashData?.kpi?.total_ships ??
          ships.filter((s) => s.active !== false).length;
        const totalCatches = dashData?.kpi?.total_catches ?? catches.length;

        const rawVolume =
          dashData?.kpi?.total_volume_kg ?? calculateCatchTotalVolume(catches);
        const totalVolumeStr = formatWeight(rawVolume);

        const sortedCatches = [...catches].sort((a, b) => {
          const tA = a.catch_date ? new Date(a.catch_date).getTime() : 0;
          const tB = b.catch_date ? new Date(b.catch_date).getTime() : 0;
          return tB - tA;
        });
        setRecentCatches(sortedCatches.slice(0, 6));

        // Generate volume sparkline
        const volByDate: Record<string, number> = {};
        for (const c of [...catches].sort(
          (a, b) =>
            new Date(a.catch_date || 0).getTime() -
            new Date(b.catch_date || 0).getTime(),
        )) {
          const key = (c.catch_date || "").slice(0, 10);
          if (key) {
            const vol = (c.catch_details || []).reduce(
              (acc, d) => acc + (Number(d.quantity) || 0),
              0,
            );
            volByDate[key] = (volByDate[key] || 0) + vol;
          }
        }
        const volumeSparkline = Object.values(volByDate);
        const volumeTrendUp =
          volumeSparkline.length >= 2
            ? volumeSparkline[volumeSparkline.length - 1] >= volumeSparkline[0]
            : true;

        setMetrics({
          activeShipsCount: activeShips,
          totalShipsCount: ships.length || activeShips,
          totalCatchesCount: totalCatches,
          totalVolumeStr,
          volumeSparkline,
          volumeTrendUp,
          activeScalesCount: devices.filter((d) => d.is_active !== false).length,
        });
      } catch {
        // Keeps safe default metrics
      } finally {
        setLoading(false);
      }
    }

    loadStaffStats();
  }, []);

  return (
    <div>
      {/* Header Staf Lapangan */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-subtext dark:text-slate-400 mb-1">
            <span>Pelayanan Pelabuhan</span>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className="text-ink dark:text-white font-semibold">Operasional Lapangan</span>
          </div>
          <h1 className="m-0 text-[22px] sm:text-[26px] font-bold tracking-tight text-ink dark:text-white">
            Dashboard Staf Lapangan
          </h1>
          <p className="m-0 text-[13px] text-subtext dark:text-slate-400 mt-1">
            Operasional penimbangan tangkapan IoT di dermaga, administrasi kapal, dan verifikasi hasil laut.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <RoleBadge role="admin" label="Staf Lapangan" />
        </div>
      </div>

      {/* 4 Cards Operasional Lapangan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard
          label="Timbangan IoT Terpasang"
          value={formatNumber(metrics.activeScalesCount)}
          delta="Timbangan aktif di dermaga"
          showSparkline={false}
          color="blue"
          Icon={Scale}
          loading={loading}
          href="/staff/scales"
          linkText="Buka Terminal Timbang"
        />
        <KpiCard
          label="Laporan Tangkapan Masuk"
          value={formatNumber(metrics.totalCatchesCount)}
          delta="Hasil verifikasi di pelabuhan"
          showSparkline={false}
          color="emerald"
          Icon={ClipboardList}
          loading={loading}
          href="/staff/catches"
          linkText="Daftar Tangkapan"
        />
        <KpiCard
          label="Total Volume Ditimbang"
          value={metrics.totalVolumeStr}
          delta="Akumulasi produksi tervalidasi"
          showSparkline={true}
          sparklineData={metrics.volumeSparkline}
          trendUp={metrics.volumeTrendUp}
          color="amber"
          Icon={Fish}
          loading={loading}
          href="/staff/catches"
          linkText="Detail Bobot"
        />
        <KpiCard
          label="Kapal Aktif Melaut"
          value={formatNumber(metrics.activeShipsCount)}
          delta={`${metrics.totalShipsCount} armada terdaftar`}
          showSparkline={false}
          color="purple"
          Icon={Ship}
          loading={loading}
          href="/staff/ships"
          linkText="Data Armada"
        />
      </div>

      {/* Grid: Laporan Tangkapan Masuk + Distribusi WPP */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Tabel Tangkapan Terbaru */}
        <div className="lg:col-span-3 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-slate-800 rounded-2xl shadow-subtle overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#E5E7EB] dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="m-0 text-[15px] font-bold text-ink dark:text-white">
                Laporan Tangkapan Masuk
              </h2>
              <p className="m-0 text-xs text-subtext dark:text-slate-400 mt-0.5">
                Daftar laporan hasil penangkapan ikan teranyar dari armada di dermaga
              </p>
            </div>
            <Link
              to="/staff/catches"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 no-underline"
            >
              Lihat semua &rarr;
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3 p-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse"
                />
              ))}
            </div>
          ) : recentCatches.length === 0 ? (
            <div className="py-10 text-center text-sm text-subtext dark:text-slate-400">
              Belum ada laporan tangkapan yang masuk.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F9FAFB] dark:bg-slate-800/60 border-b border-[#E5E7EB] dark:border-slate-700 text-[11px] font-semibold uppercase tracking-wider text-subtext dark:text-slate-400">
                    <th className="py-3 px-4">Tanggal</th>
                    <th className="py-3 px-4">Nama Kapal</th>
                    <th className="py-3 px-4">Tipe</th>
                    <th className="py-3 px-4 text-right">Rincian Spesies</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] dark:divide-slate-800">
                  {recentCatches.map((c) => (
                    <tr
                      key={c.id}
                      className="hover:bg-[#F9FAFB] dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-4 text-subtext dark:text-slate-400 font-mono">
                        {c.catch_date || "—"}
                      </td>
                      <td className="py-3 px-4 font-semibold text-ink dark:text-white">
                        {c.ship_name || `Kapal #${c.ship}`}
                      </td>
                      <td className="py-3 px-4 capitalize text-subtext dark:text-slate-400">
                        {c.catch_type || "Pelagis"}
                      </td>
                      <td className="py-3 px-4 text-right text-ink dark:text-white font-medium">
                        {c.catch_details?.length
                          ? `${c.catch_details.length} jenis ikan`
                          : "1 jenis ikan"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Distribusi Wilayah Tangkap WPP */}
        <div className="lg:col-span-2">
          <WppBarChart />
        </div>
      </div>
    </div>
  );
}
