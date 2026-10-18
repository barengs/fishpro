import { useCallback, useEffect, useState } from "react";
import { Cpu, Key, MapPin, Wifi, WifiOff } from "lucide-react";
import { PageToolbar } from "../../components/PageToolbar";
import { DataTable, type Column } from "../../components/DataTable";
import { CrudActions } from "../../components/FormField";
import { useCrudModal } from "../../components/useCrudModal";
import { ConfirmDeleteModal } from "../../components/ConfirmDeleteModal";
import { useConfirmDelete } from "../../components/useConfirmDelete";
import { DetailModal } from "../../components/DetailModal";
import { useDetailModal } from "../../components/useDetailModal";
import { StatusChip } from "../../components/StatusChip";
import { AlertBanner } from "../../components/ui";
import { useToast } from "../../components/toast";
import { IotDeviceModal } from "./components/IotDeviceModal";
import {
  iotService,
  type CreateSmartScalePayload,
  type SmartScale,
} from "../../services/iot";

export function IotDevicesPage() {
  const [devices, setDevices] = useState<SmartScale[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [editingDevice, setEditingDevice] = useState<SmartScale | null>(null);

  const deviceModal = useCrudModal();
  const toast = useToast();

  const {
    target: deleteTarget,
    open: isDeleteOpen,
    requestDelete,
    cancelDelete,
  } = useConfirmDelete<{ id: number; name: string }>();

  const {
    selected: selectedDevice,
    open: isDetailOpen,
    openDetail,
    closeDetail,
  } = useDetailModal<SmartScale>();

  const fetchDevices = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await iotService.getDevices();
      setDevices(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Gagal memuat daftar timbangan IoT.",
      );
      setDevices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function loadInitial() {
      try {
        const data = await iotService.getDevices();
        if (!ignore) setDevices(Array.isArray(data) ? data : []);
      } catch (err: unknown) {
        if (!ignore) {
          setErrorMsg(
            err instanceof Error
              ? err.message
              : "Gagal memuat daftar timbangan IoT.",
          );
          setDevices([]);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    loadInitial();
    return () => {
      ignore = true;
    };
  }, []);

  const handleOpenAdd = () => {
    setEditingDevice(null);
    deviceModal.openModal();
  };

  const handleOpenEdit = (dev: SmartScale) => {
    setEditingDevice(dev);
    deviceModal.openModal();
  };

  const handleSubmit = async (payload: CreateSmartScalePayload) => {
    if (editingDevice) {
      await iotService.updateDevice(editingDevice.id, payload);
      toast.success(`Timbangan "${payload.name}" berhasil diperbarui.`);
    } else {
      await iotService.createDevice(payload);
      toast.success(`Timbangan "${payload.name}" berhasil didaftarkan.`);
    }
    fetchDevices();
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const targetId = deleteTarget.id;
    try {
      await iotService.deleteDevice(targetId);
      setDevices((prev) => prev.filter((d) => d.id !== targetId));
      toast.success(`Perangkat "${deleteTarget.name}" berhasil dihapus.`);
      cancelDelete();
      fetchDevices();
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Gagal menghapus perangkat timbangan.",
      );
    }
  };

  const safeDevices = Array.isArray(devices) ? devices : [];
  const filteredDevices = safeDevices.filter((d) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      d.device_id.toLowerCase().includes(q) ||
      d.name.toLowerCase().includes(q) ||
      d.port_name.toLowerCase().includes(q)
    );
  });

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
            <div className="text-sm font-semibold text-strong truncate">
              {r.name}
            </div>
            <div className="text-xs text-soft font-mono truncate">
              ID: {r.device_id}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "port",
      header: "Lokasi Pelabuhan",
      flex: 2,
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

      <section className="surface-card border rounded-xl p-6 shadow-xs">
        <DataTable
          columns={cols}
          rows={filteredDevices}
          rowKey={(r) => String(r.id)}
          loading={loading}
          emptyText="Belum ada perangkat timbangan pintar IoT yang terdaftar di sistem."
          onRowClick={openDetail}
        />
      </section>

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
              className="h-9 px-3.5 rounded-lg border border-fco-border-subtle surface-inset hover:surface-page text-xs font-semibold text-fco-blue cursor-pointer transition-colors"
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
        open={deviceModal.open}
        editingDevice={editingDevice}
        onClose={deviceModal.closeModal}
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
