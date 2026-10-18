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
    <div className="surface-card border rounded-xl p-5 sm:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Scale size={20} className="text-fco-blue" aria-hidden="true" />
          <h1 className="m-0 text-xl sm:text-2xl font-extrabold tracking-tight text-strong">
            Terminal Timbangan Pintar IoT
          </h1>
        </div>
        <p className="m-0 text-xs sm:text-sm text-soft">
          Penerimaan berat tangkapan otomatis dari timbangan dermaga pelabuhan,
          kalkulasi PNBP instan, dan segel blockchain.
        </p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="w-56 sm:w-64">
          <SelectField
            label="Pilih Timbangan Dermaga"
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

        <div className="flex items-center gap-2 pt-6">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
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
            <span>{sseConnected ? "SSE Live" : "Menghubungkan"}</span>
          </span>

          <button
            type="button"
            onClick={onRefresh}
            title="Refresh Pembacaan"
            className="w-9 h-9 rounded-lg border border-fco-border-subtle surface-inset hover:surface-page text-soft hover:text-strong flex items-center justify-center cursor-pointer transition-colors"
          >
            <RefreshCw size={15} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
