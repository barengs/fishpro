import { AlertCircle, Download, FileUp } from "lucide-react";
import { PageToolbar } from "../../components/PageToolbar";
import { DataTable, type Column } from "../../components/DataTable";
import { CrudActions } from "../../components/FormField";
import { AlertBanner, SelectField } from "../../components/ui";
import { StatusChip } from "../../components/StatusChip";
import { CrudModal } from "../../components/CrudModal";
import { ConfirmDeleteModal } from "../../components/ConfirmDeleteModal";
import { DetailModal } from "../../components/DetailModal";
import { CatchReportWizard } from "../../components/CatchReportWizard";
import { CsvImportModal } from "./species/CsvImportModal";
import { catchesService, type FishCatch } from "../../services/catches";
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
    isImportModalOpen,
    openImportModal,
    closeImportModal,
    handleCsvImport,
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
              title="Laporan Hasil Tangkapan"
              desc="Kelola seluruh catatan hasil tangkapan kapal, rincian jenis ikan, dan verifikasi segel resmi pelabuhan."
              searchPlaceholder="Filter kapal / tanggal..."
              searchValue={search}
              onSearchChange={setSearch}
              addLabel="Buat Laporan Baru"
              onAdd={openModal}
              extraActions={
                  <>
                      <a
                          href={catchesService.getTemplateUrl()}
                          download
                          className="inline-flex items-center justify-center gap-2 h-[46px] px-4 rounded-[12px] text-sm font-semibold border border-[#d9dee8] dark:border-[#2a3753] bg-white dark:bg-[#0f1729] hover:bg-[#f1f4f9] dark:hover:bg-[#141d33] text-[#0f172a] dark:text-[#e8edf7] transition-colors no-underline whitespace-nowrap"
                      >
                          <Download size={16} className="text-[#2563eb] dark:text-[#5b94ff]" aria-hidden="true" />
                          <span>Unduh Template CSV</span>
                      </a>
                      <button
                          type="button"
                          onClick={openImportModal}
                          className="inline-flex items-center justify-center gap-2 h-[46px] px-4 rounded-[12px] text-sm font-semibold border border-[#d9dee8] dark:border-[#2a3753] bg-white dark:bg-[#0f1729] hover:bg-[#f1f4f9] dark:hover:bg-[#141d33] text-[#0f172a] dark:text-[#e8edf7] transition-colors cursor-pointer whitespace-nowrap"
                      >
                          <FileUp size={16} className="text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                          <span>Impor File CSV</span>
                      </button>
                  </>
              }
          />

          <AlertBanner variant="success" message={toastMsg || ""} onDismiss={() => setToastMsg(null)} />
          <AlertBanner variant="error" message={errorMsg || ""} onDismiss={() => setErrorMsg(null)} />

          <DataTable
              columns={cols}
              rows={rows}
              rowKey={r => String(r.id)}
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
              onClose={closeDetail}
              fields={[
                  {
                      label: "Kapal Penangkap",
                      value: selectedCatch?.ship_name || (selectedCatch?.ship ? `#${selectedCatch.ship}` : "—"),
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
                      label: "Status",
                      value: "Tercatat Resmi",
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
                              return <span className="text-subtext text-xs">Belum ada rincian spesifik spesies.</span>;
                          }

                          const totalQty = details.reduce((acc, cur) => acc + (Number(cur.quantity) || 0), 0);

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
                                                  <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/40 transition-colors">
                                                      <td className="py-3.5 px-4 text-center tabular-nums text-gray-400 dark:text-slate-500 font-normal w-12">
                                                          {i + 1}
                                                      </td>
                                                      <td className="py-3.5 px-4">
                                                          <div className="font-bold text-sm text-gray-900 dark:text-white">
                                                              {d.fish_species_name || `Spesies #${d.fish_species}`}
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
                              onChange={e => setSelectedShipReg(e.target.value)}
                              options={
                                  ships.length === 0
                                      ? [
                                            {
                                                value: "",
                                                label: "Belum ada kapal terdaftar di database",
                                                disabled: true,
                                            },
                                        ]
                                      : ships.map(s => ({
                                            value: s.registration_number,
                                            label: `${s.name} (${s.registration_number}) · ${s.gross_tonnage || 0} GT`,
                                        }))
                              }
                          />
                          {ships.length === 0 && (
                              <p className="m-0 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5 mt-1">
                                  <AlertCircle size={14} className="shrink-0" aria-hidden="true" />
                                  <span>
                                      Belum ada data kapal di sistem. Silakan tambahkan data di menu{" "}
                                      <strong>Kapal</strong> terlebih dahulu agar dapat dipilih di sini.
                                  </span>
                              </p>
                          )}
                      </div>
                  }
              />
          </CrudModal>

          <CsvImportModal
              open={isImportModalOpen}
              title="Impor Laporan Tangkapan dari CSV"
              subtitle="Format header CSV: ship_registration,ship_name,owner_name,captain_name,captain_license,quota_amount,catch_date,catch_type,location_latitude,location_longitude,description,fish_species_name,quantity,unit,value,notes,wpp_name"
              headerFormat="ship_registration,ship_name,owner_name,captain_name,captain_license,quota_amount,catch_date,catch_type,location_latitude,location_longitude,description,fish_species_name,quantity,unit,value,notes,wpp_name"
              placeholderText="Tempel atau unggah isi file CSV riwayat tangkapan di sini..."
              onClose={closeImportModal}
              onImport={handleCsvImport}
          />

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
