import { Cpu, Loader2, Send } from "lucide-react";

interface IotSimulatorProps {
  showSimulator: boolean;
  onToggle: () => void;
  simWeight: string;
  onWeightChange: (val: string) => void;
  simulating: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function IotSimulator({
  showSimulator,
  onToggle,
  simWeight,
  onWeightChange,
  simulating,
  onSubmit,
}: IotSimulatorProps) {
  return (
    <div className="surface-card border rounded-xl p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Cpu size={16} className="text-purple-600 dark:text-purple-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-strong">
            Simulator Hardware IoT
          </span>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="text-2xs text-fco-blue hover:underline bg-transparent border-none cursor-pointer p-0 font-semibold"
        >
          {showSimulator ? "Sembunyikan" : "Buka Tester"}
        </button>
      </div>

      {showSimulator && (
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <p className="m-0 text-xs text-soft leading-relaxed">
            Uji alur penimbangan secara instan tanpa perangkat fisik. Masukkan
            angka berat untuk memicu endpoint{" "}
            <code>POST /api/iot/receive-weight/</code>.
          </p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="number"
                step="0.01"
                required
                value={simWeight}
                onChange={(e) => onWeightChange(e.target.value)}
                placeholder="Contoh: 45.50"
                className="w-full h-10 border-2 border-fco-border dark:border-fco-border-dark rounded-lg px-3 text-sm font-mono field-input focus:outline-hidden focus:border-fco-blue"
              />
              <span className="text-xs text-soft font-semibold absolute right-3 top-2.5">
                kg
              </span>
            </div>
            <button
              type="submit"
              disabled={simulating}
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg border-none bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs disabled:opacity-60 shrink-0"
            >
              {simulating ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Send size={14} />
              )}
              <span>Kirim Berat</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
