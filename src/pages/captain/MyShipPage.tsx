import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../components/PageHeader";
import { StatusChip } from "../../components/StatusChip";
import { Skeleton } from "../../components/ui/Skeleton";
import { shipsService, type Ship } from "../../services/ships";
import { authService } from "../../services/auth";
import { Ship as ShipIcon } from "lucide-react";

export function MyShipPage() {
  const [ship, setShip] = useState<Ship | null>(null);
  const [loading, setLoading] = useState(true);

  const currentUser = authService.getStoredUser();

  useEffect(() => {
    async function loadShip() {
      setLoading(true);
      try {
        const targetShip = await shipsService
          .getShipForCaptain(currentUser)
          .catch(() => null);
        setShip(targetShip);
      } catch {
        setShip(null);
      } finally {
        setLoading(false);
      }
    }
    loadShip();
  }, [currentUser]);

  const quota = ship?.current_year_quota;
  const quotaPct = quota ? quota.quota_percentage : 0;
  const quotaBarColor =
    quotaPct < 15 ? "#EF4444" : quotaPct < 30 ? "#F59E0B" : "#1A56DB";

  const specs: { label: string; value: ReactNode }[] = ship
    ? [
        { label: "Nama kapal", value: ship.name },
        {
          label: "Nomor registrasi (SIPI)",
          value: (
            <span className="font-mono text-fco-blue font-bold">
              {ship.registration_number}
            </span>
          ),
        },
        {
          label: "Pemilik (Owner)",
          value: ship.owner_name || (ship.owner ? `Owner #${ship.owner}` : "—"),
        },
        {
          label: "Nahkoda (Captain)",
          value:
            ship.captain_name ||
            currentUser?.profile?.name ||
            currentUser?.username ||
            "—",
        },
        {
          label: "Panjang (m)",
          value: ship.length ? `${ship.length} m` : "—",
        },
        {
          label: "Lebar (m)",
          value: ship.width ? `${ship.width} m` : "—",
        },
        {
          label: "Gross tonnage",
          value: ship.gross_tonnage ? `${ship.gross_tonnage} GT` : "—",
        },
        {
          label: "Tahun dibuat",
          value: ship.year_built ? String(ship.year_built) : "—",
        },
        {
          label: "Pelabuhan asal",
          value: ship.home_port || "—",
        },
        {
          label: "Status operasional",
          value: (
            <StatusChip
              label={ship.active ? "Aktif Beroperasi" : "Nonaktif"}
              bg={ship.active ? undefined : "#EEF1F6"}
              color={ship.active ? undefined : "#4A5872"}
            />
          ),
        },
        {
          label: "Total kuota tahun berjalan",
          value: quota
            ? `${Number(quota.total_quota).toLocaleString("id-ID")} kg`
            : "—",
        },
        {
          label: "Sisa kuota",
          value: quota ? (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <span>
                  {Number(quota.remaining_quota).toLocaleString("id-ID")} kg
                </span>
                <span
                  className={`text-xs font-bold ${
                    quotaPct < 15
                      ? "text-red-600 dark:text-red-400"
                      : quotaPct < 30
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-fco-blue"
                  }`}
                >
                  ({quotaPct}%)
                </span>
              </div>
              <div className="w-full max-w-48 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden border border-fco-border-subtle">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, Math.max(0, quotaPct))}%`,
                    backgroundColor: quotaBarColor,
                  }}
                />
              </div>
            </div>
          ) : (
            "—"
          ),
        },
      ]
    : [];

  return (
    <div className="max-w-220 mx-auto">
      <PageHeader
        title="Kapal Saya"
        desc="Informasi kapal dan kuota resmi yang Anda nahkodai terintegrasi API backend."
      />

      <section className="surface-card border rounded-xl p-8 shadow-xs">
        {loading ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-6 border-b border-fco-border-subtle">
              <div className="flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48 rounded" />
                  <Skeleton className="h-3 w-32 rounded" />
                </div>
              </div>
              <Skeleton className="h-7 w-20 rounded-full" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <Skeleton className="h-3 w-24 rounded" />
                  <Skeleton className="h-5 w-40 rounded" />
                </div>
              ))}
            </div>
          </div>
        ) : !ship ? (
          <div className="py-12 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-fco-blue-light dark:bg-fco-blue/20 flex items-center justify-center text-fco-blue">
              <ShipIcon size={28} aria-hidden="true" />
            </div>
            <h2 className="text-lg font-extrabold text-strong m-0">
              Belum Ada Kapal Terhubung
            </h2>
            <p className="text-sm text-soft max-w-115 m-0 leading-relaxed">
              Akun nahkoda Anda saat ini belum dihubungkan ke kapal yang
              terdaftar di database KKP. Hubungi pemilik kapal (Owner) atau
              Administrator untuk menugaskan kapal ke akun Anda.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-fco-border-subtle">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-fco-blue text-white flex items-center justify-center shrink-0">
                  <ShipIcon size={24} aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-strong m-0">
                    {ship.name}
                  </h2>
                  <div className="text-xs text-soft tabular-nums mt-0.5">
                    {ship.registration_number} · Terdaftar di sistem KKP
                  </div>
                </div>
              </div>
              <StatusChip
                label={ship.active ? "Aktif" : "Nonaktif"}
                bg={ship.active ? undefined : "#EEF1F6"}
                color={ship.active ? undefined : "#4A5872"}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
              {specs.map((s) => (
                <div
                  key={s.label}
                  className="pb-4 border-b border-fco-border-subtle"
                >
                  <div className="text-xs text-soft mb-1 font-medium">
                    {s.label}
                  </div>
                  <div className="text-sm sm:text-fco-md font-semibold tabular-nums text-strong">
                    {s.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-soft">
              <span>Data kapal terverifikasi sistem resmi KKP</span>
              <Link
                to="/captain/catches"
                className="font-semibold text-fco-blue hover:text-fco-blue-hover no-underline"
              >
                Lihat riwayat tangkapan kapal
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
