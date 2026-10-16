import { useEffect, useState } from "react";
import { PageToolbar } from "../../components/PageToolbar";
import { DataTable, type Column } from "../../components/DataTable";
import { CrudActions } from "../../components/FormField";
import { useCrudModal } from "../../components/useCrudModal";
import { ConfirmDeleteModal } from "../../components/ConfirmDeleteModal";
import { useConfirmDelete } from "../../components/useConfirmDelete";
import { AlertBanner } from "../../components/ui";
import { OwnerModal } from "../../components/modals/OwnerModal";
import {
  ownersService,
  type Owner,
  type CreateOwnerPayload,
} from "../../services/owners";

export function OwnersTab() {
  const [rows, setRows] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingOwner, setEditingOwner] = useState<Owner | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const {
    target: deleteTarget,
    open: isDeleteOpen,
    requestDelete,
    cancelDelete,
  } = useConfirmDelete<{ id: number; name: string }>();

  const ownerModal = useCrudModal();

  const fetchOwners = async (query?: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await ownersService.getAll(query);
      setRows(data);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Gagal memuat data pemilik";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOwners(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleOpenAdd = () => {
    setEditingOwner(null);
    setErrorMsg(null);
    ownerModal.openModal();
  };

  const handleOpenEdit = (owner: Owner) => {
    setEditingOwner(owner);
    setErrorMsg(null);
    ownerModal.openModal();
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await ownersService.delete(deleteTarget.id);
      setToastMsg(`Pemilik "${deleteTarget.name}" berhasil dihapus.`);
      setTimeout(() => setToastMsg(null), 3000);
      cancelDelete();
      fetchOwners(search);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Gagal menghapus data pemilik";
      setErrorMsg(msg);
    } finally {
      setDeleting(false);
    }
  };

  const handleModalSubmit = async (payload: CreateOwnerPayload) => {
    if (editingOwner) {
      await ownersService.update(editingOwner.id, payload);
      setToastMsg(`Data pemilik "${payload.full_name}" berhasil diperbarui.`);
    } else {
      await ownersService.create(payload);
      setToastMsg(`Pemilik baru "${payload.full_name}" berhasil didaftarkan.`);
    }
    setTimeout(() => setToastMsg(null), 3000);
    fetchOwners(search);
  };

  const cols: Column<Owner>[] = [
    {
      key: "name",
      header: "Nama / Tipe",
      flex: 3,
      render: (r) => (
        <div>
          <div className="text-sm font-semibold">{r.full_name}</div>
          <div className="text-xs text-soft">
            {r.owner_type === "company" ? "Perusahaan" : "Perorangan"}
            {r.ships && r.ships.length > 0 && ` · ${r.ships.length} Kapal`}
          </div>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      flex: 2,
      render: (r) => <span className="text-sm">{r.email || "—"}</span>,
    },
    {
      key: "phone",
      header: "Telepon",
      flex: 2,
      render: (r) => (
        <span className="text-sm tabular-nums">{r.phone || "—"}</span>
      ),
    },
    {
      key: "address",
      header: "Alamat",
      flex: 2,
      render: (r) => (
        <span className="text-xs text-soft truncate max-w-40 block">
          {r.address || "—"}
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
          onEdit={() => handleOpenEdit(r)}
          onDelete={() => requestDelete({ id: r.id, name: r.full_name })}
        />
      ),
    },
  ];

  return (
    <div>
      <PageToolbar
        title="Pemilik"
        desc="Kelola data pemilik kapal (perorangan atau perusahaan) terintegrasi API backend."
        searchPlaceholder="Cari pemilik kapal..."
        searchValue={search}
        onSearchChange={setSearch}
        addLabel="Tambah pemilik"
        onAdd={handleOpenAdd}
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
          columns={cols}
          rows={rows}
          rowKey={(r) => String(r.id)}
          loading={loading}
          emptyText="Belum ada data pemilik terdaftar di server."
        />
      </section>

      <OwnerModal
        open={ownerModal.open}
        onClose={ownerModal.closeModal}
        onSubmit={handleModalSubmit}
        editingOwner={editingOwner}
      />

      <ConfirmDeleteModal
        open={isDeleteOpen}
        title="Hapus Data Pemilik"
        itemName={deleteTarget?.name}
        message="Apakah Anda yakin ingin menghapus data pemilik ini? Seluruh kapal yang terhubung akan kehilangan data relasi pemilik."
        loading={deleting}
        onClose={cancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
