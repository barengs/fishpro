import { useEffect, useState } from "react";
import { DataTable, type Column } from "../../../components/DataTable";
import { CrudActions } from "../../../components/FormField";
import { CrudModal } from "../../../components/CrudModal";
import { useCrudModal } from "../../../components/useCrudModal";
import { ConfirmDeleteModal } from "../../../components/ConfirmDeleteModal";
import { useConfirmDelete } from "../../../components/useConfirmDelete";
import { PageToolbar } from "../../../components/PageToolbar";
import { StatusChip } from "../../../components/StatusChip";
import { AlertBanner, TextField } from "../../../components/ui";
import { menuSchema } from "../../../utils/schemas";
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
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const {
    target: deleteTarget,
    open: isDeleteOpen,
    requestDelete,
    cancelDelete,
  } = useConfirmDelete<{ id: number; name: string }>();

  const menuModal = useCrudModal();
  const [mForm, setMForm] = useState<CreateMenuPayload>({
    name: "",
    url: "",
    icon: "",
    parent: null,
    order: 0,
    is_active: true,
  });
  const [editingMenuId, setEditingMenuId] = useState<number | null>(null);

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

  const handleMenuSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = menuSchema.safeParse(mForm);
    if (!parsed.success) {
      setErrorMsg(parsed.error.issues[0]?.message || "Input menu belum valid.");
      return;
    }
    setSubmitting(true);
    try {
      if (editingMenuId) {
        await menusService.update(editingMenuId, mForm);
        setToastMsg(`Menu "${mForm.name}" berhasil diperbarui.`);
      } else {
        await menusService.create(mForm);
        setToastMsg(`Menu baru "${mForm.name}" berhasil ditambahkan.`);
      }
      setTimeout(() => setToastMsg(null), 3000);
      menuModal.closeModal();
      fetchMenus();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Gagal menyimpan menu");
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await menusService.delete(deleteTarget.id);
      setToastMsg(`Menu "${deleteTarget.name}" berhasil dihapus.`);
      setTimeout(() => setToastMsg(null), 3000);
      cancelDelete();
      fetchMenus();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Gagal menghapus menu");
    } finally {
      setDeleting(false);
    }
  };

  const menuCols: Column<Menu>[] = [
    {
      key: "name",
      header: "Nama Menu / Ikon",
      flex: 2,
      render: (r) => (
        <div>
          <div className="text-sm font-semibold">{r.name}</div>
          {r.icon && <div className="text-xs text-soft">Ikon: {r.icon}</div>}
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
            setEditingMenuId(r.id);
            setMForm({
              name: r.name,
              url: r.url || "",
              icon: r.icon || "",
              parent: r.parent || null,
              order: r.order,
              is_active: r.is_active,
            });
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
        title="Menu Navigasi (Menus)"
        desc="Daftar semua menu frontend yang aktif dan dapat dikustomisasi hak aksesnya."
        addLabel="Tambah Menu"
        onAdd={() => {
          setEditingMenuId(null);
          setMForm({
            name: "",
            url: "",
            icon: "",
            parent: null,
            order: 0,
            is_active: true,
          });
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

      <CrudModal
        open={menuModal.open}
        title={editingMenuId ? "Ubah Menu" : "Tambah Menu Baru"}
        subtitle="Konfigurasi URL dan urutan menu navigasi frontend."
        onClose={menuModal.closeModal}
        onSubmit={handleMenuSubmit}
        submitLabel={
          submitting
            ? "Menyimpan..."
            : editingMenuId
              ? "Perbarui Menu"
              : "Simpan Menu"
        }
      >
        <TextField
          label="Nama Menu"
          id="mn-name"
          required
          disabled={submitting}
          value={mForm.name}
          onChange={(e) => setMForm({ ...mForm, name: e.target.value })}
          placeholder="Contoh: Logistik Tangkapan"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <TextField
            label="URL Rute"
            id="mn-url"
            optional
            disabled={submitting}
            value={mForm.url || ""}
            onChange={(e) => setMForm({ ...mForm, url: e.target.value })}
            placeholder="/admin/logistik"
          />
          <TextField
            label="Ikon (Lucide Name)"
            id="mn-icon"
            optional
            disabled={submitting}
            value={mForm.icon || ""}
            onChange={(e) => setMForm({ ...mForm, icon: e.target.value })}
            placeholder="Package / Ship / FileText"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <TextField
            label="Urutan Tampil"
            id="mn-order"
            type="number"
            optional
            disabled={submitting}
            value={mForm.order ?? 0}
            onChange={(e) =>
              setMForm({ ...mForm, order: Number(e.target.value) })
            }
          />
          <div className="flex items-center pt-8">
            <label className="flex items-center gap-2.5 text-sm font-semibold cursor-pointer text-strong">
              <input
                type="checkbox"
                disabled={submitting}
                checked={mForm.is_active}
                onChange={(e) =>
                  setMForm({ ...mForm, is_active: e.target.checked })
                }
                className="w-4 h-4 rounded text-fco-blue accent-fco-blue"
              />
              Menu Aktif
            </label>
          </div>
        </div>
      </CrudModal>

      <ConfirmDeleteModal
        open={isDeleteOpen}
        title="Hapus Menu Navigasi"
        itemName={deleteTarget?.name}
        message="Apakah Anda yakin ingin menghapus menu navigasi ini? Seluruh konfigurasi hak akses menu pada setiap peran akan dihapus."
        loading={deleting}
        onClose={cancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
