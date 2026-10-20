import { useCallback, useEffect, useState } from "react";
import { useCrudModal } from "../../../../components/useCrudModal";
import { useConfirmDelete } from "../../../../components/useConfirmDelete";
import { useDetailModal } from "../../../../components/useDetailModal";
import {
  fishService,
  fishSpeciesService,
  type CreateFishPayload,
  type Fish,
  type FishSpecies,
} from "../../../../services/fish";

export function useFishList() {
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

  const fetchData = useCallback(async () => {
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
  }, []);

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

  const handleOpenAdd = () => {
    setEditingFish(null);
    fishModal.openModal();
  };

  const handleOpenEdit = (f: Fish) => {
    setEditingFish(f);
    fishModal.openModal();
  };

  const handleFishSubmit = async (payload: CreateFishPayload) => {
    try {
      if (editingFish) {
        await fishService.update(editingFish.id, payload);
        setToastMsg("Data ikan berhasil diperbarui.");
      } else {
        await fishService.create(payload);
        setToastMsg("Data ikan baru berhasil ditambahkan.");
      }
      setTimeout(() => setToastMsg(null), 3000);
      fishModal.closeModal();
      fetchData();
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Gagal menyimpan data ikan",
      );
    }
  };

  const handleImportCsv = async (
    csvText: string,
    clearExisting: boolean,
  ): Promise<void> => {
    try {
      const res = await fishService.importFish(csvText, clearExisting);
      setToastMsg(
        res.message || `Berhasil mengimpor ${res.created || 0} sampel ikan.`,
      );
      setTimeout(() => setToastMsg(null), 3000);
      importModal.closeModal();
      fetchData();
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Gagal mengimpor file CSV",
      );
    }
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

  return {
    fishList,
    speciesList,
    loading,
    errorMsg,
    setErrorMsg,
    toastMsg,
    setToastMsg,
    editingFish,
    isFishModalOpen: fishModal.open,
    closeFishModal: fishModal.closeModal,
    handleOpenAdd,
    handleOpenEdit,
    handleFishSubmit,
    isImportModalOpen: importModal.open,
    openImportModal: importModal.openModal,
    closeImportModal: importModal.closeModal,
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
  };
}
