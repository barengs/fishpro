import { useEffect, useState } from "react";
import { ClipboardList, Coins, Fish, Search, Ship } from "lucide-react";
import { KpiCard, type KpiColor } from "../../components/KpiCard";
import { PnbpChart } from "./components/PnbpChart";
import { BlockchainCard } from "./components/BlockchainCard";
import { CriticalQuotaTable } from "./components/CriticalQuotaTable";
import { WppBarChart } from "./components/WppBarChart";
import { shipsService } from "../../services/ships";
import { catchesService } from "../../services/catches";
import { pnbpService } from "../../services/pnbp";

interface KpiItem {
  label: string;
  value: string;
  delta?: string;
  color: KpiColor;
  Icon: typeof Ship;
}

const defaultKpis: KpiItem[] = [
  {
    label: "Kapal aktif",
    value: "1.284",
    delta: "12 kapal baru bulan ini",
    color: "blue",
    Icon: Ship,
  },
  {
    label: "Laporan bulan ini",
    value: "3.472",
    delta: "4,2% dari bulan lalu",
    color: "emerald",
    Icon: ClipboardList,
  },
  {
    label: "Total tangkapan",
    value: "842 ton",
    delta: "3,1% dari bulan lalu",
    color: "cyan",
    Icon: Fish,
  },
  {
    label: "PNBP terhitung",
    value: "Rp 4,4 M",
    delta: "6,8% dari bulan lalu",
    color: "purple",
    Icon: Coins,
  },
];

export function AdminDashboard() {
  const [kpis, setKpis] = useState<KpiItem[]>(defaultKpis);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadStats() {
      try {
        const [ships, catches, chartRes] = await Promise.all([
          shipsService.getAll().catch(() => []),
          catchesService.getAll().catch(() => []),
          pnbpService.getUnifiedChartData().catch(() => null),
        ]);

        const activeShipsCount = ships.filter((s) => s.active !== false).length;
        const totalCatchesCount = catches.length;

        const summary = chartRes?.charts_data?.summary_stats;
        let totalPnbpStr = "Rp 4,4 M";
        let totalVolumeStr = "842 ton";

        if (summary?.total_pnbp_sum) {
          const sum = summary.total_pnbp_sum;
          if (sum >= 1_000_000_000) {
            totalPnbpStr = `Rp ${(sum / 1_000_000_000).toFixed(1)} M`;
          } else {
            totalPnbpStr = `Rp ${(sum / 1_000_000).toFixed(0)} jt`;
          }
        }

        if (summary?.total_volume_sum) {
          const vol = summary.total_volume_sum;
          if (vol >= 1000) {
            totalVolumeStr = `${(vol / 1000).toFixed(0)} ton`;
          } else {
            totalVolumeStr = `${vol} kg`;
          }
        }

        setKpis([
          {
            label: "Kapal aktif",
            value:
              activeShipsCount > 0
                ? activeShipsCount.toLocaleString("id-ID")
                : "1.284",
            delta: `${ships.length} total armada nasional`,
            color: "blue",
            Icon: Ship,
          },
          {
            label: "Total laporan tangkapan",
            value:
              totalCatchesCount > 0
                ? totalCatchesCount.toLocaleString("id-ID")
                : "3.472",
            delta: "Tercatat di blockchain",
            color: "emerald",
            Icon: ClipboardList,
          },
          {
            label: "Total volume tangkapan",
            value: totalVolumeStr,
            delta: "Akumulasi produksi nasional",
            color: "cyan",
            Icon: Fish,
          },
          {
            label: "PNBP terhitung",
            value: totalPnbpStr,
            delta: "Penerimaan resmi KKP",
            color: "purple",
            Icon: Coins,
          },
        ]);
      } catch {
        // Fallback to default
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
              className="w-full sm:w-65 h-10 border rounded-fco pl-9.5 pr-3 text-sm field-input focus:outline-none focus:border-fco-blue transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Global KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {kpis.map((k) => (
          <KpiCard
            key={k.label}
            label={k.label}
            value={k.value}
            delta={k.delta}
            color={k.color}
            Icon={k.Icon}
          />
        ))}
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
