import { useEffect, useState } from "react";
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
        title="Hak Akses Menu (Role-Menus)"
        desc="Pengaturan matriks hak akses menu (melihat, membuat, mengedit, menghapus) untuk masing-masing peran."
        addLabel="Tetapkan Menu"
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
        subtitle="Tentukan izin spesifik (lihat, buat, ubah, hapus) untuk peran ini."
        onClose={assignMenuModal.closeModal}
        onSubmit={handleAssignMenuSubmit}
        submitLabel={submitting ? "Menetapkan..." : "Tetapkan Menu"}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              { value: "", label: "— Pilih Menu —" },
              ...menus.map((m) => ({
                value: m.id,
                label: `${m.name} (${m.url || "—"})`,
              })),
            ]}
          />
        </div>

        <div>
          <span className="block text-sm font-semibold text-strong mb-2.5">
            Izin Akses Granular
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl surface-inset border">
            <label className="flex items-center gap-2 text-sm font-semibold text-strong cursor-pointer">
              <input
                type="checkbox"
                checked={assignForm.permissions?.can_view ?? true}
                onChange={(e) =>
                  setAssignForm({
                    ...assignForm,
                    permissions: {
                      ...assignForm.permissions,
                      can_view: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 rounded text-fco-blue accent-fco-blue"
              />
              Dapat Melihat
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold text-strong cursor-pointer">
              <input
                type="checkbox"
                checked={assignForm.permissions?.can_create ?? false}
                onChange={(e) =>
                  setAssignForm({
                    ...assignForm,
                    permissions: {
                      ...assignForm.permissions,
                      can_create: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 rounded text-fco-blue accent-fco-blue"
              />
              Dapat Membuat
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold text-strong cursor-pointer">
              <input
                type="checkbox"
                checked={assignForm.permissions?.can_edit ?? false}
                onChange={(e) =>
                  setAssignForm({
                    ...assignForm,
                    permissions: {
                      ...assignForm.permissions,
                      can_edit: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 rounded text-fco-blue accent-fco-blue"
              />
              Dapat Mengedit
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold text-strong cursor-pointer">
              <input
                type="checkbox"
                checked={assignForm.permissions?.can_delete ?? false}
                onChange={(e) =>
                  setAssignForm({
                    ...assignForm,
                    permissions: {
                      ...assignForm.permissions,
                      can_delete: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 rounded text-fco-blue accent-fco-blue"
              />
              Dapat Menghapus
            </label>
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
