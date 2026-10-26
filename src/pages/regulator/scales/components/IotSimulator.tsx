import { Cpu, Loader2, Send } from "lucide-react";
import {
  formatThousandInput,
  unformatThousandInput,
} from "../../../../utils/formatters";

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
    <div className="surface-card border border-fco-border-subtle rounded-xs p-4 shadow-2xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu size={15} className="text-fco-blue" />
          <span className="text-xs font-bold uppercase tracking-wider text-strong">
            Simulator Hardware IoT
          </span>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="text-2xs text-fco-blue hover:underline bg-transparent border-none cursor-pointer p-0 font-semibold"
        >
          {showSimulator ? "Sembunyikan" : "Buka Pengujian"}
        </button>
      </div>

      {showSimulator && (
        <form
          onSubmit={onSubmit}
          className="mt-3 pt-3 border-t border-fco-border-subtle flex flex-col gap-2.5"
        >
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                inputMode="decimal"
                required
                value={formatThousandInput(simWeight)}
                onChange={(e) =>
                  onWeightChange(unformatThousandInput(e.target.value))
                }
                placeholder="45,50"
                className="w-full h-10 border border-fco-border-subtle surface-card rounded-xs px-3 pr-8 text-sm font-mono field-input focus:outline-hidden focus:border-fco-blue"
              />
              <span className="text-xs text-soft font-semibold absolute right-3 top-2.5">
                kg
              </span>
            </div>
            <button
              type="submit"
              disabled={simulating}
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xs border-none bg-fco-blue hover:bg-fco-blue-hover text-white text-xs font-bold cursor-pointer transition-colors shadow-xs disabled:opacity-60 shrink-0"
            >
              {simulating ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Send size={14} />
              )}
              <span>Kirim Berat</span>
            </button>
          </div>
          <p className="m-0 text-2xs text-soft leading-relaxed">
            Uji alur penimbangan instan tanpa sensor fisik. Mengirim berat
            virtual ke backend.
          </p>
        </form>
      )}
    </div>
  );
}
