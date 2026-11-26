import { useEffect, useState } from "react";
import {
  Coins,
  Cpu,
  Link2,
  Ship,
} from "lucide-react";
import { KpiCard } from "../../components/KpiCard";
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
    <div className="flex flex-col gap-6">
      {/* Header Tata Kelola */}
      <div>
        <div className="flex items-center gap-2 text-[13px] font-medium text-subtext dark:text-[#98a6c0] mb-1.5">
          <span>Tata Kelola</span>
          <span className="text-slate-300 dark:text-slate-600">/</span>
          <span className="text-ink dark:text-[#e8edf7] font-semibold">Ringkasan Sistem Nasional</span>
        </div>
        <h1 className="m-0 text-[26px] sm:text-[30px] font-extrabold tracking-tight text-ink dark:text-[#e8edf7] leading-tight">
          Tata Kelola &amp; Regulasi Sistem
        </h1>
        <p className="m-0 text-[13px] text-subtext dark:text-[#98a6c0] mt-1.5 max-w-2xl">
          Pemantauan kepatuhan kuota AI, integritas audit blockchain, dan telemetri dermaga pelabuhan.
        </p>
      </div>

      {/* 4 Cards Tata Kelola - Matching Sample */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total armada nasional"
          value={formatNumber(metrics.activeShipsCount)}
          delta={`${metrics.totalShipsCount} armada kapal terdaftar`}
          showSparkline={false}
          color="blue"
          Icon={Ship}
          loading={loading}
          href="/admin/ships"
          linkText="Buka daftar armada"
        />
        <KpiCard
          label="Penerimaan PNBP negara"
          value={metrics.totalPnbpStr}
          delta="Kalkulasi resmi PP 85/2021"
          showSparkline={true}
          sparklineData={metrics.pnbpSparkline}
          trendUp={metrics.pnbpTrendUp}
          color="teal"
          Icon={Coins}
          loading={loading}
          href="/admin/quota"
          linkText="Kebijakan & simulasi AI"
        />
        <KpiCard
          label="Audit imutabilitas"
          value={metrics.blockchainValid ? "Terverifikasi" : "Perlu Audit"}
          delta={`${metrics.blockchainBlockCount} blok transaksi tersegel`}
          showSparkline={false}
          color="navy"
          Icon={Link2}
          loading={loading}
          href="/admin/blockchain"
          linkText="Inspeksi rantai blok"
        />
        <KpiCard
          label="Perangkat IoT timbangan"
          value={formatNumber(metrics.iotDevicesCount)}
          delta="Timbangan pintar aktif di pelabuhan"
          showSparkline={false}
          color="purple"
          Icon={Cpu}
          loading={loading}
          href="/admin/iot-devices"
          linkText="Kelola perangkat IoT"
        />
      </div>

      {/* Grid Grafik PNBP & Status Blockchain */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PnbpChart />
        </div>
        <div>
          <BlockchainCard />
        </div>
      </div>

      {/* Grid Radar Kuota Kritis & Distribusi WPP */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
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
