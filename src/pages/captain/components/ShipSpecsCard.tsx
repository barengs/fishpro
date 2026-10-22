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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-fco-blue flex items-center justify-center shrink-0">
              <Ship size={15} aria-hidden="true" />
            </div>
            <h2 className="m-0 text-base font-bold text-strong truncate">
              {shipName ? `Detail Kapal (${shipName})` : "Detail Kapal"}
            </h2>
          </div>
          <Link
            to="/captain/ship"
            className="text-xs font-semibold text-fco-blue hover:text-fco-blue-hover no-underline shrink-0"
          >
            Lihat kapal
          </Link>
        </div>

        {!specs || specs.length === 0 ? (
          <div className="py-8 text-center text-sm text-soft">
            Spesifikasi kapal belum tersedia atau kapal belum terhubung.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {specs.map((s) => (
              <div
                key={s.label}
                className="p-3 rounded-xl surface-inset border border-fco-border-subtle"
              >
                <div className="text-2xs font-semibold text-soft uppercase tracking-wider mb-1 truncate">
                  {s.label}
                </div>
                <div className="text-base font-bold tabular-nums text-strong truncate">
                  {s.value}
                </div>
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
