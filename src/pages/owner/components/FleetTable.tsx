import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProgressBar } from "../../../components/ProgressBar";
import { StatusChip } from "../../../components/StatusChip";
import { Skeleton } from "../../../components/ui/Skeleton";
import { shipsService, type Ship } from "../../../services/ships";
import { authService } from "../../../services/auth";

interface FleetTableProps {
  ships?: Ship[];
}

export function FleetTable({ ships: propsShips }: FleetTableProps) {
  const [internalShips, setInternalShips] = useState<Ship[]>([]);
  const [loading, setLoading] = useState(!propsShips);

  const currentUser = authService.getStoredUser();
  const ownerId = currentUser?.id;

  const ships = propsShips ?? internalShips;

  useEffect(() => {
    if (propsShips) {
      return;
    }

    let ignore = false;
    async function loadFleet() {
      setLoading(true);
      try {
        let data: Ship[] = [];
        if (ownerId) {
          data = await shipsService
            .getByOwner(ownerId)
            .catch(() => shipsService.getAll());
        } else {
          data = await shipsService.getAll();
        }
        if (!ignore) {
          setInternalShips(data);
        }
      } catch {
        // Fallback to empty
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadFleet();

    return () => {
      ignore = true;
    };
  }, [ownerId, propsShips]);

  return (
    <section className="surface-card border rounded-xl p-6 shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <h2 className="m-0 text-base font-bold text-strong">
          Armada kapal ({ships.length})
        </h2>
        <Link
          to="/owner/captains"
          className="text-sm font-semibold text-fco-blue hover:text-fco-blue-hover no-underline"
        >
          Kelola nahkoda →
        </Link>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-130">
          <div className="flex items-center py-2.5 text-xs font-semibold text-soft">
            <div className="basis-3/10">Kapal</div>
            <div className="basis-2/10">Nahkoda</div>
            <div className="basis-3/10">Sisa kuota</div>
            <div className="basis-2/10 text-right">Status</div>
          </div>

          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={`skel-fleet-${i}`}
                className="flex items-center py-3 border-t border-fco-border-subtle text-sm gap-2"
              >
                <div className="basis-3/10 space-y-1.5 pr-2">
                  <Skeleton className="h-4 w-3/4 rounded" />
                  <Skeleton className="h-3 w-1/2 rounded opacity-60" />
                </div>
                <div className="basis-2/10 pr-2">
                  <Skeleton className="h-4 w-2/3 rounded" />
                </div>
                <div className="basis-3/10 space-y-1.5 pr-2">
                  <Skeleton className="h-3 w-1/3 rounded" />
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
                <div className="basis-2/10 flex justify-end">
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              </div>
            ))
          ) : ships.length === 0 ? (
            <div className="py-8 text-center text-sm text-soft">
              Belum ada kapal dalam armada Anda.
            </div>
          ) : (
            ships.map((s) => {
              const quota = s.current_year_quota;
              const pct = quota ? quota.quota_percentage : 70;
              const width = `${pct}%`;

              const isIdle = !s.captain;
              const isWarn = pct < 15;
              const isWatch = pct < 35;

              const chipLabel = !s.active
                ? "Nonaktif"
                : isIdle
                  ? "Tanpa nahkoda"
                  : isWarn
                    ? "Kuota menipis"
                    : isWatch
                      ? "Perlu dipantau"
                      : "Aktif";

              const chipBg = !s.active
                ? "#EEF1F6"
                : isWarn
                  ? "#FFF1E0"
                  : isIdle
                    ? "#EEF1F6"
                    : "#E8F0FE";

              const chipColor = !s.active
                ? "#4A5872"
                : isWarn
                  ? "#B54708"
                  : isIdle
                    ? "#4A5872"
                    : "#1A56DB";

              return (
                <div
                  key={s.id || s.registration_number}
                  className="flex items-center py-4 border-t border-fco-border-subtle"
                >
                  <div className="basis-3/10">
                    <div className="text-sm font-semibold text-strong">
                      {s.name}
                    </div>
                    <div className="text-xs text-soft tabular-nums">
                      {s.registration_number}
                    </div>
                  </div>
                  <div className="basis-2/10 text-sm text-strong">
                    {s.captain_name || (
                      <span className="text-soft">Belum ditunjuk</span>
                    )}
                  </div>
                  <div className="basis-3/10 pr-6">
                    <ProgressBar width={width} showText />
                  </div>
                  <div className="basis-2/10 text-right">
                    <StatusChip
                      label={chipLabel}
                      bg={chipBg}
                      color={chipColor}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
