import { Download, FileUp } from "lucide-react";
import { DataTable, type Column } from "../../../components/DataTable";
import { CrudActions } from "../../../components/FormField";
import { ConfirmDeleteModal } from "../../../components/ConfirmDeleteModal";
import { DetailModal } from "../../../components/DetailModal";
import { PageToolbar } from "../../../components/PageToolbar";
import { AlertBanner } from "../../../components/ui";
import { CsvImportModal } from "./CsvImportModal";
import { FishModal } from "./FishModal";
import { fishSpeciesService, type Fish } from "../../../services/fish";
import { useFishList } from "./hooks/useFishList";

export function FishListTab() {
  const {
    fishList,
    speciesList,
    loading,
    errorMsg,
    setErrorMsg,
    toastMsg,
    setToastMsg,
    editingFish,
    isFishModalOpen,
    closeFishModal,
    handleOpenAdd,
    handleOpenEdit,
    handleFishSubmit,
    isImportModalOpen,
    openImportModal,
    closeImportModal,
    handleImportCsv,
    selectedFish,
    isDetailOpen,
    openDetail,
    closeDetail,
    deleteTarget,
    isDeleteOpen,
    cancelDelete,
    requestDelete,
    handleConfirmDelete,
  } = useFishList();

  const fishCols: Column<Fish>[] = [
    {
      key: "id",
      header: "ID",
      flex: 1,
      hideOnMobile: true,
      render: (r) => (
        <span className="font-mono text-xs text-soft">#{r.id}</span>
      ),
    },
    {
      key: "species",
      header: "Spesies",
      flex: 2,
      render: (r) => (
        <div>
          <div className="font-semibold text-strong">
            {r.species_name || `Spesies #${r.species}`}
          </div>
          <div className="sm:hidden text-2xs text-soft">
            {r.name ? `${r.name} · ` : ""}
            {r.weight ? `${Number(r.weight).toLocaleString("id-ID")} kg` : ""}
          </div>
        </div>
      ),
    },
    {
      key: "name",
      header: "Nama / Label",
      flex: 2,
      hideOnMobile: true,
      render: (r) => (
        <span className="text-strong font-medium">{r.name || "—"}</span>
      ),
    },
    {
      key: "weight",
      header: "Berat (kg)",
      flex: 1,
      align: "right",
      hideOnMobile: true,
      render: (r) =>
        r.weight !== null && r.weight !== undefined ? (
          <span className="font-mono font-semibold">
            {Number(r.weight).toLocaleString("id-ID")} kg
          </span>
        ) : (
          <span className="text-soft">—</span>
        ),
    },
    {
      key: "notes",
      header: "Catatan",
      flex: 3,
      hideOnMobile: true,
      render: (r) => (
        <span className="text-xs text-soft line-clamp-1">{r.notes || "—"}</span>
      ),
    },
    {
      key: "aksi",
      header: "Aksi",
      flex: 1,
      align: "right",
      render: (r) => (
        <CrudActions
          onDetail={() => openDetail(r)}
          onEdit={() => handleOpenEdit(r)}
          onDelete={() =>
            requestDelete({
              id: r.id,
              name: r.name || `Sampel #${r.id}`,
            })
          }
        />
      ),
    },
  ];

  return (
    <div>
      <PageToolbar
        addLabel="Tambah Ikan"
        onAdd={handleOpenAdd}
        extraActions={
          <>
            <a
              href={fishSpeciesService.getFishTemplateUrl()}
              download
              className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-fco text-xs sm:text-sm font-semibold border border-fco-border dark:border-fco-border-dark surface-card hover:surface-page text-strong transition-colors no-underline whitespace-nowrap shadow-2xs"
            >
              <Download
                size={14}
                className="text-fco-blue"
                aria-hidden="true"
              />
              <span>Unduh Template CSV</span>
            </a>
            <button
              type="button"
              onClick={openImportModal}
              className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-fco text-xs sm:text-sm font-semibold border border-fco-border dark:border-fco-border-dark surface-card hover:surface-page text-strong transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
            >
              <FileUp
                size={14}
                className="text-emerald-600 dark:text-emerald-400"
                aria-hidden="true"
              />
              <span>Impor Ikan</span>
            </button>
          </>
        }
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

      <section className="surface-card border rounded-xl p-6 shadow-xs">
        <DataTable
          columns={fishCols}
          rows={fishList}
          rowKey={(r) => String(r.id)}
          loading={loading}
          emptyText="Belum ada data sampel ikan individu."
          onRowClick={openDetail}
        />
      </section>

      <DetailModal
        open={isDetailOpen}
        title={selectedFish?.name || `Sampel Ikan #${selectedFish?.id}`}
        subtitle="Data spesimen ikan individu, berat, dan kondisi kualitasnya."
        badge={
          selectedFish ? (
            <span className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-fco-blue">
              Spesies: {selectedFish.species_name || `#${selectedFish.species}`}
            </span>
          ) : undefined
        }
        onClose={closeDetail}
        fields={[
          {
            label: "Nama / Label Sampel",
            value: selectedFish?.name || `Sampel #${selectedFish?.id}`,
          },
          {
            label: "Berat Ikan",
            value: selectedFish?.weight
              ? `${Number(selectedFish.weight).toLocaleString("id-ID")} kg`
              : "—",
          },
          {
            label: "Catatan Kualitas & Kondisi",
            value:
              selectedFish?.notes ||
              "Tidak ada catatan kualitas pada sampel ini.",
            fullWidth: true,
          },
        ]}
      />

      <FishModal
        open={isFishModalOpen}
        editingFish={editingFish}
        speciesList={speciesList}
        onClose={closeFishModal}
        onSubmit={handleFishSubmit}
      />

      <CsvImportModal
        open={isImportModalOpen}
        title="Impor Ikan dari CSV"
        subtitle="Kirim data CSV teks sesuai header: nama_jenis,nama_ikan,berat_kg,catatan"
        headerFormat="nama_jenis,nama_ikan,berat_kg,catatan"
        placeholderText={
          "nama_jenis,nama_ikan,berat_kg,catatan\nTongkol,Tongkol Super,1.5,Kualitas ekspor"
        }
        onClose={closeImportModal}
        onImport={handleImportCsv}
      />

      <ConfirmDeleteModal
        open={isDeleteOpen}
        title="Hapus Data Sampel Ikan"
        itemName={deleteTarget?.name}
        message="Apakah Anda yakin ingin menghapus data sampel ikan ini?"
        onClose={cancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
