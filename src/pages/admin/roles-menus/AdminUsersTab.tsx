import { useEffect, useState } from "react";
import { DataTable, type Column } from "../../../components/DataTable";
import { useCrudModal } from "../../../components/useCrudModal";
import { PageToolbar } from "../../../components/PageToolbar";
import { StatusChip } from "../../../components/StatusChip";
import { AlertBanner } from "../../../components/ui";
import { AdminUserModal } from "./AdminUserModal";
import {
  adminUsersService,
  rolesService,
  type AdminUser,
  type RegisterAdminPayload,
  type RegisterRegulatorPayload,
  type Role,
} from "../../../services/admin";

export function AdminUsersTab() {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const userModal = useCrudModal();

  const fetchData = async (query?: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const [userData, rData] = await Promise.all([
        adminUsersService.getAll(query),
        rolesService.getAll(),
      ]);
      setAdminUsers(userData);
      setRoles(rData);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Gagal memuat pengguna admin",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleUserSubmit = async (
    type: "admin" | "regulator",
    adminForm: RegisterAdminPayload,
    regulatorForm: RegisterRegulatorPayload,
  ) => {
    try {
      if (type === "admin") {
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
      fetchData(search);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Gagal mendaftarkan pengguna",
      );
      throw err;
    }
  };

  const userCols: Column<AdminUser>[] = [
    {
      key: "user",
      header: "Pengguna / Username",
      flex: 3,
      render: (r) => (
        <div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-sm font-semibold">
              {r.admin_profile?.full_name || r.username}
            </span>
            <span className="sm:hidden">
              <StatusChip
                label={r.is_active ? "Aktif" : "Nonaktif"}
                bg={r.is_active ? undefined : "#EEF1F6"}
                color={r.is_active ? undefined : "#4A5872"}
              />
            </span>
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
      hideOnMobile: true,
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
      hideOnMobile: true,
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
      hideOnMobile: true,
      render: (r) =>
        r.is_active ? (
          <StatusChip label="Aktif" />
        ) : (
          <StatusChip label="Nonaktif" bg="#EEF1F6" color="#4A5872" />
        ),
    },
  ];

  return (
    <div>
      <PageToolbar
        searchPlaceholder="Cari pengguna admin..."
        searchValue={search}
        onSearchChange={setSearch}
        addLabel="Daftarkan Pengguna"
        onAdd={() => {
          userModal.openModal();
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

      <DataTable
        columns={userCols}
        rows={adminUsers}
        rowKey={(r) => String(r.id)}
        loading={loading}
        emptyText="Belum ada akun admin terdaftar di server."
      />

      <AdminUserModal
        open={userModal.open}
        onClose={userModal.closeModal}
        onSubmit={handleUserSubmit}
        roles={roles}
      />
    </div>
  );
}
