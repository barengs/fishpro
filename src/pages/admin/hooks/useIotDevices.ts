import { useCallback, useEffect, useState } from "react";
import { useCrudModal } from "../../../components/useCrudModal";
import { useConfirmDelete } from "../../../components/useConfirmDelete";
import { useDetailModal } from "../../../components/useDetailModal";
import { useToast } from "../../../components/toast";
import {
  iotService,
  type CreateSmartScalePayload,
  type SmartScale,
} from "../../../services/iot";

export function useIotDevices() {
  const [devices, setDevices] = useState<SmartScale[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [editingDevice, setEditingDevice] = useState<SmartScale | null>(null);

  const deviceModal = useCrudModal();
  const toast = useToast();

  const {
    target: deleteTarget,
    open: isDeleteOpen,
    requestDelete,
    cancelDelete,
  } = useConfirmDelete<{ id: number; name: string }>();

  const {
    selected: selectedDevice,
    open: isDetailOpen,
    openDetail,
    closeDetail,
  } = useDetailModal<SmartScale>();

  const fetchDevices = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await iotService.getDevices();
      setDevices(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Gagal memuat daftar timbangan IoT.",
      );
      setDevices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function loadInitial() {
      try {
        const data = await iotService.getDevices();
        if (!ignore) setDevices(Array.isArray(data) ? data : []);
      } catch (err: unknown) {
        if (!ignore) {
          setErrorMsg(
            err instanceof Error
              ? err.message
              : "Gagal memuat daftar timbangan IoT.",
          );
          setDevices([]);
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
    setEditingDevice(null);
    deviceModal.openModal();
  };

  const handleOpenEdit = (dev: SmartScale) => {
    setEditingDevice(dev);
    deviceModal.openModal();
  };

  const handleSubmit = async (payload: CreateSmartScalePayload) => {
    try {
      if (editingDevice) {
        await iotService.updateDevice(editingDevice.id, payload);
        toast.success(`Timbangan "${payload.name}" berhasil diperbarui.`);
      } else {
        await iotService.createDevice(payload);
        toast.success(`Timbangan "${payload.name}" berhasil didaftarkan.`);
      }
      deviceModal.closeModal();
      fetchDevices();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Gagal menyimpan data timbangan.";
      setErrorMsg(msg);
      toast.error(msg);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const targetId = deleteTarget.id;
    try {
      await iotService.deleteDevice(targetId);
      setDevices((prev) => prev.filter((d) => d.id !== targetId));
      toast.success(`Perangkat "${deleteTarget.name}" berhasil dihapus.`);
      cancelDelete();
      fetchDevices();
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Gagal menghapus perangkat timbangan.",
      );
    }
  };

  const safeDevices = Array.isArray(devices) ? devices : [];
  const filteredDevices = safeDevices.filter((d) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      d.device_id.toLowerCase().includes(q) ||
      d.name.toLowerCase().includes(q) ||
      d.port_name.toLowerCase().includes(q)
    );
  });

  return {
    filteredDevices,
    loading,
    search,
    setSearch,
    errorMsg,
    setErrorMsg,
    editingDevice,
    isModalOpen: deviceModal.open,
    closeModal: deviceModal.closeModal,
    handleOpenAdd,
    handleOpenEdit,
    handleSubmit,
    selectedDevice,
    isDetailOpen,
    openDetail,
    closeDetail,
    deleteTarget,
    isDeleteOpen,
    requestDelete,
    cancelDelete,
    handleConfirmDelete,
  };
}
