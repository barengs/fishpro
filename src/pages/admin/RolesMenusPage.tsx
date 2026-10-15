import { useEffect, useState } from "react";
import { PageToolbar } from "../../components/PageToolbar";
import { DataTable, type Column } from "../../components/DataTable";
import { CrudActions, FormField, inputCls } from "../../components/FormField";
import { CrudModal } from "../../components/CrudModal";
import { useCrudModal } from "../../components/useCrudModal";
import { StatusChip } from "../../components/StatusChip";
import {
  adminUsersService,
  menusService,
  roleMenusService,
  rolesService,
  type AdminUser,
  type AssignMenuPayload,
  type CreateMenuPayload,
  type CreateRolePayload,
  type Menu,
  type RegisterAdminPayload,
  type RegisterRegulatorPayload,
  type Role,
  type RoleMenu,
} from "../../services/admin";
import { Loader2 } from "lucide-react";

type AdminTab = "roles" | "menus" | "role-menus" | "admin-users";

export function RolesMenusPage() {
  const [tab, setTab] = useState<AdminTab>("roles");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Data states
  const [roles, setRoles] = useState<Role[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [roleMenus, setRoleMenus] = useState<RoleMenu[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);

  // Modal triggers
  const roleModal = useCrudModal();
  const menuModal = useCrudModal();
  const assignMenuModal = useCrudModal();
  const userModal = useCrudModal();

  // Form states
  const [rForm, setRForm] = useState<CreateRolePayload>({
    name: "",
    description: "",
  });
  const [editingRoleId, setEditingRoleId] = useState<number | null>(null);

  const [mForm, setMForm] = useState<CreateMenuPayload>({
    name: "",
    url: "",
    icon: "",
    parent: null,
    order: 0,
    is_active: true,
  });
  const [editingMenuId, setEditingMenuId] = useState<number | null>(null);

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

  const [userRegisterType, setUserRegisterType] = useState<
    "admin" | "regulator"
  >("admin");
  const [adminForm, setAdminForm] = useState<RegisterAdminPayload>({
    username: "",
    password: "",
    email: "",
    full_name: "",
    phone: "",
    department: "KKP Pusat",
    position: "Staff Administrator",
    role: null,
  });
  const [regulatorForm, setRegulatorForm] = useState<RegisterRegulatorPayload>({
    username: "",
    email: "",
    password: "",
    full_name: "",
    phone: "",
    department: "Direktorat Pengawasan",
    position: "Pengawas Kuota Perikanan",
  });

  // Load data according to active tab
  const fetchData = async (currentTab: AdminTab, query?: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      if (currentTab === "roles") {
        const data = await rolesService.getAll(query);
        setRoles(data);
      } else if (currentTab === "menus") {
        const data = await menusService.getAll();
        setMenus(data);
      } else if (currentTab === "role-menus") {
        const [rmData, rData, mData] = await Promise.all([
          roleMenusService.getAll(),
          rolesService.getAll(),
          menusService.getAll(),
        ]);
        setRoleMenus(rmData);
        setRoles(rData);
        setMenus(mData);
      } else if (currentTab === "admin-users") {
        const [userData, rData] = await Promise.all([
          adminUsersService.getAll(query),
          rolesService.getAll(),
        ]);
        setAdminUsers(userData);
        setRoles(rData);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Gagal memuat data dari server";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(tab, search);
    }, 300);
    return () => clearTimeout(timer);
  }, [tab, search]);

  // ==================== Handlers ====================

  // Role Submit
  const handleRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rForm.name.trim()) return;
    setSubmitting(true);
    try {
      if (editingRoleId) {
        await rolesService.update(editingRoleId, rForm);
        setToastMsg(`Peran "${rForm.name}" berhasil diperbarui.`);
      } else {
        await rolesService.create(rForm);
        setToastMsg(`Peran baru "${rForm.name}" berhasil dibuat.`);
      }
      setTimeout(() => setToastMsg(null), 3000);
      roleModal.closeModal();
      fetchData("roles", search);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Gagal menyimpan peran");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRole = async (id: number, name: string) => {
    if (!window.confirm(`Yakin ingin menghapus peran "${name}"?`)) return;
    try {
      await rolesService.delete(id);
      setToastMsg(`Peran "${name}" berhasil dihapus.`);
      setTimeout(() => setToastMsg(null), 3000);
      fetchData("roles", search);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal menghapus peran");
    }
  };

  // Menu Submit
  const handleMenuSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mForm.name.trim()) return;
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
      fetchData("menus");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Gagal menyimpan menu");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMenu = async (id: number, name: string) => {
    if (!window.confirm(`Yakin ingin menghapus menu "${name}"?`)) return;
    try {
      await menusService.delete(id);
      setToastMsg(`Menu "${name}" berhasil dihapus.`);
      setTimeout(() => setToastMsg(null), 3000);
      fetchData("menus");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal menghapus menu");
    }
  };

  // RoleMenu Assign
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
      fetchData("role-menus");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Gagal menetapkan menu");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRoleMenu = async (id: number) => {
    if (!window.confirm("Hapus relasi hak akses menu ini?")) return;
    try {
      await roleMenusService.delete(id);
      setToastMsg("Relasi menu berhasil dihapus.");
      setTimeout(() => setToastMsg(null), 3000);
      fetchData("role-menus");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal menghapus relasi menu");
    }
  };

  // User Register Submit
  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (userRegisterType === "admin") {
        if (!adminForm.username.trim() || !adminForm.password) return;
        await adminUsersService.registerAdmin(adminForm);
        setToastMsg(
          `Pengguna admin "${adminForm.username}" berhasil didaftarkan.`,
        );
      } else {
        if (
          !regulatorForm.username.trim() ||
          !regulatorForm.email ||
          !regulatorForm.password
        )
          return;
        await adminUsersService.registerRegulator(regulatorForm);
        setToastMsg(
          `Pengawas/Regulator "${regulatorForm.full_name}" berhasil didaftarkan.`,
        );
      }
      setTimeout(() => setToastMsg(null), 3000);
      userModal.closeModal();
      fetchData("admin-users", search);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Gagal mendaftarkan pengguna",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==================== Columns ====================

  const roleCols: Column<Role>[] = [
    {
      key: "name",
      header: "Nama Peran",
      flex: 2,
      render: (r) => <span className="text-sm font-bold">{r.name}</span>,
    },
    {
      key: "desc",
      header: "Deskripsi",
      flex: 3,
      render: (r) => (
        <span className="text-sm text-soft">{r.description || "—"}</span>
      ),
    },
    {
      key: "perms",
      header: "Hak Akses (Permissions)",
      flex: 2,
      render: (r) => (
        <span className="text-xs text-soft">
          {r.permissions && r.permissions.length > 0
            ? `${r.permissions.length} Izin aktif`
            : "Default"}
        </span>
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
            setEditingRoleId(r.id);
            setRForm({ name: r.name, description: r.description || "" });
            roleModal.openModal();
          }}
          onDelete={() => handleDeleteRole(r.id, r.name)}
        />
      ),
    },
  ];

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
          onDelete={() => handleDeleteMenu(r.id, r.name)}
        />
      ),
    },
  ];

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
        <CrudActions onDelete={() => handleDeleteRoleMenu(r.id)} />
      ),
    },
  ];

  const userCols: Column<AdminUser>[] = [
    {
      key: "user",
      header: "Pengguna / Username",
      flex: 3,
      render: (r) => (
        <div>
          <div className="text-sm font-semibold">
            {r.admin_profile?.full_name || r.username}
          </div>
          <div className="text-xs text-soft">
            @{r.username} · {r.email || "—"}
          </div>
        </div>
      ),
    },
    {
      key: "dept",
      header: "Departemen / Posisi",
      flex: 3,
      render: (r) => (
        <div>
          <div className="text-sm">{r.admin_profile?.department || "—"}</div>
          <div className="text-xs text-soft">
            {r.admin_profile?.position || "—"}
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Telepon",
      flex: 2,
      render: (r) => (
        <span className="text-sm tabular-nums">
          {r.admin_profile?.phone || "—"}
        </span>
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
  ];

  const tabMeta = {
    roles: {
      title: "Peran Pengguna (Roles)",
      desc: "Daftar semua peran pengguna dalam sistem. Setiap peran memiliki izin dan menu yang berbeda.",
      add: "Tambah Peran",
      onAdd: () => {
        setEditingRoleId(null);
        setRForm({ name: "", description: "" });
        roleModal.openModal();
      },
    },
    menus: {
      title: "Menu Navigasi (Menus)",
      desc: "Daftar semua menu frontend yang aktif dan dapat dikustomisasi hak aksesnya.",
      add: "Tambah Menu",
      onAdd: () => {
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
      },
    },
    "role-menus": {
      title: "Hak Akses Menu (Role-Menus)",
      desc: "Pengaturan matriks hak akses menu (melihat, membuat, mengedit, menghapus) untuk masing-masing peran.",
      add: "Tetapkan Menu",
      onAdd: () => {
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
      },
    },
    "admin-users": {
      title: "Pengguna Admin & Regulator",
      desc: "Manajemen akun administrator KKP dan pendaftaran petugas regulator pengawas kuota.",
      add: "Daftarkan Pengguna",
      onAdd: () => {
        setUserRegisterType("admin");
        userModal.openModal();
      },
    },
  } as const;

  const meta = tabMeta[tab];

  return (
    <div>
      <PageToolbar
        title={meta.title}
        desc={meta.desc}
        searchPlaceholder="Cari data..."
        searchValue={search}
        onSearchChange={setSearch}
        tabs={[
          { key: "roles", label: "1. Peran (Roles)" },
          { key: "menus", label: "2. Menu Frontend" },
          { key: "role-menus", label: "3. Hak Akses Menu" },
          { key: "admin-users", label: "4. Akun Admin & Regulator" },
        ]}
        activeTab={tab}
        onTabChange={(k) => {
          setTab(k as AdminTab);
          setSearch("");
        }}
        addLabel={meta.add}
        onAdd={meta.onAdd}
      />

      {toastMsg && (
        <div className="p-3.5 px-4.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-sm font-semibold mb-5 border border-emerald-200 dark:border-emerald-500/20">
          ✓ {toastMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 px-4.5 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 text-sm font-semibold mb-5 border border-red-200 dark:border-red-500/20">
          ⚠ {errorMsg}
        </div>
      )}

      {/* Main Table by Tab */}
      <section className="surface-card border rounded-2xl p-6 shadow-xs">
        {tab === "roles" && (
          <DataTable
            columns={roleCols}
            rows={roles}
            rowKey={(r) => String(r.id)}
            loading={loading}
            emptyText="Belum ada data peran terdaftar di server."
          />
        )}
        {tab === "menus" && (
          <DataTable
            columns={menuCols}
            rows={menus}
            rowKey={(r) => String(r.id)}
            loading={loading}
            emptyText="Belum ada data menu terdaftar di server."
          />
        )}
        {tab === "role-menus" && (
          <DataTable
            columns={roleMenuCols}
            rows={roleMenus}
            rowKey={(r) => String(r.id)}
            loading={loading}
            emptyText="Belum ada hubungan peran-menu yang ditetapkan."
          />
        )}
        {tab === "admin-users" && (
          <DataTable
            columns={userCols}
            rows={adminUsers}
            rowKey={(r) => String(r.id)}
            loading={loading}
            emptyText="Belum ada akun admin terdaftar di server."
          />
        )}
      </section>

      {/* Modal 1: Role CRUD */}
      <CrudModal
        open={roleModal.open}
        title={editingRoleId ? "Ubah Peran" : "Buat Peran Baru"}
        subtitle="Kelola nama peran pengguna dan deskripsinya."
        onClose={roleModal.closeModal}
        onSubmit={handleRoleSubmit}
        submitLabel={
          submitting
            ? "Menyimpan..."
            : editingRoleId
              ? "Perbarui Peran"
              : "Simpan Peran"
        }
      >
        <FormField label="Nama Peran (Unik)" htmlFor="rl-name" required>
          <input
            id="rl-name"
            required
            disabled={submitting}
            value={rForm.name}
            onChange={(e) => setRForm({ ...rForm, name: e.target.value })}
            placeholder="Contoh: surveyor_kkp atau staf_pelabuhan"
            className={inputCls}
          />
        </FormField>
        <FormField label="Deskripsi Peran" htmlFor="rl-desc">
          <textarea
            id="rl-desc"
            rows={3}
            disabled={submitting}
            value={rForm.description || ""}
            onChange={(e) =>
              setRForm({ ...rForm, description: e.target.value })
            }
            placeholder="Penjelasan wewenang dan tanggung jawab peran..."
            className="w-full border rounded-xl p-3 text-fco-md field-input focus:outline-none focus:border-fco-blue resize-none"
          />
        </FormField>
      </CrudModal>

      {/* Modal 2: Menu CRUD */}
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
        <FormField label="Nama Menu" htmlFor="mn-name" required>
          <input
            id="mn-name"
            required
            disabled={submitting}
            value={mForm.name}
            onChange={(e) => setMForm({ ...mForm, name: e.target.value })}
            placeholder="Contoh: Logistik Tangkapan"
            className={inputCls}
          />
        </FormField>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="URL Rute" htmlFor="mn-url">
            <input
              id="mn-url"
              disabled={submitting}
              value={mForm.url || ""}
              onChange={(e) => setMForm({ ...mForm, url: e.target.value })}
              placeholder="/admin/logistik"
              className={inputCls}
            />
          </FormField>
          <FormField label="Ikon (Lucide Name)" htmlFor="mn-icon">
            <input
              id="mn-icon"
              disabled={submitting}
              value={mForm.icon || ""}
              onChange={(e) => setMForm({ ...mForm, icon: e.target.value })}
              placeholder="Package / Ship / FileText"
              className={inputCls}
            />
          </FormField>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Urutan Tampil" htmlFor="mn-order">
            <input
              id="mn-order"
              type="number"
              disabled={submitting}
              value={mForm.order ?? 0}
              onChange={(e) =>
                setMForm({ ...mForm, order: Number(e.target.value) })
              }
              className={inputCls}
            />
          </FormField>
          <div className="flex items-center pt-8">
            <label className="flex items-center gap-2.5 text-sm font-semibold cursor-pointer text-strong">
              <input
                type="checkbox"
                disabled={submitting}
                checked={mForm.is_active}
                onChange={(e) =>
                  setMForm({ ...mForm, is_active: e.target.checked })
                }
                className="w-4 h-4 rounded text-fco-blue accent-[#1A56DB]"
              />
              Menu Aktif
            </label>
          </div>
        </div>
      </CrudModal>

      {/* Modal 3: Assign Menu to Role */}
      <CrudModal
        open={assignMenuModal.open}
        title="Tetapkan Menu ke Peran"
        subtitle="Tentukan izin spesifik (lihat, buat, ubah, hapus) untuk peran ini."
        onClose={assignMenuModal.closeModal}
        onSubmit={handleAssignMenuSubmit}
        submitLabel={submitting ? "Menetapkan..." : "Tetapkan Menu"}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Pilih Peran" htmlFor="as-role" required>
            <select
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
              className={inputCls}
            >
              <option value="">— Pilih Peran —</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Pilih Menu" htmlFor="as-menu" required>
            <select
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
              className={inputCls}
            >
              <option value="">— Pilih Menu —</option>
              {menus.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.url || "—"})
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <div>
          <span className="block text-sm font-semibold text-strong mb-2.5">
            Izin Akses Granular (Granular Permissions)
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
                className="w-4 h-4 rounded text-fco-blue accent-[#1A56DB]"
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
                className="w-4 h-4 rounded text-fco-blue accent-[#1A56DB]"
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
                className="w-4 h-4 rounded text-fco-blue accent-[#1A56DB]"
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
                className="w-4 h-4 rounded text-fco-blue accent-[#1A56DB]"
              />
              Dapat Menghapus
            </label>
          </div>
        </div>
      </CrudModal>

      {/* Modal 4: Register Admin or Regulator */}
      <CrudModal
        open={userModal.open}
        title={
          userRegisterType === "admin"
            ? "Daftarkan Admin Baru"
            : "Daftarkan Regulator Baru"
        }
        subtitle={
          userRegisterType === "admin"
            ? "Endpoint: POST /api/admin/admin-users/register/"
            : "Endpoint: POST /api/admin/admin-users/register_regulator/"
        }
        onClose={userModal.closeModal}
        onSubmit={handleUserSubmit}
        submitLabel={submitting ? "Mendaftarkan..." : "Selesaikan Pendaftaran"}
        wide
      >
        <div className="flex gap-2 p-1 bg-fco-blue-light/50 dark:bg-fco-blue/15 rounded-xl mb-4 w-fit">
          <button
            type="button"
            onClick={() => setUserRegisterType("admin")}
            className={`h-9 px-4 rounded-lg text-xs sm:text-sm font-semibold border-none cursor-pointer transition-all ${
              userRegisterType === "admin"
                ? "bg-fco-blue text-white shadow-xs"
                : "bg-transparent text-soft hover:text-strong"
            }`}
          >
            Administrator KKP
          </button>
          <button
            type="button"
            onClick={() => setUserRegisterType("regulator")}
            className={`h-9 px-4 rounded-lg text-xs sm:text-sm font-semibold border-none cursor-pointer transition-all ${
              userRegisterType === "regulator"
                ? "bg-fco-blue text-white shadow-xs"
                : "bg-transparent text-soft hover:text-strong"
            }`}
          >
            Pengawas / Regulator Kuota
          </button>
        </div>

        {userRegisterType === "admin" ? (
          <div className="flex flex-col gap-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                label="Nama Pengguna (Username)"
                htmlFor="ad-user"
                required
              >
                <input
                  id="ad-user"
                  required
                  disabled={submitting}
                  value={adminForm.username}
                  onChange={(e) =>
                    setAdminForm({ ...adminForm, username: e.target.value })
                  }
                  placeholder="admin.kelautan"
                  className={inputCls}
                />
              </FormField>
              <FormField
                label="Kata Sandi (Min. 8 Karakter)"
                htmlFor="ad-pass"
                required
              >
                <input
                  id="ad-pass"
                  type="password"
                  required
                  disabled={submitting}
                  value={adminForm.password}
                  onChange={(e) =>
                    setAdminForm({ ...adminForm, password: e.target.value })
                  }
                  placeholder="••••••••"
                  className={inputCls}
                />
              </FormField>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="Nama Lengkap" htmlFor="ad-fn">
                <input
                  id="ad-fn"
                  disabled={submitting}
                  value={adminForm.full_name || ""}
                  onChange={(e) =>
                    setAdminForm({ ...adminForm, full_name: e.target.value })
                  }
                  placeholder="Drs. H. Sulaiman"
                  className={inputCls}
                />
              </FormField>
              <FormField label="Email" htmlFor="ad-mail">
                <input
                  id="ad-mail"
                  type="email"
                  disabled={submitting}
                  value={adminForm.email || ""}
                  onChange={(e) =>
                    setAdminForm({ ...adminForm, email: e.target.value })
                  }
                  placeholder="admin@kkp.go.id"
                  className={inputCls}
                />
              </FormField>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <FormField label="Telepon" htmlFor="ad-phone">
                <input
                  id="ad-phone"
                  disabled={submitting}
                  value={adminForm.phone || ""}
                  onChange={(e) =>
                    setAdminForm({ ...adminForm, phone: e.target.value })
                  }
                  placeholder="08xxxxxxxxxx"
                  className={inputCls}
                />
              </FormField>
              <FormField label="Departemen" htmlFor="ad-dept">
                <input
                  id="ad-dept"
                  disabled={submitting}
                  value={adminForm.department || ""}
                  onChange={(e) =>
                    setAdminForm({ ...adminForm, department: e.target.value })
                  }
                  placeholder="Ditjen Perikanan Tangkap"
                  className={inputCls}
                />
              </FormField>
              <FormField label="Peran Spesifik (Opsional)" htmlFor="ad-role">
                <select
                  id="ad-role"
                  disabled={submitting || roles.length === 0}
                  value={adminForm.role || ""}
                  onChange={(e) =>
                    setAdminForm({
                      ...adminForm,
                      role: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                  className={inputCls}
                >
                  <option value="">— Tetapkan Peran —</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                label="Nama Pengguna (Username)"
                htmlFor="reg-user"
                required
              >
                <input
                  id="reg-user"
                  required
                  disabled={submitting}
                  value={regulatorForm.username}
                  onChange={(e) =>
                    setRegulatorForm({
                      ...regulatorForm,
                      username: e.target.value,
                    })
                  }
                  placeholder="pengawas.benoa"
                  className={inputCls}
                />
              </FormField>
              <FormField
                label="Kata Sandi (Min. 8 Karakter)"
                htmlFor="reg-pass"
                required
              >
                <input
                  id="reg-pass"
                  type="password"
                  required
                  disabled={submitting}
                  value={regulatorForm.password}
                  onChange={(e) =>
                    setRegulatorForm({
                      ...regulatorForm,
                      password: e.target.value,
                    })
                  }
                  placeholder="••••••••"
                  className={inputCls}
                />
              </FormField>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                label="Nama Lengkap Pengawas"
                htmlFor="reg-name"
                required
              >
                <input
                  id="reg-name"
                  required
                  disabled={submitting}
                  value={regulatorForm.full_name}
                  onChange={(e) =>
                    setRegulatorForm({
                      ...regulatorForm,
                      full_name: e.target.value,
                    })
                  }
                  placeholder="Ir. Bambang Wijaya"
                  className={inputCls}
                />
              </FormField>
              <FormField label="Email Dinas" htmlFor="reg-mail" required>
                <input
                  id="reg-mail"
                  type="email"
                  required
                  disabled={submitting}
                  value={regulatorForm.email}
                  onChange={(e) =>
                    setRegulatorForm({
                      ...regulatorForm,
                      email: e.target.value,
                    })
                  }
                  placeholder="pengawas@kkp.go.id"
                  className={inputCls}
                />
              </FormField>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <FormField label="Nomor Telepon" htmlFor="reg-phone">
                <input
                  id="reg-phone"
                  disabled={submitting}
                  value={regulatorForm.phone || ""}
                  onChange={(e) =>
                    setRegulatorForm({
                      ...regulatorForm,
                      phone: e.target.value,
                    })
                  }
                  placeholder="08xxxxxxxxxx"
                  className={inputCls}
                />
              </FormField>
              <FormField label="Satuan Kerja / Dept" htmlFor="reg-dept">
                <input
                  id="reg-dept"
                  disabled={submitting}
                  value={regulatorForm.department || ""}
                  onChange={(e) =>
                    setRegulatorForm({
                      ...regulatorForm,
                      department: e.target.value,
                    })
                  }
                  placeholder="PSDKP Pangkalan Benoa"
                  className={inputCls}
                />
              </FormField>
              <FormField label="Posisi / Jabatan" htmlFor="reg-pos">
                <input
                  id="reg-pos"
                  disabled={submitting}
                  value={regulatorForm.position || ""}
                  onChange={(e) =>
                    setRegulatorForm({
                      ...regulatorForm,
                      position: e.target.value,
                    })
                  }
                  placeholder="Pengawas Kuota & Mutu"
                  className={inputCls}
                />
              </FormField>
            </div>
          </div>
        )}

        {submitting && (
          <div className="flex items-center justify-center gap-2 text-sm text-fco-blue pt-2">
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            <span>Mendaftarkan ke server backend...</span>
          </div>
        )}
      </CrudModal>
    </div>
  );
}
