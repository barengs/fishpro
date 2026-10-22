import { PageToolbar } from "../../components/PageToolbar";
import { DataTable, type Column } from "../../components/DataTable";
import { CrudActions } from "../../components/FormField";
import { ConfirmDeleteModal } from "../../components/ConfirmDeleteModal";
import { DetailModal } from "../../components/DetailModal";
import { AlertBanner } from "../../components/ui";
import { CaptainModal } from "../../components/modals/CaptainModal";
import type { Captain } from "../../services/captains";
import { useCaptainsManager } from "./hooks/useCaptainsManager";

export function CaptainsTab() {
  const {
    rows,
    ownersList,
    loading,
    search,
    setSearch,
    errorMsg,
    setErrorMsg,
    toastMsg,
    setToastMsg,
    editingCaptain,
    isModalOpen,
    closeModal,
    handleOpenAdd,
    handleOpenEdit,
    handleModalSubmit,
    selectedCaptain,
    isDetailOpen,
    openDetail,
    closeDetail,
    deleteTarget,
    isDeleteOpen,
    deleting,
    requestDelete,
    cancelDelete,
    handleConfirmDelete,
  } = useCaptainsManager();

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
      key: "owner",
      header: "Pemilik",
      flex: 2,
      hideOnMobile: true,
      render: (r) => (
        <span className="text-sm">{r.owner_name || `Owner #${r.owner}`}</span>
      ),
    },
    {
      key: "exp",
      header: "Pengalaman",
      flex: 1,
      align: "right",
      hideOnMobile: true,
      render: (r) => (
        <span className="text-sm tabular-nums">
          {r.years_of_experience ? `${r.years_of_experience} th` : "—"}
        </span>
      ),
    },
    {
      key: "phone",
      header: "Telepon",
      flex: 2,
      hideOnMobile: true,
      render: (r) => (
        <span className="text-sm tabular-nums">{r.phone || "—"}</span>
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
        searchPlaceholder="Cari nahkoda / lisensi..."
        searchValue={search}
        onSearchChange={setSearch}
        addLabel="Tambah nahkoda"
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
        emptyText="Belum ada data nahkoda terdaftar di server."
        onRowClick={openDetail}
      />

      <DetailModal
        open={isDetailOpen}
        title={selectedCaptain?.full_name || "Detail Nahkoda"}
        subtitle="Profil nahkoda kapal, nomor lisensi resmi, dan penugasan armada."
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
              className="h-10 px-4 rounded-xl border border-fco-border dark:border-fco-border-dark surface-card hover:surface-page text-sm font-semibold text-fco-blue cursor-pointer transition-colors"
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
            label: "Nomor Lisensi Pelaut",
            value: (
              <span className="font-mono font-bold text-strong">
                {selectedCaptain?.license_number}
              </span>
            ),
          },
          {
            label: "Pemilik / Perusahaan",
            value:
              selectedCaptain?.owner_name ||
              (selectedCaptain?.owner
                ? `Owner #${selectedCaptain?.owner}`
                : "—"),
          },
          {
            label: "Pengalaman Berlayar",
            value: selectedCaptain?.years_of_experience
              ? `${selectedCaptain.years_of_experience} Tahun`
              : "—",
          },
          {
            label: "Nomor Telepon",
            value: selectedCaptain?.phone || "—",
          },
          {
            label: "Email",
            value: selectedCaptain?.email || "—",
          },
          {
            label: "Alamat Domisili",
            value: selectedCaptain?.address || "Tidak ada data alamat.",
            fullWidth: true,
          },
          {
            label: "Kapal yang Dinahkodai",
            value:
              (selectedCaptain?.ships || []).length > 0
                ? (selectedCaptain?.ships || []).map((s) => s.name).join(", ")
                : "Belum ditugaskan ke kapal aktif",
            fullWidth: true,
          },
        ]}
      />

      <CaptainModal
        open={isModalOpen}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
        editingCaptain={editingCaptain}
        ownersList={ownersList}
      />

      <ConfirmDeleteModal
        open={isDeleteOpen}
        title="Hapus Data Nahkoda"
        itemName={deleteTarget?.name}
        message="Apakah Anda yakin ingin menghapus data nahkoda ini? Kapal yang sedang dinahkodai oleh akun ini akan kehilangan relasi nahkoda."
        loading={deleting}
        onClose={cancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
