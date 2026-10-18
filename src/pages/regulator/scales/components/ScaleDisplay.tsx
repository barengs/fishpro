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
    <div className="surface-card border rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col justify-between relative overflow-hidden bg-linear-to-b from-slate-900 to-[#0e2756] text-white">
      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Radio size={16} className="text-emerald-400 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Sensor Timbangan Digital
          </span>
        </div>
        <span className="text-2xs font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300">
          {selectedDeviceId || "SEMUA TIMBANGAN"}
        </span>
      </div>

      {/* Giant Digital Number */}
      <div className="py-6 sm:py-8 flex flex-col items-center justify-center text-center">
        <div className="text-5xl sm:text-6xl lg:text-7xl font-mono font-black tracking-tight tabular-nums text-white drop-shadow-md">
          {currentWeightNum}
        </div>
        <div className="text-sm sm:text-base font-bold uppercase tracking-widest text-emerald-400 mt-2">
          KILOGRAM (KG)
        </div>
      </div>

      {/* Scale Status Footer */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="font-semibold">
            {latestReading ? "Beban Terdeteksi (Pending)" : "Siap Menimbang"}
          </span>
        </span>
        <span className="font-mono text-2xs opacity-75">
          {latestReading
            ? `ID: ${latestReading.id.slice(0, 8)}...`
            : "Menunggu keranjang ikan..."}
        </span>
      </div>
    </div>
  );
}
