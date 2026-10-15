import { useState } from "react";
import { CrudModal } from "../CrudModal";
import { TextField, TextareaField } from "../ui";
import {
  type CreateFishingAreaPayload,
  type FishingArea,
} from "../../services/regions";

interface AreaModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateFishingAreaPayload) => Promise<void>;
  editingArea?: FishingArea | null;
}

function AreaForm({
  editingArea,
  onClose,
  onSubmit,
}: {
  editingArea?: FishingArea | null;
  onClose: () => void;
  onSubmit: (payload: CreateFishingAreaPayload) => Promise<void>;
}) {
  const [f, setF] = useState<CreateFishingAreaPayload>({
    nama: editingArea?.nama || "",
    code: editingArea?.code || "",
    deskripsi: editingArea?.deskripsi || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.nama.trim() || !f.code.trim()) {
      setErrorMsg("Nama wilayah dan kode wilayah wajib diisi.");
      return;
    }
    setSubmitting(true);
    setErrorMsg(null);
    try {
      await onSubmit(f);
      onClose();
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Gagal menyimpan wilayah",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {errorMsg && (
        <div
          role="alert"
          className="p-3 px-4 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 text-xs font-semibold mb-1 border border-red-200 dark:border-red-500/20"
        >
          ⚠ {errorMsg}
        </div>
      )}

      <TextField
        label="Nama wilayah"
        id="ar-nama"
        required
        disabled={submitting}
        value={f.nama}
        onChange={(e) => setF({ ...f, nama: e.target.value })}
        placeholder="Contoh: Laut Jawa"
      />
      <TextField
        label="Kode wilayah (unik)"
        id="ar-code"
        required
        disabled={submitting}
        value={f.code}
        onChange={(e) => setF({ ...f, code: e.target.value })}
        placeholder="WPP 712"
        hint="Format: WPP 571 – WPP 718"
      />
      <TextareaField
        label="Deskripsi cakupan perairan"
        id="ar-desc"
        optional
        rows={3}
        disabled={submitting}
        value={f.deskripsi || ""}
        onChange={(e) => setF({ ...f, deskripsi: e.target.value })}
        placeholder="Cakupan selat, teluk, atau zona penangkapan ikan..."
      />

      <div className="flex gap-3 mt-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 h-12 rounded-xl border border-fco-border bg-transparent hover:surface-page text-sm font-semibold cursor-pointer transition-colors"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 h-12 rounded-xl border-none bg-fco-blue hover:bg-fco-blue-hover text-white text-fco-md font-semibold cursor-pointer transition-colors disabled:opacity-60"
        >
          {submitting
            ? "Menyimpan..."
            : editingArea
              ? "Perbarui Wilayah"
              : "Simpan Wilayah"}
        </button>
      </div>
    </form>
  );
}

export function AreaModal({
  open,
  onClose,
  onSubmit,
  editingArea,
}: AreaModalProps) {
  if (!open) return null;

  return (
    <CrudModal
      open={open}
      title={editingArea ? "Ubah Wilayah Penangkapan" : "Tambah Wilayah (WPP)"}
      subtitle="Daftarkan wilayah WPPNRI dengan kode unik (contoh: WPP 571 - WPP 718)."
      onClose={onClose}
      hideFooter
    >
      <AreaForm
        key={editingArea ? String(editingArea.id) : "new-area"}
        editingArea={editingArea}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    </CrudModal>
  );
}
