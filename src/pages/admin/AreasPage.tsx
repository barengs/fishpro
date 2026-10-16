import { useEffect, useState } from "react";
import { PageToolbar } from "../../components/PageToolbar";
import { DataTable, type Column } from "../../components/DataTable";
import { CrudActions } from "../../components/FormField";
import { useCrudModal } from "../../components/useCrudModal";
import { ConfirmDeleteModal } from "../../components/ConfirmDeleteModal";
import { useConfirmDelete } from "../../components/useConfirmDelete";
import { DetailModal } from "../../components/DetailModal";
import { AlertBanner } from "../../components/ui";
import { AreaModal } from "../../components/modals/AreaModal";
import { TemplateDropdown } from "../../components/TemplateDropdown";
import { CsvImportModal } from "./species/CsvImportModal";
import {
  regionsService,
  type CreateFishingAreaPayload,
  type FishingArea,
} from "../../services/regions";
import { FileUp } from "lucide-react";

export function AreasPage() {
  const [rows, setRows] = useState<FishingArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingArea, setEditingArea] = useState<FishingArea | null>(null);
  const [selectedDetailArea, setSelectedDetailArea] =
    useState<FishingArea | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const {
    target: deleteTarget,
    open: isDeleteOpen,
    requestDelete,
    cancelDelete,
  } = useConfirmDelete<{ id: number; name: string }>();

  const areaModal = useCrudModal();
  const importModal = useCrudModal();

  const fetchAreas = async (query?: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await regionsService.getAll(query);
      setRows(data);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Gagal memuat data WPP");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAreas(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleOpenAdd = () => {
    setEditingArea(null);
    setErrorMsg(null);
    areaModal.openModal();
  };

  const handleOpenEdit = (area: FishingArea) => {
    setEditingArea(area);
    setErrorMsg(null);
    areaModal.openModal();
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await regionsService.delete(deleteTarget.id);
      setToastMsg(`Wilayah "${deleteTarget.name}" berhasil dihapus.`);
      setTimeout(() => setToastMsg(null), 3000);
      cancelDelete();
      fetchAreas(search);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Gagal menghapus wilayah",
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleModalSubmit = async (payload: CreateFishingAreaPayload) => {
    if (editingArea) {
      await regionsService.update(editingArea.id, payload);
      setToastMsg(`Wilayah "${payload.nama}" berhasil diperbarui.`);
    } else {
      await regionsService.create(payload);
      setToastMsg(`Wilayah baru "${payload.nama}" berhasil ditambahkan.`);
    }
    setTimeout(() => setToastMsg(null), 3000);
    fetchAreas(search);
  };

  const handleCsvImport = async (csvData: string, clearExisting: boolean) => {
    const res = await regionsService.importAreas(csvData, clearExisting);
    setToastMsg(
      `Impor selesai: ${res.created} dibuat, ${res.updated} diperbarui, ${res.errors} kesalahan.`,
    );
    setTimeout(() => setToastMsg(null), 4000);
    fetchAreas(search);
  };

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

  return (
    <div>
      <PageToolbar
        title="Wilayah Pengelolaan Perikanan (WPP)"
        desc="Daftar resmi Wilayah Pengelolaan Perikanan Negara Republik Indonesia (WPPNRI)."
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
              onClick={importModal.openModal}
              className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-fco text-xs sm:text-sm font-semibold border border-fco-border dark:border-fco-border-dark surface-card hover:surface-page text-strong transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
            >
              <FileUp
                size={14}
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

      <section className="surface-card border rounded-xl p-6 shadow-xs">
        <DataTable
          columns={cols}
          rows={rows}
          rowKey={(r) => String(r.id)}
          loading={loading}
          emptyText="Belum ada wilayah penangkapan terdaftar di server."
          onRowClick={(r) => setSelectedDetailArea(r)}
        />
      </section>

      <DetailModal
        open={Boolean(selectedDetailArea)}
        title={selectedDetailArea?.nama || "Detail Wilayah (WPP)"}
        subtitle="Rincian informasi Wilayah Pengelolaan Perikanan Negara Republik Indonesia."
        badge={
          selectedDetailArea ? (
            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-fco-blue">
              Kode: {selectedDetailArea.code}
            </span>
          ) : undefined
        }
        onClose={() => setSelectedDetailArea(null)}
        actions={
          selectedDetailArea && (
            <button
              type="button"
              onClick={() => {
                const target = selectedDetailArea;
                setSelectedDetailArea(null);
                handleOpenEdit(target);
              }}
              className="h-10 px-4 rounded-xl border border-fco-border dark:border-fco-border-dark surface-card hover:surface-page text-sm font-semibold text-fco-blue cursor-pointer transition-colors"
            >
              Ubah Data
            </button>
          )
        }
        fields={[
          {
            label: "Nama Wilayah Resmi",
            value: selectedDetailArea?.nama,
          },
          {
            label: "Kode Singkat / Wilayah",
            value: (
              <span className="font-mono font-bold text-fco-blue">
                {selectedDetailArea?.code}
              </span>
            ),
          },
          {
            label: "Deskripsi Lengkap Cakupan Geografis",
            value:
              selectedDetailArea?.deskripsi ||
              "Tidak ada deskripsi cakupan wilayah.",
            fullWidth: true,
          },
        ]}
      />

      <AreaModal
        open={areaModal.open}
        onClose={areaModal.closeModal}
        onSubmit={handleModalSubmit}
        editingArea={editingArea}
      />

      <CsvImportModal
        open={importModal.open}
        title="Impor Wilayah (WPP) dari CSV"
        subtitle="Kirim data CSV teks sesuai format resmi: nama,code,deskripsi"
        headerFormat="nama,code,deskripsi"
        placeholderText={
          "nama,code,deskripsi\nSelat Malaka,WPP 571,Wilayah barat Sumatera\nLaut Jawa,WPP 712,Perairan dangkal produktif"
        }
        onClose={importModal.closeModal}
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
