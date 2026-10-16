import { useEffect, useState } from "react";
import { DataTable, type Column } from "../../../components/DataTable";
import { CrudActions } from "../../../components/FormField";
import { CrudModal } from "../../../components/CrudModal";
import { useCrudModal } from "../../../components/useCrudModal";
import { ConfirmDeleteModal } from "../../../components/ConfirmDeleteModal";
import { useConfirmDelete } from "../../../components/useConfirmDelete";
import { PageToolbar } from "../../../components/PageToolbar";
import { AlertBanner, TextField, TextareaField } from "../../../components/ui";
import { roleSchema } from "../../../utils/schemas";
import {
  rolesService,
  type CreateRolePayload,
  type Role,
} from "../../../services/admin";

export function RolesTab() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [search, setSearch] = useState("");
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

  const roleModal = useCrudModal();
  const [rForm, setRForm] = useState<CreateRolePayload>({
    name: "",
    description: "",
  });
  const [editingRoleId, setEditingRoleId] = useState<number | null>(null);

  const fetchRoles = async (query?: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await rolesService.getAll(query);
      setRoles(data);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Gagal memuat peran");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRoles(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = roleSchema.safeParse(rForm);
    if (!parsed.success) {
      setErrorMsg(parsed.error.issues[0]?.message || "Nama peran belum valid.");
      return;
    }
    setSubmitting(true);
    try {
      const payload: CreateRolePayload = {
        name: rForm.name.trim(),
        description: rForm.description?.trim() || "",
        ...(rForm.permissions_ids && rForm.permissions_ids.length > 0
          ? { permissions_ids: rForm.permissions_ids }
          : {}),
      };

      if (editingRoleId) {
        await rolesService.update(editingRoleId, payload);
        setToastMsg(`Peran "${rForm.name}" berhasil diperbarui.`);
      } else {
        await rolesService.create(payload);
        setToastMsg(`Peran baru "${rForm.name}" berhasil dibuat.`);
      }
      setTimeout(() => setToastMsg(null), 3000);
      roleModal.closeModal();
      fetchRoles(search);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Gagal menyimpan peran");
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await rolesService.delete(deleteTarget.id);
      setToastMsg(`Peran "${deleteTarget.name}" berhasil dihapus.`);
      setTimeout(() => setToastMsg(null), 3000);
      cancelDelete();
      fetchRoles(search);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Gagal menghapus peran");
    } finally {
      setDeleting(false);
    }
  };

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
      header: "Tingkat Akses",
      flex: 2,
      render: (r) => {
        const isAdmin = r.name.toLowerCase() === "admin";
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              isAdmin
                ? "bg-purple-500/10 text-purple-700 dark:text-purple-300"
                : "bg-blue-500/10 text-fco-blue dark:text-blue-400"
            }`}
          >
            {isAdmin ? "Akses Penuh (Super Admin)" : "Akses Menu Terbatas"}
          </span>
        );
      },
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
            const existingPerms =
              r.permissions?.map((p) => (typeof p === "number" ? p : p.id)) ||
              r.permissions_ids ||
              [];
            setRForm({
              name: r.name,
              description: r.description || "",
              permissions_ids: existingPerms,
            });
            roleModal.openModal();
          }}
          onDelete={() => requestDelete({ id: r.id, name: r.name })}
        />
      ),
    },
  ];

  return (
    <div>
      <PageToolbar
        searchPlaceholder="Cari nama peran..."
        searchValue={search}
        onSearchChange={setSearch}
        addLabel="Tambah Peran"
        onAdd={() => {
          setEditingRoleId(null);
          setRForm({ name: "", description: "" });
          roleModal.openModal();
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
          columns={roleCols}
          rows={roles}
          rowKey={(r) => String(r.id)}
          loading={loading}
          emptyText="Belum ada data peran terdaftar di server."
        />
      </section>

      <CrudModal
        open={roleModal.open}
        title={editingRoleId ? "Ubah Nama Peran" : "Buat Peran Baru"}
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
        <TextField
          label="Nama Peran"
          id="rl-name"
          required
          disabled={submitting}
          value={rForm.name}
          onChange={(e) => setRForm({ ...rForm, name: e.target.value })}
          placeholder="Contoh: surveyor_kkp atau staf_pelabuhan"
        />
        <TextareaField
          label="Deskripsi Peran"
          id="rl-desc"
          optional
          disabled={submitting}
          value={rForm.description || ""}
          onChange={(e) => setRForm({ ...rForm, description: e.target.value })}
          placeholder="Penjelasan wewenang dan tanggung jawab peran..."
        />
      </CrudModal>

      <ConfirmDeleteModal
        open={isDeleteOpen}
        title="Hapus Peran Pengguna"
        itemName={deleteTarget?.name}
        message="Apakah Anda yakin ingin menghapus peran ini? Seluruh izin akses dan penugasan peran pada pengguna akan dicabut."
        loading={deleting}
        onClose={cancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
