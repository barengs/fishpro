import { useEffect, useState } from "react";
import { PageToolbar } from "../../components/PageToolbar";
import { DataTable, type Column } from "../../components/DataTable";
import { CrudActions } from "../../components/FormField";
import { useCrudModal } from "../../components/useCrudModal";
import { ConfirmDeleteModal } from "../../components/ConfirmDeleteModal";
import { useConfirmDelete } from "../../components/useConfirmDelete";
import { DetailModal } from "../../components/DetailModal";
import { useDetailModal } from "../../components/useDetailModal";
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
  const {
    selected: selectedOwner,
    open: isDetailOpen,
    openDetail,
    closeDetail,
  } = useDetailModal<Owner>();

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
    const targetId = deleteTarget.id;
    try {
      await ownersService.delete(targetId);
      setRows((prev) => prev.filter((r) => r.id !== targetId));
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
        <div className="min-w-0">
          <div className="text-sm font-semibold truncate" title={r.full_name}>
            {r.full_name}
          </div>
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
      hideOnMobile: true,
      render: (r) => (
        <span
          className="text-sm truncate block max-w-full"
          title={r.email || ""}
        >
          {r.email || "—"}
        </span>
      ),
    },
    {
      key: "phone",
      header: "Telepon",
      flex: 2,
      hideOnMobile: true,
      render: (r) => (
        <span
          className="text-sm tabular-nums truncate block max-w-full"
          title={r.phone || ""}
        >
          {r.phone || "—"}
        </span>
      ),
    },
    {
      key: "address",
      header: "Alamat",
      flex: 2,
      hideOnMobile: true,
      render: (r) => (
        <span
          className="text-xs text-soft truncate block max-w-full"
          title={r.address || ""}
        >
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
          onDetail={() => openDetail(r)}
          onEdit={() => handleOpenEdit(r)}
          onDelete={() => requestDelete({ id: r.id, name: r.full_name })}
        />
      ),
    },
  ];

  return (
    <div>
      <PageToolbar
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

      <DataTable
        columns={cols}
        rows={rows}
        rowKey={(r) => String(r.id)}
        loading={loading}
        emptyText="Belum ada data pemilik terdaftar di server."
        onRowClick={openDetail}
      />

      <DetailModal
        open={isDetailOpen}
        title={selectedOwner?.full_name || "Detail Pemilik Kapal"}
        subtitle="Identitas legalitas pemilik kapal atau perusahaan perikanan."
        badge={
          selectedOwner ? (
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-xs bg-blue-500/10 text-fco-blue">
              {selectedOwner.owner_type === "company"
                ? "Perusahaan (PT/CV)"
                : "Perorangan"}
            </span>
          ) : undefined
        }
        onClose={closeDetail}
        actions={
          selectedOwner && (
            <button
              type="button"
              onClick={() => {
                const target = selectedOwner;
                closeDetail();
                handleOpenEdit(target);
              }}
              className="h-10 px-4 rounded-xl border border-fco-border dark:border-fco-border-dark surface-card hover:surface-page text-sm font-semibold text-fco-blue cursor-pointer transition-colors"
            >
              Ubah Data
            </button>
          )
        }
        fields={[
          {
            label: "Nama Lengkap / Perusahaan",
            value: selectedOwner?.full_name,
          },
          {
            label: "Tipe Kepemilikan",
            value:
              selectedOwner?.owner_type === "company"
                ? "Perusahaan Resmi"
                : "Perorangan / Pribadi",
          },
          {
            label: "Email",
            value: selectedOwner?.email || "—",
          },
          {
            label: "Nomor Telepon",
            value: selectedOwner?.phone || "—",
          },
          {
            label: "Alamat Kantor / Domisili",
            value: selectedOwner?.address || "Tidak ada alamat terdaftar.",
            fullWidth: true,
          },
          {
            label: "Armada Kapal Terdaftar",
            value:
              (selectedOwner?.ships || []).length > 0
                ? `${selectedOwner?.ships?.length} Kapal Terdaftar`
                : "Belum memiliki kapal",
            fullWidth: true,
          },
        ]}
      />

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
