import { AlertCircle } from "lucide-react";
import { PageToolbar } from "../../components/PageToolbar";
import { DataTable, type Column } from "../../components/DataTable";
import { CrudActions } from "../../components/FormField";
import { AlertBanner, SelectField } from "../../components/ui";
import { StatusChip } from "../../components/StatusChip";
import { CrudModal } from "../../components/CrudModal";
import { ConfirmDeleteModal } from "../../components/ConfirmDeleteModal";
import { DetailModal } from "../../components/DetailModal";
import { CatchReportWizard } from "../../components/CatchReportWizard";
import type { FishCatch } from "../../services/catches";
import { useCatchesManager } from "./hooks/useCatchesManager";

export function CatchesPage() {
  const {
    rows,
    ships,
    loading,
    search,
    setSearch,
    selectedShipReg,
    setSelectedShipReg,
    errorMsg,
    setErrorMsg,
    toastMsg,
    setToastMsg,
    isModalOpen,
    openModal,
    closeModal,
    handleSubmit,
    selectedCatch,
    isDetailOpen,
    openDetail,
    closeDetail,
    deleteTarget,
    isDeleteOpen,
    deleting,
    requestDelete,
    cancelDelete,
    handleConfirmDelete,
  } = useCatchesManager();

  const cols: Column<FishCatch>[] = [
    {
      key: "ship",
      header: "Kapal / Tanggal",
      flex: 3,
      render: (r) => (
        <div>
          <div className="text-sm font-semibold">
            {r.ship_name || `Kapal ${r.ship}`}
          </div>
          <div className="text-xs text-soft tabular-nums">
            {r.catch_date} ·{" "}
            {r.catch_type === "pelagic"
              ? "Pelagis"
              : r.catch_type === "demersal"
                ? "Demersal"
                : "Terumbu"}
          </div>
        </div>
      ),
    },
    {
      key: "loc",
      header: "Lokasi Koordinat",
      flex: 2,
      hideOnMobile: true,
      render: (r) => (
        <span className="text-xs text-soft font-mono">
          {r.location_latitude}, {r.location_longitude}
        </span>
      ),
    },
    {
      key: "details",
      header: "Detail Tangkapan",
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
      render: (r) => (
        <CrudActions
          onDetail={() => openDetail(r)}
          onDelete={() =>
            requestDelete({
              id: r.id,
              name: `Laporan kapal ${r.ship_name || `#${r.ship}`}`,
            })
          }
        />
      ),
    },
  ];

  return (
    <div>
      <PageToolbar
        title="Laporan Tangkapan Ikan (Fish Catches)"
        desc="Kelola laporan tangkapan kapal nasional terintegrasi API backend & verifikasi blockchain otomatis."
        searchPlaceholder="Filter kapal / tanggal..."
        searchValue={search}
        onSearchChange={setSearch}
        addLabel="Buat Laporan Baru"
        onAdd={openModal}
      />

      <AlertBanner
        variant="success"
        message={toastMsg || ""}
        onDismiss={() => setToastMsg(null)}
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
        emptyText="Belum ada data laporan penangkapan ikan di server."
        onRowClick={openDetail}
      />

      <DetailModal
        open={isDetailOpen}
        title={
          selectedCatch
            ? `Laporan Tangkapan: ${selectedCatch.ship_name || `#${selectedCatch.ship}`}`
            : "Detail Laporan Tangkapan"
        }
        subtitle="Data hasil tangkapan ikan, koordinat penangkapan GPS, dan hitungan PNBP."
        badge={
          selectedCatch ? <StatusChip label="Tercatat Resmi" /> : undefined
        }
        onClose={closeDetail}
        fields={[
          {
            label: "Kapal Penangkap",
            value:
              selectedCatch?.ship_name ||
              (selectedCatch?.ship ? `#${selectedCatch.ship}` : "—"),
          },
          {
            label: "Tanggal Penangkapan",
            value: selectedCatch?.catch_date || "—",
          },
          {
            label: "Jenis Tangkapan",
            value: selectedCatch?.catch_type?.toUpperCase() || "PELAGIC",
          },
          {
            label: "Koordinat GPS",
            value: selectedCatch
              ? `${selectedCatch.location_latitude}, ${selectedCatch.location_longitude}`
              : "—",
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
                      <thead className="bg-fco-blue sticky top-0 z-1 text-white font-bold">
                        <tr>
                          <th className="py-2.5 px-3 w-10 text-center">No</th>
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
                            <td className="py-2.5 px-3 text-center tabular-nums text-soft font-semibold w-10">
                              {i + 1}
                            </td>
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
            label: "Catatan Lokasi",
            value: selectedCatch?.description || "Tidak ada catatan tambahan.",
            fullWidth: true,
          },
        ]}
      />

      <CrudModal
        open={isModalOpen}
        title="Buat Laporan Tangkapan Ikan"
        subtitle="Catat hasil tangkapan kapal, lokasi GPS, dan rincian tangkapan."
        onClose={closeModal}
        hideFooter
      >
        <CatchReportWizard
          onSubmit={handleSubmit}
          onCancel={closeModal}
          shipSelector={
            <div className="flex flex-col gap-1.5">
              <SelectField
                label="Pilih Kapal Terdaftar (Ship)"
                id="ct-ship"
                required
                searchable
                searchPlaceholder="Cari nama kapal atau nomor registrasi..."
                placeholder={
                  ships.length === 0
                    ? "— Belum ada kapal terdaftar di database —"
                    : "— Pilih Kapal Terdaftar —"
                }
                value={selectedShipReg}
                onChange={(e) => setSelectedShipReg(e.target.value)}
                options={
                  ships.length === 0
                    ? [
                        {
                          value: "",
                          label: "Belum ada kapal terdaftar di database",
                          disabled: true,
                        },
                      ]
                    : ships.map((s) => ({
                        value: s.registration_number,
                        label: `${s.name} (${s.registration_number}) · ${s.gross_tonnage || 0} GT`,
                      }))
                }
              />
              {ships.length === 0 && (
                <p className="m-0 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5 mt-1">
                  <AlertCircle
                    size={14}
                    className="shrink-0"
                    aria-hidden="true"
                  />
                  <span>
                    Belum ada data kapal di sistem. Silakan tambahkan data di
                    menu <strong>Kapal</strong> terlebih dahulu agar dapat
                    dipilih di sini.
                  </span>
                </p>
              )}
            </div>
          }
        />
      </CrudModal>

      <ConfirmDeleteModal
        open={isDeleteOpen}
        title="Hapus Laporan Tangkapan"
        itemName={deleteTarget?.name}
        message="Apakah Anda yakin ingin menghapus data laporan tangkapan ini dari sistem?"
        loading={deleting}
        onClose={cancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
