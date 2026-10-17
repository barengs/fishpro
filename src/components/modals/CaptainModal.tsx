import { useState } from "react";
import { CrudModal } from "../CrudModal";
import { SelectField, TextField, TextareaField } from "../ui";
import {
  type Captain,
  type CreateCaptainPayload,
  type Owner,
} from "../../services/owners";
import { captainSchema } from "../../utils/schemas";
import { Loader2 } from "lucide-react";

interface CaptainModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateCaptainPayload) => Promise<void>;
  editingCaptain?: Captain | null;
  ownersList?: Owner[];
  fixedOwnerId?: number;
}

function CaptainForm({
  editingCaptain,
  ownersList,
  fixedOwnerId,
  onClose,
  onSubmit,
}: {
  editingCaptain?: Captain | null;
  ownersList: Owner[];
  fixedOwnerId?: number;
  onClose: () => void;
  onSubmit: (payload: CreateCaptainPayload) => Promise<void>;
}) {
  const [form, setForm] = useState<CreateCaptainPayload>({
    full_name: editingCaptain?.full_name || "",
    license_number: editingCaptain?.license_number || "",
    owner:
      editingCaptain?.owner ||
      fixedOwnerId ||
      (ownersList.length > 0 ? ownersList[0].id : 0),
    date_of_birth: editingCaptain?.date_of_birth || null,
    contact_info: editingCaptain?.contact_info || "",
    email: editingCaptain?.email || "",
    phone: editingCaptain?.phone || "",
    address: editingCaptain?.address || "",
    years_of_experience: editingCaptain?.years_of_experience || null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalOwner = fixedOwnerId || form.owner;
    const parsed = captainSchema.safeParse({
      ...form,
      owner: finalOwner,
    });
    if (!parsed.success) {
      setErrorMsg(
        parsed.error.issues[0]?.message || "Input nahkoda tidak valid.",
      );
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);
    try {
      await onSubmit({
        ...form,
        owner: finalOwner,
      });
      onClose();
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Gagal menyimpan data nahkoda",
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <TextField
          label="Nama nahkoda"
          id="c-name"
          required
          disabled={submitting}
          value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          placeholder="Contoh: Budi Hartono"
        />

        <TextField
          label="Nomor lisensi (unik)"
          id="c-lic"
          required
          disabled={submitting}
          value={form.license_number}
          onChange={(e) => setForm({ ...form, license_number: e.target.value })}
          placeholder="Contoh: SKN-2024-0012"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {!fixedOwnerId ? (
          <SelectField
            label="Pemilik kapal (Owner)"
            id="c-owner"
            required
            searchable
            searchPlaceholder="Cari nama pemilik..."
            disabled={submitting || ownersList.length === 0}
            value={form.owner || ""}
            onChange={(e) =>
              setForm({ ...form, owner: Number(e.target.value) })
            }
            options={
              ownersList.length === 0
                ? [
                    {
                      value: "",
                      label: "Belum ada pemilik (tambahkan pemilik dulu)",
                    },
                  ]
                : ownersList.map((o) => ({
                    value: o.id,
                    label: `${o.full_name} (${o.owner_type === "company" ? "PT" : "Pribadi"})`,
                  }))
            }
          />
        ) : null}

        <TextField
          label="Tanggal lahir"
          id="c-dob"
          type="date"
          optional
          disabled={submitting}
          value={form.date_of_birth || ""}
          onChange={(e) =>
            setForm({ ...form, date_of_birth: e.target.value || null })
          }
        />

        <TextField
          label="Pengalaman (tahun)"
          id="c-exp"
          type="number"
          min="0"
          optional
          disabled={submitting}
          value={form.years_of_experience ?? ""}
          onChange={(e) =>
            setForm({
              ...form,
              years_of_experience: e.target.value
                ? Number(e.target.value)
                : null,
            })
          }
          placeholder="Contoh: 5"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <TextField
          label="Email"
          id="c-email"
          type="email"
          optional
          disabled={submitting}
          value={form.email || ""}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="nahkoda@email.com"
        />

        <TextField
          label="Telepon"
          id="c-phone"
          optional
          disabled={submitting}
          value={form.phone || ""}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="08xxxxxxxxxx"
        />
      </div>

      <TextField
        label="Kontak tambahan"
        id="c-contact"
        optional
        disabled={submitting}
        value={form.contact_info || ""}
        onChange={(e) => setForm({ ...form, contact_info: e.target.value })}
        placeholder="Radio panggilan / SSB kapal"
      />

      <TextareaField
        label="Alamat"
        id="c-addr"
        rows={2}
        optional
        disabled={submitting}
        value={form.address || ""}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
        placeholder="Alamat domisili nahkoda..."
      />

      {submitting && (
        <div className="flex items-center justify-center gap-2 text-sm text-fco-blue pt-1">
          <Loader2 size={16} className="animate-spin" aria-hidden="true" />
          <span>Menghubungi server backend...</span>
        </div>
      )}

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
            : editingCaptain
              ? "Perbarui Nahkoda"
              : "Simpan Nahkoda"}
        </button>
      </div>
    </form>
  );
}

export function CaptainModal({
  open,
  onClose,
  onSubmit,
  editingCaptain,
  ownersList = [],
  fixedOwnerId,
}: CaptainModalProps) {
  if (!open) return null;

  return (
    <CrudModal
      open={open}
      title={editingCaptain ? "Ubah Data Nahkoda" : "Tambah Nahkoda Baru"}
      subtitle={
        editingCaptain
          ? "Perbarui informasi lisensi atau kontak nahkoda."
          : "Daftarkan nahkoda baru dengan lisensi resmi."
      }
      onClose={onClose}
      hideFooter
    >
      <CaptainForm
        key={editingCaptain ? String(editingCaptain.id) : "new-captain"}
        editingCaptain={editingCaptain}
        ownersList={ownersList}
        fixedOwnerId={fixedOwnerId}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    </CrudModal>
  );
}
