import { useCallback, useEffect, useState } from "react";
import { PageToolbar } from "../../components/PageToolbar";
import { DataTable, type Column } from "../../components/DataTable";
import { StatusChip } from "../../components/StatusChip";
import { AlertBanner } from "../../components/ui";
import { catchesService, type FishCatch } from "../../services/catches";
import { shipsService, type Ship } from "../../services/ships";
import { authService } from "../../services/auth";

export function MyCatchesPage() {
  const [rows, setRows] = useState<FishCatch[]>([]);
  const [ship, setShip] = useState<Ship | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const currentUser = authService.getStoredUser();

  const fetchCatches = useCallback(
    async (query?: string) => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const currentShip = await shipsService
          .getShipForCaptain(currentUser)
          .catch(() => null);
        setShip(currentShip);

        if (currentShip) {
          const catchesData = await catchesService.getAll({
            ship_id: currentShip.id,
            search: query,
          });
          setRows(catchesData);
        } else {
          const allCatches = await catchesService.getAll({ search: query });
          setRows(allCatches);
        }
      } catch (err: unknown) {
        setErrorMsg(
          err instanceof Error ? err.message : "Gagal memuat riwayat tangkapan",
        );
      } finally {
        setLoading(false);
      }
    },
    [currentUser],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCatches(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, fetchCatches]);

  const cols: Column<FishCatch>[] = [
    {
      key: "date",
      header: "Tanggal / Hasil",
      flex: 3,
      render: (r) => {
        const details = r.catch_details || [];
        const summary = details
          .map(
            (d) => `${d.fish_species_name || "Ikan"}: ${d.quantity} ${d.unit}`,
          )
          .join(", ");
        return (
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold tabular-nums">
                {r.catch_date}
              </span>
              <span className="sm:hidden">
                <StatusChip label="Tercatat" />
              </span>
            </div>
            <div className="text-xs text-soft line-clamp-1">
              {r.catch_type === "pelagic"
                ? "Pelagis"
                : r.catch_type === "demersal"
                  ? "Demersal"
                  : "Terumbu Karang"}
              {summary ? ` · ${summary}` : ""}
            </div>
          </div>
        );
      },
    },
    {
      key: "details",
      header: "Hasil Tangkapan",
      flex: 3,
      hideOnMobile: true,
      render: (r) => {
        const details = r.catch_details || [];
        if (details.length === 0)
          return <span className="text-xs text-soft">—</span>;
        return (
          <div className="flex flex-col gap-0.5">
            {details.map((d, i) => (
              <div key={i} className="text-xs">
                <span className="font-semibold text-strong">
                  {d.fish_species_name || `Spesies #${d.fish_species}`}
                </span>
                : {d.quantity} {d.unit}
                {d.pnbp && (
                  <span className="text-fco-blue font-mono font-medium ml-1.5">
                    (PNBP: Rp {Number(d.pnbp).toLocaleString("id-ID")})
                  </span>
                )}
              </div>
            ))}
          </div>
        );
      },
    },
    {
      key: "loc",
      header: "Koordinat GPS",
      flex: 2,
      hideOnMobile: true,
      render: (r) => (
        <span className="text-xs text-soft font-mono">
          {r.location_latitude}, {r.location_longitude}
        </span>
      ),
    },
    {
      key: "st",
      header: "Status",
      flex: 1,
      align: "center",
      hideOnMobile: true,
      render: () => <StatusChip label="Tercatat" />,
    },
  ];

  return (
    <div className="max-w-360 mx-auto">
      <PageToolbar
        title="Riwayat Tangkapan Kapal"
        desc={
          ship
            ? `Laporan hasil laut untuk kapal ${ship.name} (${ship.registration_number}).`
            : "Laporan hasil laut resmi untuk kapal armada Anda."
        }
        searchPlaceholder="Filter tanggal..."
        searchValue={search}
        onSearchChange={setSearch}
      />

      <AlertBanner
        variant="error"
        message={errorMsg || ""}
        onDismiss={() => setErrorMsg(null)}
      />

      <section className="surface-card border rounded-xl p-6 shadow-xs">
        <DataTable
          columns={cols}
          rows={rows}
          rowKey={(r) => String(r.id)}
          loading={loading}
          emptyText="Belum ada riwayat tangkapan tercatat untuk kapal ini."
        />
      </section>
    </div>
  );
}
