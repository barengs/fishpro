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

      <section className="surface-card border rounded-xl p-4 sm:p-6 shadow-xs">
        <DataTable
          columns={cols}
          rows={rows}
          rowKey={(r) => String(r.id)}
          loading={loading}
          emptyText="Belum ada riwayat tangkapan tercatat untuk kapal ini."
          onRowClick={openDetail}
        />
      </section>

      {/* Modal Detail Tangkapan */}
      <DetailModal
        open={isDetailOpen}
        title={
          selectedCatch
            ? `Laporan Tangkapan: ${selectedCatch.catch_date}`
            : "Detail Tangkapan Ikan"
        }
        subtitle="Rincian hasil tangkapan laut, koordinat GPS penangkapan, dan estimasi PNBP resmi KKP."
        badge={
          selectedCatch ? <StatusChip label="Tercatat Resmi" /> : undefined
        }
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
            label: "Kategori Tangkapan",
            value:
              selectedCatch?.catch_type === "pelagic"
                ? "Ikan Pelagis"
                : selectedCatch?.catch_type === "demersal"
                  ? "Ikan Demersal"
                  : selectedCatch?.catch_type === "reef"
                    ? "Ikan Karang"
                    : selectedCatch?.catch_type || "—",
          },
          {
            label: "Koordinat GPS",
            value: selectedCatch ? (
              <span className="font-mono text-xs">
                {selectedCatch.location_latitude},{" "}
                {selectedCatch.location_longitude}
              </span>
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
                  <span className="text-soft text-xs">
                    Belum ada rincian spesifik spesies.
                  </span>
                );
              }

              const totalQty = details.reduce(
                (acc, cur) => acc + (Number(cur.quantity) || 0),
                0,
              );
              const totalPnbp = details.reduce(
                (acc, cur) => acc + (Number(cur.pnbp) || 0),
                0,
              );

              return (
                <div className="rounded-xl border border-fco-border-subtle surface-inset overflow-hidden mt-1">
                  <div className="max-h-52 overflow-y-auto divide-y divide-fco-border-subtle">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="surface-card sticky top-0 z-1 text-soft font-semibold border-b border-fco-border-subtle">
                        <tr>
                          <th className="py-2.5 px-3">Spesies / WPP</th>
                          <th className="py-2.5 px-3 text-right">Volume</th>
                          <th className="py-2.5 px-3 text-right">PNBP</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-fco-border-subtle text-strong">
                        {details.map((d, i) => (
                          <tr
                            key={i}
                            className="hover:surface-page transition-colors"
                          >
                            <td className="py-2.5 px-3">
                              <div className="font-semibold text-strong">
                                {d.fish_species_name ||
                                  `Spesies #${d.fish_species}`}
                              </div>
                              {d.wpp && (
                                <div className="text-2xs text-soft font-medium">
                                  Wilayah: {d.wpp}
                                </div>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-right font-bold tabular-nums">
                              {d.quantity} {d.unit}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono text-fco-blue tabular-nums">
                              {d.pnbp
                                ? `Rp ${Number(d.pnbp).toLocaleString("id-ID")}`
                                : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary Bar */}
                  <div className="p-2.5 px-3 surface-card border-t border-fco-border-subtle flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
                    <span className="text-soft font-medium">
                      {details.length} Spesies
                    </span>
                    <div className="flex items-center gap-3.5 tabular-nums">
                      <span>
                        Total: {Number(totalQty).toLocaleString("id-ID")} kg
                      </span>
                      {totalPnbp > 0 && (
                        <span className="text-fco-blue">
                          PNBP: Rp {Number(totalPnbp).toLocaleString("id-ID")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })(),
          },
          {
            label: "Keterangan / Catatan Lokasi",
            value: selectedCatch?.description || "Tidak ada catatan tambahan.",
            fullWidth: true,
          },
        ]}
      />
    </div>
  );
}
