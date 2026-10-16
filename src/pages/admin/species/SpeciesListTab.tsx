import { useEffect, useState } from "react";
import { DataTable, type Column } from "../../../components/DataTable";
import { CrudActions } from "../../../components/FormField";
import { CrudModal } from "../../../components/CrudModal";
import { useCrudModal } from "../../../components/useCrudModal";
import { ConfirmDeleteModal } from "../../../components/ConfirmDeleteModal";
import { useConfirmDelete } from "../../../components/useConfirmDelete";
import { PageToolbar } from "../../../components/PageToolbar";
import { AlertBanner, TextField, TextareaField } from "../../../components/ui";
import { CsvImportModal } from "./CsvImportModal";
import {
  fishSpeciesService,
  type CreateFishSpeciesPayload,
  type FishSpecies,
} from "../../../services/fish";
import { Download, FileUp } from "lucide-react";

export function SpeciesListTab() {
  const [speciesList, setSpeciesList] = useState<FishSpecies[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const {
    target: deleteTarget,
    open: isDeleteOpen,
    requestDelete,
    cancelDelete,
  } = useConfirmDelete<{ id: number; name: string }>();

  const speciesModal = useCrudModal();
  const importModal = useCrudModal();
  const [editingSpeciesId, setEditingSpeciesId] = useState<number | null>(null);
  const [speciesForm, setSpeciesForm] = useState<CreateFishSpeciesPayload>({
    name: "",
    scientific_name: "",
    description: "",
  });

  const fetchSpecies = async (query?: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await fishSpeciesService.getAll(query);
      setSpeciesList(data);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Gagal memuat spesies ikan",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSpecies(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleSpeciesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!speciesForm.name.trim()) return;
    setSubmitting(true);
    setErrorMsg(null);
    try {
      if (editingSpeciesId) {
        await fishSpeciesService.update(editingSpeciesId, speciesForm);
        setToastMsg(`Spesies "${speciesForm.name}" berhasil diperbarui.`);
      } else {
        await fishSpeciesService.create(speciesForm);
        setToastMsg(`Spesies baru "${speciesForm.name}" berhasil ditambahkan.`);
      }
      setTimeout(() => setToastMsg(null), 3000);
      speciesModal.closeModal();
      fetchSpecies(search);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Gagal menyimpan spesies ikan",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fishSpeciesService.delete(deleteTarget.id);
      setToastMsg(`Spesies "${deleteTarget.name}" berhasil dihapus.`);
      setTimeout(() => setToastMsg(null), 3000);
      cancelDelete();
      fetchSpecies(search);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Gagal menghapus spesies",
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleImportCsv = async (csvData: string, clearExisting: boolean) => {
    const res = await fishSpeciesService.importSpecies(csvData, clearExisting);
    setToastMsg(
      `Impor selesai: ${res.created} dibuat, ${res.updated} diperbarui, ${res.errors} kesalahan.`,
    );
    setTimeout(() => setToastMsg(null), 4000);
    fetchSpecies(search);
  };

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
      render: (r) => (
        <span className="text-sm text-soft">{r.description || "—"}</span>
      ),
    },
    {
      key: "aksi",
      header: "Aksi",
      flex: 1,
      align: "right",
      render: (r) => (
        <CrudActions
          onEdit={() => {
            setEditingSpeciesId(r.id);
            setSpeciesForm({
              name: r.name,
              scientific_name: r.scientific_name || "",
              description: r.description || "",
            });
            speciesModal.openModal();
          }}
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
        onAdd={() => {
          setEditingSpeciesId(null);
          setSpeciesForm({ name: "", scientific_name: "", description: "" });
          speciesModal.openModal();
        }}
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
              onClick={importModal.openModal}
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

      <section className="surface-card border rounded-xl p-6 shadow-xs">
        <DataTable
          columns={speciesCols}
          rows={speciesList}
          rowKey={(r) => String(r.id)}
          loading={loading}
          emptyText="Belum ada data spesies ikan terdaftar di server."
        />
      </section>

      <CrudModal
        open={speciesModal.open}
        title={editingSpeciesId ? "Ubah Spesies Ikan" : "Tambah Spesies Ikan"}
        subtitle="Daftarkan jenis ikan baru ke katalog resmi."
        onClose={speciesModal.closeModal}
        onSubmit={handleSpeciesSubmit}
        submitLabel={
          submitting
            ? "Menyimpan..."
            : editingSpeciesId
              ? "Perbarui Spesies"
              : "Simpan Spesies"
        }
      >
        <TextField
          label="Nama Ikan (Unik)"
          id="sp-name"
          required
          disabled={submitting}
          value={speciesForm.name}
          onChange={(e) =>
            setSpeciesForm({ ...speciesForm, name: e.target.value })
          }
          placeholder="Contoh: Tuna Sirip Kuning"
        />
        <TextField
          label="Nama Ilmiah (Taksonomi)"
          id="sp-sci"
          optional
          disabled={submitting}
          value={speciesForm.scientific_name || ""}
          onChange={(e) =>
            setSpeciesForm({ ...speciesForm, scientific_name: e.target.value })
          }
          placeholder="Contoh: Thunnus albacares"
        />
        <TextareaField
          label="Deskripsi Spesies"
          id="sp-desc"
          optional
          rows={3}
          disabled={submitting}
          value={speciesForm.description || ""}
          onChange={(e) =>
            setSpeciesForm({ ...speciesForm, description: e.target.value })
          }
          placeholder="Karakteristik habitat, ukuran umum, atau musim..."
        />
      </CrudModal>

      <CsvImportModal
        open={importModal.open}
        title="Impor Spesies dari CSV"
        subtitle="Kirim data CSV teks sesuai header resmi: name,scientific_name,description"
        headerFormat="name,scientific_name,description"
        placeholderText={
          "name,scientific_name,description\nTongkol,Euthynnus affinis,Ikan pelagis bernilai ekonomis\nCakalang,Katsuwonus pelamis,Ikan pelagis cepat berenang"
        }
        onClose={importModal.closeModal}
        onImport={handleImportCsv}
      />

      <ConfirmDeleteModal
        open={isDeleteOpen}
        title="Hapus Spesies Ikan"
        itemName={deleteTarget?.name}
        message="Apakah Anda yakin ingin menghapus katalog spesies ini? Data tangkapan dan acuan harga yang merujuk spesies ini dapat terpengaruh."
        loading={deleting}
        onClose={cancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
