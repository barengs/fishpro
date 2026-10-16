import { useEffect, useState } from "react";
import { DataTable, type Column } from "../../../components/DataTable";
import { CrudActions } from "../../../components/FormField";
import { CrudModal } from "../../../components/CrudModal";
import { useCrudModal } from "../../../components/useCrudModal";
import { ConfirmDeleteModal } from "../../../components/ConfirmDeleteModal";
import { useConfirmDelete } from "../../../components/useConfirmDelete";
import { PageToolbar } from "../../../components/PageToolbar";
import {
  AlertBanner,
  SelectField,
  TextField,
  TextareaField,
} from "../../../components/ui";
import { CsvImportModal } from "./CsvImportModal";
import {
  fishService,
  fishSpeciesService,
  type CreateFishPayload,
  type Fish,
  type FishSpecies,
} from "../../../services/fish";
import { Download, FileUp } from "lucide-react";

export function FishListTab() {
  const [fishList, setFishList] = useState<Fish[]>([]);
  const [speciesList, setSpeciesList] = useState<FishSpecies[]>([]);
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

  const fishModal = useCrudModal();
  const importModal = useCrudModal();
  const [editingFishId, setEditingFishId] = useState<number | null>(null);
  const [fishForm, setFishForm] = useState<CreateFishPayload>({
    species: 0,
    name: "",
    weight: "",
    notes: "",
  });

  const fetchData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const [fishData, spData] = await Promise.all([
        fishService.getAll(),
        fishSpeciesService.getAll(),
      ]);
      setFishList(fishData);
      setSpeciesList(spData);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Gagal memuat data sampel ikan",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function loadInitial() {
      try {
        const [fishData, spData] = await Promise.all([
          fishService.getAll(),
          fishSpeciesService.getAll(),
        ]);
        if (!ignore) {
          setFishList(fishData);
          setSpeciesList(spData);
        }
      } catch (err: unknown) {
        if (!ignore) {
          setErrorMsg(
            err instanceof Error
              ? err.message
              : "Gagal memuat data sampel ikan",
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    loadInitial();
    return () => {
      ignore = true;
    };
  }, []);

  const handleFishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fishForm.species) {
      setErrorMsg("Harap pilih jenis spesies ikan.");
      return;
    }
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const payload: CreateFishPayload = {
        ...fishForm,
        weight: fishForm.weight ? parseFloat(String(fishForm.weight)) : null,
      };
      if (editingFishId) {
        await fishService.update(editingFishId, payload);
        setToastMsg("Data ikan berhasil diperbarui.");
      } else {
        await fishService.create(payload);
        setToastMsg("Data ikan individu baru berhasil ditambahkan.");
      }
      setTimeout(() => setToastMsg(null), 3000);
      fishModal.closeModal();
      fetchData();
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Gagal menyimpan data ikan",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fishService.delete(deleteTarget.id);
      setToastMsg(`Data ikan ${deleteTarget.name} berhasil dihapus.`);
      setTimeout(() => setToastMsg(null), 3000);
      cancelDelete();
      fetchData();
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Gagal menghapus data ikan",
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleImportCsv = async (csvData: string, clearExisting: boolean) => {
    const res = await fishService.importFish(csvData, clearExisting);
    setToastMsg(
      `Impor selesai: ${res.created} dibuat, ${res.updated} diperbarui, ${res.errors} kesalahan.`,
    );
    setTimeout(() => setToastMsg(null), 4000);
    fetchData();
  };

  const fishCols: Column<Fish>[] = [
    {
      key: "name",
      header: "Nama Ikan / Spesies",
      flex: 3,
      render: (r) => (
        <div>
          <div className="text-sm font-semibold">
            {r.name || "Ikan Tanpa Label"}
          </div>
          <div className="text-xs text-fco-blue font-medium">
            {r.species_name || `Spesies #${r.species}`}
          </div>
        </div>
      ),
    },
    {
      key: "weight",
      header: "Berat",
      flex: 2,
      align: "right",
      render: (r) => (
        <span className="text-sm tabular-nums font-semibold">
          {r.weight ? `${r.weight} kg` : "—"}
        </span>
      ),
    },
    {
      key: "notes",
      header: "Catatan",
      flex: 3,
      render: (r) => (
        <span className="text-xs text-soft">{r.notes || "—"}</span>
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
            setEditingFishId(r.id);
            setFishForm({
              species: r.species,
              name: r.name || "",
              weight: r.weight ?? "",
              notes: r.notes || "",
            });
            fishModal.openModal();
          }}
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
        onAdd={() => {
          setEditingFishId(null);
          setFishForm({
            species: speciesList.length > 0 ? speciesList[0].id : 0,
            name: "",
            weight: "",
            notes: "",
          });
          fishModal.openModal();
        }}
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
              onClick={importModal.openModal}
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
        />
      </section>

      <CrudModal
        open={fishModal.open}
        title={editingFishId ? "Ubah Data Ikan" : "Tambah Ikan Individu"}
        subtitle="Catat sampel ikan individu dengan spesifikasi berat."
        onClose={fishModal.closeModal}
        onSubmit={handleFishSubmit}
        submitLabel={
          submitting
            ? "Menyimpan..."
            : editingFishId
              ? "Perbarui Data"
              : "Simpan Data"
        }
      >
        <SelectField
          label="Spesies Ikan"
          id="fi-species"
          required
          disabled={submitting || speciesList.length === 0}
          value={fishForm.species}
          onChange={(e) =>
            setFishForm({ ...fishForm, species: Number(e.target.value) })
          }
          options={
            speciesList.length === 0
              ? [
                  {
                    value: "",
                    label: "Belum ada spesies (tambahkan spesies dulu)",
                  },
                ]
              : speciesList.map((sp) => ({
                  value: sp.id,
                  label: `${sp.name} ${sp.scientific_name ? `(${sp.scientific_name})` : ""}`,
                }))
          }
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <TextField
            label="Nama / Label Sampel"
            id="fi-name"
            optional
            disabled={submitting}
            value={fishForm.name || ""}
            onChange={(e) => setFishForm({ ...fishForm, name: e.target.value })}
            placeholder="Contoh: Tuna Grade A"
          />
          <TextField
            label="Berat (kg)"
            id="fi-weight"
            type="number"
            step="0.01"
            optional
            disabled={submitting}
            value={fishForm.weight ?? ""}
            onChange={(e) =>
              setFishForm({ ...fishForm, weight: e.target.value })
            }
            placeholder="Contoh: 15.5"
          />
        </div>
        <TextareaField
          label="Catatan Kualitas / Kondisi"
          id="fi-notes"
          optional
          rows={2}
          disabled={submitting}
          value={fishForm.notes || ""}
          onChange={(e) => setFishForm({ ...fishForm, notes: e.target.value })}
          placeholder="Kualitas kesegaran, lokasi penangkapan khusus, dll..."
        />
      </CrudModal>

      <CsvImportModal
        open={importModal.open}
        title="Impor Ikan dari CSV"
        subtitle="Kirim data CSV teks sesuai header: nama_jenis,nama_ikan,berat_kg,catatan"
        headerFormat="nama_jenis,nama_ikan,berat_kg,catatan"
        placeholderText={
          "nama_jenis,nama_ikan,berat_kg,catatan\nTongkol,Tongkol Super,1.5,Kualitas ekspor"
        }
        onClose={importModal.closeModal}
        onImport={handleImportCsv}
      />

      <ConfirmDeleteModal
        open={isDeleteOpen}
        title="Hapus Data Sampel Ikan"
        itemName={deleteTarget?.name}
        message="Apakah Anda yakin ingin menghapus data sampel ikan ini?"
        loading={deleting}
        onClose={cancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
