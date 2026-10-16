import { useEffect, useState } from "react";
import { DataTable, type Column } from "../../../components/DataTable";
import { CrudActions } from "../../../components/FormField";
import { useCrudModal } from "../../../components/useCrudModal";
import { ConfirmDeleteModal } from "../../../components/ConfirmDeleteModal";
import { useConfirmDelete } from "../../../components/useConfirmDelete";
import { PageToolbar } from "../../../components/PageToolbar";
import { AlertBanner } from "../../../components/ui";
import { AssignRoleMenuModal } from "./AssignRoleMenuModal";
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
  const [deleting, setDeleting] = useState(false);
  const {
    target: deleteTarget,
    open: isDeleteOpen,
    requestDelete,
    cancelDelete,
  } = useConfirmDelete<{ id: number; name: string }>();

  const assignMenuModal = useCrudModal();

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

  const handleAssignMenuSubmit = async (payload: AssignMenuPayload) => {
    await roleMenusService.assignMenu(payload);
    setToastMsg("Hak akses menu untuk peran berhasil ditetapkan.");
    setTimeout(() => setToastMsg(null), 3000);
    fetchData();
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

  const rmCols: Column<RoleMenu>[] = [
    {
      key: "role",
      header: "Peran",
      flex: 2,
      render: (r) => <span className="text-sm font-bold">{r.role}</span>,
    },
    {
      key: "menu",
      header: "Menu",
      flex: 2,
      render: (r) => <span className="text-sm font-semibold">{r.menu}</span>,
    },
    {
      key: "permissions",
      header: "Izin Akses",
      flex: 3,
      render: (r) => (
        <div className="flex gap-1.5 flex-wrap">
          {r.can_view && (
            <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
              Lihat
            </span>
          )}
          {r.can_create && (
            <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              Buat
            </span>
          )}
          {r.can_edit && (
            <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
              Ubah
            </span>
          )}
          {r.can_delete && (
            <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400">
              Hapus
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
        onAdd={assignMenuModal.openModal}
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
          columns={rmCols}
          rows={roleMenus}
          rowKey={(r) => String(r.id)}
          loading={loading}
          emptyText="Belum ada hubungan peran-menu yang ditetapkan."
        />
      </section>

      <AssignRoleMenuModal
        open={assignMenuModal.open}
        roles={roles}
        menus={menus}
        onClose={assignMenuModal.closeModal}
        onSubmit={handleAssignMenuSubmit}
      />

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
