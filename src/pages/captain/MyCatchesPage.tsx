import { useCallback, useEffect, useState } from "react";
import { PageToolbar } from "../../components/PageToolbar";
import { DataTable, type Column } from "../../components/DataTable";
import { StatusChip } from "../../components/StatusChip";
import { AlertBanner } from "../../components/ui";
import { DetailModal } from "../../components/DetailModal";
import { useDetailModal } from "../../components/useDetailModal";
import { CrudActions } from "../../components/FormField";
import { catchesService, type FishCatch } from "../../services/catches";
import { shipsService, type Ship } from "../../services/ships";
import { authService } from "../../services/auth";

export function MyCatchesPage() {
  const [rows, setRows] = useState<FishCatch[]>([]);
  const [ship, setShip] = useState<Ship | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    selected: selectedCatch,
    open: isDetailOpen,
    openDetail,
    closeDetail,
  } = useDetailModal<FishCatch>();

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
          <div className="py-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold tabular-nums text-strong">
                {r.catch_date}
              </span>
              <span className="sm:hidden">
                <StatusChip label="Tercatat" />
              </span>
            </div>
            <div className="text-xs text-soft line-clamp-1 mt-0.5">
              {r.catch_type === "pelagic"
                ? "Pelagis"
                : r.catch_type === "demersal"
                  ? "Demersal"
                  : "Karang"}
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
    {
      key: "aksi",
      header: "Aksi",
      flex: 1,
      align: "right",
      render: (r) => <CrudActions onDetail={() => openDetail(r)} />,
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

      <DataTable
        columns={cols}
        rows={rows}
        rowKey={(r) => String(r.id)}
        loading={loading}
        emptyText="Belum ada riwayat tangkapan tercatat untuk kapal ini."
        onRowClick={openDetail}
      />

      {/* Modal Detail Tangkapan */}
      <DetailModal
        open={isDetailOpen}
        title={
          selectedCatch
            ? `Laporan Tangkapan: ${selectedCatch.ship_name || (ship?.name ? ship.name : selectedCatch.catch_date)}`
            : "Detail Tangkapan Ikan"
        }
        subtitle="Data hasil tangkapan ikan, koordinat penangkapan GPS, dan hitungan PNBP."
        onClose={closeDetail}
        fields={[
          {
            label: "Kapal Penangkap",
            value:
              selectedCatch?.ship_name ||
              (ship ? `${ship.name} (${ship.registration_number})` : "—"),
          },
          {
            label: "Tanggal Penangkapan",
            value: selectedCatch?.catch_date || "—",
          },
          {
            label: "Jenis Tangkapan",
            value:
              selectedCatch?.catch_type === "pelagic"
                ? "PELAGIC"
                : selectedCatch?.catch_type === "demersal"
                  ? "DEMERSAL"
                  : selectedCatch?.catch_type?.toUpperCase() || "PELAGIC",
          },
          {
            label: "Status",
            value: "Tercatat Resmi",
          },
          {
            label: "Koordinat GPS",
            value: selectedCatch ? (
              `${selectedCatch.location_latitude}, ${selectedCatch.location_longitude}`
            ) : (
              "—"
            ),
          },
          {
            label: "Rincian Hasil Tangkapan & Spesies",
            fullWidth: true,
            value: (() => {
              const details = selectedCatch?.catch_details || [];
              if (details.length === 0) {
                return (
                  <span className="text-subtext text-xs">
                    Belum ada rincian spesifik spesies.
                  </span>
                );
              }

              const totalQty = details.reduce(
                (acc, cur) => acc + (Number(cur.quantity) || 0),
                0,
              );

              return (
                <div className="rounded-2xl border border-gray-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden mt-1.5">
                  <div className="max-h-60 overflow-y-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-[#F8F9FA] dark:bg-slate-800/60 sticky top-0 z-1 border-b border-gray-200/70 dark:border-slate-800 text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                        <tr>
                          <th className="py-3 px-4 w-12 text-center font-bold">NO</th>
                          <th className="py-3 px-4 font-bold">SPESIES / WPP</th>
                          <th className="py-3 px-4 text-right font-bold">VOLUME</th>
                          <th className="py-3 px-4 text-right font-bold">PNBP</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-slate-800/60 text-ink dark:text-white">
                        {details.map((d, i) => (
                          <tr
                            key={i}
                            className="hover:bg-gray-50/50 dark:hover:bg-slate-800/40 transition-colors"
                          >
                            <td className="py-3.5 px-4 text-center tabular-nums text-gray-400 dark:text-slate-500 font-normal w-12">
                              {i + 1}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-sm text-gray-900 dark:text-white">
                                {d.fish_species_name ||
                                  `Spesies #${d.fish_species}`}
                              </div>
                              {d.wpp && (
                                <div className="text-xs text-gray-400 font-normal mt-0.5">
                                  Wilayah: {d.wpp}
                                </div>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-right font-semibold text-sm text-gray-900 dark:text-white tabular-nums">
                              {Number(d.quantity).toFixed(2)} {d.unit || "kg"}
                            </td>
                            <td className="py-3.5 px-4 text-right text-sm text-gray-400 dark:text-slate-400 tabular-nums">
                              {d.pnbp && Number(d.pnbp) > 0
                                ? `Rp ${Number(d.pnbp).toLocaleString("id-ID")}`
                                : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary Bar */}
                  <div className="px-4 py-3 bg-[#F8F9FA] dark:bg-slate-800/60 border-t border-gray-200/70 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-gray-500 dark:text-slate-400 font-medium">
                      {details.length} Spesies
                    </span>
                    <div className="flex items-center gap-1.5 tabular-nums">
                      <span className="text-gray-500 dark:text-slate-400">Total</span>
                      <span className="font-bold text-sm text-gray-900 dark:text-white">
                        {Number(totalQty).toLocaleString("id-ID")} kg
                      </span>
                    </div>
                  </div>
                </div>
              );
            })(),
          },
          {
            label: "Catatan Lokasi",
            value: selectedCatch?.description || "Operasi penangkapan bulan 08/2026",
            fullWidth: true,
          },
        ]}
      />
    </div>
  );
}
