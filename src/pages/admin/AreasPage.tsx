import { useEffect, useState } from "react";
import { PageToolbar } from "../../components/PageToolbar";
import { DataTable, type Column } from "../../components/DataTable";
import { CrudActions } from "../../components/FormField";
import { useCrudModal } from "../../components/useCrudModal";
import { AlertBanner } from "../../components/ui";
import { AreaModal } from "../../components/modals/AreaModal";
import { CsvImportModal } from "./species/CsvImportModal";
import {
  regionsService,
  type CreateFishingAreaPayload,
  type FishingArea,
} from "../../services/regions";
import { Download, FileUp } from "lucide-react";

export function AreasPage() {
  const [rows, setRows] = useState<FishingArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingArea, setEditingArea] = useState<FishingArea | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

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

  const handleDelete = async (id: number, nama: string) => {
    if (!window.confirm(`Yakin ingin menghapus wilayah "${nama}"?`)) return;
    try {
      await regionsService.delete(id);
      setToastMsg(`Wilayah "${nama}" berhasil dihapus.`);
      setTimeout(() => setToastMsg(null), 3000);
      fetchAreas(search);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal menghapus wilayah");
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
        <span className="text-sm text-soft">{r.deskripsi || "—"}</span>
      ),
    },
    {
      key: "aksi",
      header: "Aksi",
      flex: 1,
      align: "right",
      render: (r) => (
        <CrudActions
          onEdit={() => handleOpenEdit(r)}
          onDelete={() => handleDelete(r.id, r.nama)}
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
      />

      {/* CSV Actions */}
      <div className="flex gap-2.5 mb-5 flex-wrap">
        <a
          href={regionsService.getDownloadTemplateUrl("csv")}
          download
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-fco-border surface-card hover:surface-inset transition-colors no-underline text-strong shadow-2xs"
        >
          <Download size={14} className="text-fco-blue" aria-hidden="true" />
          <span>Unduh Template CSV WPP</span>
        </a>
        <a
          href={regionsService.getDownloadTemplateUrl("excel")}
          download
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-fco-border surface-card hover:surface-inset transition-colors no-underline text-strong shadow-2xs"
        >
          <Download size={14} className="text-emerald-600" aria-hidden="true" />
          <span>Unduh Template Excel WPP</span>
        </a>
        <button
          type="button"
          onClick={importModal.openModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-fco-border surface-card hover:surface-inset transition-colors cursor-pointer text-strong shadow-2xs"
        >
          <FileUp size={14} className="text-emerald-600" aria-hidden="true" />
          <span>Impor WPP dari CSV</span>
        </button>
      </div>

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
        />
      </section>

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
    </div>
  );
}
