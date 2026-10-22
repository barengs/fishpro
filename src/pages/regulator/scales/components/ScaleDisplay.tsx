import { Radio } from "lucide-react";
import { type ScaleReading } from "../../../../services/iot";

interface ScaleDisplayProps {
  selectedDeviceId: string;
  latestReading: ScaleReading | null;
}

export function ScaleDisplay({
  selectedDeviceId,
  latestReading,
}: ScaleDisplayProps) {
  const currentWeightNum = latestReading
    ? Number(latestReading.weight).toFixed(2)
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
        <div className="px-2.5 py-1 rounded-xs bg-black/40 border border-white/10 text-right">
          <span className="text-2xs font-mono font-bold text-cyan-300 block">
            {selectedDeviceId || "SEMUA TIMBANGAN"}
          </span>
        </div>
      </div>

      {/* Main Digital Readout */}
      <div className="py-8 sm:py-10 flex flex-col items-center justify-center text-center">
        <div className="text-6xl sm:text-7xl font-mono font-black tracking-tight tabular-nums text-white drop-shadow-lg">
          {currentWeightNum}
        </div>
        <div className="text-xs sm:text-sm font-bold uppercase tracking-widest text-emerald-400 mt-2.5">
          KILOGRAM (KG)
        </div>
      </div>

      {/* Scale Status Footer */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
        <span className="flex items-center gap-1.5 font-medium">
          <span
            className={`w-2 h-2 rounded-full ${
              latestReading ? "bg-amber-400" : "bg-emerald-400"
            }`}
          />
          <span>
            {latestReading ? "Beban Terdeteksi (Pending)" : "Siap Menimbang"}
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
