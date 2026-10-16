import { useState } from "react";
import { CrudModal } from "../../../components/CrudModal";
import { SelectField, TextField } from "../../../components/ui";
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
          className="p-3 px-4 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 text-xs font-semibold border border-red-200 dark:border-red-500/20"
        >
          ⚠ {errorMsg}
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
          disabled={submitting}
          value={form.icon || ""}
          onChange={(e) => setForm({ ...form, icon: e.target.value })}
          options={availableMenuIcons}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <TextField
          label="Urutan Tampil"
          id="mn-order"
          type="number"
          optional
          disabled={submitting}
          value={form.order ?? 0}
          onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
        />
        <div className="flex items-center pt-8">
          <label className="flex items-center gap-2.5 text-sm font-semibold cursor-pointer text-strong">
            <input
              type="checkbox"
              disabled={submitting}
              checked={form.is_active}
              onChange={(e) =>
                setForm({ ...form, is_active: e.target.checked })
              }
              className="w-4 h-4 rounded text-fco-blue accent-fco-blue"
            />
            Menu Aktif
          </label>
        </div>
      </div>

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
