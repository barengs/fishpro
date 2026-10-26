import { Cpu, Key, MapPin, Wifi, WifiOff } from "lucide-react";
import { PageToolbar } from "../../components/PageToolbar";
import { DataTable, type Column } from "../../components/DataTable";
import { CrudActions } from "../../components/FormField";
import { ConfirmDeleteModal } from "../../components/ConfirmDeleteModal";
import { DetailModal } from "../../components/DetailModal";
import { StatusChip } from "../../components/StatusChip";
import { AlertBanner } from "../../components/ui";
import { IotDeviceModal } from "./components/IotDeviceModal";
import type { SmartScale } from "../../services/iot";
import { useIotDevices } from "./hooks/useIotDevices";

export function IotDevicesPage() {
  const {
    filteredDevices,
    loading,
    search,
    setSearch,
    errorMsg,
    setErrorMsg,
    editingDevice,
    isModalOpen,
    closeModal,
    handleOpenAdd,
    handleOpenEdit,
    handleSubmit,
    selectedDevice,
    isDetailOpen,
    openDetail,
    closeDetail,
    deleteTarget,
    isDeleteOpen,
    cancelDelete,
    requestDelete,
    handleConfirmDelete,
  } = useIotDevices();

  const cols: Column<SmartScale>[] = [
    {
      key: "device",
      header: "Perangkat / ID Sensor",
      flex: 3,
      render: (r) => (
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg surface-inset flex items-center justify-center text-fco-blue shrink-0">
            <Cpu size={17} aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-semibold text-strong truncate">
                {r.name}
              </span>
              <span className="sm:hidden">
                <StatusChip
                  label={r.is_active ? "Aktif" : "Nonaktif"}
                  bg={r.is_active ? undefined : "#EEF1F6"}
                  color={r.is_active ? undefined : "#4A5872"}
                />
              </span>
            </div>
            <div className="text-xs text-soft font-mono truncate">
              ID: {r.device_id}
              <span className="sm:hidden font-sans"> · {r.port_name}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "port",
      header: "Lokasi Pelabuhan",
      flex: 2,
      hideOnMobile: true,
      render: (r) => (
        <div className="flex items-center gap-1.5 text-sm text-strong truncate">
          <MapPin size={14} className="text-soft shrink-0" aria-hidden="true" />
          <span className="truncate">{r.port_name}</span>
        </div>
      ),
    },
    {
      key: "api_key",
      header: "Kunci API",
      flex: 2,
      hideOnMobile: true,
      render: (r) => (
        <div className="flex items-center gap-1.5 text-xs font-mono text-soft">
          <Key size={13} className="text-soft shrink-0" aria-hidden="true" />
          <span className="truncate">
            {r.api_key ? `${r.api_key.slice(0, 10)}••••` : "—"}
          </span>
        </div>
      ),
    },
    {
      key: "last_seen",
      header: "Terakhir Aktif",
      flex: 2,
      hideOnMobile: true,
      render: (r) => (
        <span className="text-xs text-soft">
          {r.last_seen
            ? new Date(r.last_seen).toLocaleString("id-ID")
            : "Belum pernah aktif"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      flex: 1,
      align: "center",
      hideOnMobile: true,
      render: (r) =>
        r.is_active ? (
          <StatusChip
            label="Aktif"
            icon={<Wifi size={13} className="text-emerald-500" />}
          />
        ) : (
          <StatusChip
            label="Nonaktif"
            bg="#EEF1F6"
            color="#4A5872"
            icon={<WifiOff size={13} className="text-slate-400" />}
          />
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
          onDelete={() =>
            requestDelete({
              id: r.id,
              name: `${r.name} (${r.device_id})`,
            })
          }
        />
      ),
    },
  ];

  return (
    <div>
      <PageToolbar
        title="Perangkat Timbangan Pintar IoT"
        desc="Kelola daftar perangkat keras timbangan digital pelabuhan resmi yang terhubung ke jaringan FCO."
        searchPlaceholder="Cari ID perangkat / pelabuhan..."
        searchValue={search}
        onSearchChange={setSearch}
        addLabel="Daftarkan Timbangan"
        onAdd={handleOpenAdd}
      />

      {errorMsg && (
        <div className="mb-5">
          <AlertBanner
            variant="error"
            message={errorMsg}
            onDismiss={() => setErrorMsg(null)}
          />
        </div>
      )}

      <DataTable
        columns={cols}
        rows={filteredDevices}
        rowKey={(r) => String(r.id)}
        loading={loading}
        emptyText="Belum ada perangkat timbangan pintar IoT yang terdaftar di sistem."
        onRowClick={openDetail}
      />

      {/* Detail Modal */}
      <DetailModal
        open={isDetailOpen}
        title={selectedDevice?.name || "Detail Perangkat Timbangan"}
        subtitle="Spesifikasi perangkat keras IoT dan kredensial koneksi sensor dermaga."
        badge={
          selectedDevice ? (
            <StatusChip
              label={selectedDevice.is_active ? "Perangkat Aktif" : "Nonaktif"}
              bg={selectedDevice.is_active ? undefined : "#EEF1F6"}
              color={selectedDevice.is_active ? undefined : "#4A5872"}
            />
          ) : undefined
        }
        onClose={closeDetail}
        actions={
          selectedDevice && (
            <button
              type="button"
              onClick={() => {
                const target = selectedDevice;
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
            label: "ID Perangkat (Device ID)",
            value: (
              <span className="font-mono font-bold text-fco-blue">
                {selectedDevice?.device_id}
              </span>
            ),
          },
          {
            label: "Nama Timbangan",
            value: selectedDevice?.name,
          },
          {
            label: "Pelabuhan Lokasi",
            value: selectedDevice?.port_name,
          },
          {
            label: "Kunci API (Device Token)",
            value: (
              <span className="font-mono text-xs text-strong break-all select-all">
                {selectedDevice?.api_key || "—"}
              </span>
            ),
            fullWidth: true,
          },
          {
            label: "Sinyal Terakhir (Heartbeat)",
            value: selectedDevice?.last_seen
              ? new Date(selectedDevice.last_seen).toLocaleString("id-ID")
              : "Belum pernah mengirim sinyal",
          },
          {
            label: "Waktu Registrasi",
            value: selectedDevice?.created_at
              ? new Date(selectedDevice.created_at).toLocaleString("id-ID")
              : "—",
          },
        ]}
      />

      {/* Add / Edit Modal */}
      <IotDeviceModal
        open={isModalOpen}
        editingDevice={editingDevice}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />

      {/* Delete Confirmation */}
      <ConfirmDeleteModal
        open={isDeleteOpen}
        title="Hapus Perangkat Timbangan IoT"
        itemName={deleteTarget?.name}
        message="Apakah Anda yakin ingin menghapus perangkat timbangan ini? Sensor hardware tidak akan dapat mengirim data lagi sebelum didaftarkan kembali."
        onClose={cancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
