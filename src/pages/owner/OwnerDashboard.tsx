import { useEffect, useState } from "react";
import { BarChart3, Coins, Fish, Ship } from "lucide-react";
import { KpiCard } from "../../components/KpiCard";
import { FleetTable } from "./components/FleetTable";
import { PnbpPredictionBars } from "./components/PnbpPredictionBars";
import { AiAdviceCard } from "./components/AiAdviceCard";
import { shipsService, type Ship as ShipType } from "../../services/ships";
import { catchesService } from "../../services/catches";
import { pnbpService } from "../../services/pnbp";
import { authService } from "../../services/auth";

interface OwnerMetrics {
  shipsCount: number;
  unassignedCaptainsCount: number;
  catchesCount: number;
  catchStr: string;
  pnbpStr: string;
  avgQuota: number;
}

export function OwnerDashboard() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<OwnerMetrics>({
    shipsCount: 0,
    unassignedCaptainsCount: 0,
    catchesCount: 0,
    catchStr: "0 kg",
    pnbpStr: "Rp 0",
    avgQuota: 0,
  });
  const [ships, setShips] = useState<ShipType[]>([]);

  const currentUser = authService.getStoredUser();
  const ownerId = currentUser?.id;

  useEffect(() => {
    async function loadOwnerStats() {
      setLoading(true);
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
        let avgQuota = 0;
        if (shipsCount > 0) {
          const totalPct = ownerShips.reduce((acc, s) => {
            const p = s.current_year_quota
              ? s.current_year_quota.quota_percentage
              : 0;
            return acc + p;
          }, 0);
          avgQuota = Math.round(totalPct / shipsCount);
        }

        const summary = chartRes?.charts_data?.summary_stats;
        let pnbpStr = "Rp 0";
        let catchStr = "0 kg";

        if (summary?.total_pnbp_sum && summary.total_pnbp_sum > 0) {
          const sum = summary.total_pnbp_sum;
          pnbpStr =
            sum >= 1_000_000_000
              ? `Rp ${(sum / 1_000_000_000).toFixed(1)} M`
              : `Rp ${(sum / 1_000_000).toFixed(1)} jt`;
        }

        if (summary?.total_volume_sum && summary.total_volume_sum > 0) {
          const vol = summary.total_volume_sum;
          catchStr =
            vol >= 1000 ? `${(vol / 1000).toFixed(1)} ton` : `${vol} kg`;
        } else if (catches.length > 0) {
          const sumQty = catches.reduce((acc, c) => {
            const detailQty = (c.catch_details || []).reduce(
              (dAcc, d) => dAcc + (parseFloat(String(d.quantity)) || 0),
              0,
            );
            return acc + detailQty;
          }, 0);
          if (sumQty > 0) {
            catchStr =
              sumQty >= 1000
                ? `${(sumQty / 1000).toFixed(1)} ton`
                : `${sumQty} kg`;
          }
        }

        setMetrics({
          shipsCount,
          unassignedCaptainsCount,
          catchesCount: catches.length,
          catchStr,
          pnbpStr,
          avgQuota,
        });
      } catch {
        // Keeps 0 metrics on error
      } finally {
        setLoading(false);
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

      {/* Realtime Owner KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <KpiCard
          label="Jumlah armada kapal"
          value={`${metrics.shipsCount}`}
          note={
            metrics.shipsCount === 0
              ? "Belum ada kapal terdaftar"
              : metrics.unassignedCaptainsCount > 0
                ? `${metrics.unassignedCaptainsCount} kapal belum ada nahkoda`
                : "Semua kapal memiliki nahkoda"
          }
          color="blue"
          Icon={Ship}
          loading={loading}
        />
        <KpiCard
          label="Tangkapan terverifikasi"
          value={metrics.catchStr}
          note={
            metrics.catchesCount > 0
              ? `${metrics.catchesCount} laporan masuk ke sistem`
              : "Belum ada laporan tangkapan"
          }
          color="emerald"
          Icon={Fish}
          loading={loading}
        />
        <KpiCard
          label="PNBP terhitung"
          value={metrics.pnbpStr}
          note="Perhitungan resmi berbasis GT"
          color="purple"
          Icon={Coins}
          loading={loading}
        />
        <KpiCard
          label="Sisa kuota gabungan"
          value={metrics.shipsCount > 0 ? `${metrics.avgQuota}%` : "—"}
          note={
            metrics.shipsCount > 0
              ? `Rata-rata ${metrics.shipsCount} kapal armada`
              : "Belum ada alokasi kuota"
          }
          color="amber"
          Icon={BarChart3}
          loading={loading}
        />
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
