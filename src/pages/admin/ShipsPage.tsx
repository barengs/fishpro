import { useEffect, useState } from "react";
import { PageToolbar } from "../../components/PageToolbar";
import { DataTable, type Column } from "../../components/DataTable";
import { CrudActions } from "../../components/FormField";
import { StatusChip } from "../../components/StatusChip";
import { CrudModal } from "../../components/CrudModal";
import { useCrudModal } from "../../components/useCrudModal";
import { ConfirmDeleteModal } from "../../components/ConfirmDeleteModal";
import { useConfirmDelete } from "../../components/useConfirmDelete";
import { DetailModal } from "../../components/DetailModal";
import { useDetailModal } from "../../components/useDetailModal";
import { ShipFormWizard } from "../../components/ShipFormWizard";
import { AlertBanner } from "../../components/ui";
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
  const [editingShip, setEditingShip] = useState<Ship | null>(null);
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
  const {
    selected: selectedShip,
    open: isDetailOpen,
    openDetail,
    closeDetail,
  } = useDetailModal<Ship>();

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
    const targetId = deleteTarget.id;
    try {
      await shipsService.delete(targetId);
      setRows((prev) => prev.filter((r) => r.id !== targetId));
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

  const handleOpenAdd = () => {
    setEditingShip(null);
    openModal();
  };

  const handleOpenEdit = (ship: Ship) => {
    setEditingShip(ship);
    openModal();
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

      if (editingShip) {
        await shipsService.update(editingShip.id, payload);
        setToastMsg(`Data kapal "${data.name}" berhasil diperbarui.`);
      } else {
        await shipsService.create(payload);
        setToastMsg(`Kapal "${data.name}" berhasil didaftarkan.`);
      }
      setTimeout(() => setToastMsg(null), 3000);
      closeModal();
      fetchShips(search);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan kapal";
      setErrorMsg(msg);
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
          onDetail={() => openDetail(r)}
          onEdit={() => handleOpenEdit(r)}
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
          columns={columns}
          rows={rows}
          rowKey={(r) => String(r.id)}
          loading={loading}
          emptyText="Belum ada data kapal terdaftar di server."
          onRowClick={openDetail}
        />
      </section>

      <DetailModal
        open={isDetailOpen}
        title={selectedShip?.name || "Detail Kapal"}
        subtitle="Spesifikasi teknis, identitas registrasi, dan penugasan kapal."
        badge={
          selectedShip ? (
            <StatusChip
              label={selectedShip.active ? "Aktif Beroperasi" : "Nonaktif"}
              bg={selectedShip.active ? undefined : "#EEF1F6"}
              color={selectedShip.active ? undefined : "#4A5872"}
            />
          ) : undefined
        }
        onClose={closeDetail}
        actions={
          selectedShip && (
            <button
              type="button"
              onClick={() => {
                const target = selectedShip;
                closeDetail();
                handleOpenEdit(target);
              }}
              className="h-9 px-3.5 rounded-lg border border-fco-border-subtle surface-inset hover:surface-page text-xs font-semibold text-fco-blue cursor-pointer transition-colors"
            >
              Ubah Data
            </button>
          )
        }
        fields={[
          {
            label: "Nomor Registrasi",
            value: selectedShip?.registration_number,
          },
          {
            label: "Gross Tonnage (GT)",
            value: `${selectedShip?.gross_tonnage ?? "—"} GT`,
          },
          {
            label: "Pemilik (Owner)",
            value:
              selectedShip?.owner_name ||
              (selectedShip?.owner ? `#${selectedShip?.owner}` : "—"),
          },
          {
            label: "Nahkoda (Captain)",
            value:
              selectedShip?.captain_name ||
              (selectedShip?.captain ? `#${selectedShip?.captain}` : "—"),
          },
          {
            label: "Dimensi Kapal (P x L)",
            value:
              selectedShip?.length && selectedShip?.width
                ? `${selectedShip.length} m x ${selectedShip.width} m`
                : "—",
          },
          {
            label: "Tahun Pembuatan",
            value: selectedShip?.year_built || "—",
          },
          {
            label: "Pelabuhan Pangkalan",
            value: selectedShip?.home_port || "—",
            fullWidth: true,
          },
        ]}
      />

      <CrudModal
        open={open}
        title={editingShip ? "Ubah Data Kapal" : "Tambah Kapal Baru"}
        subtitle="3 langkah: identitas, spesifikasi teknis, cek ringkasan."
        onClose={closeModal}
        hideFooter
      >
        <ShipFormWizard
          key={editingShip?.id ?? "new"}
          initialData={editingShip}
          onSubmit={handleSubmit}
        />
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
