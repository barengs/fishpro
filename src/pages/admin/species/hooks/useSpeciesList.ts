import { useCallback, useEffect, useState } from "react";
import { useCrudModal } from "../../../../components/useCrudModal";
import { useConfirmDelete } from "../../../../components/useConfirmDelete";
import { useDetailModal } from "../../../../components/useDetailModal";
import { speciesSchema } from "../../../../utils/schemas";
import {
  fishSpeciesService,
  type CreateFishSpeciesPayload,
  type FishSpecies,
} from "../../../../services/fish";

export function useSpeciesList() {
  const [speciesList, setSpeciesList] = useState<FishSpecies[]>([]);
  const [search, setSearch] = useState("");
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

  const {
    selected: selectedSpecies,
    open: isDetailOpen,
    openDetail,
    closeDetail,
  } = useDetailModal<FishSpecies>();

  const speciesModal = useCrudModal();
  const importModal = useCrudModal();
  const [editingSpeciesId, setEditingSpeciesId] = useState<number | null>(null);
  const [speciesForm, setSpeciesForm] = useState<CreateFishSpeciesPayload>({
    name: "",
    scientific_name: "",
    description: "",
  });

  const fetchSpecies = useCallback(async (query?: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await fishSpeciesService.getAll(query);
      setSpeciesList(data);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Gagal memuat spesies ikan",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSpecies(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, fetchSpecies]);

  const handleOpenAdd = () => {
    setEditingSpeciesId(null);
    setSpeciesForm({ name: "", scientific_name: "", description: "" });
    speciesModal.openModal();
  };

  const handleOpenEdit = (r: FishSpecies) => {
    setEditingSpeciesId(r.id);
    setSpeciesForm({
      name: r.name,
      scientific_name: r.scientific_name || "",
      description: r.description || "",
    });
    speciesModal.openModal();
  };

  const handleSpeciesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = speciesSchema.safeParse(speciesForm);
    if (!parsed.success) {
      setErrorMsg(
        parsed.error.issues[0]?.message || "Nama spesies belum valid.",
      );
      return;
    }
    setSubmitting(true);
    setErrorMsg(null);
    try {
      if (editingSpeciesId) {
        await fishSpeciesService.update(editingSpeciesId, speciesForm);
        setToastMsg(`Spesies "${speciesForm.name}" berhasil diperbarui.`);
      } else {
        await fishSpeciesService.create(speciesForm);
        setToastMsg(`Spesies baru "${speciesForm.name}" berhasil ditambahkan.`);
      }
      setTimeout(() => setToastMsg(null), 3000);
      speciesModal.closeModal();
      fetchSpecies(search);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Gagal menyimpan spesies ikan",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const targetId = deleteTarget.id;
    try {
      await fishSpeciesService.delete(targetId);
      setSpeciesList((prev) => prev.filter((r) => r.id !== targetId));
      setToastMsg(`Spesies "${deleteTarget.name}" berhasil dihapus.`);
      setTimeout(() => setToastMsg(null), 3000);
      cancelDelete();
      fetchSpecies(search);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Gagal menghapus spesies",
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleImportCsv = async (csvData: string, clearExisting: boolean) => {
    try {
      const res = await fishSpeciesService.importSpecies(
        csvData,
        clearExisting,
      );
      setToastMsg(
        `Impor selesai: ${res.created} dibuat, ${res.updated} diperbarui, ${res.errors} kesalahan.`,
      );
      setTimeout(() => setToastMsg(null), 4000);
      importModal.closeModal();
      fetchSpecies(search);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Gagal mengimpor file CSV",
      );
    }
  };

  return {
    speciesList,
    search,
    setSearch,
    loading,
    errorMsg,
    setErrorMsg,
    toastMsg,
    setToastMsg,
    submitting,
    deleting,

    // Form & Modal Add/Edit
    editingSpeciesId,
    speciesForm,
    setSpeciesForm,
    isSpeciesModalOpen: speciesModal.open,
    openSpeciesModal: speciesModal.openModal,
    closeSpeciesModal: speciesModal.closeModal,
    handleOpenAdd,
    handleOpenEdit,
    handleSpeciesSubmit,

    // Modal Import
    isImportModalOpen: importModal.open,
    openImportModal: importModal.openModal,
    closeImportModal: importModal.closeModal,
    handleImportCsv,

    // Modal Detail
    selectedSpecies,
    isDetailOpen,
    openDetail,
    closeDetail,

    // Modal Delete
    deleteTarget,
    isDeleteOpen,
    requestDelete,
    cancelDelete,
    handleConfirmDelete,
  };
}
