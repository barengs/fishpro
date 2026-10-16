import { useEffect, useState } from "react";
import { PageToolbar } from "../../components/PageToolbar";
import { DataTable, type Column } from "../../components/DataTable";
import { CrudActions } from "../../components/FormField";
import { StatusChip } from "../../components/StatusChip";
import { CrudModal } from "../../components/CrudModal";
import { useCrudModal } from "../../components/useCrudModal";
import { ConfirmDeleteModal } from "../../components/ConfirmDeleteModal";
import { useConfirmDelete } from "../../components/useConfirmDelete";
import { ShipFormWizard } from "../../components/ShipFormWizard";
import type { ShipFormData } from "../../components/shipFormTypes";
import {
  shipsService,
  type Ship,
  type CreateShipPayload,
} from "../../services/ships";

export function ShipsPage() {
  const [rows, setRows] = useState<Ship[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { open, openModal, closeModal } = useCrudModal();
  const {
    target: deleteTarget,
    open: isDeleteOpen,
    requestDelete,
    cancelDelete,
  } = useConfirmDelete<{ id: number; name: string }>();

  const fetchShips = async (query?: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await shipsService.getAll(query);
      setRows(data);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Gagal memuat data kapal";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchShips(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await shipsService.delete(deleteTarget.id);
      setToastMsg(`Kapal "${deleteTarget.name}" berhasil dihapus.`);
      setTimeout(() => setToastMsg(null), 3000);
      cancelDelete();
      fetchShips(search);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus kapal";
      setErrorMsg(msg);
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async (data: ShipFormData) => {
    try {
      const payload: CreateShipPayload = {
        name: data.name.trim(),
        registration_number: data.registration_number.trim(),
        owner: data.owner ? Number(data.owner) || null : null,
        captain: data.captain ? Number(data.captain) || null : null,
        length: data.length ? parseFloat(data.length) : null,
        width: data.width ? parseFloat(data.width) : null,
        gross_tonnage: data.gross_tonnage
          ? parseFloat(data.gross_tonnage)
          : null,
        year_built: data.year_built ? Number(data.year_built) : null,
        home_port: data.home_port?.trim() || null,
        active: data.active,
      };

      await shipsService.create(payload);
      setToastMsg(`Kapal "${data.name}" berhasil didaftarkan.`);
      setTimeout(() => setToastMsg(null), 3000);
      closeModal();
      fetchShips(search);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan kapal";
      alert(msg);
    }
  };

  const columns: Column<Ship>[] = [
    {
      key: "name",
      header: "Nama / Registrasi",
      flex: 3,
      render: (r) => (
        <div>
          <div className="text-sm font-semibold">{r.name}</div>
          <div className="text-xs text-soft tabular-nums">
            {r.registration_number}
            {r.home_port && ` · ${r.home_port}`}
          </div>
        </div>
      ),
    },
    {
      key: "owner",
      header: "Pemilik",
      flex: 2,
      render: (r) => (
        <span className="text-sm">
          {r.owner_name || (r.owner ? `Owner #${r.owner}` : "—")}
        </span>
      ),
    },
    {
      key: "captain",
      header: "Nahkoda",
      flex: 2,
      render: (r) => (
        <span className="text-sm">
          {r.captain_name || (r.captain ? `Captain #${r.captain}` : "—")}
        </span>
      ),
    },
    {
      key: "gt",
      header: "GT",
      flex: 1,
      align: "right",
      render: (r) => (
        <span className="text-sm tabular-nums">{r.gross_tonnage ?? "—"}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      flex: 1,
      align: "center",
      render: (r) =>
        r.active ? (
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
          onDelete={() => requestDelete({ id: r.id, name: r.name })}
        />
      ),
    },
  ];

  return (
    <div>
      <PageToolbar
        title="Kapal Nasional"
        desc="Daftar seluruh kapal penangkap ikan terdaftar di sistem KKP (nama, registrasi, GT, pemilik, nahkoda)."
        searchPlaceholder="Cari nama / nomor registrasi..."
        searchValue={search}
        onSearchChange={setSearch}
        addLabel="Tambah kapal"
        onAdd={openModal}
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

      <section className="surface-card border rounded-xl p-6 shadow-xs">
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(r) => String(r.id)}
          loading={loading}
          emptyText="Belum ada data kapal terdaftar di server."
        />
      </section>

      <CrudModal
        open={open}
        title="Tambah kapal baru"
        subtitle="3 langkah: identitas, spesifikasi teknis, cek ringkasan."
        onClose={closeModal}
        hideFooter
      >
        <ShipFormWizard onSubmit={handleSubmit} />
      </CrudModal>

      <ConfirmDeleteModal
        open={isDeleteOpen}
        title="Hapus Kapal Nasional"
        itemName={deleteTarget?.name}
        message="Apakah Anda yakin ingin menghapus kapal ini dari sistem KKP? Data operasional kapal akan dihapus permanen."
        loading={deleting}
        onClose={cancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
