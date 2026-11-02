import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  Cpu,
  Coins,
  KeyRound,
  Link2,
  ShieldCheck,
  Ship,
  Users,
} from "lucide-react";
import { KpiCard } from "../../components/KpiCard";
import { RoleBadge } from "../../components/RoleBadge";
import { PnbpChart } from "./components/PnbpChart";
import { BlockchainCard } from "./components/BlockchainCard";
import { CriticalQuotaTable } from "./components/CriticalQuotaTable";
import { WppBarChart } from "./components/WppBarChart";
import { shipsService, type Ship as ShipType } from "../../services/ships";
import { pnbpService } from "../../services/pnbp";
import { blockchainService } from "../../services/blockchain";
import { iotService } from "../../services/iot";
import { dashboardService } from "../../services/dashboard";
import { formatNumber, formatRupiah } from "../../utils";

interface SuperAdminMetrics {
  activeShipsCount: number;
  totalShipsCount: number;
  totalPnbpStr: string;
  pnbpSparkline?: number[];
  pnbpTrendUp?: boolean;
  blockchainValid: boolean;
  blockchainBlockCount: number;
  iotDevicesCount: number;
}

export function SuperAdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<SuperAdminMetrics>({
    activeShipsCount: 0,
    totalShipsCount: 0,
    totalPnbpStr: "Rp 0",
    blockchainValid: true,
    blockchainBlockCount: 0,
    iotDevicesCount: 0,
  });

  useEffect(() => {
    async function loadSuperStats() {
      setLoading(true);
      try {
        const [dashData, ships, chartRes, chainStatus, iotDevices] =
          await Promise.all([
            dashboardService.getAdminDashboard().catch(() => null),
            shipsService.getAll().catch(() => []),
            pnbpService.getUnifiedChartData().catch(() => null),
            blockchainService.getStatus().catch(() => null),
            iotService.getDevices().catch(() => []),
          ]);

        const activeShips =
          dashData?.kpi?.total_ships ??
          ships.filter((s: ShipType) => s.active !== false).length;
        const totalShips = ships.length || activeShips;
        const summary = chartRes?.charts_data?.summary_stats;

        const totalPnbpStr = dashData?.kpi?.total_pnbp
          ? formatRupiah(dashData.kpi.total_pnbp)
          : formatRupiah(summary?.total_pnbp_sum);

        const history = chartRes?.charts_data?.historical_pnbp?.data || [];
        const pnbpHistory = history
          .map((h) => Number(h.pnbp ?? h.total_pnbp ?? 0))
          .filter((v) => !isNaN(v) && v > 0);

        const pnbpTrendUp =
          pnbpHistory.length >= 2
            ? pnbpHistory[pnbpHistory.length - 1] >= pnbpHistory[0]
            : true;

        setMetrics({
          activeShipsCount: activeShips,
          totalShipsCount: totalShips,
          totalPnbpStr,
          pnbpSparkline: pnbpHistory,
          pnbpTrendUp,
          blockchainValid:
            dashData?.blockchain?.is_valid ?? chainStatus?.valid ?? true,
          blockchainBlockCount:
            dashData?.blockchain?.total_blocks ??
            chainStatus?.block_count ??
            0,
          iotDevicesCount: iotDevices.length,
        });
      } catch {
        // Keeps safe default metrics
      } finally {
        setLoading(false);
      }
    }

    loadSuperStats();
  }, []);

  return (
    <div>
      {/* Header Tata Kelola */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-soft mb-1">
            <span>Tata Kelola</span>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className="text-strong font-medium">Ringkasan Sistem Nasional</span>
          </div>
          <h1 className="m-0 text-2xl sm:text-3xl font-extrabold tracking-tight text-strong">
            Tata Kelola & Regulasi Sistem
          </h1>
          <p className="m-0 text-sm text-soft mt-1">
            Pemantauan kepatuhan kuota AI, integritas audit blockchain, dan telemetri dermaga pelabuhan.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <RoleBadge role="superadmin" />
        </div>
      </div>

      {/* 4 Cards Tata Kelola */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard
          label="Total Armada Nasional"
          value={formatNumber(metrics.activeShipsCount)}
          delta={`${metrics.totalShipsCount} armada kapal terdaftar`}
          showSparkline={false}
          color="blue"
          Icon={Ship}
          loading={loading}
          href="/admin/ships"
          linkText="Buka Daftar Armada"
        />
        <KpiCard
          label="Penerimaan PNBP Negara"
          value={metrics.totalPnbpStr}
          delta="Kalkulasi resmi PP 85/2021"
          showSparkline={true}
          sparklineData={metrics.pnbpSparkline}
          trendUp={metrics.pnbpTrendUp}
          color="rose"
          Icon={Coins}
          loading={loading}
          href="/admin/quota"
          linkText="Kebijakan & Simulasi AI"
        />
        <KpiCard
          label="Audit Imutabilitas Blockchain"
          value={metrics.blockchainValid ? "Terverifikasi" : "Perlu Audit"}
          delta={`${metrics.blockchainBlockCount} blok transaksi tersegel`}
          showSparkline={false}
          color={metrics.blockchainValid ? "purple" : "rose"}
          Icon={Link2}
          loading={loading}
          href="/admin/blockchain"
          linkText="Inspeksi Rantai Blok"
        />
        <KpiCard
          label="Perangkat IoT Timbangan"
          value={formatNumber(metrics.iotDevicesCount)}
          delta="Timbangan pintar aktif di pelabuhan"
          showSparkline={false}
          color="emerald"
          Icon={Cpu}
          loading={loading}
          href="/admin/iot-devices"
          linkText="Kelola Perangkat IoT"
        />
      </div>

      {/* Baris Tata Kelola Cepat */}
      <div className="mb-6 p-4 rounded-xl surface-card border border-fco-border flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <ShieldCheck size={20} />
          </div>
          <div>
            <div className="text-sm font-bold text-strong">Akses Tata Kelola Khusus Super Admin</div>
            <div className="text-xs text-soft">
              Kelola alokasi kuota AI, parameter smart scales, dan hak akses RBAC sistem.
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/quota"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold surface-inset hover:surface-page border border-fco-border-subtle text-strong no-underline transition-colors"
          >
            <BarChart3 size={14} className="text-soft" />
            <span>Alokasi Kuota</span>
          </Link>
          <Link
            to="/admin/blockchain"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold surface-inset hover:surface-page border border-fco-border-subtle text-strong no-underline transition-colors"
          >
            <Link2 size={14} className="text-soft" />
            <span>Audit Ledger</span>
          </Link>
          <Link
            to="/admin/roles"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold surface-inset hover:surface-page border border-fco-border-subtle text-strong no-underline transition-colors"
          >
            <KeyRound size={14} className="text-soft" />
            <span>Peran & Menu</span>
          </Link>
          <Link
            to="/admin/users"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold surface-inset hover:surface-page border border-fco-border-subtle text-strong no-underline transition-colors"
          >
            <Users size={14} className="text-soft" />
            <span>Manajemen Pengguna</span>
          </Link>
        </div>
      </div>

      {/* Grid Grafik PNBP & Status Blockchain */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2">
          <PnbpChart />
        </div>
        <div>
          <BlockchainCard />
        </div>
      </div>

      {/* Grid Radar Kuota Kritis & Distribusi WPP */}
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
