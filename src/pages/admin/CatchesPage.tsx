import { useCallback, useEffect, useState } from "react";
import { PageToolbar } from "../../components/PageToolbar";
import { DataTable, type Column } from "../../components/DataTable";
import { CrudActions } from "../../components/FormField";
import { SelectField } from "../../components/ui";
import { StatusChip } from "../../components/StatusChip";
import { CrudModal } from "../../components/CrudModal";
import { useCrudModal } from "../../components/useCrudModal";
import { ConfirmDeleteModal } from "../../components/ConfirmDeleteModal";
import { useConfirmDelete } from "../../components/useConfirmDelete";
import { DetailModal } from "../../components/DetailModal";
import { useDetailModal } from "../../components/useDetailModal";
import { CatchReportWizard } from "../../components/CatchReportWizard";
import type { CatchReportFormData } from "../../components/catchReportTypes";
import { catchesService, type FishCatch } from "../../services/catches";
import { shipsService, type Ship } from "../../services/ships";
import { fishSpeciesService, type FishSpecies } from "../../services/fish";

export function CatchesPage() {
  const [rows, setRows] = useState<FishCatch[]>([]);
  const [ships, setShips] = useState<Ship[]>([]);
  const [speciesList, setSpeciesList] = useState<FishSpecies[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedShipReg, setSelectedShipReg] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { open, openModal, closeModal } = useCrudModal();
  const {
    target: deleteTarget,
    open: isDeleteOpen,
    requestDelete,
    cancelDelete,
  } = useConfirmDelete<{ id: number; name?: string }>();
  const {
    selected: selectedCatch,
    open: isDetailOpen,
    openDetail,
    closeDetail,
  } = useDetailModal<FishCatch>();

  const fetchCatches = useCallback(
    async (query?: string) => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const [catchesData, shipsData, spData] = await Promise.all([
          catchesService.getAll(query ? { search: query } : undefined),
          shipsService.getAll().catch(() => []),
          fishSpeciesService.getAll().catch(() => []),
        ]);
        setRows(catchesData);
        setShips(shipsData);
        setSpeciesList(spData);
        if (shipsData.length > 0 && !selectedShipReg) {
          setSelectedShipReg(shipsData[0].registration_number);
        }
      } catch (err: unknown) {
        setErrorMsg(
          err instanceof Error
            ? err.message
            : "Gagal memuat data laporan tangkapan",
        );
      } finally {
        setLoading(false);
      }
    },
    [selectedShipReg],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCatches(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, fetchCatches]);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await catchesService.delete(deleteTarget.id);
      setToastMsg("Laporan tangkapan berhasil dihapus.");
      setTimeout(() => setToastMsg(null), 3000);
      cancelDelete();
      fetchCatches(search);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Gagal menghapus laporan tangkapan",
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async (data: CatchReportFormData) => {
    if (!selectedShipReg.trim()) {
      alert("Harap pilih kapal untuk laporan tangkapan ini.");
      return;
    }

    try {
      // Find species ID
      let speciesId = Number(data.fish_species);
      if (isNaN(speciesId) || speciesId === 0) {
        const found = speciesList.find(
          (s) => s.name.toLowerCase() === data.fish_species.toLowerCase(),
        );
        speciesId = found
          ? found.id
          : speciesList.length > 0
            ? speciesList[0].id
            : 1;
      }

      const payload = {
        ship: selectedShipReg,
        catch_date: data.catch_date,
        catch_type: data.catch_type,
        location_latitude: data.location_latitude,
        location_longitude: data.location_longitude,
        description: data.description || "",
        catch_details: [
          {
            fish_species: speciesId,
            quantity: parseFloat(data.quantity) || 0,
            unit: data.unit || "kg",
            value: data.value ? parseFloat(data.value) : null,
            notes: data.description || "",
          },
        ],
      };

      await catchesService.createWithDetails(payload);
      setToastMsg(
        `Laporan tangkapan untuk ${selectedShipReg} berhasil dibuat dan disegel ke blockchain!`,
      );
      setTimeout(() => setToastMsg(null), 4000);
      closeModal();
      fetchCatches(search);
    } catch (err: unknown) {
      alert(
        err instanceof Error ? err.message : "Gagal mengirim laporan tangkapan",
      );
    }
  };

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

      {toastMsg && (
        <div className="p-3.5 px-4.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-sm font-semibold mb-5 border border-emerald-200 dark:border-emerald-500/20">
          ✓ {toastMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 px-4.5 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 text-sm font-semibold mb-5 border border-red-200 dark:border-red-500/20">
          ⚠ {errorMsg}
        </div>
      )}

      <section className="surface-card border rounded-xl p-6 shadow-xs">
        <DataTable
          columns={cols}
          rows={rows}
          rowKey={(r) => String(r.id)}
          loading={loading}
          emptyText="Belum ada data laporan penangkapan ikan di server."
          onRowClick={openDetail}
        />
      </section>

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
            value: (
              <div className="flex flex-col gap-2 pt-1">
                {(selectedCatch?.catch_details || []).length === 0 ? (
                  <span className="text-soft text-xs">
                    Belum ada rincian spesies.
                  </span>
                ) : (
                  (selectedCatch?.catch_details || []).map((d, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg surface-card border dark:border-fco-border-dark flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-strong">
                          {d.fish_species_name || `Spesies #${d.fish_species}`}
                        </div>
                        <div className="text-soft text-2xs mt-0.5">
                          Wilayah WPP: {d.wpp || "—"}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-strong">
                          {d.quantity} {d.unit}
                        </div>
                        {d.pnbp && (
                          <div className="text-fco-blue font-mono font-medium text-2xs">
                            PNBP: Rp {Number(d.pnbp).toLocaleString("id-ID")}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            ),
          },
          {
            label: "Catatan Lokasi",
            value: selectedCatch?.description || "Tidak ada catatan tambahan.",
            fullWidth: true,
          },
        ]}
      />

      <CrudModal
        open={open}
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
                <p className="m-0 text-xs text-amber-600 dark:text-amber-400">
                  ⚠ Belum ada data kapal di sistem. Silakan tambahkan data di
                  menu <strong>Kapal</strong> terlebih dahulu agar dapat dipilih
                  di sini.
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
