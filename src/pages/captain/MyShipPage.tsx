import { useEffect, useState } from "react";
import { PageHeader } from "../../components/PageHeader";
import { shipsService, type Ship } from "../../services/ships";
import { authService } from "../../services/auth";
import { Loader2, Ship as ShipIcon } from "lucide-react";

export function MyShipPage() {
  const [ship, setShip] = useState<Ship | null>(null);
  const [loading, setLoading] = useState(true);

  const currentUser = authService.getStoredUser();
  const captainId = currentUser?.id || 1;

  useEffect(() => {
    async function loadShip() {
      setLoading(true);
      try {
        const ships = await shipsService
          .getByCaptain(captainId)
          .catch(() => []);
        if (ships.length > 0) {
          setShip(ships[0]);
        } else {
          // Check all ships
          const all = await shipsService.getAll().catch(() => []);
          // Try matching ship where captain id matches or captain name matches user name
          const matched = all.find(
            (s) =>
              (s.captain && s.captain === captainId) ||
              (s.captain_name &&
                s.captain_name.toLowerCase() ===
                  currentUser?.username.toLowerCase()),
          );
          setShip(matched || (all.length > 0 ? all[0] : null));
        }
      } catch {
        setShip(null);
      } finally {
        setLoading(false);
      }
    }
    loadShip();
  }, [captainId, currentUser?.username]);

  const specs = ship
    ? [
        { label: "Nama kapal", value: ship.name },
        { label: "Nomor registrasi", value: ship.registration_number },
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
        { label: "Panjang (m)", value: ship.length ? `${ship.length} m` : "—" },
        { label: "Lebar (m)", value: ship.width ? `${ship.width} m` : "—" },
        {
          label: "Gross tonnage",
          value: ship.gross_tonnage ? `${ship.gross_tonnage} GT` : "—",
        },
        {
          label: "Tahun dibuat",
          value: ship.year_built ? String(ship.year_built) : "—",
        },
        { label: "Pelabuhan asal", value: ship.home_port || "—" },
        {
          label: "Status kapal",
          value: ship.active ? "Aktif Beroperasi" : "Nonaktif",
        },
        {
          label: "Total kuota tahun berjalan",
          value: ship.current_year_quota
            ? `${Number(ship.current_year_quota.total_quota).toLocaleString("id-ID")} kg`
            : "—",
        },
        {
          label: "Sisa kuota",
          value: ship.current_year_quota
            ? `${Number(ship.current_year_quota.remaining_quota).toLocaleString("id-ID")} kg (${ship.current_year_quota.quota_percentage}%)`
            : "—",
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
          <div className="py-12 flex flex-col items-center justify-center gap-2 text-sm text-soft">
            <Loader2
              size={24}
              className="animate-spin text-fco-blue"
              aria-hidden="true"
            />
            <span>Memuat informasi kapal...</span>
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
          <div>
            <div className="flex items-center gap-3 pb-6 mb-6 border-b border-fco-border-subtle">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
              {specs.map((s) => (
                <div
                  key={s.label}
                  className="pb-4 border-b border-fco-border-subtle"
                >
                  <div className="text-xs text-soft mb-1">{s.label}</div>
                  <div className="text-fco-md font-semibold tabular-nums">
                    {s.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
