import { useCallback, useEffect, useState } from "react";
import { PageToolbar } from "../../components/PageToolbar";
import { DataTable, type Column } from "../../components/DataTable";
import { useCrudModal } from "../../components/useCrudModal";
import { ConfirmDeleteModal } from "../../components/ConfirmDeleteModal";
import { useConfirmDelete } from "../../components/useConfirmDelete";
import { DetailModal } from "../../components/DetailModal";
import { useDetailModal } from "../../components/useDetailModal";
import { CrudActions } from "../../components/FormField";
import { AlertBanner } from "../../components/ui";
import { CaptainModal } from "../../components/modals/CaptainModal";
import {
  captainsService,
  type Captain,
  type CreateCaptainPayload,
} from "../../services/captains";
import { shipsService } from "../../services/ships";
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
  const {
    selected: selectedCaptain,
    open: isDetailOpen,
    openDetail,
    closeDetail,
  } = useDetailModal<Captain>();

  const captainModal = useCrudModal();

  const currentUser = authService.getStoredUser();
  const currentOwnerId =
    currentUser?.profile?.owner_id ||
    currentUser?.profile?.id ||
    currentUser?.id;
  const currentOwnerKey = `${currentOwnerId || ""}-${currentUser?.profile?.name || currentUser?.profile?.full_name || currentUser?.username || ""}`;

  const fetchCaptains = useCallback(async (query?: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const user = authService.getStoredUser();
      const ownerId = user?.profile?.owner_id || user?.profile?.id || user?.id;
      const ownerName = (
        user?.profile?.name ||
        user?.profile?.full_name ||
        user?.username ||
        ""
      )
        .toLowerCase()
        .trim();

      const [captainsData, ownerShips] = await Promise.all([
        captainsService.getAll(query),
        shipsService.getFleetForOwner(user).catch(() => []),
      ]);

      const ownerShipIds = new Set(ownerShips.map((s) => s.id));
      const ownerShipRegs = new Set(
        ownerShips.map((s) => s.registration_number.toLowerCase().trim()),
      );
      const ownerAssignedCaptainIds = new Set(
        ownerShips.map((s) => s.captain).filter((c): c is number => Boolean(c)),
      );
      const ownerAssignedCaptainNames = new Set(
        ownerShips
          .map((s) => s.captain_name?.toLowerCase().trim())
          .filter((n): n is string => Boolean(n)),
      );

      // Filter kepemilikan armada agar hanya menampilkan nahkoda milik armada owner yang sedang login
      const ownerCaptains = captainsData.filter((c) => {
        // 1. Relasi langsung pemilik
        if (ownerId && c.owner === ownerId) return true;
        if (
          ownerName &&
          c.owner_name &&
          c.owner_name.toLowerCase().trim() === ownerName
        ) {
          return true;
        }
        // 2. Nahkoda yang ditunjuk pada kapal milik armada owner (KM Bintang Laut -> yahya)
        if (ownerAssignedCaptainIds.has(c.id)) return true;
        if (
          c.full_name &&
          ownerAssignedCaptainNames.has(c.full_name.toLowerCase().trim())
        ) {
          return true;
        }
        // 3. Kapal yang terhubung pada profil nahkoda merupakan kapal milik armada owner
        if (c.ships && c.ships.length > 0) {
          return c.ships.some(
            (s) =>
              ownerShipIds.has(s.id) ||
              ownerShipRegs.has(s.registration_number.toLowerCase().trim()),
          );
        }
        return false;
      });

      setRows(ownerCaptains);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Gagal memuat data nahkoda";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCaptains(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, fetchCaptains, currentOwnerKey]);

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
    const targetId = deleteTarget.id;
    try {
      await captainsService.delete(targetId);
      setRows((prev) => prev.filter((r) => r.id !== targetId));
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
      hideOnMobile: true,
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
      hideOnMobile: true,
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

      <DataTable
        columns={cols}
        rows={rows}
        rowKey={(r) => String(r.id)}
        loading={loading}
        emptyText="Belum ada nahkoda ditunjuk dalam armada Anda."
        onRowClick={openDetail}
      />

      <DetailModal
        open={isDetailOpen}
        title={selectedCaptain?.full_name || "Detail Nahkoda Armada"}
        subtitle="Profil nahkoda, nomor lisensi resmi, dan kapal yang dikendalikan."
        badge={
          selectedCaptain ? (
            <span className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded-xs bg-blue-500/10 text-fco-blue">
              Lisensi: {selectedCaptain.license_number}
            </span>
          ) : undefined
        }
        onClose={closeDetail}
        actions={
          selectedCaptain && (
            <button
              type="button"
              onClick={() => {
                const target = selectedCaptain;
                closeDetail();
                handleOpenEdit(target);
              }}
              className="h-9 px-3.5 rounded-xs border border-fco-border-subtle surface-inset hover:surface-page text-xs font-semibold text-fco-blue cursor-pointer transition-colors"
            >
              Ubah Data
            </button>
          )
        }
        fields={[
          {
            label: "Nama Lengkap",
            value: selectedCaptain?.full_name,
          },
          {
            label: "Pengalaman Berlayar",
            value: selectedCaptain?.years_of_experience
              ? `${selectedCaptain.years_of_experience} Tahun`
              : "—",
          },
          {
            label: "Nomor Telepon",
            value:
              selectedCaptain?.phone || selectedCaptain?.contact_info || "—",
          },
          {
            label: "Kapal yang Dikelola",
            value:
              (selectedCaptain?.ships || []).length > 0
                ? (selectedCaptain?.ships || []).map((s) => s.name).join(", ")
                : "Belum ditugaskan ke kapal armada",
            fullWidth: true,
          },
        ]}
      />

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
