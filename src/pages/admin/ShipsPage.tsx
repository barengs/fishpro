import { PageToolbar } from "../../components/PageToolbar";
import { DataTable, type Column } from "../../components/DataTable";
import { CrudActions } from "../../components/FormField";
import { StatusChip } from "../../components/StatusChip";
import { CrudModal } from "../../components/CrudModal";
import { ConfirmDeleteModal } from "../../components/ConfirmDeleteModal";
import { DetailModal } from "../../components/DetailModal";
import { ShipFormWizard } from "../../components/ShipFormWizard";
import { AlertBanner } from "../../components/ui";
import type { Ship } from "../../services/ships";
import { useAdminShips } from "./hooks/useAdminShips";

export function ShipsPage() {
  const {
    rows,
    loading,
    search,
    setSearch,
    errorMsg,
    setErrorMsg,
    toastMsg,
    setToastMsg,
    editingShip,
    isModalOpen,
    closeModal,
    handleOpenAdd,
    handleOpenEdit,
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
  } = useAdminShips();

  const columns: Column<Ship>[] = [
    {
      key: "name",
      header: "Nama / Registrasi",
      flex: 3,
      render: (r) => (
        <div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-sm font-semibold">{r.name}</span>
            <span className="sm:hidden">
              <StatusChip
                label={r.active ? "Aktif" : "Nonaktif"}
                bg={r.active ? undefined : "#EEF1F6"}
                color={r.active ? undefined : "#4A5872"}
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
      key: "owner",
      header: "Pemilik",
      flex: 2,
      hideOnMobile: true,
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
      hideOnMobile: true,
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
      hideOnMobile: true,
      render: (r) => (
        <span className="text-sm tabular-nums">{r.gross_tonnage ?? "—"}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      flex: 1,
      align: "center",
      hideOnMobile: true,
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

      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(r) => String(r.id)}
        loading={loading}
        emptyText="Belum ada data kapal terdaftar di server."
        onRowClick={openDetail}
      />

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
              className="h-9 px-3.5 rounded-xs border border-fco-border-subtle surface-inset hover:surface-page text-xs font-semibold text-fco-blue cursor-pointer transition-colors"
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
        open={isModalOpen}
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
