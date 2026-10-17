import { useEffect, useState } from "react";
import { Download, FileUp } from "lucide-react";
import { DataTable, type Column } from "../../../components/DataTable";
import { CrudActions } from "../../../components/FormField";
import { useCrudModal } from "../../../components/useCrudModal";
import { ConfirmDeleteModal } from "../../../components/ConfirmDeleteModal";
import { useConfirmDelete } from "../../../components/useConfirmDelete";
import { DetailModal } from "../../../components/DetailModal";
import { useDetailModal } from "../../../components/useDetailModal";
import { PageToolbar } from "../../../components/PageToolbar";
import { AlertBanner } from "../../../components/ui";
import { CsvImportModal } from "./CsvImportModal";
import { FishModal } from "./FishModal";
import {
  fishService,
  fishSpeciesService,
  type CreateFishPayload,
  type Fish,
  type FishSpecies,
} from "../../../services/fish";

export function FishListTab() {
  const [fishList, setFishList] = useState<Fish[]>([]);
  const [speciesList, setSpeciesList] = useState<FishSpecies[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [editingFish, setEditingFish] = useState<Fish | null>(null);
  const {
    target: deleteTarget,
    open: isDeleteOpen,
    requestDelete,
    cancelDelete,
  } = useConfirmDelete<{ id: number; name: string }>();
  const {
    selected: selectedFish,
    open: isDetailOpen,
    openDetail,
    closeDetail,
  } = useDetailModal<Fish>();

  const fishModal = useCrudModal();
  const importModal = useCrudModal();

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

  const handleFishSubmit = async (payload: CreateFishPayload) => {
    if (editingFish) {
      await fishService.update(editingFish.id, payload);
      setToastMsg("Data ikan berhasil diperbarui.");
    } else {
      await fishService.create(payload);
      setToastMsg("Data ikan baru berhasil ditambahkan.");
    }
    setTimeout(() => setToastMsg(null), 3000);
    fetchData();
  };

  const handleImportCsv = async (
    csvText: string,
    clearExisting: boolean,
  ): Promise<void> => {
    const res = await fishService.importFish(csvText, clearExisting);
    setToastMsg(
      res.message || `Berhasil mengimpor ${res.created || 0} sampel ikan.`,
    );
    setTimeout(() => setToastMsg(null), 3000);
    fetchData();
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const targetId = deleteTarget.id;
    try {
      await fishService.delete(targetId);
      setFishList((prev) => prev.filter((r) => r.id !== targetId));
      setToastMsg(`Data ikan ${deleteTarget.name} berhasil dihapus.`);
      setTimeout(() => setToastMsg(null), 3000);
      cancelDelete();
      fetchData();
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Gagal menghapus data ikan",
      );
    }
  };

  const fishCols: Column<Fish>[] = [
    {
      key: "id",
      header: "ID",
      flex: 1,
      render: (r) => (
        <span className="font-mono text-xs text-soft">#{r.id}</span>
      ),
    },
    {
      key: "species",
      header: "Spesies",
      flex: 2,
      render: (r) => (
        <div className="font-semibold text-strong">
          {r.species_name || `Spesies #${r.species}`}
        </div>
      ),
    },
    {
      key: "name",
      header: "Nama / Label",
      flex: 2,
      render: (r) => (
        <span className="text-strong font-medium">{r.name || "—"}</span>
      ),
    },
    {
      key: "weight",
      header: "Berat (kg)",
      flex: 1,
      align: "right",
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
          onEdit={() => {
            setEditingFish(r);
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
          setEditingFish(null);
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
        open={fishModal.open}
        editingFish={editingFish}
        speciesList={speciesList}
        onClose={fishModal.closeModal}
        onSubmit={handleFishSubmit}
      />

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
        onClose={cancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
