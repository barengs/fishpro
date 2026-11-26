import { useCallback } from "react";
import { PageHeader } from "../../components/PageHeader";
import { PageToolbar } from "../../components/PageToolbar";
import { DataTable, type Column } from "../../components/DataTable";
import { CrudActions } from "../../components/FormField";
import { ConfirmDeleteModal } from "../../components/ConfirmDeleteModal";
import { DetailModal } from "../../components/DetailModal";
import { AlertBanner } from "../../components/ui";
import { AreaModal } from "../../components/modals/AreaModal";
import { TemplateDropdown } from "../../components/TemplateDropdown";
import { CsvImportModal } from "./species/CsvImportModal";
import { WppMapViewer } from "../../components/map/WppMapViewer";
import { regionsService, type FishingArea } from "../../services/regions";
import { FileUp } from "lucide-react";
import { useAreasManager } from "./hooks/useAreasManager";

export function AreasPage() {
  const {
    rows,
    loading,
    search,
    setSearch,
    editingArea,
    selectedDetailArea,
    setSelectedDetailArea,
    errorMsg,
    setErrorMsg,
    toastMsg,
    setToastMsg,
    deleting,
    isAreaModalOpen,
    closeAreaModal,
    handleOpenAdd,
    handleOpenEdit,
    handleModalSubmit,
    isImportModalOpen,
    openImportModal,
    closeImportModal,
    handleCsvImport,
    deleteTarget,
    isDeleteOpen,
    cancelDelete,
    requestDelete,
    handleConfirmDelete,
  } = useAreasManager();

  const cols: Column<FishingArea>[] = [
    {
      key: "nama",
      header: "Nama Wilayah / Kode",
      flex: 3,
      render: (r) => (
        <div>
          <div className="text-sm font-semibold">{r.nama}</div>
          <div className="text-xs text-fco-blue font-mono font-medium">
            {r.code}
          </div>
        </div>
      ),
    },
    {
      key: "desc",
      header: "Deskripsi Cakupan",
      flex: 4,
      hideOnMobile: true,
      render: (r) => (
        <span
          className="text-sm text-soft line-clamp-1 max-w-md block"
          title={r.deskripsi || ""}
        >
          {r.deskripsi || "—"}
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
          onDetail={() => setSelectedDetailArea(r)}
          onEdit={() => handleOpenEdit(r)}
          onDelete={() => requestDelete({ id: r.id, name: r.nama })}
        />
      ),
    },
  ];

  const handleSelectWppFromMap = useCallback(
    (wppCode: string) => {
      if (!wppCode) {
        setSearch("");
        return;
      }
      setSearch((prev) => (prev.trim() === wppCode ? "" : wppCode));
    },
    [setSearch],
  );

  return (
    <div>
      <PageHeader
        title="Wilayah Pengelolaan Perikanan (WPP)"
        desc="Daftar resmi Wilayah Pengelolaan Perikanan Negara Republik Indonesia (WPPNRI)."
      />

      {/* Peta Wilayah WPP Nasional */}
      <div className="mb-6">
        <WppMapViewer
          role="admin"
          selectedWpp={search}
          onSelectWpp={handleSelectWppFromMap}
        />
      </div>

      <PageToolbar
        searchPlaceholder="Cari WPP..."
        searchValue={search}
        onSearchChange={setSearch}
        addLabel="Tambah Wilayah"
        onAdd={handleOpenAdd}
        extraActions={
          <>
            <TemplateDropdown
              label="Unduh Template"
              options={[
                {
                  label: "Template WPP (CSV)",
                  format: "csv",
                  url: regionsService.getDownloadTemplateUrl("csv"),
                  filename: "template_wpp.csv",
                },
                {
                  label: "Template WPP (Excel)",
                  format: "excel",
                  url: regionsService.getDownloadTemplateUrl("excel"),
                  filename: "template_wpp.xlsx",
                },
              ]}
            />
            <button
              type="button"
              onClick={openImportModal}
              className="inline-flex items-center justify-center gap-2 h-[46px] px-4 rounded-[12px] text-sm font-semibold border border-[#d9dee8] dark:border-[#2a3753] bg-white dark:bg-[#0f1729] hover:bg-[#f1f4f9] dark:hover:bg-[#141d33] text-[#0f172a] dark:text-[#e8edf7] transition-colors cursor-pointer whitespace-nowrap"
            >
              <FileUp
                size={16}
                className="text-emerald-600 dark:text-emerald-400"
                aria-hidden="true"
              />
              <span>Impor File CSV</span>
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
        columns={cols}
        rows={rows}
        rowKey={(r) => String(r.id)}
        loading={loading}
        emptyText="Belum ada wilayah penangkapan terdaftar di server."
        onRowClick={(r) => setSelectedDetailArea(r)}
      />

      <DetailModal
        open={Boolean(selectedDetailArea)}
        title={selectedDetailArea?.nama || "Detail Wilayah"}
        onClose={() => setSelectedDetailArea(null)}
        fields={[
          {
            label: "Nama Wilayah",
            value: selectedDetailArea?.nama,
          },
          {
            label: "Kode WPP",
            value: (
              <span className="font-mono font-bold text-fco-blue">
                {selectedDetailArea?.code}
              </span>
            ),
          },
          {
            label: "Cakupan Geografis",
            value:
              selectedDetailArea?.deskripsi ||
              "Tidak ada deskripsi cakupan wilayah.",
            fullWidth: true,
          },
        ]}
      />

      <AreaModal
        open={isAreaModalOpen}
        onClose={closeAreaModal}
        onSubmit={handleModalSubmit}
        editingArea={editingArea}
      />

      <CsvImportModal
        open={isImportModalOpen}
        title="Impor Wilayah (WPP) dari CSV"
        subtitle="Kirim data CSV teks sesuai format resmi: nama, code, deskripsi"
        headerFormat="nama,code,deskripsi"
        placeholderText={
          "nama,code,deskripsi\nSelat Malaka,WPP 571,Wilayah barat Sumatera\nLaut Jawa,WPP 712,Perairan dangkal produktif"
        }
        onClose={closeImportModal}
        onImport={handleCsvImport}
      />

      <ConfirmDeleteModal
        open={isDeleteOpen}
        title="Hapus Wilayah Tangkapan (WPP)"
        itemName={deleteTarget?.name}
        message="Apakah Anda yakin ingin menghapus data wilayah pengelolaan perikanan ini?"
        loading={deleting}
        onClose={cancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
