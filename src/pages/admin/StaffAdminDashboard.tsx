import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Anchor,
  Building2,
  ClipboardList,
  Fish,
  PlusCircle,
  Ship,
  Users,
} from "lucide-react";
import { KpiCard } from "../../components/KpiCard";
import { RoleBadge } from "../../components/RoleBadge";
import { WppBarChart } from "./components/WppBarChart";
import { shipsService } from "../../services/ships";
import { catchesService, type FishCatch } from "../../services/catches";
import { ownersService } from "../../services/owners";
import { captainsService } from "../../services/captains";
import { dashboardService } from "../../services/dashboard";
import {
  calculateCatchTotalVolume,
  formatNumber,
  formatWeight,
} from "../../utils";

interface StaffAdminMetrics {
  activeShipsCount: number;
  totalShipsCount: number;
  totalCatchesCount: number;
  totalVolumeStr: string;
  volumeSparkline?: number[];
  volumeTrendUp?: boolean;
  totalPartnersCount: number;
}

export function StaffAdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<StaffAdminMetrics>({
    activeShipsCount: 0,
    totalShipsCount: 0,
    totalCatchesCount: 0,
    totalVolumeStr: "0 kg",
    totalPartnersCount: 0,
  });
  const [recentCatches, setRecentCatches] = useState<FishCatch[]>([]);

  useEffect(() => {
    async function loadStaffStats() {
      setLoading(true);
      try {
        const [dashData, ships, catches, owners, captains] = await Promise.all([
          dashboardService.getAdminDashboard().catch(() => null),
          shipsService.getAll().catch(() => []),
          catchesService.getAll().catch(() => []),
          ownersService.getAll().catch(() => []),
          captainsService.getAll().catch(() => []),
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

        // Volume sparkline
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
          totalPartnersCount: owners.length + captains.length,
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
      {/* Header Operasional */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-soft mb-1">
            <span>Pelayanan</span>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className="text-strong font-medium">Operasional Harian</span>
          </div>
          <h1 className="m-0 text-2xl sm:text-3xl font-extrabold tracking-tight text-strong">
            Pelayanan & Operasional Armada
          </h1>
          <p className="m-0 text-sm text-soft mt-1">
            Verifikasi pendaftaran kapal, administrasi data pemilik dan nahkoda, serta validasi laporan hasil tangkapan.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <RoleBadge role="admin" />
        </div>
      </div>

      {/* 4 Cards Operasional */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard
          label="Kapal Aktif Melaut"
          value={formatNumber(metrics.activeShipsCount)}
          delta={`${metrics.totalShipsCount} armada terdaftar`}
          showSparkline={false}
          color="blue"
          Icon={Ship}
          loading={loading}
          href="/admin/ships"
          linkText="Buka Data Kapal"
        />
        <KpiCard
          label="Laporan Tangkapan"
          value={formatNumber(metrics.totalCatchesCount)}
          delta="Laporan hasil tangkap masuk"
          showSparkline={false}
          color="emerald"
          Icon={ClipboardList}
          loading={loading}
          href="/admin/catches"
          linkText="Verifikasi Laporan"
        />
        <KpiCard
          label="Total Volume Hasil Laut"
          value={metrics.totalVolumeStr}
          delta="Akumulasi produksi tervalidasi"
          showSparkline={true}
          sparklineData={metrics.volumeSparkline}
          trendUp={metrics.volumeTrendUp}
          color="amber"
          Icon={Fish}
          loading={loading}
          href="/admin/catches"
          linkText="Detail Volume"
        />
        <KpiCard
          label="Pemilik & Nahkoda"
          value={formatNumber(metrics.totalPartnersCount)}
          delta="Pengusaha & kapten terdaftar"
          showSparkline={false}
          color="purple"
          Icon={Users}
          loading={loading}
          href="/admin/owners"
          linkText="Kelola Mitra"
        />
      </div>

      {/* Aksi Cepat Pelayanan */}
      <div className="mb-6 p-4 rounded-xl surface-card border border-fco-border flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-sm font-bold text-strong">Aksi Pelayanan Cepat</div>
          <div className="text-xs text-soft">
            Jalan pintas untuk pencatatan dan verifikasi data harian nelayan.
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/catches"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-fco-blue hover:bg-fco-blue-hover text-white no-underline transition-colors shadow-2xs"
          >
            <PlusCircle size={14} />
            <span>Entri Tangkapan</span>
          </Link>
          <Link
            to="/admin/ships"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold surface-inset hover:surface-page border border-fco-border-subtle text-strong no-underline transition-colors"
          >
            <Ship size={14} className="text-soft" />
            <span>Tambah Kapal</span>
          </Link>
          <Link
            to="/admin/owners"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold surface-inset hover:surface-page border border-fco-border-subtle text-strong no-underline transition-colors"
          >
            <Building2 size={14} className="text-soft" />
            <span>Pemilik Kapal</span>
          </Link>
          <Link
            to="/admin/captains"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold surface-inset hover:surface-page border border-fco-border-subtle text-strong no-underline transition-colors"
          >
            <Anchor size={14} className="text-soft" />
            <span>Nahkoda</span>
          </Link>
        </div>
      </div>

      {/* Data Operasional Utama: Tangkapan Terkini + Distribusi WPP */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Tabel Tangkapan Terbaru */}
        <div className="lg:col-span-3 surface-card border border-fco-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="m-0 text-base font-bold text-strong">
                Laporan Tangkapan Masuk
              </h2>
              <p className="m-0 text-xs text-soft mt-0.5">
                Daftar laporan hasil penangkapan ikan teranyar dari armada
              </p>
            </div>
            <Link
              to="/admin/catches"
              className="text-xs font-semibold text-fco-blue hover:underline no-underline"
            >
              Lihat semua &rarr;
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3 py-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
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
                    <tr key={c.id} className="hover:surface-page transition-colors">
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
