import { useCallback, useEffect, useState } from "react";
import { PageToolbar } from "../../components/PageToolbar";
import { DataTable, type Column } from "../../components/DataTable";
import { CrudActions } from "../../components/FormField";
import { StatusChip } from "../../components/StatusChip";
import { ProgressBar } from "../../components/ProgressBar";
import { CrudModal } from "../../components/CrudModal";
import { useCrudModal } from "../../components/useCrudModal";
import { ConfirmDeleteModal } from "../../components/ConfirmDeleteModal";
import { useConfirmDelete } from "../../components/useConfirmDelete";
import { DetailModal } from "../../components/DetailModal";
import { useDetailModal } from "../../components/useDetailModal";
import { ShipFormWizard } from "../../components/ShipFormWizard";
import { useToast } from "../../components/toast";
import type { ShipFormData } from "../../components/shipFormTypes";
import {
  shipsService,
  type Ship,
  type CreateShipPayload,
} from "../../services/ships";
import { authService } from "../../services/auth";

export function FleetPage() {
  const [rows, setRows] = useState<Ship[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const toast = useToast();
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

  const currentUser = authService.getStoredUser();
  const currentOwnerId = currentUser?.id;

  const fetchFleet = useCallback(
    async (query?: string) => {
      setLoading(true);
      setErrorMsg(null);
      try {
        // If we have current owner ID, we can get ships by owner; otherwise get all matching
        let data: Ship[] = [];
        if (currentOwnerId && !query) {
          data = await shipsService
            .getByOwner(currentOwnerId)
            .catch(() => shipsService.getAll(query));
        } else {
          data = await shipsService.getAll(query);
        }
        setRows(data);
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Gagal memuat data armada kapal";
        setErrorMsg(msg);
      } finally {
        setLoading(false);
      }
    },
    [currentOwnerId],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFleet(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, fetchFleet]);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await shipsService.delete(deleteTarget.id);
      toast.success(`Kapal "${deleteTarget.name}" berhasil dihapus.`);
      cancelDelete();
      fetchFleet(search);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus kapal";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async (data: ShipFormData) => {
    try {
      const payload: CreateShipPayload = {
        name: data.name.trim(),
        registration_number: data.registration_number.trim(),
        owner:
          currentOwnerId || (data.owner ? Number(data.owner) || null : null),
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
      toast.success(`Kapal "${data.name}" berhasil didaftarkan ke armada.`);
      closeModal();
      fetchFleet(search);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Gagal mendaftarkan kapal";
      toast.error(msg);
    }
  };

  const cols: Column<Ship>[] = [
    {
      key: "ship",
      header: "Kapal / Registrasi",
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
      key: "cap",
      header: "Nahkoda",
      flex: 2,
      render: (r) => (
        <span className="text-sm">
          {r.captain_name || (
            <span className="text-amber-600 dark:text-amber-400 font-medium">
              Belum ditunjuk
            </span>
          )}
        </span>
      ),
    },
    {
      key: "q",
      header: "Sisa Kuota",
      flex: 3,
      render: (r) => {
        const quota = r.current_year_quota;
        return (
          <ProgressBar
            width={quota ? `${quota.quota_percentage}%` : "0%"}
            showText={Boolean(quota)}
          />
        );
      },
    },
    {
      key: "st",
      header: "Status",
      flex: 1,
      align: "center",
      render: (r) =>
        !r.active ? (
          <StatusChip label="Nonaktif" bg="#EEF1F6" color="#4A5872" />
        ) : !r.captain ? (
          <StatusChip label="Tanpa nahkoda" bg="#FFF1E0" color="#B54708" />
        ) : (
          <StatusChip label="Aktif" />
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
          onDelete={() => requestDelete({ id: r.id, name: r.name })}
        />
      ),
    },
  ];

  return (
    <div>
      <PageToolbar
        title="Armada Kapal"
        desc="Kelola kapal milik armada Anda (nama, registrasi SIPI, GT, penunjukan nahkoda, status izin)."
        searchPlaceholder="Cari armada..."
        searchValue={search}
        onSearchChange={setSearch}
        addLabel="Tambah kapal"
        onAdd={openModal}
      />

      {errorMsg && (
        <div className="p-3.5 px-4.5 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 text-sm font-semibold mb-5 border border-red-200 dark:border-red-500/20">
          ⚠ {errorMsg}
        </div>
      )}

      <section className="surface-card border rounded-xl p-6 shadow-xs">
        <DataTable
          columns={cols}
          rows={rows}
          rowKey={(r) => String(r.id)}
          loading={loading}
          emptyText="Belum ada kapal terdaftar dalam armada Anda."
          onRowClick={openDetail}
        />
      </section>

      <DetailModal
        open={isDetailOpen}
        title={selectedShip?.name || "Detail Kapal Armada"}
        subtitle="Data registrasi, spesifikasi kapal, dan kesiapan operasi armada Anda."
        badge={
          selectedShip ? (
            <StatusChip
              label={
                !selectedShip.active
                  ? "Nonaktif"
                  : !selectedShip.captain
                    ? "Tanpa Nahkoda"
                    : "Siap Operasi"
              }
              bg={
                !selectedShip.active || !selectedShip.captain
                  ? "#FFF1E0"
                  : undefined
              }
              color={
                !selectedShip.active || !selectedShip.captain
                  ? "#B54708"
                  : undefined
              }
            />
          ) : undefined
        }
        onClose={closeDetail}
        fields={[
          {
            label: "Nomor Registrasi (SIPI)",
            value: (
              <span className="font-mono font-bold text-fco-blue">
                {selectedShip?.registration_number}
              </span>
            ),
          },
          {
            label: "Nahkoda Bertugas",
            value:
              selectedShip?.captain_name ||
              (selectedShip?.captain
                ? `#${selectedShip?.captain}`
                : "Belum ditugaskan"),
          },
          {
            label: "Gross Tonnage (GT)",
            value: `${selectedShip?.gross_tonnage ?? "—"} GT`,
          },
          {
            label: "Dimensi Kapal",
            value:
              selectedShip?.length && selectedShip?.width
                ? `${selectedShip.length} m x ${selectedShip.width} m`
                : "—",
          },
          {
            label: "Sisa Kuota Tahunan",
            value:
              selectedShip?.current_year_quota &&
              typeof selectedShip.current_year_quota === "object"
                ? `${Number(selectedShip.current_year_quota.remaining_quota).toLocaleString("id-ID")} kg (dari ${Number(selectedShip.current_year_quota.total_quota).toLocaleString("id-ID")} kg)`
                : "Tidak ada data kuota aktif",
            fullWidth: true,
          },
        ]}
      />

      <CrudModal
        open={open}
        title="Tambah kapal ke armada"
        subtitle="3 langkah: identitas, spesifikasi teknis, cek ringkasan."
        onClose={closeModal}
        hideFooter
      >
        <ShipFormWizard onSubmit={handleSubmit} fixedOwnerId={currentOwnerId} />
      </CrudModal>

      <ConfirmDeleteModal
        open={isDeleteOpen}
        title="Hapus Kapal dari Armada"
        itemName={deleteTarget?.name}
        message="Apakah Anda yakin ingin menghapus kapal ini dari armada? Seluruh histori dan penugasan nahkoda akan terputus."
        loading={deleting}
        onClose={cancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
