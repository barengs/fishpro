const past = "#1A56DB";
const next = "#BCD3F8";

const bars = [
  { label: "Agu", h: "58%", color: past, top: "" },
  { label: "Sep", h: "66%", color: past, top: "" },
  { label: "Okt", h: "74%", color: past, top: "" },
  { label: "Nov", h: "80%", color: next, top: "" },
  { label: "Des", h: "86%", color: next, top: "" },
  { label: "Jan", h: "92%", color: next, top: "Rp 38 jt" },
];

export function PnbpPredictionBars() {
  return (
    <section className="surface-card border rounded-2xl p-6 shadow-xs">
      <h2 className="mt-0 mb-1 text-base font-bold text-strong">
        Prediksi PNBP
      </h2>
      <div className="text-fco-sm text-soft mb-5">
        Tiga bulan terakhir dan tiga bulan ke depan
      </div>

      <div className="flex items-end gap-3 h-37.5">
        {bars.map((b) => (
          <div
            key={b.label}
            className="flex-1 h-full flex flex-col justify-end items-center gap-1.5"
          >
            <div className="text-fco-xs font-bold text-strong h-3.5">
              {b.top}
            </div>
            <div
              className="w-full rounded-t-md transition-all duration-300"
              style={{ height: b.h, backgroundColor: b.color }}
            />
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-2">
        {bars.map((b) => (
          <div key={b.label} className="flex-1 text-center text-xs text-soft">
            {b.label}
          </div>
        ))}
      </div>

      <div className="flex gap-4 mt-4 text-xs text-soft">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-xs bg-fco-blue" />
          Aktual
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-xs bg-fco-blue-border" />
          Prediksi
        </span>
      </div>
    </section>
  );
}
