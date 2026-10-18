import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { CrudModal } from "../../../components/CrudModal";
import { SelectField, TextField, ToggleSwitch } from "../../../components/ui";
import { menuSchema } from "../../../utils/schemas";
import { availableMenuIcons } from "./menuIcons";
import { type CreateMenuPayload, type Menu } from "../../../services/admin";

interface MenuModalProps {
  open: boolean;
  editingMenu: Menu | null;
  onClose: () => void;
  onSubmit: (payload: CreateMenuPayload) => Promise<void>;
}

function MenuFormContent({
  editingMenu,
  onClose,
  onSubmit,
}: {
  editingMenu: Menu | null;
  onClose: () => void;
  onSubmit: (payload: CreateMenuPayload) => Promise<void>;
}) {
  const [form, setForm] = useState<CreateMenuPayload>({
    name: editingMenu?.name || "",
    url: editingMenu?.url || "",
    icon: editingMenu?.icon || "",
    parent: editingMenu?.parent || null,
    order: editingMenu?.order ?? 0,
    is_active: editingMenu?.is_active ?? true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = menuSchema.safeParse(form);
    if (!parsed.success) {
      setErrorMsg(parsed.error.issues[0]?.message || "Input menu belum valid.");
      return;
    }
    setSubmitting(true);
    setErrorMsg(null);
    try {
      await onSubmit(form);
      onClose();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Gagal menyimpan menu");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
      {errorMsg && (
        <div
          role="alert"
          className="flex items-center gap-2 p-3 px-4 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 text-xs font-semibold border border-red-200 dark:border-red-500/20"
        >
          <AlertCircle size={15} className="shrink-0" aria-hidden="true" />
          <span>{errorMsg}</span>
        </div>
      )}

      <TextField
        label="Nama Menu"
        id="mn-name"
        required
        disabled={submitting}
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="Contoh: Logistik Tangkapan"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <TextField
          label="URL Rute"
          id="mn-url"
          optional
          disabled={submitting}
          value={form.url || ""}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          placeholder="/admin/logistik"
        />
        <SelectField
          label="Pilih Ikon Menu"
          id="mn-icon"
          optional
          searchable
          searchPlaceholder="Cari ikon menu..."
          disabled={submitting}
          value={form.icon || ""}
          onChange={(e) => setForm({ ...form, icon: e.target.value })}
          options={availableMenuIcons}
        />
      </div>

      <TextField
        label="Urutan Tampil"
        id="mn-order"
        type="number"
        optional
        disabled={submitting}
        value={form.order ?? 0}
        onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
        placeholder="0"
        hint="Menentukan urutan posisi menu di sidebar navigasi."
      />

      <ToggleSwitch
        id="mn-status-toggle"
        checked={Boolean(form.is_active)}
        disabled={submitting}
        onChange={(checked) => setForm({ ...form, is_active: checked })}
        label="Status Publikasi Menu"
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
            : editingMenu
              ? "Perbarui Menu"
              : "Simpan Menu"}
        </button>
      </div>
    </form>
  );
}

export function MenuModal({
  open,
  editingMenu,
  onClose,
  onSubmit,
}: MenuModalProps) {
  if (!open) return null;

  return (
    <CrudModal
      open={open}
      title={editingMenu ? "Ubah Menu" : "Tambah Menu Baru"}
      subtitle="Konfigurasi URL dan urutan menu navigasi frontend."
      onClose={onClose}
      hideFooter
    >
      <MenuFormContent
        key={editingMenu?.id ?? "new"}
        editingMenu={editingMenu}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    </CrudModal>
  );
}
