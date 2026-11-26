import { Link } from "react-router-dom";
import { Ship } from "lucide-react";

interface SpecItem {
  label: string;
  value: string;
}

interface ShipSpecsCardProps {
  specs?: SpecItem[];
  shipName?: string;
}

export function ShipSpecsCard({ specs, shipName }: ShipSpecsCardProps) {
  return (
    <section className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-subtle h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-[#F9FAFB] dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 text-charcoal dark:text-slate-300 flex items-center justify-center shrink-0">
              <Ship size={14} aria-hidden="true" />
            </div>
            <h2 className="m-0 text-[15px] font-bold text-ink dark:text-white truncate">
              Detail Kapal
            </h2>
          </div>
          <Link
            to="/captain/ship"
            className="text-[12px] font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 no-underline shrink-0"
          >
            Lihat kapal
          </Link>
        </div>

        <p className="m-0 text-xs text-subtext dark:text-slate-400 mb-3 leading-relaxed truncate">
          {shipName
            ? `Spesifikasi teknis fisik ${shipName}.`
            : "Spesifikasi teknis dan dimensi kapal."}
        </p>

        {!specs || specs.length === 0 ? (
          <div className="py-6 text-center text-xs text-subtext dark:text-slate-400">
            Spesifikasi kapal belum tersedia atau kapal belum terhubung.
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-[#E5E7EB] dark:divide-slate-800 text-sm">
            {specs.map((s) => (
              <div
                key={s.label}
                className="flex items-center justify-between py-2 text-xs sm:text-sm"
              >
                <span className="text-subtext dark:text-slate-400">{s.label}</span>
                <span className="font-semibold tabular-nums text-ink dark:text-white">
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-[#E5E7EB] dark:border-slate-800 flex items-center justify-between text-xs text-subtext dark:text-slate-400">
        <span>Kesiapan armada</span>
        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
          Izin Berlayar Aktif
        </span>
      </div>
    </section>
  );
}
