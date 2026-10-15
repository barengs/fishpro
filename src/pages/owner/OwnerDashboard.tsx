import { useEffect, useState } from "react";
import { BarChart3, Coins, Fish, Ship } from "lucide-react";
import { KpiCard, type KpiColor } from "../../components/KpiCard";
import { FleetTable } from "./components/FleetTable";
import { PnbpPredictionBars } from "./components/PnbpPredictionBars";
import { AiAdviceCard } from "./components/AiAdviceCard";
import { shipsService, type Ship as ShipType } from "../../services/ships";
import { catchesService } from "../../services/catches";
import { pnbpService } from "../../services/pnbp";
import { authService } from "../../services/auth";

interface KpiItem {
  label: string;
  value: string;
  note?: string;
  color: KpiColor;
  Icon: typeof Ship;
}

const defaultKpis: KpiItem[] = [
  {
    label: "Jumlah kapal",
    value: "5",
    note: "1 kapal belum punya nahkoda",
    color: "blue",
    Icon: Ship,
  },
  {
    label: "Tangkapan bulan ini",
    value: "24,6 ton",
    note: "Dari seluruh armada",
    color: "emerald",
    Icon: Fish,
  },
  {
    label: "PNBP bulan ini",
    value: "Rp 31,2 jt",
    note: "Terhitung otomatis dari laporan",
    color: "purple",
    Icon: Coins,
  },
  {
    label: "Sisa kuota gabungan",
    value: "49%",
    note: "Rata-rata seluruh armada",
    color: "amber",
    Icon: BarChart3,
  },
];

export function OwnerDashboard() {
  const [kpis, setKpis] = useState<KpiItem[]>(defaultKpis);
  const [ships, setShips] = useState<ShipType[]>([]);

  const currentUser = authService.getStoredUser();
  const ownerId = currentUser?.id;

  useEffect(() => {
    async function loadOwnerStats() {
      try {
        let ownerShips: ShipType[] = [];
        if (ownerId) {
          ownerShips = await shipsService
            .getByOwner(ownerId)
            .catch(() => shipsService.getAll());
        } else {
          ownerShips = await shipsService.getAll();
        }
        setShips(ownerShips);

        const [catches, chartRes] = await Promise.all([
          catchesService.getAll().catch(() => []),
          pnbpService.getUnifiedChartData().catch(() => null),
        ]);

        const shipsCount = ownerShips.length;
        const unassignedCaptainsCount = ownerShips.filter(
          (s) => !s.captain,
        ).length;

        // Calculate average remaining quota percentage
        let avgQuota = 50;
        if (shipsCount > 0) {
          const totalPct = ownerShips.reduce((acc, s) => {
            const p = s.current_year_quota
              ? s.current_year_quota.quota_percentage
              : 70;
            return acc + p;
          }, 0);
          avgQuota = Math.round(totalPct / shipsCount);
        }

        const summary = chartRes?.charts_data?.summary_stats;
        let pnbpStr = "Rp 31,2 jt";
        let catchStr = "24,6 ton";

        if (summary?.total_pnbp_sum) {
          const sum = summary.total_pnbp_sum;
          pnbpStr =
            sum >= 1_000_000_000
              ? `Rp ${(sum / 1_000_000_000).toFixed(1)} M`
              : `Rp ${(sum / 1_000_000).toFixed(1)} jt`;
        }

        if (summary?.total_volume_sum) {
          const vol = summary.total_volume_sum;
          catchStr =
            vol >= 1000 ? `${(vol / 1000).toFixed(1)} ton` : `${vol} kg`;
        }

        setKpis([
          {
            label: "Jumlah armada kapal",
            value: shipsCount > 0 ? `${shipsCount}` : "5",
            note:
              unassignedCaptainsCount > 0
                ? `${unassignedCaptainsCount} kapal belum ada nahkoda`
                : "Semua kapal memiliki nahkoda",
            color: "blue",
            Icon: Ship,
          },
          {
            label: "Tangkapan terverifikasi",
            value: catchStr,
            note: `${catches.length} laporan masuk ke sistem`,
            color: "emerald",
            Icon: Fish,
          },
          {
            label: "PNBP terhitung",
            value: pnbpStr,
            note: "Perhitungan resmi berbasis GT",
            color: "purple",
            Icon: Coins,
          },
          {
            label: "Sisa kuota gabungan",
            value: `${avgQuota}%`,
            note: `Rata-rata ${shipsCount || 5} kapal armada`,
            color: "amber",
            Icon: BarChart3,
          },
        ]);
      } catch {
        // Fallback to default
      }
    }

    loadOwnerStats();
  }, [ownerId]);

  return (
    <div>
      <div className="mb-7">
        <h1 className="m-0 text-3xl font-extrabold tracking-tight">
          Armada Anda
        </h1>
        <div className="text-sm text-soft mt-1">
          Pantau kapal, nahkoda, kuota, dan PNBP armada secara terpadu.
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {kpis.map((k) => (
          <KpiCard
            key={k.label}
            label={k.label}
            value={k.value}
            note={k.note}
            color={k.color}
            Icon={k.Icon}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">
        <div className="lg:col-span-3">
          <FleetTable ships={ships.length > 0 ? ships : undefined} />
        </div>
        <div className="lg:col-span-2 flex flex-col gap-4 min-w-0">
          <PnbpPredictionBars />
          <AiAdviceCard />
        </div>
      </div>
    </div>
  );
}
