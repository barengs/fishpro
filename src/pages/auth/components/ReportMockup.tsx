import { Check, Link2 } from "lucide-react";

export function ReportMockup() {
  return (
    <div className="surface-card border rounded-xl shadow-xl overflow-hidden max-w-120 w-full">
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-fco-border">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
        <span className="ml-3 text-xs text-soft tabular-nums">
          fishpro / lapor-tangkapan
        </span>
        <span className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-fco-blue">
          <Check size={13} strokeWidth={3} aria-hidden="true" /> tersimpan +
          ter-hash
        </span>
      </div>
      <div className="p-5 sm:p-6">
        <div className="grid grid-cols-2 gap-2.5 text-sm">
          <div className="field-input border rounded-xl px-3 py-2.5">
            <span className="text-xs text-soft block">Kapal</span>
            <span className="font-semibold">KM Samudra Jaya · REG-0412</span>
          </div>
          <div className="field-input border rounded-xl px-3 py-2.5">
            <span className="text-xs text-soft block">Tanggal / WPP</span>
            <span className="font-semibold">09 Okt 2026 · WPP 573</span>
          </div>
          <div className="field-input border rounded-xl px-3 py-2.5">
            <span className="text-xs text-soft block">Spesies</span>
            <span className="font-semibold">Tongkol · 120 kg</span>
          </div>
          <div className="rounded-xl px-3 py-2.5 bg-fco-blue-light dark:bg-fco-blue/15 border border-fco-blue-border">
            <span className="text-xs text-soft block">PNBP terhitung</span>
            <span className="font-bold text-fco-blue">Rp 120.000</span>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="font-semibold text-soft">Sisa kuota 2026</span>
            <span className="font-bold tabular-nums">70%</span>
          </div>
          <div className="h-2 rounded-full track-bar overflow-hidden">
            <div
              className="h-full rounded-full bg-fco-blue"
              style={{ width: "70%" }}
            />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-soft tabular-nums">
          <Link2 size={13} className="text-fco-blue" aria-hidden="true" /> blok
          #2318 · c04d…88a7 · terverifikasi
        </div>
      </div>
    </div>
  );
}
