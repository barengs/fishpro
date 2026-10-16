import { useEffect, useState } from "react";
import { AlertTriangle, Eye, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { DataTable, type Column } from "../../../components/DataTable";
import { CrudActions } from "../../../components/FormField";
import { CrudModal } from "../../../components/CrudModal";
import { useCrudModal } from "../../../components/useCrudModal";
import { ConfirmDeleteModal } from "../../../components/ConfirmDeleteModal";
import { useConfirmDelete } from "../../../components/useConfirmDelete";
import { PageToolbar } from "../../../components/PageToolbar";
import { AlertBanner, SelectField } from "../../../components/ui";
import {
  menusService,
  roleMenusService,
  rolesService,
  type AssignMenuPayload,
  type Menu,
  type Role,
  type RoleMenu,
} from "../../../services/admin";

export function RoleMenusTab() {
  const [roleMenus, setRoleMenus] = useState<RoleMenu[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
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

  const assignMenuModal = useCrudModal();
  const [assignForm, setAssignForm] = useState<AssignMenuPayload>({
    role_id: 0,
    menu_id: 0,
    permissions: {
      can_view: true,
      can_create: false,
      can_edit: false,
      can_delete: false,
    },
  });

  const fetchData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const [rmData, rData, mData] = await Promise.all([
        roleMenusService.getAll(),
        rolesService.getAll(),
        menusService.getAll(),
      ]);
      setRoleMenus(rmData);
      setRoles(rData);
      setMenus(mData);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Gagal memuat relasi peran-menu",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function loadInitial() {
      try {
        const [rmData, rData, mData] = await Promise.all([
          roleMenusService.getAll(),
          rolesService.getAll(),
          menusService.getAll(),
        ]);
        if (!ignore) {
          setRoleMenus(rmData);
          setRoles(rData);
          setMenus(mData);
        }
      } catch (err: unknown) {
        if (!ignore) {
          setErrorMsg(
            err instanceof Error
              ? err.message
              : "Gagal memuat relasi peran-menu",
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    loadInitial();
    return () => {
      ignore = true;
    };
  }, []);

  const handleAssignMenuSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignForm.role_id || !assignForm.menu_id) {
      setErrorMsg("Peran dan Menu wajib dipilih.");
      return;
    }
    setSubmitting(true);
    try {
      await roleMenusService.assignMenu(assignForm);
      setToastMsg("Hak akses menu untuk peran berhasil ditetapkan.");
      setTimeout(() => setToastMsg(null), 3000);
      assignMenuModal.closeModal();
      fetchData();
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Gagal menetapkan menu ke peran",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await roleMenusService.delete(deleteTarget.id);
      setToastMsg("Relasi menu berhasil dihapus.");
      setTimeout(() => setToastMsg(null), 3000);
      cancelDelete();
      fetchData();
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Gagal menghapus relasi menu",
      );
    } finally {
      setDeleting(false);
    }
  };

  const roleMenuCols: Column<RoleMenu>[] = [
    {
      key: "role",
      header: "Peran",
      flex: 2,
      render: (r) => <span className="text-sm font-bold">{r.role}</span>,
    },
    {
      key: "menu",
      header: "Menu Ditugaskan",
      flex: 2,
      render: (r) => (
        <span className="text-sm font-semibold text-fco-blue">{r.menu}</span>
      ),
    },
    {
      key: "perms",
      header: "Hak Akses (Lihat / Buat / Ubah / Hapus)",
      flex: 3,
      render: (r) => (
        <div className="flex gap-1.5 flex-wrap">
          {r.can_view && (
            <span className="px-2 py-0.5 rounded text-xs bg-emerald-500/10 text-emerald-600 font-semibold">
              View
            </span>
          )}
          {r.can_create && (
            <span className="px-2 py-0.5 rounded text-xs bg-blue-500/10 text-blue-600 font-semibold">
              Create
            </span>
          )}
          {r.can_edit && (
            <span className="px-2 py-0.5 rounded text-xs bg-amber-500/10 text-amber-600 font-semibold">
              Edit
            </span>
          )}
          {r.can_delete && (
            <span className="px-2 py-0.5 rounded text-xs bg-rose-500/10 text-rose-600 font-semibold">
              Delete
            </span>
          )}
        </div>
      ),
    },
    {
      key: "aksi",
      header: "Aksi",
      flex: 1,
      align: "right",
      render: (r) => (
        <CrudActions
          onDelete={() =>
            requestDelete({
              id: r.id,
              name: `Hak akses "${r.menu}" untuk peran "${r.role}"`,
            })
          }
        />
      ),
    },
  ];

  return (
    <div>
      <PageToolbar
        addLabel="Tetapkan Hak Akses Menu"
        onAdd={() => {
          setAssignForm({
            role_id: roles.length > 0 ? roles[0].id : 0,
            menu_id: menus.length > 0 ? menus[0].id : 0,
            permissions: {
              can_view: true,
              can_create: false,
              can_edit: false,
              can_delete: false,
            },
          });
          assignMenuModal.openModal();
        }}
      />

      <AlertBanner
        variant="success"
        message={toastMsg || ""}
        onDismiss={() => setToastMsg(null)}
      />
      <AlertBanner
        variant="error"
        message={errorMsg || ""}
        onDismiss={() => setErrorMsg(null)}
      />

      <section className="surface-card border rounded-xl p-6 shadow-xs">
        <DataTable
          columns={roleMenuCols}
          rows={roleMenus}
          rowKey={(r) => String(r.id)}
          loading={loading}
          emptyText="Belum ada hubungan peran-menu yang ditetapkan."
        />
      </section>

      <CrudModal
        open={assignMenuModal.open}
        title="Tetapkan Menu ke Peran"
        subtitle="Tentukan izin akses menu (lihat, tambah, ubah, hapus) untuk peran ini."
        onClose={assignMenuModal.closeModal}
        onSubmit={handleAssignMenuSubmit}
        submitLabel={submitting ? "Menetapkan..." : "Tetapkan Menu"}
      >
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
            disabled={submitting || roles.length === 0}
            value={assignForm.role_id}
            onChange={(e) =>
              setAssignForm({
                ...assignForm,
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
            disabled={submitting || menus.length === 0}
            value={assignForm.menu_id}
            onChange={(e) =>
              setAssignForm({
                ...assignForm,
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
                  setAssignForm({
                    ...assignForm,
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
                  setAssignForm({
                    ...assignForm,
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
              const checked = Boolean(assignForm.permissions?.[item.key]);
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
                      setAssignForm({
                        ...assignForm,
                        permissions: {
                          ...assignForm.permissions,
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

      <ConfirmDeleteModal
        open={isDeleteOpen}
        title="Hapus Hak Akses Menu"
        itemName={deleteTarget?.name}
        message="Apakah Anda yakin ingin menghapus hak akses menu ini untuk peran terkait?"
        loading={deleting}
        onClose={cancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
