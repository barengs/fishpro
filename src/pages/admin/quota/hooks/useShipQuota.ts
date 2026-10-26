import { useCallback, useEffect, useState } from "react";
import { useCrudModal } from "../../../../components/useCrudModal";
import { useDetailModal } from "../../../../components/useDetailModal";
import { useToast } from "../../../../components/toast";
import { shipsService, type Ship } from "../../../../services/ships";

export function useShipQuota() {
  const [ships, setShips] = useState<Ship[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const quotaModal = useCrudModal();
  const {
    selected: selectedShip,
    open: isDetailOpen,
    openDetail,
    closeDetail,
  } = useDetailModal<Ship>();

  const [form, setForm] = useState({
    shipReg: "",
    year: "2026",
    quota: "",
  });

  const fetchShips = useCallback(async (query?: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await shipsService.getAll(query);
      setShips(data);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Gagal memuat data kuota kapal",
      );
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

  const handleOpenAdd = () => {
    setForm({
      shipReg: ships.length > 0 ? ships[0].registration_number : "",
      year: "2026",
      quota: "",
    });
    quotaModal.openModal();
  };

  const handleOpenAdjust = (ship: Ship) => {
    const q = ship.current_year_quota;
    setForm({
      shipReg: ship.registration_number,
      year: q?.year ? String(q.year) : "2026",
      quota: q?.total_quota ? String(q.total_quota) : "",
    });
    quotaModal.openModal();
  };

  const handleSubmitQuota = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.shipReg) {
      setErrorMsg("Harap pilih kapal terlebih dahulu.");
      return;
    }
    const quotaVal = parseFloat(form.quota);
    if (isNaN(quotaVal) || quotaVal <= 0) {
      setErrorMsg("Jumlah kuota harus berupa angka lebih dari 0.");
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      await shipsService.regulatorManualQuota({
        ship_registration_number: form.shipReg.trim(),
        year: Number(form.year) || 2026,
        quota_amount: quotaVal,
      });

      toast.success(
        `Kuota untuk kapal ${form.shipReg} tahun ${form.year} berhasil disimpan.`,
      );
      quotaModal.closeModal();
      fetchShips(search);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Gagal menyimpan kuota kapal.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    ships,
    loading,
    search,
    setSearch,
    errorMsg,
    setErrorMsg,
    submitting,
    form,
    setForm,

    // Modal Atur Kuota
    isModalOpen: quotaModal.open,
    openModal: quotaModal.openModal,
    closeModal: quotaModal.closeModal,
    handleOpenAdd,
    handleOpenAdjust,
    handleSubmitQuota,

    // Detail Modal
    selectedShip,
    isDetailOpen,
    openDetail,
    closeDetail,
  };
}
