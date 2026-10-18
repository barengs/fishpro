import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { CrudModal } from "../../../components/CrudModal";
import { TextField, ToggleSwitch } from "../../../components/ui";
import {
  type CreateSmartScalePayload,
  type SmartScale,
} from "../../../services/iot";

interface IotDeviceModalProps {
  open: boolean;
  editingDevice: SmartScale | null;
  onClose: () => void;
  onSubmit: (payload: CreateSmartScalePayload) => Promise<void>;
}

function IotDeviceFormContent({
  editingDevice,
  onClose,
  onSubmit,
}: {
  editingDevice: SmartScale | null;
  onClose: () => void;
  onSubmit: (payload: CreateSmartScalePayload) => Promise<void>;
}) {
  const [form, setForm] = useState<CreateSmartScalePayload>({
    device_id: editingDevice?.device_id || "",
    name: editingDevice?.name || "",
    port_name: editingDevice?.port_name || "",
    is_active: editingDevice?.is_active ?? true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.device_id.trim()) {
      setErrorMsg("ID Perangkat timbangan wajib diisi.");
      return;
    }
    if (!form.name.trim()) {
      setErrorMsg("Nama timbangan wajib diisi.");
      return;
    }
    if (!form.port_name.trim()) {
      setErrorMsg("Nama pelabuhan lokasi timbangan wajib diisi.");
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);
    try {
      await onSubmit(form);
      onClose();
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Gagal menyimpan data perangkat timbangan.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {errorMsg && (
        <div
          role="alert"
          className="flex items-center gap-2 p-3 px-4 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 text-xs font-semibold border border-red-200 dark:border-red-500/20"
        >
          <AlertCircle size={15} className="shrink-0" aria-hidden="true" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Baris 1: ID Perangkat & Nama Timbangan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <TextField
          label="ID Perangkat (Device ID)"
          id="dev-id"
          required
          disabled={submitting || Boolean(editingDevice)}
          value={form.device_id}
          onChange={(e) =>
            setForm({
              ...form,
              device_id: e.target.value.toUpperCase().replace(/\s+/g, "-"),
            })
          }
          placeholder="Contoh: SCALE-BENOAS-01"
        />

        <TextField
          label="Nama Timbangan"
          id="dev-name"
          required
          disabled={submitting}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Contoh: Timbangan Dermaga Barat 01"
        />
      </div>

      {/* Baris 2: Lokasi Pelabuhan */}
      <TextField
        label="Lokasi Pelabuhan / Dermaga"
        id="dev-port"
        required
        disabled={submitting}
        value={form.port_name}
        onChange={(e) => setForm({ ...form, port_name: e.target.value })}
        placeholder="Contoh: Pelabuhan Benoa, Bali"
      />

      {/* Baris 3: Toggle Status Operasional */}
      <ToggleSwitch
        id="dev-status-toggle"
        checked={Boolean(form.is_active)}
        disabled={submitting}
        onChange={(checked) => setForm({ ...form, is_active: checked })}
        label="Status Operasional Timbangan"
      />

      <div className="flex gap-2.5 justify-end mt-1 pt-4 border-t border-fco-border-subtle">
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="h-10 px-4 rounded-xl border border-fco-border surface-card hover:surface-page text-sm font-semibold text-strong cursor-pointer"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="h-10 px-5 rounded-xl border-none bg-fco-blue hover:bg-fco-blue-hover text-white text-sm font-semibold cursor-pointer shadow-xs disabled:opacity-60"
        >
          {submitting
            ? "Menyimpan..."
            : editingDevice
              ? "Perbarui Perangkat"
              : "Daftarkan Perangkat"}
        </button>
      </div>
    </form>
  );
}

export function IotDeviceModal({
  open,
  editingDevice,
  onClose,
  onSubmit,
}: IotDeviceModalProps) {
  if (!open) return null;

  return (
    <CrudModal
      open={open}
      title={
        editingDevice
          ? "Ubah Perangkat Timbangan IoT"
          : "Daftarkan Timbangan Pintar IoT"
      }
      subtitle="Integrasi timbangan digital dermaga untuk transmisi berat tangkapan otomatis."
      onClose={onClose}
      hideFooter
    >
      <IotDeviceFormContent
        key={editingDevice ? String(editingDevice.id) : "new"}
        editingDevice={editingDevice}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    </CrudModal>
  );
}
