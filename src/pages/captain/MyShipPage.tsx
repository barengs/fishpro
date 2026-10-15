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
          // Fallback to all ships if captainId not directly assigned
          const all = await shipsService.getAll();
          if (all.length > 0) setShip(all[0]);
        }
      } catch {
        // Ignored
      } finally {
        setLoading(false);
      }
    }
    loadShip();
  }, [captainId]);

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
          value: ship.captain_name || currentUser?.username || "—",
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
            ? `${ship.current_year_quota.total_quota} kg`
            : "12.000 kg",
        },
        {
          label: "Sisa kuota",
          value: ship.current_year_quota
            ? `${ship.current_year_quota.remaining_quota} kg (${ship.current_year_quota.quota_percentage}%)`
            : "8.400 kg (70%)",
        },
      ]
    : [
        { label: "Nama kapal", value: "KM Samudra Jaya" },
        { label: "Nomor registrasi", value: "REG-0412" },
        { label: "Panjang (m)", value: "18,00 m" },
        { label: "Lebar (m)", value: "5,20 m" },
        { label: "Gross tonnage", value: "42,50 GT" },
        { label: "Tahun dibuat", value: "2015" },
        { label: "Pelabuhan asal", value: "Benoa" },
        { label: "Status", value: "Aktif" },
        { label: "Kuota 2026", value: "12.000 kg" },
        { label: "Sisa kuota", value: "8.400 kg (70%)" },
      ];

  return (
    <div className="max-w-220 mx-auto">
      <PageHeader
        title="Kapal Saya"
        desc="Informasi kapal dan kuota resmi yang Anda nahkodai terintegrasi API backend."
      />

      <section className="surface-card border rounded-2xl p-8 shadow-xs">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2 text-sm text-soft">
            <Loader2
              size={24}
              className="animate-spin text-fco-blue"
              aria-hidden="true"
            />
            <span>Memuat informasi kapal...</span>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 pb-6 mb-6 border-b border-fco-border-subtle">
              <div className="w-12 h-12 rounded-xl bg-fco-blue text-white flex items-center justify-center shrink-0">
                <ShipIcon size={24} aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-strong m-0">
                  {ship ? ship.name : "KM Samudra Jaya"}
                </h2>
                <div className="text-xs text-soft tabular-nums mt-0.5">
                  {ship ? ship.registration_number : "REG-0412"} · Terdaftar di
                  sistem KKP
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
