import { useCallback, useEffect, useState } from "react";
import { useCrudModal } from "../../../components/useCrudModal";
import { useConfirmDelete } from "../../../components/useConfirmDelete";
import { useDetailModal } from "../../../components/useDetailModal";
import {
  captainsService,
  type Captain,
  type CreateCaptainPayload,
} from "../../../services/captains";
import { ownersService, type Owner } from "../../../services/owners";

export function useCaptainsManager() {
  const [rows, setRows] = useState<Captain[]>([]);
  const [ownersList, setOwnersList] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingCaptain, setEditingCaptain] = useState<Captain | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const captainModal = useCrudModal();
  const {
    target: deleteTarget,
    open: isDeleteOpen,
    requestDelete,
    cancelDelete,
  } = useConfirmDelete<{ id: number; name: string }>();
  const {
    selected: selectedCaptain,
    open: isDetailOpen,
    openDetail,
    closeDetail,
  } = useDetailModal<Captain>();

  const fetchCaptains = useCallback(async (query?: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const [captainsData, ownersData] = await Promise.all([
        captainsService.getAll(query),
        ownersService.getAll(),
      ]);
      setRows(captainsData);
      setOwnersList(ownersData);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Gagal memuat data nahkoda";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCaptains(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, fetchCaptains]);

  const handleOpenAdd = () => {
    setEditingCaptain(null);
    setErrorMsg(null);
    captainModal.openModal();
  };

  const handleOpenEdit = (captain: Captain) => {
    setEditingCaptain(captain);
    setErrorMsg(null);
    captainModal.openModal();
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const targetId = deleteTarget.id;
    try {
      await captainsService.delete(targetId);
      setRows((prev) => prev.filter((r) => r.id !== targetId));
      setToastMsg(`Nahkoda "${deleteTarget.name}" berhasil dihapus.`);
      setTimeout(() => setToastMsg(null), 3000);
      cancelDelete();
      fetchCaptains(search);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Gagal menghapus data nahkoda";
      setErrorMsg(msg);
    } finally {
      setDeleting(false);
    }
  };

  const handleModalSubmit = async (payload: CreateCaptainPayload) => {
    try {
      if (editingCaptain) {
        await captainsService.update(editingCaptain.id, payload);
        setToastMsg(`Data nahkoda "${payload.full_name}" berhasil diperbarui.`);
      } else {
        await captainsService.create(payload);
        setToastMsg(
          `Nahkoda baru "${payload.full_name}" berhasil ditambahkan.`,
        );
      }
      setTimeout(() => setToastMsg(null), 3000);
      captainModal.closeModal();
      fetchCaptains(search);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Gagal menyimpan data nahkoda";
      setErrorMsg(msg);
    }
  };

  return {
    rows,
    ownersList,
    loading,
    search,
    setSearch,
    errorMsg,
    setErrorMsg,
    toastMsg,
    setToastMsg,

    // Modal Add / Edit
    editingCaptain,
    isModalOpen: captainModal.open,
    openModal: captainModal.openModal,
    closeModal: captainModal.closeModal,
    handleOpenAdd,
    handleOpenEdit,
    handleModalSubmit,

    // Modal Detail
    selectedCaptain,
    isDetailOpen,
    openDetail,
    closeDetail,

    // Modal Delete
    deleteTarget,
    isDeleteOpen,
    deleting,
    requestDelete,
    cancelDelete,
    handleConfirmDelete,
  };
}
