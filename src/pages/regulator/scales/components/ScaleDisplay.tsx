import { AlertTriangle, Radio } from "lucide-react";
import { type ScaleReading } from "../../../../services/iot";

interface ScaleDisplayProps {
  selectedDeviceId: string;
  latestReading: ScaleReading | null;
  loading?: boolean;
}

export function ScaleDisplay({
  selectedDeviceId,
  latestReading,
  loading,
}: ScaleDisplayProps) {
  const currentWeightNum = latestReading
    ? Number(latestReading.weight).toFixed(2)
    : "0.00";
  const tareWeight = latestReading?.tare ? Number(latestReading.tare) : 0;
  const netWeightNum = latestReading
    ? Math.max(0, Number(latestReading.weight) - tareWeight).toFixed(2)
    : "0.00";

  return (
    <div
      className="border border-blue-950/80 rounded-xs p-6 shadow-sm flex flex-col justify-between relative overflow-hidden text-white"
      style={{
        background: "linear-gradient(180deg, #0f172a 0%, #0b1f44 100%)",
      }}
    >
      {/* Sensor Header */}
      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Radio size={15} className="text-emerald-400 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Sensor Timbangan Digital
          </span>
        </div>
        <div className="flex items-center gap-2">
          {latestReading?.is_stable === false && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs bg-amber-500/20 border border-amber-500/40 text-amber-300 text-2xs font-bold">
              <AlertTriangle size={11} />
              FLUKTUATIF
            </span>
          )}
          <div className="px-2.5 py-1 rounded-xs bg-black/40 border border-white/10 text-right">
            <span className="text-2xs font-mono font-bold text-cyan-300 block">
              {selectedDeviceId || "SEMUA TIMBANGAN"}
            </span>
          </div>
        </div>
      </div>

      {/* Anomaly Banner if detected */}
      {latestReading?.anomaly_warning && (
        <div className="mt-3 px-3 py-2 rounded-xs bg-amber-950/60 border border-amber-500/50 flex items-start gap-2 text-xs text-amber-200">
          <AlertTriangle size={14} className="text-amber-400 shrink-0 mt-0.5" />
          <span className="leading-snug">{latestReading.anomaly_warning}</span>
        </div>
      )}

      {/* Main Digital Readout */}
      <div className="py-6 sm:py-8 flex flex-col items-center justify-center text-center">
        <div
          className={`text-6xl sm:text-7xl font-mono font-black tracking-tight tabular-nums text-white drop-shadow-lg ${
            loading && !latestReading ? "opacity-60 animate-pulse" : ""
          }`}
        >
          {currentWeightNum}
        </div>
        <div className="text-xs sm:text-sm font-bold uppercase tracking-widest text-emerald-400 mt-2">
          KILOGRAM (KG)
        </div>
        {tareWeight > 0 && (
          <div className="mt-2 text-2xs text-slate-300 font-mono">
            Netto: <span className="font-bold text-white">{netWeightNum} kg</span> (Tara: {tareWeight.toFixed(2)} kg)
          </div>
        )}
      </div>

      {/* Scale Status Footer */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
        <span className="flex items-center gap-1.5 font-medium">
          <span
            className={`w-2 h-2 rounded-full ${
              loading && !latestReading
                ? "bg-blue-400 animate-pulse"
                : latestReading?.is_stable === false
                  ? "bg-amber-400 animate-ping"
                  : latestReading
                    ? "bg-amber-400"
                    : "bg-emerald-400"
            }`}
          />
          <span>
            {loading && !latestReading
              ? "Menghubungkan ke Sensor..."
              : latestReading?.is_stable === false
                ? "Beban Fluktuatif (Menunggu Stabil)"
                : latestReading
                  ? "Beban Terdeteksi (Pending)"
                  : "Siap Menimbang"}
          </span>
        </span>
        <span className="font-mono text-2xs text-slate-400">
          {latestReading
            ? `ID: #${latestReading.id.slice(0, 8)}`
            : "Menunggu beban dermaga..."}
        </span>
      </div>
    </div>
  );
}
