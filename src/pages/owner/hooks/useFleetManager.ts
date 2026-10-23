import { useCallback, useEffect, useState } from "react";
import { useToast } from "../../../components/toast";
import { useCrudModal } from "../../../components/useCrudModal";
import { useConfirmDelete } from "../../../components/useConfirmDelete";
import { useDetailModal } from "../../../components/useDetailModal";
import type { ShipFormData } from "../../../components/shipFormTypes";
import {
  shipsService,
  type Ship,
  type CreateShipPayload,
} from "../../../services/ships";
import { authService } from "../../../services/auth";

export function useFleetManager() {
  const [rows, setRows] = useState<Ship[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingShip, setEditingShip] = useState<Ship | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const toast = useToast();
  const { open: isModalOpen, openModal, closeModal } = useCrudModal();
  const {
    target: deleteTarget,
    open: isDeleteOpen,
    requestDelete,
    cancelDelete,
  } = useConfirmDelete<{ id: number; name: string }>();
  const {
    selected: selectedShip,
    open: isDetailOpen,
    openDetail,
    closeDetail,
  } = useDetailModal<Ship>();

  const currentUser = authService.getStoredUser();
  const currentOwnerId =
    currentUser?.profile?.owner_id ||
    currentUser?.profile?.id ||
    currentUser?.id;

  const fetchFleet = useCallback(
    async (query?: string) => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const data = await shipsService.getFleetForOwner(currentUser, query);
        setRows(data);
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Gagal memuat data armada kapal";
        setErrorMsg(msg);
      } finally {
        setLoading(false);
      }
    },
    [currentUser],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFleet(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, fetchFleet]);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const targetId = deleteTarget.id;
    try {
      await shipsService.delete(targetId);
      setRows((prev) => prev.filter((r) => r.id !== targetId));
      toast.success(`Kapal "${deleteTarget.name}" berhasil dihapus.`);
      cancelDelete();
      fetchFleet(search);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus kapal";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setDeleting(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingShip(null);
    openModal();
  };

  const handleOpenEdit = (ship: Ship) => {
    setEditingShip(ship);
    openModal();
  };

  const handleSubmit = async (data: ShipFormData) => {
    try {
      const payload: CreateShipPayload = {
        name: data.name.trim(),
        registration_number: data.registration_number.trim(),
        owner:
          currentOwnerId || (data.owner ? Number(data.owner) || null : null),
        captain: data.captain ? Number(data.captain) || null : null,
        length: data.length ? parseFloat(data.length) : null,
        width: data.width ? parseFloat(data.width) : null,
        gross_tonnage: data.gross_tonnage
          ? parseFloat(data.gross_tonnage)
          : null,
        year_built: data.year_built ? Number(data.year_built) : null,
        home_port: data.home_port?.trim() || null,
        active: data.active,
      };

      if (editingShip) {
        await shipsService.update(editingShip.id, payload);
        toast.success(`Kapal "${data.name}" berhasil diperbarui.`);
      } else {
        await shipsService.create(payload);
        toast.success(`Kapal "${data.name}" berhasil didaftarkan ke armada.`);
      }
      closeModal();
      fetchFleet(search);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan kapal";
      toast.error(msg);
    }
  };

  return {
    rows,
    loading,
    search,
    setSearch,
    errorMsg,
    setErrorMsg,
    currentOwnerId,

    // Modal Add/Edit
    editingShip,
    isModalOpen,
    handleOpenAdd,
    handleOpenEdit,
    closeModal,
    handleSubmit,

    // Detail Modal
    selectedShip,
    isDetailOpen,
    openDetail,
    closeDetail,

    // Delete Modal
    deleteTarget,
    isDeleteOpen,
    deleting,
    requestDelete,
    cancelDelete,
    handleConfirmDelete,
  };
}
