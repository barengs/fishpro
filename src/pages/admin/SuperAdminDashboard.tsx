import { useEffect, useState } from "react";
import { Coins, Cpu, Fish, Ship } from "lucide-react";
import { KpiCard } from "../../components/KpiCard";
import { PnbpChart } from "./components/PnbpChart";
import { RecentCatchesCard } from "./components/RecentCatchesCard";
import { CriticalQuotaTable } from "./components/CriticalQuotaTable";
import { WppBarChart } from "./components/WppBarChart";
import { catchesService, type FishCatch } from "../../services/catches";
import { iotService } from "../../services/iot";
import { shipsService } from "../../services/ships";
import { dashboardService } from "../../services/dashboard";
import type {
  AdminDashboardData,
  WppPotentialItem,
} from "../../services/dashboard/types";
import {
  calculateCatchTotalVolume,
  formatNumber,
  formatRupiah,
  formatWeight,
} from "../../utils";

interface SuperAdminMetrics {
  totalShipsCount: number;
  totalOwnersCount: number;
  totalCatchesCount: number;
  totalVolumeKg: number;
  rawTotalPnbp: number;
  totalPnbpStr: string;
  pnbpSparkline: number[];
  iotDevicesCount: number;
  activeScalesCount: number;
  pendingReadingsCount: number;
}

export function SuperAdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [hasDashboardData, setHasDashboardData] = useState(false);
  const [metrics, setMetrics] = useState<SuperAdminMetrics>({
    totalShipsCount: 0,
    totalOwnersCount: 0,
    totalCatchesCount: 0,
    totalVolumeKg: 0,
    rawTotalPnbp: 0,
    totalPnbpStr: "Rp 0",
    pnbpSparkline: [],
    iotDevicesCount: 0,
    activeScalesCount: 0,
    pendingReadingsCount: 0,
  });
  const [monthlySeries, setMonthlySeries] = useState<
    AdminDashboardData["monthly_pnbp_chart"]
  >([]);
  const [wppDistribution, setWppDistribution] = useState<
    AdminDashboardData["wpp_distribution"]
  >([]);
  const [criticalShips, setCriticalShips] = useState<
    AdminDashboardData["critical_quota_ships"]
  >([]);
  const [wppPotential, setWppPotential] = useState<WppPotentialItem[]>([]);
  const [recentCatches, setRecentCatches] = useState<FishCatch[]>([]);

  useEffect(() => {
    let ignore = false;

    async function loadSuperStats() {
      setLoading(true);
      try {
        const [
          dashData,
          potentialRes,
          catches,
          iotDevices,
          pendingReadings,
        ] = await Promise.all([
          dashboardService.getAdminDashboard().catch(() => null),
          dashboardService.getWppPotentialForecast().catch(() => null),
          catchesService.getAll().catch(() => [] as FishCatch[]),
          iotService.getDevices().catch(() => []),
          iotService.getReadings(undefined, "pending").catch(() => []),
        ]);

        if (ignore) return;

        const dashOk = Boolean(dashData && dashData.status === "success");
        setHasDashboardData(dashOk);

        const fallbackShips = dashOk
          ? []
          : await shipsService.getAll().catch(() => []);
        if (ignore) return;

        const sortedCatches = [...catches].sort((a, b) => {
          const tA = a.catch_date ? new Date(a.catch_date).getTime() : 0;
          const tB = b.catch_date ? new Date(b.catch_date).getTime() : 0;
          return tB - tA;
        });

        const totalVolumeFromCatches = calculateCatchTotalVolume(catches);
        const totalPnbpFromCatches = catches.reduce((acc, c) => {
          const sum = (c.catch_details || []).reduce(
            (s, d) => s + (Number(d.pnbp) || 0),
            0,
          );
          return acc + sum;
        }, 0);

        const rawTotalPnbp = dashOk
          ? dashData!.kpi.total_pnbp
          : totalPnbpFromCatches;

        const series = dashOk ? dashData!.monthly_pnbp_chart || [] : [];
        const pnbpSparkline = series
          .filter((item) => !item.is_prediction)
          .map((item) => Number(item.total_pnbp) || 0);

        const activeScales = iotDevices.filter((d) => d.is_active !== false);

        setMetrics({
          totalShipsCount: dashOk
            ? dashData!.kpi.total_ships
            : fallbackShips.length,
          totalOwnersCount: dashOk ? dashData!.kpi.total_owners : 0,
          totalCatchesCount: dashOk
            ? dashData!.kpi.total_catches
            : catches.length,
          totalVolumeKg: dashOk
            ? dashData!.kpi.total_volume_kg
            : totalVolumeFromCatches,
          rawTotalPnbp,
          totalPnbpStr: formatRupiah(rawTotalPnbp),
          pnbpSparkline,
          iotDevicesCount: iotDevices.length,
          activeScalesCount: activeScales.length,
          pendingReadingsCount: pendingReadings.length,
        });

        setMonthlySeries(series);
        setWppDistribution(dashOk ? dashData!.wpp_distribution || [] : []);
        setCriticalShips(dashOk ? dashData!.critical_quota_ships || [] : []);
        setWppPotential(potentialRes?.rankings || []);
        setRecentCatches(sortedCatches.slice(0, 4));
      } catch {
        // Keeps safe default state
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadSuperStats();
    return () => {
      ignore = true;
    };
  }, []);

  // Pass structured dashboard arrays during initial load or when backend summary succeeded;
  // if the summary endpoint failed after loading, omit props so widgets fall back to standalone endpoints.
  const useCentralizedSeries = loading || hasDashboardData;

  return (
    <div className="flex flex-col gap-6">
      {/* Header Tata Kelola */}
      <div>
        <div className="flex items-center gap-2 text-[13px] font-medium text-subtext dark:text-[#98a6c0] mb-1.5">
          <span>Tata Kelola</span>
          <span className="text-slate-300 dark:text-slate-600">/</span>
          <span className="text-ink dark:text-[#e8edf7] font-semibold">
            Ringkasan Sistem Nasional
          </span>
        </div>
        <h1 className="m-0 text-[26px] sm:text-[30px] font-extrabold tracking-tight text-ink dark:text-[#e8edf7] leading-tight">
          Tata Kelola &amp; Regulasi Sistem
        </h1>
        <p className="m-0 text-[13px] text-subtext dark:text-[#98a6c0] mt-1.5 max-w-2xl">
          Pemantauan armada nasional, realisasi tangkapan, penerimaan PNBP, dan telemetri timbangan pelabuhan.
        </p>
      </div>

      {/* 4 Cards Tata Kelola — Selaras dengan /api/dashboard/admin/ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total armada nasional"
          value={formatNumber(metrics.totalShipsCount)}
          delta={
            metrics.totalOwnersCount > 0
              ? `${formatNumber(metrics.totalOwnersCount)} pemilik kapal terdaftar`
              : "Armada kapal terdaftar"
          }
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
          color="teal"
          Icon={Coins}
          loading={loading}
          href="/admin/quota"
          linkText="Kebijakan & simulasi AI"
        />
        <KpiCard
          label="Total hasil tangkapan"
          value={formatWeight(metrics.totalVolumeKg)}
          delta={`${formatNumber(metrics.totalCatchesCount)} laporan pendaratan tercatat`}
          showSparkline={false}
          color="navy"
          Icon={Fish}
          loading={loading}
          href="/admin/catches"
          linkText="Lihat laporan tangkapan"
        />
        <KpiCard
          label="Perangkat IoT timbangan"
          value={formatNumber(metrics.activeScalesCount)}
          delta={
            metrics.pendingReadingsCount > 0
              ? `${formatNumber(metrics.pendingReadingsCount)} antrean belum diproses`
              : `${formatNumber(metrics.iotDevicesCount)} timbangan aktif di pelabuhan`
          }
          showSparkline={false}
          color="purple"
          Icon={Cpu}
          loading={loading}
          href="/admin/iot-devices"
          linkText="Kelola perangkat IoT"
        />
      </div>

      {/* Grid Grafik PNBP & Tangkapan Terbaru */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PnbpChart
            monthlySeries={useCentralizedSeries ? monthlySeries : undefined}
            totalPnbpOverride={hasDashboardData ? metrics.rawTotalPnbp : undefined}
            loading={loading}
          />
        </div>
        <div>
          <RecentCatchesCard catches={recentCatches} loading={loading} />
        </div>
      </div>

      {/* Grid Radar Kuota Kritis & Distribusi WPP */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <CriticalQuotaTable
            ships={useCentralizedSeries ? criticalShips : undefined}
            loading={loading}
          />
        </div>
        <div className="lg:col-span-2">
          <WppBarChart
            distribution={useCentralizedSeries ? wppDistribution : undefined}
            potential={wppPotential}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
