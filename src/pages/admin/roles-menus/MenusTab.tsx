import { useEffect, useState } from "react";
import { DataTable, type Column } from "../../../components/DataTable";
import { CrudActions } from "../../../components/FormField";
import { useCrudModal } from "../../../components/useCrudModal";
import { ConfirmDeleteModal } from "../../../components/ConfirmDeleteModal";
import { useConfirmDelete } from "../../../components/useConfirmDelete";
import { PageToolbar } from "../../../components/PageToolbar";
import { StatusChip } from "../../../components/StatusChip";
import { AlertBanner } from "../../../components/ui";
import { MenuModal } from "./MenuModal";
import { iconMap } from "./menuIcons";
import {
  menusService,
  type CreateMenuPayload,
  type Menu,
} from "../../../services/admin";

export function MenusTab() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const {
    target: deleteTarget,
    open: isDeleteOpen,
    requestDelete,
    cancelDelete,
  } = useConfirmDelete<{ id: number; name: string }>();

  const menuModal = useCrudModal();

  const fetchMenus = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await menusService.getAll();
      setMenus(data);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Gagal memuat menu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function loadInitial() {
      try {
        const data = await menusService.getAll();
        if (!ignore) setMenus(data);
      } catch (err: unknown) {
        if (!ignore) {
          setErrorMsg(err instanceof Error ? err.message : "Gagal memuat menu");
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

  const handleMenuSubmit = async (payload: CreateMenuPayload) => {
    if (editingMenu) {
      await menusService.update(editingMenu.id, payload);
      setToastMsg(`Menu "${payload.name}" berhasil diperbarui.`);
    } else {
      await menusService.create(payload);
      setToastMsg(`Menu baru "${payload.name}" berhasil dibuat.`);
    }
    setTimeout(() => setToastMsg(null), 3000);
    fetchMenus();
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await menusService.delete(deleteTarget.id);
      setToastMsg(`Menu "${deleteTarget.name}" berhasil dihapus.`);
      setTimeout(() => setToastMsg(null), 3000);
      cancelDelete();
      fetchMenus();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Gagal menghapus menu");
    }
  };

  const menuCols: Column<Menu>[] = [
    {
      key: "name",
      header: "Nama Menu",
      flex: 2,
      render: (r) => (
        <div className="flex items-center gap-2.5">
          {r.icon && iconMap[r.icon] && (
            <span className="w-7 h-7 rounded-lg surface-inset flex items-center justify-center text-fco-blue shrink-0">
              {iconMap[r.icon]}
            </span>
          )}
          <div>
            <div className="text-sm font-semibold">{r.name}</div>
            {r.icon && <div className="text-xs text-soft">{r.icon}</div>}
          </div>
        </div>
      ),
    },
    {
      key: "url",
      header: "URL Rute",
      flex: 2,
      render: (r) => (
        <code className="text-xs bg-fco-blue-light/50 dark:bg-fco-blue/15 px-2 py-1 rounded-md text-fco-blue font-mono">
          {r.url || "—"}
        </code>
      ),
    },
    {
      key: "order",
      header: "Urutan",
      flex: 1,
      align: "center",
      render: (r) => (
        <span className="text-sm tabular-nums font-semibold">{r.order}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      flex: 1,
      align: "center",
      render: (r) =>
        r.is_active ? (
          <StatusChip label="Aktif" />
        ) : (
          <StatusChip label="Nonaktif" bg="#EEF1F6" color="#4A5872" />
        ),
    },
    {
      key: "aksi",
      header: "Aksi",
      flex: 1,
      align: "right",
      render: (r) => (
        <CrudActions
          onEdit={() => {
            setEditingMenu(r);
            menuModal.openModal();
          }}
          onDelete={() => requestDelete({ id: r.id, name: r.name })}
        />
      ),
    },
  ];

  return (
    <div>
      <PageToolbar
        addLabel="Tambah Menu"
        onAdd={() => {
          setEditingMenu(null);
          menuModal.openModal();
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
          columns={menuCols}
          rows={menus}
          rowKey={(r) => String(r.id)}
          loading={loading}
          emptyText="Belum ada data menu terdaftar di server."
        />
      </section>

      <MenuModal
        open={menuModal.open}
        editingMenu={editingMenu}
        onClose={menuModal.closeModal}
        onSubmit={handleMenuSubmit}
      />

      <ConfirmDeleteModal
        open={isDeleteOpen}
        title="Hapus Menu Navigasi"
        itemName={deleteTarget?.name}
        message="Apakah Anda yakin ingin menghapus menu navigasi ini? Seluruh konfigurasi hak akses menu pada setiap peran akan dihapus."
        onClose={cancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
