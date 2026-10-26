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
    <section className="surface-card border rounded-xl p-6 shadow-xs h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-fco-blue flex items-center justify-center shrink-0">
              <Ship size={16} aria-hidden="true" />
            </div>
            <h2 className="m-0 text-base font-bold text-strong truncate">
              Detail Kapal
            </h2>
          </div>
          <Link
            to="/captain/ship"
            className="text-xs font-semibold text-fco-blue hover:text-fco-blue-hover no-underline shrink-0"
          >
            Lihat kapal
          </Link>
        </div>

        <p className="m-0 text-xs text-soft mb-3 leading-relaxed truncate">
          {shipName
            ? `Spesifikasi teknis fisik ${shipName}.`
            : "Spesifikasi teknis dan dimensi kapal."}
        </p>

        {!specs || specs.length === 0 ? (
          <div className="py-6 text-center text-xs text-soft">
            Spesifikasi kapal belum tersedia atau kapal belum terhubung.
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-fco-border-subtle text-sm">
            {specs.map((s) => (
              <div
                key={s.label}
                className="flex items-center justify-between py-2 text-xs sm:text-sm"
              >
                <span className="text-soft">{s.label}</span>
                <span className="font-semibold tabular-nums text-strong">
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-fco-border-subtle flex items-center justify-between text-xs text-soft">
        <span>Kesiapan armada</span>
        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
          Izin Berlayar Aktif
        </span>
      </div>
    </section>
  );
}
