import { useEffect, useState } from "react";
import { BarChart3, Coins, Fish, Ship } from "lucide-react";
import { KpiCard } from "../../components/KpiCard";
import { FleetTable } from "./components/FleetTable";
import { PnbpPredictionBars } from "./components/PnbpPredictionBars";
import { AiAdviceCard } from "./components/AiAdviceCard";
import { shipsService, type Ship as ShipType } from "../../services/ships";
import { catchesService } from "../../services/catches";
import { authService } from "../../services/auth";
import {
  calculateAverageRemainingQuota,
  calculateCatchTotalVolume,
  formatRupiah,
  formatWeight,
} from "../../utils";

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
  const currentOwnerKey = `${currentUser?.id || ""}-${currentUser?.profile?.name || currentUser?.username || ""}`;

  useEffect(() => {
    let ignore = false;

    async function loadOwnerStats() {
      setLoading(true);
      try {
        const user = authService.getStoredUser();
        const ownerShips = await shipsService
          .getFleetForOwner(user)
          .catch(() => []);

        if (ignore) return;
        setShips(ownerShips);

        const shipsCount = ownerShips.length;
        const unassignedCaptainsCount = ownerShips.filter(
          (s) => !s.captain,
        ).length;

        // Ambil data laporan tangkapan per kapal armada pemilik ini
        const fleetCatchesPromises = ownerShips.map((s) =>
          catchesService.getAll({ ship_id: s.id }).catch(() => []),
        );
        const catchesArrays = await Promise.all(fleetCatchesPromises);
        if (ignore) return;

        const ownerCatches = catchesArrays.flat();

        // Hitung total tangkapan dan PNBP khusus armada pemilik ini
        const rawVolume = calculateCatchTotalVolume(ownerCatches);
        const totalPnbp = ownerCatches.reduce((acc, c) => {
          const details = c.catch_details || [];
          const catchPnbp = details.reduce(
            (sum, d) => sum + (Number(d.pnbp) || 0),
            0,
          );
          return acc + catchPnbp;
        }, 0);

        const avgQuota = calculateAverageRemainingQuota(ownerShips);
        const catchStr = formatWeight(rawVolume);
        const pnbpStr = formatRupiah(totalPnbp);

        setMetrics({
          shipsCount,
          unassignedCaptainsCount,
          catchesCount: ownerCatches.length,
          catchStr,
          pnbpStr,
          avgQuota,
        });
      } catch {
        // Keeps 0 metrics on error
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadOwnerStats();

    return () => {
      ignore = true;
    };
  }, [currentOwnerKey]);

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
          value={metrics.avgQuota > 0 ? `${metrics.avgQuota}%` : "—"}
          note={
            metrics.avgQuota > 0
              ? `Rata-rata armada kapal berkuota`
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
