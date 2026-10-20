import { PageToolbar } from "../../components/PageToolbar";
import { DataTable, type Column } from "../../components/DataTable";
import { CrudActions } from "../../components/FormField";
import { StatusChip } from "../../components/StatusChip";
import { ProgressBar } from "../../components/ProgressBar";
import { CrudModal } from "../../components/CrudModal";
import { ConfirmDeleteModal } from "../../components/ConfirmDeleteModal";
import { DetailModal } from "../../components/DetailModal";
import { ShipFormWizard } from "../../components/ShipFormWizard";
import { AlertBanner } from "../../components/ui";
import type { Ship } from "../../services/ships";
import { useFleetManager } from "./hooks/useFleetManager";

export function FleetPage() {
  const {
    rows,
    loading,
    search,
    setSearch,
    errorMsg,
    setErrorMsg,
    currentOwnerId,
    editingShip,
    isModalOpen,
    handleOpenAdd,
    handleOpenEdit,
    closeModal,
    handleSubmit,
    selectedShip,
    isDetailOpen,
    openDetail,
    closeDetail,
    deleteTarget,
    isDeleteOpen,
    deleting,
    requestDelete,
    cancelDelete,
    handleConfirmDelete,
  } = useFleetManager();

  const cols: Column<Ship>[] = [
    {
      key: "ship",
      header: "Kapal / Registrasi",
      flex: 3,
      render: (r) => (
        <div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-sm font-semibold">{r.name}</span>
            <span className="sm:hidden">
              <StatusChip
                label={
                  !r.active
                    ? "Nonaktif"
                    : !r.captain
                      ? "Tanpa nahkoda"
                      : "Aktif"
                }
                bg={!r.active || !r.captain ? "#FFF1E0" : undefined}
                color={!r.active || !r.captain ? "#B54708" : undefined}
              />
            </span>
          </div>
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
      hideOnMobile: true,
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
      hideOnMobile: true,
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
      hideOnMobile: true,
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
          onEdit={() => handleOpenEdit(r)}
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
        onAdd={handleOpenAdd}
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
      />

      <CrudModal
        open={isModalOpen}
        title={
          editingShip ? "Ubah Data Kapal Armada" : "Tambah kapal ke armada"
        }
        subtitle="3 langkah: identitas, spesifikasi teknis, cek ringkasan."
        onClose={closeModal}
        hideFooter
      >
        <ShipFormWizard
          key={editingShip?.id ?? "new"}
          initialData={editingShip}
          onSubmit={handleSubmit}
          fixedOwnerId={currentOwnerId}
        />
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
