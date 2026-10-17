import { useState } from "react";
import { CrudModal } from "../../../components/CrudModal";
import { SelectField, TextField, TextareaField } from "../../../components/ui";
import { fishSchema } from "../../../utils/schemas";
import {
  type CreateFishPayload,
  type Fish,
  type FishSpecies,
} from "../../../services/fish";

interface FishModalProps {
  open: boolean;
  editingFish: Fish | null;
  speciesList: FishSpecies[];
  onClose: () => void;
  onSubmit: (payload: CreateFishPayload) => Promise<void>;
}

function FishFormContent({
  editingFish,
  speciesList,
  onClose,
  onSubmit,
}: {
  editingFish: Fish | null;
  speciesList: FishSpecies[];
  onClose: () => void;
  onSubmit: (payload: CreateFishPayload) => Promise<void>;
}) {
  const [form, setForm] = useState<{
    species: number;
    name: string;
    weight: string;
    notes: string;
  }>({
    species:
      editingFish?.species || (speciesList.length > 0 ? speciesList[0].id : 0),
    name: editingFish?.name || "",
    weight:
      editingFish?.weight !== null && editingFish?.weight !== undefined
        ? String(editingFish.weight)
        : "",
    notes: editingFish?.notes || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = fishSchema.safeParse(form);
    if (!parsed.success) {
      setErrorMsg(
        parsed.error.issues[0]?.message || "Input sampel ikan belum valid.",
      );
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);
    try {
      const payload: CreateFishPayload = {
        species: form.species,
        name: form.name.trim() || null,
        weight: form.weight ? parseFloat(form.weight) : null,
        notes: form.notes.trim() || null,
      };
      await onSubmit(payload);
      onClose();
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Gagal menyimpan data ikan.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
      {errorMsg && (
        <div
          role="alert"
          className="p-3 px-4 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 text-xs font-semibold border border-red-200 dark:border-red-500/20"
        >
          ⚠ {errorMsg}
        </div>
      )}

      <SelectField
        label="Spesies Ikan"
        id="fi-species"
        required
        searchable
        searchPlaceholder="Cari nama spesies atau ilmiah..."
        disabled={submitting || speciesList.length === 0}
        value={form.species}
        onChange={(e) => setForm({ ...form, species: Number(e.target.value) })}
        options={
          speciesList.length === 0
            ? [
                {
                  value: "",
                  label: "Belum ada spesies (tambahkan spesies dulu)",
                },
              ]
            : speciesList.map((sp) => ({
                value: sp.id,
                label: `${sp.name} ${sp.scientific_name ? `(${sp.scientific_name})` : ""}`,
              }))
        }
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <TextField
          label="Nama / Label Sampel"
          id="fi-name"
          optional
          disabled={submitting}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Contoh: Tuna Grade A"
        />
        <TextField
          label="Berat (kg)"
          id="fi-weight"
          type="number"
          step="0.01"
          optional
          disabled={submitting}
          value={form.weight}
          onChange={(e) => setForm({ ...form, weight: e.target.value })}
          placeholder="Contoh: 15.5"
        />
      </div>
      <TextareaField
        label="Catatan Kualitas / Kondisi"
        id="fi-notes"
        optional
        rows={2}
        disabled={submitting}
        value={form.notes}
        onChange={(e) => setForm({ ...form, notes: e.target.value })}
        placeholder="Kualitas kesegaran, lokasi penangkapan khusus, dll..."
      />

      <div className="flex gap-2.5 justify-end mt-4 pt-4 border-t border-fco-border-subtle">
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="h-10 px-4 rounded-xl border border-fco-border surface-card hover:surface-page text-sm font-semibold text-strong cursor-pointer"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="h-10 px-5 rounded-xl border-none bg-fco-blue hover:bg-fco-blue-hover text-white text-sm font-semibold cursor-pointer shadow-xs disabled:opacity-60"
        >
          {submitting
            ? "Menyimpan..."
            : editingFish
              ? "Perbarui Data"
              : "Simpan Data"}
        </button>
      </div>
    </form>
  );
}

export function FishModal({
  open,
  editingFish,
  speciesList,
  onClose,
  onSubmit,
}: FishModalProps) {
  if (!open) return null;

  return (
    <CrudModal
      open={open}
      title={editingFish ? "Ubah Data Ikan" : "Tambah Ikan Individu"}
      subtitle="Catat sampel ikan individu dengan spesifikasi berat."
      onClose={onClose}
      hideFooter
    >
      <FishFormContent
        key={editingFish?.id ?? "new"}
        editingFish={editingFish}
        speciesList={speciesList}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    </CrudModal>
  );
}
