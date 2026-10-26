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
          className={`inline-flex items-center gap-1.5 h-11 px-3.5 rounded-xs text-xs font-semibold border ${
            sseConnected
              ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
              : "bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              sseConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
            }`}
          />
          <span>{sseConnected ? "Live Aktif" : "Menghubungkan"}</span>
        </span>

        <button
          type="button"
          onClick={onRefresh}
          title="Segarkan Pembacaan"
          className="w-11 h-11 rounded-xs border border-fco-border-subtle surface-card hover:surface-page text-soft hover:text-strong flex items-center justify-center cursor-pointer transition-colors shrink-0"
        >
          <RefreshCw size={15} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
