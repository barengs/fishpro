import { useCallback, useEffect, useState } from "react";
import { useCrudModal } from "../../../components/useCrudModal";
import { useConfirmDelete } from "../../../components/useConfirmDelete";
import {
  regionsService,
  type CreateFishingAreaPayload,
  type FishingArea,
} from "../../../services/regions";

export function useAreasManager() {
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

  const fetchAreas = useCallback(async (query?: string) => {
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
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAreas(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, fetchAreas]);

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
    const targetId = deleteTarget.id;
    try {
      await regionsService.delete(targetId);
      setRows((prev) => prev.filter((r) => r.id !== targetId));
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
    try {
      if (editingArea) {
        await regionsService.update(editingArea.id, payload);
        setToastMsg(`Wilayah "${payload.nama}" berhasil diperbarui.`);
      } else {
        await regionsService.create(payload);
        setToastMsg(`Wilayah baru "${payload.nama}" berhasil ditambahkan.`);
      }
      setTimeout(() => setToastMsg(null), 3000);
      areaModal.closeModal();
      fetchAreas(search);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Gagal menyimpan data wilayah",
      );
    }
  };

  const handleCsvImport = async (csvData: string, clearExisting: boolean) => {
    try {
      const res = await regionsService.importAreas(csvData, clearExisting);
      setToastMsg(
        `Impor selesai: ${res.created} dibuat, ${res.updated} diperbarui, ${res.errors} kesalahan.`,
      );
      setTimeout(() => setToastMsg(null), 4000);
      importModal.closeModal();
      fetchAreas(search);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Gagal mengimpor file CSV",
      );
    }
  };

  return {
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

    // Modal Area
    isAreaModalOpen: areaModal.open,
    openAreaModal: areaModal.openModal,
    closeAreaModal: areaModal.closeModal,
    handleOpenAdd,
    handleOpenEdit,
    handleModalSubmit,

    // Modal Import
    isImportModalOpen: importModal.open,
    openImportModal: importModal.openModal,
    closeImportModal: importModal.closeModal,
    handleCsvImport,

    // Modal Delete
    deleteTarget,
    isDeleteOpen,
    requestDelete,
    cancelDelete,
    handleConfirmDelete,
  };
}
