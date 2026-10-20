import { useCallback, useEffect, useState } from "react";
import { useCrudModal } from "../../../components/useCrudModal";
import { useConfirmDelete } from "../../../components/useConfirmDelete";
import { useDetailModal } from "../../../components/useDetailModal";
import type { ShipFormData } from "../../../components/shipFormTypes";
import {
  shipsService,
  type Ship,
  type CreateShipPayload,
} from "../../../services/ships";

export function useAdminShips() {
  const [rows, setRows] = useState<Ship[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingShip, setEditingShip] = useState<Ship | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  const fetchShips = useCallback(async (query?: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await shipsService.getAll(query);
      setRows(data);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Gagal memuat data kapal";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchShips(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, fetchShips]);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const targetId = deleteTarget.id;
    try {
      await shipsService.delete(targetId);
      setRows((prev) => prev.filter((r) => r.id !== targetId));
      setToastMsg(`Kapal "${deleteTarget.name}" berhasil dihapus.`);
      setTimeout(() => setToastMsg(null), 3000);
      cancelDelete();
      fetchShips(search);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus kapal";
      setErrorMsg(msg);
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
        owner: data.owner ? Number(data.owner) || null : null,
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
        setToastMsg(`Data kapal "${data.name}" berhasil diperbarui.`);
      } else {
        await shipsService.create(payload);
        setToastMsg(`Kapal "${data.name}" berhasil didaftarkan.`);
      }
      setTimeout(() => setToastMsg(null), 3000);
      closeModal();
      fetchShips(search);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan kapal";
      setErrorMsg(msg);
    }
  };

  return {
    rows,
    loading,
    search,
    setSearch,
    errorMsg,
    setErrorMsg,
    toastMsg,
    setToastMsg,

    // Modal Add / Edit
    editingShip,
    isModalOpen,
    openModal,
    closeModal,
    handleOpenAdd,
    handleOpenEdit,
    handleSubmit,

    // Modal Detail
    selectedShip,
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
