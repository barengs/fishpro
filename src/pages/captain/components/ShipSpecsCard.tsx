interface SpecItem {
  label: string;
  value: string;
}

interface ShipSpecsCardProps {
  specs?: SpecItem[];
}

export function ShipSpecsCard({ specs }: ShipSpecsCardProps) {
  return (
    <section className="surface-card border rounded-2xl p-6 shadow-xs">
      <h2 className="mt-0 mb-4 text-base font-bold text-strong">
        Detail kapal
      </h2>
      {!specs || specs.length === 0 ? (
        <div className="py-6 text-center text-sm text-soft">
          Spesifikasi kapal belum tersedia atau kapal belum terhubung.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {specs.map((s) => (
            <div key={s.label}>
              <div className="text-xs font-semibold text-soft mb-1">
                {s.label}
              </div>
              <div className="text-lg font-bold tabular-nums text-strong">
                {s.value}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
