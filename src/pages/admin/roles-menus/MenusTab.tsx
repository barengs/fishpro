import { useEffect, useState } from "react";
import {
  Anchor,
  BarChart3,
  Building2,
  ClipboardList,
  Coins,
  Compass,
  Database,
  FileText,
  Fish,
  LayoutDashboard,
  Link2,
  MapPin,
  Navigation,
  Package,
  Scale,
  Settings,
  ShieldCheck,
  Ship,
  Users,
} from "lucide-react";
import { DataTable, type Column } from "../../../components/DataTable";
import { CrudActions } from "../../../components/FormField";
import { CrudModal } from "../../../components/CrudModal";
import { useCrudModal } from "../../../components/useCrudModal";
import { ConfirmDeleteModal } from "../../../components/ConfirmDeleteModal";
import { useConfirmDelete } from "../../../components/useConfirmDelete";
import { PageToolbar } from "../../../components/PageToolbar";
import { StatusChip } from "../../../components/StatusChip";
import { AlertBanner, SelectField, TextField } from "../../../components/ui";
import { menuSchema } from "../../../utils/schemas";
import {
  menusService,
  type CreateMenuPayload,
  type Menu,
} from "../../../services/admin";

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard size={16} />,
  Ship: <Ship size={16} />,
  Building2: <Building2 size={16} />,
  Anchor: <Anchor size={16} />,
  ClipboardList: <ClipboardList size={16} />,
  Fish: <Fish size={16} />,
  MapPin: <MapPin size={16} />,
  BarChart3: <BarChart3 size={16} />,
  Coins: <Coins size={16} />,
  Link2: <Link2 size={16} />,
  ShieldCheck: <ShieldCheck size={16} />,
  Users: <Users size={16} />,
  Scale: <Scale size={16} />,
  Compass: <Compass size={16} />,
  Navigation: <Navigation size={16} />,
  Package: <Package size={16} />,
  FileText: <FileText size={16} />,
  Database: <Database size={16} />,
  Settings: <Settings size={16} />,
};

const availableMenuIcons = [
  { value: "", label: "— Tanpa Ikon —" },
  {
    value: "LayoutDashboard",
    label: "Dashboard / Ringkasan",
    icon: <LayoutDashboard size={16} />,
  },
  { value: "Ship", label: "Kapal Armada", icon: <Ship size={16} /> },
  {
    value: "Building2",
    label: "Pemilik / Perusahaan",
    icon: <Building2 size={16} />,
  },
  { value: "Anchor", label: "Nahkoda / Kelautan", icon: <Anchor size={16} /> },
  {
    value: "ClipboardList",
    label: "Laporan Tangkapan",
    icon: <ClipboardList size={16} />,
  },
  { value: "Fish", label: "Spesies Ikan", icon: <Fish size={16} /> },
  { value: "MapPin", label: "Wilayah (WPP)", icon: <MapPin size={16} /> },
  {
    value: "BarChart3",
    label: "Kuota & Statistik",
    icon: <BarChart3 size={16} />,
  },
  { value: "Coins", label: "Tarif & PNBP", icon: <Coins size={16} /> },
  { value: "Link2", label: "Blockchain & Hash", icon: <Link2 size={16} /> },
  {
    value: "ShieldCheck",
    label: "Peran & Akses",
    icon: <ShieldCheck size={16} />,
  },
  { value: "Users", label: "Pengguna / Tim", icon: <Users size={16} /> },
  {
    value: "Scale",
    label: "Regulasi & Timbangan",
    icon: <Scale size={16} />,
  },
  {
    value: "Compass",
    label: "Katalog & Navigasi",
    icon: <Compass size={16} />,
  },
  {
    value: "Navigation",
    label: "GPS & Lokasi",
    icon: <Navigation size={16} />,
  },
  { value: "Package", label: "Logistik & Muatan", icon: <Package size={16} /> },
  {
    value: "FileText",
    label: "Dokumen & Sertifikat",
    icon: <FileText size={16} />,
  },
  { value: "Database", label: "Master Data", icon: <Database size={16} /> },
  {
    value: "Settings",
    label: "Pengaturan Sistem",
    icon: <Settings size={16} />,
  },
];

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
        setToastMsg(`Menu baru "${mForm.name}" berhasil dibuat.`);
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <TextField
            label="URL Rute"
            id="mn-url"
            optional
            disabled={submitting}
            value={mForm.url || ""}
            onChange={(e) => setMForm({ ...mForm, url: e.target.value })}
            placeholder="/admin/logistik"
          />
          <SelectField
            label="Pilih Ikon Menu"
            id="mn-icon"
            optional
            disabled={submitting}
            value={mForm.icon || ""}
            onChange={(e) => setMForm({ ...mForm, icon: e.target.value })}
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
