import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Anchor,
  Building2,
  ClipboardList,
  Fish,
  Scale,
  Ship,
  Sparkles,
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
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-soft mb-1">
            <span>Pelayanan Pelabuhan</span>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className="text-strong font-medium">Operasional Lapangan</span>
          </div>
          <h1 className="m-0 text-2xl sm:text-3xl font-extrabold tracking-tight text-strong">
            Dashboard Staf Lapangan
          </h1>
          <p className="m-0 text-sm text-soft mt-1">
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

      {/* Aksi Cepat Tugas Lapangan */}
      <div className="mb-6 p-4 rounded-xl surface-card border border-fco-border flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-sm font-bold text-strong flex items-center gap-2">
            <span>Tugas & Aksi Lapangan</span>
            <span className="inline-flex items-center gap-1 text-2xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Sparkles size={11} />
              <span>Realtime IoT</span>
            </span>
          </div>
          <div className="text-xs text-soft mt-0.5">
            Pintasan kerja harian staf untuk penimbangan tangkapan dan verifikasi armada nelayan.
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/staff/scales"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-fco-blue hover:bg-fco-blue-hover text-white no-underline transition-colors shadow-2xs"
          >
            <Scale size={15} />
            <span>Mulai Timbang IoT</span>
          </Link>
          <Link
            to="/staff/catches"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold surface-inset hover:surface-page border border-fco-border-subtle text-strong no-underline transition-colors"
          >
            <ClipboardList size={14} className="text-soft" />
            <span>Entri Tangkapan</span>
          </Link>
          <Link
            to="/staff/ships"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold surface-inset hover:surface-page border border-fco-border-subtle text-strong no-underline transition-colors"
          >
            <Ship size={14} className="text-soft" />
            <span>Verifikasi Kapal</span>
          </Link>
          <Link
            to="/staff/owners"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold surface-inset hover:surface-page border border-fco-border-subtle text-strong no-underline transition-colors"
          >
            <Building2 size={14} className="text-soft" />
            <span>Pemilik Kapal</span>
          </Link>
          <Link
            to="/staff/captains"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold surface-inset hover:surface-page border border-fco-border-subtle text-strong no-underline transition-colors"
          >
            <Anchor size={14} className="text-soft" />
            <span>Nahkoda</span>
          </Link>
        </div>
      </div>

      {/* Grid: Laporan Tangkapan Masuk + Distribusi WPP */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Tabel Tangkapan Terbaru */}
        <div className="lg:col-span-3 surface-card border border-fco-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="m-0 text-base font-bold text-strong">
                Laporan Tangkapan Masuk
              </h2>
              <p className="m-0 text-xs text-soft mt-0.5">
                Daftar laporan hasil penangkapan ikan teranyar dari armada di dermaga
              </p>
            </div>
            <Link
              to="/staff/catches"
              className="text-xs font-semibold text-fco-blue hover:underline no-underline"
            >
              Lihat semua &rarr;
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3 py-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse"
                />
              ))}
            </div>
          ) : recentCatches.length === 0 ? (
            <div className="py-10 text-center text-sm text-soft">
              Belum ada laporan tangkapan yang masuk.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-fco-border-subtle text-soft font-semibold">
                    <th className="py-2.5 px-3">Tanggal</th>
                    <th className="py-2.5 px-3">Nama Kapal</th>
                    <th className="py-2.5 px-3">Tipe</th>
                    <th className="py-2.5 px-3 text-right">Rincian Spesies</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-fco-border-subtle">
                  {recentCatches.map((c) => (
                    <tr
                      key={c.id}
                      className="hover:surface-page transition-colors"
                    >
                      <td className="py-2.5 px-3 text-soft font-mono">
                        {c.catch_date || "—"}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-strong">
                        {c.ship_name || `Kapal #${c.ship}`}
                      </td>
                      <td className="py-2.5 px-3 capitalize text-soft">
                        {c.catch_type || "Pelagis"}
                      </td>
                      <td className="py-2.5 px-3 text-right text-strong font-medium">
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
