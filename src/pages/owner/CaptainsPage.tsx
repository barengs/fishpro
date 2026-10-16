import { useEffect, useState } from "react";
import { PageToolbar } from "../../components/PageToolbar";
import { DataTable, type Column } from "../../components/DataTable";
import { useCrudModal } from "../../components/useCrudModal";
import { ConfirmDeleteModal } from "../../components/ConfirmDeleteModal";
import { useConfirmDelete } from "../../components/useConfirmDelete";
import { CrudActions } from "../../components/FormField";
import { AlertBanner } from "../../components/ui";
import { CaptainModal } from "../../components/modals/CaptainModal";
import {
  captainsService,
  type Captain,
  type CreateCaptainPayload,
} from "../../services/captains";
import { authService } from "../../services/auth";

export function CaptainsPage() {
  const [rows, setRows] = useState<Captain[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingCaptain, setEditingCaptain] = useState<Captain | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const {
    target: deleteTarget,
    open: isDeleteOpen,
    requestDelete,
    cancelDelete,
  } = useConfirmDelete<{ id: number; name: string }>();

  const captainModal = useCrudModal();

  const currentUser = authService.getStoredUser();
  const currentOwnerId = currentUser?.id || 1;

  const fetchCaptains = async (query?: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await captainsService.getAll(query);
      setRows(data);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Gagal memuat data nahkoda";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCaptains(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleOpenAdd = () => {
    setEditingCaptain(null);
    setErrorMsg(null);
    captainModal.openModal();
  };

  const handleOpenEdit = (captain: Captain) => {
    setEditingCaptain(captain);
    setErrorMsg(null);
    captainModal.openModal();
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await captainsService.delete(deleteTarget.id);
      setToastMsg(`Nahkoda "${deleteTarget.name}" berhasil dihapus.`);
      setTimeout(() => setToastMsg(null), 3000);
      cancelDelete();
      fetchCaptains(search);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Gagal menghapus nahkoda";
      setErrorMsg(msg);
    } finally {
      setDeleting(false);
    }
  };

  const handleModalSubmit = async (payload: CreateCaptainPayload) => {
    if (editingCaptain) {
      await captainsService.update(editingCaptain.id, payload);
      setToastMsg(`Data nahkoda "${payload.full_name}" berhasil diperbarui.`);
    } else {
      await captainsService.create(payload);
      setToastMsg(`Nahkoda baru "${payload.full_name}" berhasil ditunjuk.`);
    }
    setTimeout(() => setToastMsg(null), 3000);
    fetchCaptains(search);
  };

  const cols: Column<Captain>[] = [
    {
      key: "name",
      header: "Nahkoda / Lisensi",
      flex: 3,
      render: (r) => (
        <div>
          <div className="text-sm font-semibold">{r.full_name}</div>
          <div className="text-xs text-soft tabular-nums">
            {r.license_number}
            {r.ships &&
              r.ships.length > 0 &&
              ` · ${r.ships.map((s) => s.name).join(", ")}`}
          </div>
        </div>
      ),
    },
    {
      key: "exp",
      header: "Pengalaman",
      flex: 1,
      align: "center",
      render: (r) => (
        <span className="text-sm tabular-nums">
          {r.years_of_experience ? `${r.years_of_experience} th` : "—"}
        </span>
      ),
    },
    {
      key: "phone",
      header: "Kontak",
      flex: 2,
      render: (r) => (
        <span className="text-sm tabular-nums">
          {r.phone || r.contact_info || "—"}
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
        title="Nahkoda Armada"
        desc="Kelola nahkoda berlisensi yang bertugas mengoperasikan kapal armada Anda."
        searchPlaceholder="Cari nahkoda / lisensi..."
        searchValue={search}
        onSearchChange={setSearch}
        addLabel="Tunjuk nahkoda"
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
          emptyText="Belum ada nahkoda ditunjuk dalam armada Anda."
        />
      </section>

      <CaptainModal
        open={captainModal.open}
        onClose={captainModal.closeModal}
        onSubmit={handleModalSubmit}
        editingCaptain={editingCaptain}
        fixedOwnerId={currentOwnerId}
      />

      <ConfirmDeleteModal
        open={isDeleteOpen}
        title="Hapus Nahkoda dari Armada"
        itemName={deleteTarget?.name}
        message="Apakah Anda yakin ingin menghapus nahkoda ini? Kapal yang ditugaskan kepada nahkoda ini akan menjadi tanpa nahkoda."
        loading={deleting}
        onClose={cancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
