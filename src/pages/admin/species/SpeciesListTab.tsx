import { DataTable, type Column } from "../../../components/DataTable";
import { CrudActions } from "../../../components/FormField";
import { CrudModal } from "../../../components/CrudModal";
import { ConfirmDeleteModal } from "../../../components/ConfirmDeleteModal";
import { DetailModal } from "../../../components/DetailModal";
import { PageToolbar } from "../../../components/PageToolbar";
import { AlertBanner, TextField, TextareaField } from "../../../components/ui";
import { CsvImportModal } from "./CsvImportModal";
import { fishSpeciesService, type FishSpecies } from "../../../services/fish";
import { Download, FileUp } from "lucide-react";
import { useSpeciesList } from "./hooks/useSpeciesList";

export function SpeciesListTab() {
  const {
    speciesList,
    search,
    setSearch,
    loading,
    errorMsg,
    setErrorMsg,
    toastMsg,
    setToastMsg,
    submitting,
    deleting,
    editingSpeciesId,
    speciesForm,
    setSpeciesForm,
    isSpeciesModalOpen,
    closeSpeciesModal,
    handleOpenAdd,
    handleOpenEdit,
    handleSpeciesSubmit,
    isImportModalOpen,
    openImportModal,
    closeImportModal,
    handleImportCsv,
    selectedSpecies,
    isDetailOpen,
    openDetail,
    closeDetail,
    deleteTarget,
    isDeleteOpen,
    requestDelete,
    cancelDelete,
    handleConfirmDelete,
  } = useSpeciesList();

  const speciesCols: Column<FishSpecies>[] = [
    {
      key: "name",
      header: "Nama Ikan / Ilmiah",
      flex: 3,
      render: (r) => (
        <div>
          <div className="text-sm font-semibold">{r.name}</div>
          <div className="text-xs text-soft italic">
            {r.scientific_name || "—"}
          </div>
        </div>
      ),
    },
    {
      key: "desc",
      header: "Deskripsi / Karakteristik",
      flex: 4,
      hideOnMobile: true,
      render: (r) => (
        <span
          className="text-sm text-soft line-clamp-2 max-w-md block"
          title={r.description || ""}
        >
          {r.description || "—"}
        </span>
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
          onDelete={() => requestDelete({ id: r.id, name: r.name })}
        />
      ),
    },
  ];

  return (
    <div>
      <PageToolbar
        searchPlaceholder="Cari nama spesies atau ilmiah..."
        searchValue={search}
        onSearchChange={setSearch}
        addLabel="Tambah Spesies"
        onAdd={handleOpenAdd}
        extraActions={
          <>
            <a
              href={fishSpeciesService.getTemplateUrl()}
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
              <span>Impor Spesies</span>
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

      <DataTable
        columns={speciesCols}
        rows={speciesList}
        rowKey={(r) => String(r.id)}
        loading={loading}
        emptyText="Belum ada data spesies ikan terdaftar di server."
        onRowClick={openDetail}
      />

      <DetailModal
        open={isDetailOpen}
        title={selectedSpecies?.name || "Detail Spesies Ikan"}
        subtitle="Informasi taksonomi biologis dan klasifikasi resmi spesies perikanan."
        badge={
          selectedSpecies?.scientific_name ? (
            <span className="font-mono italic text-xs font-semibold px-2.5 py-0.5 rounded-xs bg-blue-500/10 text-fco-blue">
              {selectedSpecies.scientific_name}
            </span>
          ) : undefined
        }
        onClose={closeDetail}
        actions={
          selectedSpecies && (
            <button
              type="button"
              onClick={() => {
                const target = selectedSpecies;
                closeDetail();
                handleOpenEdit(target);
              }}
              className="h-9 px-3.5 rounded-xs border border-fco-border-subtle surface-inset hover:surface-page text-xs font-semibold text-fco-blue cursor-pointer transition-colors"
            >
              Ubah Data
            </button>
          )
        }
        fields={[
          {
            label: "Nama Umum Ikan",
            value: selectedSpecies?.name,
          },
          {
            label: "Nama Ilmiah (Taksonomi)",
            value: (
              <span className="italic font-semibold text-strong">
                {selectedSpecies?.scientific_name || "—"}
              </span>
            ),
          },
          {
            label: "Deskripsi & Karakteristik",
            value:
              selectedSpecies?.description ||
              "Tidak ada deskripsi tambahan untuk spesies ini.",
            fullWidth: true,
          },
        ]}
      />

      <CrudModal
        open={isSpeciesModalOpen}
        title={
          editingSpeciesId ? "Ubah Data Spesies" : "Tambah Spesies Ikan Baru"
        }
        subtitle="Informasi taksonomi spesies ikan resmi."
        onClose={closeSpeciesModal}
        onSubmit={handleSpeciesSubmit}
        submitLabel={submitting ? "Menyimpan..." : "Simpan Spesies"}
      >
        <div className="flex flex-col gap-3.5">
          <TextField
            label="Nama Ikan"
            id="sp-name"
            required
            value={speciesForm.name}
            onChange={(e) =>
              setSpeciesForm({ ...speciesForm, name: e.target.value })
            }
            placeholder="Contoh: Tongkol Krai"
          />
          <TextField
            label="Nama Ilmiah (Opsional)"
            id="sp-sci"
            value={speciesForm.scientific_name ?? ""}
            onChange={(e) =>
              setSpeciesForm({
                ...speciesForm,
                scientific_name: e.target.value,
              })
            }
            placeholder="Contoh: Auxis thazard"
          />
          <TextareaField
            label="Deskripsi / Karakteristik"
            id="sp-desc"
            rows={3}
            value={speciesForm.description ?? ""}
            onChange={(e) =>
              setSpeciesForm({ ...speciesForm, description: e.target.value })
            }
            placeholder="Karakteristik habitat, ukuran umum, atau catatan perikanan..."
          />
        </div>
      </CrudModal>

      <CsvImportModal
        open={isImportModalOpen}
        title="Impor Spesies Ikan dari CSV"
        subtitle="Format header CSV: name,scientific_name,description"
        headerFormat="name,scientific_name,description"
        placeholderText={
          "name,scientific_name,description\nTongkol Krai,Auxis thazard,Ikan pelagis kecil perairan tropis\nCakalang,Katsuwonus pelamis,Tuna pelagis perairan terbuka"
        }
        onClose={closeImportModal}
        onImport={handleImportCsv}
      />

      <ConfirmDeleteModal
        open={isDeleteOpen}
        title="Hapus Spesies Ikan"
        itemName={deleteTarget?.name}
        message="Apakah Anda yakin ingin menghapus data spesies ikan ini? Tindakan ini dapat mempengaruhi data tangkapan terkait."
        loading={deleting}
        onClose={cancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
