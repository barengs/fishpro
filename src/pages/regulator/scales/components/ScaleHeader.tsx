import { RefreshCw, Scale } from "lucide-react";
import { SelectField } from "../../../../components/ui";
import { type SmartScale } from "../../../../services/iot";

interface ScaleHeaderProps {
  devices: SmartScale[];
  selectedDeviceId: string;
  onDeviceChange: (id: string) => void;
  sseConnected: boolean;
  onRefresh: () => void;
}

export function ScaleHeader({
  devices,
  selectedDeviceId,
  onDeviceChange,
  sseConnected,
  onRefresh,
}: ScaleHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-xs bg-blue-500/10 text-fco-blue flex items-center justify-center shrink-0">
            <Scale size={18} aria-hidden="true" />
          </div>
          <h1 className="m-0 text-2xl sm:text-3xl font-extrabold tracking-tight text-strong">
            Terminal Timbangan Pintar IoT
          </h1>
        </div>
        <p className="m-0 text-sm text-soft">
          Penerimaan bobot otomatis dari sensor timbangan dermaga pelabuhan dan
          pencatatan resmi ke blockchain.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 shrink-0">
        <div className="w-64">
          <SelectField
            label=""
            id="scale-device-select"
            searchable
            value={selectedDeviceId}
            onChange={(e) => onDeviceChange(e.target.value)}
            placeholder="— Pilih Timbangan —"
            options={devices.map((d) => ({
              value: d.device_id,
              label: `${d.name} (${d.device_id})`,
            }))}
          />
        </div>

        <span
          className={`inline-flex items-center gap-1.5 h-10 px-3.5 rounded-xl text-xs font-bold shadow-2xs ${
            sseConnected
              ? "bg-emerald-600 text-white"
              : "bg-amber-500 text-white"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              sseConnected ? "bg-white animate-pulse" : "bg-white/80"
            }`}
          />
          <span>{sseConnected ? "Live Aktif" : "Menghubungkan"}</span>
        </span>

        <button
          type="button"
          onClick={onRefresh}
          title="Segarkan Pembacaan"
          className="w-10 h-10 rounded-xl border border-line bg-white hover:bg-gray-50 dark:bg-card-dark text-soft hover:text-strong flex items-center justify-center cursor-pointer transition-colors shadow-2xs shrink-0"
        >
          <RefreshCw size={15} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
