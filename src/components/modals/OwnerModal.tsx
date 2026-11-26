import { useState } from "react";
import { CrudModal } from "./CrudModal";
import { SelectField, TextField, TextareaField } from "../ui";
import { type CreateOwnerPayload, type Owner } from "../../services/owners";
import { ownerSchema } from "../../utils/schemas";
import { AlertCircle, Loader2 } from "lucide-react";

interface OwnerModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateOwnerPayload) => Promise<void>;
  editingOwner?: Owner | null;
}

function OwnerForm({
  editingOwner,
  onClose,
  onSubmit,
}: {
  editingOwner?: Owner | null;
  onClose: () => void;
  onSubmit: (payload: CreateOwnerPayload) => Promise<void>;
}) {
  const [form, setForm] = useState<CreateOwnerPayload>({
    full_name: editingOwner?.full_name || "",
    owner_type:
      (editingOwner?.owner_type as "individual" | "company") || "individual",
    contact_info: editingOwner?.contact_info || "",
    email: editingOwner?.email || "",
    phone: editingOwner?.phone || "",
    address: editingOwner?.address || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = ownerSchema.safeParse(form);
    if (!parsed.success) {
      setErrorMsg(
        parsed.error.issues[0]?.message || "Input pemilik tidak valid.",
      );
      return;
    }
    setSubmitting(true);
    setErrorMsg(null);
    try {
      await onSubmit(form);
      onClose();
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Gagal menyimpan data pemilik",
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
          className="flex items-center gap-2 p-3 px-4 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 text-xs font-semibold mb-1 border border-red-200 dark:border-red-500/20"
        >
          <AlertCircle size={15} className="shrink-0" aria-hidden="true" />
          <span>{errorMsg}</span>
        </div>
      )}

      <TextField
        label="Nama lengkap / Perusahaan"
        id="o-name"
        required
        disabled={submitting}
        value={form.full_name}
        onChange={(e) => setForm({ ...form, full_name: e.target.value })}
        placeholder="Contoh: PT Samudra Makmur atau H. Ahmad"
      />

      <SelectField
        label="Tipe pemilik"
        id="o-type"
        required
        disabled={submitting}
        value={form.owner_type}
        onChange={(e) =>
          setForm({
            ...form,
            owner_type: e.target.value as "individual" | "company",
          })
        }
        options={[
          { value: "individual", label: "Perorangan" },
          { value: "company", label: "Badan Usaha / Perusahaan" },
        ]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <TextField
          label="Email"
          id="o-email"
          type="email"
          optional
          disabled={submitting}
          value={form.email || ""}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="nama@email.com"
        />

        <TextField
          label="Telepon"
          id="o-phone"
          optional
          disabled={submitting}
          value={form.phone || ""}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="08xxxxxxxxxx"
        />
      </div>

      <TextField
        label="Kontak tambahan"
        id="o-contact"
        optional
        disabled={submitting}
        value={form.contact_info || ""}
        onChange={(e) => setForm({ ...form, contact_info: e.target.value })}
        placeholder="WhatsApp / Telepon kantor alternatif"
      />

      <TextareaField
        label="Alamat"
        id="o-addr"
        rows={2}
        optional
        disabled={submitting}
        value={form.address || ""}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
        placeholder="Alamat kantor / domisili pemilik"
      />

      {submitting && (
        <div className="flex items-center justify-center gap-2 text-sm text-fco-blue pt-1">
          <Loader2 size={16} className="animate-spin" aria-hidden="true" />
          <span>Menyimpan data pemilik...</span>
        </div>
      )}

      <div className="flex gap-3 mt-2 pt-4 border-t border-[#e8ebf0] dark:border-[#1f2a42]">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 h-[44px] rounded-[10px] border border-[#d9dee8] dark:border-[#2a3753] bg-white dark:bg-[#0f1729] hover:bg-[#f1f4f9] dark:hover:bg-[#141d33] text-[#0f172a] dark:text-[#e8edf7] text-sm font-semibold cursor-pointer transition-colors"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 h-[44px] rounded-[10px] border-0 bg-[#2563eb] hover:bg-[#1d4ed8] dark:bg-[#5b94ff] dark:hover:bg-[#78a7ff] text-white text-sm font-semibold cursor-pointer transition-colors disabled:opacity-60"
        >
          {submitting
            ? "Menyimpan..."
            : editingOwner
              ? "Perbarui Pemilik"
              : "Simpan Pemilik"}
        </button>
      </div>
    </form>
  );
}

export function OwnerModal({
  open,
  onClose,
  onSubmit,
  editingOwner,
}: OwnerModalProps) {
  if (!open) return null;

  return (
    <CrudModal
      open={open}
      title={editingOwner ? "Ubah Data Pemilik" : "Tambah Pemilik Baru"}
      subtitle={
        editingOwner
          ? "Perbarui informasi profil pemilik kapal."
          : "Daftarkan pemilik kapal perorangan atau perusahaan."
      }
      onClose={onClose}
      hideFooter
    >
      <OwnerForm
        key={editingOwner ? String(editingOwner.id) : "new-owner"}
        editingOwner={editingOwner}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    </CrudModal>
  );
}
