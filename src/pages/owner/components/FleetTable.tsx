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
  const [internalLoading, setInternalLoading] = useState(true);

  const currentUser = authService.getStoredUser();
  const currentOwnerKey = `${currentUser?.id || ""}-${currentUser?.profile?.name || currentUser?.profile?.full_name || currentUser?.username || ""}`;

  const ships = propsShips ?? internalShips;
  const loading = propsShips ? false : internalLoading;

  useEffect(() => {
    if (propsShips) {
      return;
    }

    let ignore = false;
    async function loadFleet() {
      setInternalLoading(true);
      try {
        const user = authService.getStoredUser();
        const data = await shipsService
          .getFleetForOwner(user)
          .catch(() => []);
        if (!ignore) {
          setInternalShips(data);
        }
      } catch {
        // Fallback to empty
      } finally {
        if (!ignore) {
          setInternalLoading(false);
        }
      }
    }

    loadFleet();

    return () => {
      ignore = true;
    };
  }, [currentOwnerKey, propsShips]);

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <h2 className="m-0 text-base font-bold text-strong">
          Armada kapal ({ships.length})
        </h2>
        <Link
          to="/owner/captains"
          className="text-sm font-semibold text-fco-blue hover:text-fco-blue-hover no-underline"
        >
          Kelola nahkoda
        </Link>
      </div>

      <div className="border border-fco-border-subtle surface-card rounded-xs overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <div className="min-w-135">
            <div className="flex items-center py-3 px-3 text-xs font-bold text-white bg-fco-blue gap-2">
              <div className="w-8 shrink-0 text-center">No</div>
              <div className="basis-3/10">Kapal</div>
              <div className="basis-2/10">Nahkoda</div>
              <div className="basis-3/10">Sisa kuota</div>
              <div className="basis-2/10 text-right">Status</div>
            </div>

            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={`skel-fleet-${i}`}
                  className="flex items-center py-3 px-3 border-t border-fco-border-subtle text-sm gap-2 bg-white dark:bg-fco-card-dark"
                >
                  <div className="w-8 shrink-0 flex justify-center">
                    <Skeleton className="h-4 w-5 rounded-xs" />
                  </div>
                  <div className="basis-3/10 space-y-1.5 pr-2">
                    <Skeleton className="h-4 w-3/4 rounded-xs" />
                    <Skeleton className="h-3 w-1/2 rounded-xs opacity-60" />
                  </div>
                  <div className="basis-2/10 pr-2">
                    <Skeleton className="h-4 w-2/3 rounded-xs" />
                  </div>
                  <div className="basis-3/10 space-y-1.5 pr-2">
                    <Skeleton className="h-3 w-1/3 rounded-xs" />
                    <Skeleton className="h-2 w-full rounded-xs" />
                  </div>
                  <div className="basis-2/10 flex justify-end">
                    <Skeleton className="h-5 w-16 rounded-xs" />
                  </div>
                </div>
              ))
            ) : ships.length === 0 ? (
              <div className="py-8 text-center text-sm text-soft">
                Belum ada kapal dalam armada Anda.
              </div>
            ) : (
              ships.map((s, i) => {
                const quota = s.current_year_quota;
                const hasQuota = Boolean(
                  quota && typeof quota.quota_percentage === "number",
                );
                const pct = hasQuota ? quota!.quota_percentage : 0;
                const width = `${pct}%`;

                const isIdle = !s.captain;
                const isWarn = hasQuota && pct < 15;
                const isWatch = hasQuota && pct < 35;

                const chipLabel = !s.active
                  ? "Nonaktif"
                  : !hasQuota
                    ? "Belum Diatur"
                    : isIdle
                      ? "Tanpa nahkoda"
                      : isWarn
                        ? "Kuota menipis"
                        : isWatch
                          ? "Perlu dipantau"
                          : "Aktif";

                const chipBg = !s.active || !hasQuota
                  ? "#EEF1F6"
                  : isWarn
                    ? "#FFF1E0"
                    : isIdle
                      ? "#EEF1F6"
                      : "#E8F0FE";

                const chipColor = !s.active || !hasQuota
                  ? "#4A5872"
                  : isWarn
                    ? "#B54708"
                    : isIdle
                      ? "#4A5872"
                      : "#1A56DB";

                return (
                  <div
                    key={s.id || s.registration_number}
                    className="flex items-center py-4 px-3 border-t border-fco-border-subtle gap-2"
                  >
                    <div className="w-8 shrink-0 text-center tabular-nums text-xs font-semibold text-soft">
                      {i + 1}
                    </div>
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
                      {hasQuota ? (
                        <ProgressBar width={width} showText />
                      ) : (
                        <span className="text-xs text-soft italic">
                          Belum ada alokasi
                        </span>
                      )}
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
      </div>
    </div>
  );
}
