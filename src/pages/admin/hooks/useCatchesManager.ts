import { useCallback, useEffect, useState } from "react";
import { useCrudModal } from "../../../components/useCrudModal";
import { useConfirmDelete } from "../../../components/useConfirmDelete";
import { useDetailModal } from "../../../components/useDetailModal";
import type { CatchReportFormData } from "../../../components/catchReportTypes";
import { catchesService, type FishCatch } from "../../../services/catches";
import { shipsService, type Ship } from "../../../services/ships";
import { fishSpeciesService, type FishSpecies } from "../../../services/fish";
import { iotService } from "../../../services/iot";

export function useCatchesManager() {
  const [rows, setRows] = useState<FishCatch[]>([]);
  const [ships, setShips] = useState<Ship[]>([]);
  const [speciesList, setSpeciesList] = useState<FishSpecies[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedShipReg, setSelectedShipReg] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { open: isModalOpen, openModal, closeModal } = useCrudModal();
  const importModal = useCrudModal();
  const {
    target: deleteTarget,
    open: isDeleteOpen,
    requestDelete,
    cancelDelete,
  } = useConfirmDelete<{ id: number; name?: string }>();
  const {
    selected: selectedCatch,
    open: isDetailOpen,
    openDetail,
    closeDetail,
  } = useDetailModal<FishCatch>();

  const fetchCatches = useCallback(
    async (query?: string) => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const [catchesData, shipsData, spData] = await Promise.all([
          catchesService.getAll(query ? { search: query } : undefined),
          shipsService.getAll().catch(() => []),
          fishSpeciesService.getAll().catch(() => []),
        ]);
        setRows(catchesData);
        setShips(shipsData);
        setSpeciesList(spData);
        if (shipsData.length > 0 && !selectedShipReg) {
          setSelectedShipReg(shipsData[0].registration_number);
        }
      } catch (err: unknown) {
        setErrorMsg(
          err instanceof Error
            ? err.message
            : "Gagal memuat data laporan tangkapan",
        );
      } finally {
        setLoading(false);
      }
    },
    [selectedShipReg],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCatches(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, fetchCatches]);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const targetId = deleteTarget.id;
    try {
      await catchesService.delete(targetId);
      setRows((prev) => prev.filter((r) => r.id !== targetId));
      setToastMsg("Laporan tangkapan berhasil dihapus.");
      setTimeout(() => setToastMsg(null), 3000);
      cancelDelete();
      fetchCatches(search);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Gagal menghapus laporan tangkapan",
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async (data: CatchReportFormData) => {
    if (!selectedShipReg.trim()) {
      alert("Harap pilih kapal untuk laporan tangkapan ini.");
      return;
    }

    try {
      let speciesId = Number(data.fish_species);
      if (isNaN(speciesId) || speciesId === 0) {
        const found = speciesList.find(
          (s) => s.name.toLowerCase() === data.fish_species.toLowerCase(),
        );
        speciesId = found
          ? found.id
          : speciesList.length > 0
            ? speciesList[0].id
            : 1;
      }

      if (data.entry_mode === "iot" && data.scale_reading_id) {
        await iotService.saveCatch({
          reading_id: data.scale_reading_id,
          ship_registration_number: selectedShipReg,
          fish_species_id: speciesId,
          catch_type: data.catch_type as "pelagic" | "demersal" | "reef",
          catch_date: data.catch_date,
          operator_notes:
            data.description || "Dicatat via Admin Portal (Timbangan IoT)",
        });
      } else {
        const payload = {
          ship: selectedShipReg,
          catch_date: data.catch_date,
          catch_type: data.catch_type,
          location_latitude: data.location_latitude,
          location_longitude: data.location_longitude,
          description: data.description || "",
          catch_details: [
            {
              fish_species: speciesId,
              quantity: parseFloat(data.quantity) || 0,
              unit: data.unit || "kg",
              value: data.value ? parseFloat(data.value) : null,
              notes: data.description || "",
            },
          ],
        };
        await catchesService.createWithDetails(payload);
      }
      setToastMsg(
        `Laporan tangkapan untuk ${selectedShipReg} berhasil dibuat dan disegel ke blockchain!`,
      );
      setTimeout(() => setToastMsg(null), 4000);
      closeModal();
      fetchCatches(search);
    } catch (err: unknown) {
      alert(
        err instanceof Error ? err.message : "Gagal mengirim laporan tangkapan",
      );
    }
  };

  const handleCsvImport = async (csvData: string) => {
    try {
      const res = await catchesService.importCsv(csvData, false);
      setToastMsg(
        res.message ||
          `Impor tangkapan berhasil: ${res.created_count || 0} laporan disimpan.`,
      );
      setTimeout(() => setToastMsg(null), 4000);
      importModal.closeModal();
      fetchCatches(search);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Gagal mengimpor file CSV tangkapan",
      );
    }
  };

  return {
    rows,
    ships,
    speciesList,
    loading,
    search,
    setSearch,
    selectedShipReg,
    setSelectedShipReg,
    errorMsg,
    setErrorMsg,
    toastMsg,
    setToastMsg,

    // Modal Crud
    isModalOpen,
    openModal,
    closeModal,
    handleSubmit,

    // Modal Import
    isImportModalOpen: importModal.open,
    openImportModal: importModal.openModal,
    closeImportModal: importModal.closeModal,
    handleCsvImport,

    // Modal Detail
    selectedCatch,
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
