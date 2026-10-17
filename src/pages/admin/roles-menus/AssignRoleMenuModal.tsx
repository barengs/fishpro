import { useState } from "react";
import { AlertTriangle, Eye, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { CrudModal } from "../../../components/CrudModal";
import { SelectField } from "../../../components/ui";
import {
  type AssignMenuPayload,
  type Menu,
  type Role,
} from "../../../services/admin";

interface AssignRoleMenuModalProps {
  open: boolean;
  roles: Role[];
  menus: Menu[];
  initialRole?: number;
  initialMenu?: number;
  onClose: () => void;
  onSubmit: (payload: AssignMenuPayload) => Promise<void>;
}

export function AssignRoleMenuModal({
  open,
  roles,
  menus,
  initialRole = 0,
  initialMenu = 0,
  onClose,
  onSubmit,
}: AssignRoleMenuModalProps) {
  const [form, setForm] = useState<AssignMenuPayload>({
    role_id: initialRole || (roles.length > 0 ? roles[0].id : 0),
    menu_id: initialMenu || (menus.length > 0 ? menus[0].id : 0),
    permissions: {
      can_view: true,
      can_create: false,
      can_edit: false,
      can_delete: false,
    },
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.role_id) {
      setErrorMsg("Harap pilih peran terlebih dahulu.");
      return;
    }
    if (!form.menu_id) {
      setErrorMsg("Harap pilih menu terlebih dahulu.");
      return;
    }
    setSubmitting(true);
    setErrorMsg(null);
    try {
      await onSubmit(form);
      onClose();
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Gagal menetapkan menu ke peran.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CrudModal
      open={open}
      title="Tetapkan Menu ke Peran"
      subtitle="Tentukan izin akses menu (lihat, tambah, ubah, hapus) untuk peran ini."
      onClose={onClose}
      onSubmit={handleSubmit}
      submitLabel={submitting ? "Menetapkan..." : "Tetapkan Menu"}
    >
      {errorMsg && (
        <div
          role="alert"
          className="p-3 px-4 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 text-xs font-semibold mb-3 border border-red-200 dark:border-red-500/20"
        >
          ⚠ {errorMsg}
        </div>
      )}

      {menus.length === 0 && (
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-2.5 mb-3">
          <AlertTriangle
            size={16}
            className="text-amber-600 dark:text-amber-400 shrink-0"
            aria-hidden="true"
          />
          <span className="leading-relaxed">
            Database menu masih kosong. Tambahkan menu di tab{" "}
            <strong>Menu Navigasi</strong> terlebih dahulu.
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
        <SelectField
          label="Pilih Peran"
          id="as-role"
          required
          searchable
          searchPlaceholder="Cari nama peran..."
          disabled={submitting || roles.length === 0}
          value={form.role_id}
          onChange={(e) =>
            setForm({
              ...form,
              role_id: Number(e.target.value),
            })
          }
          options={[
            { value: "", label: "— Pilih Peran —" },
            ...roles.map((r) => ({ value: r.id, label: r.name })),
          ]}
        />

        <SelectField
          label="Pilih Menu"
          id="as-menu"
          required
          searchable
          searchPlaceholder="Cari nama menu atau URL..."
          disabled={submitting || menus.length === 0}
          value={form.menu_id}
          onChange={(e) =>
            setForm({
              ...form,
              menu_id: Number(e.target.value),
            })
          }
          options={[
            {
              value: "",
              label:
                menus.length === 0
                  ? "— Menu Belum Tersedia —"
                  : "— Pilih Menu —",
            },
            ...menus.map((m) => ({
              value: m.id,
              label: `${m.name} (${m.url || "—"})`,
            })),
          ]}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-strong">
            Hak Akses Menu
          </label>
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  permissions: {
                    can_view: true,
                    can_create: true,
                    can_edit: true,
                    can_delete: true,
                  },
                })
              }
              className="font-semibold text-fco-blue hover:underline bg-transparent border-none cursor-pointer p-0"
            >
              Pilih Semua
            </button>
            <span className="text-soft">·</span>
            <button
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  permissions: {
                    can_view: true,
                    can_create: false,
                    can_edit: false,
                    can_delete: false,
                  },
                })
              }
              className="font-medium text-soft hover:text-strong bg-transparent border-none cursor-pointer p-0"
            >
              Hanya Lihat
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {[
            {
              key: "can_view" as const,
              label: "Melihat (View)",
              desc: "Akses membaca & membuka halaman",
              Icon: Eye,
            },
            {
              key: "can_create" as const,
              label: "Membuat (Create)",
              desc: "Izin menambah data baru",
              Icon: PlusCircle,
            },
            {
              key: "can_edit" as const,
              label: "Mengubah (Edit)",
              desc: "Izin memperbarui data yang ada",
              Icon: Pencil,
            },
            {
              key: "can_delete" as const,
              label: "Menghapus (Delete)",
              desc: "Izin menghapus data dari sistem",
              Icon: Trash2,
            },
          ].map((item) => {
            const checked = Boolean(form.permissions?.[item.key]);
            return (
              <label
                key={item.key}
                className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                  checked
                    ? "border-fco-blue bg-fco-blue-light/40 dark:bg-fco-blue/10 shadow-2xs"
                    : "border-fco-border dark:border-fco-border-dark surface-card hover:surface-page"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      permissions: {
                        ...form.permissions,
                        [item.key]: e.target.checked,
                      },
                    })
                  }
                  className="mt-0.5 w-4 h-4 rounded text-fco-blue accent-fco-blue shrink-0 cursor-pointer"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <item.Icon
                      size={15}
                      className={checked ? "text-fco-blue" : "text-soft"}
                      aria-hidden="true"
                    />
                    <span className="text-sm font-semibold text-strong truncate">
                      {item.label}
                    </span>
                  </div>
                  <p className="m-0 text-xs text-soft mt-0.5 leading-snug">
                    {item.desc}
                  </p>
                </div>
              </label>
            );
          })}
        </div>
      </div>
    </CrudModal>
  );
}
