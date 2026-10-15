import { ProgressBar } from "../../../components/ProgressBar";
import { StatusChip } from "../../../components/StatusChip";

const quotaRows = [
  {
    name: "KM Cahaya Timur",
    reg: "REG-0319",
    width: "9%",
    chip: "Hampir habis",
    chipBg: "#FFF1E0",
    chipColor: "#B54708",
  },
  {
    name: "KM Bahari Satu",
    reg: "REG-0087",
    width: "14%",
    chip: "Hampir habis",
    chipBg: "#FFF1E0",
    chipColor: "#B54708",
  },
  {
    name: "KM Mutiara Laut",
    reg: "REG-0233",
    width: "22%",
    chip: "Perlu dipantau",
    chipBg: "#E8F0FE",
    chipColor: "#1A56DB",
  },
  {
    name: "KM Nusantara 7",
    reg: "REG-0561",
    width: "27%",
    chip: "Perlu dipantau",
    chipBg: "#E8F0FE",
    chipColor: "#1A56DB",
  },
  {
    name: "KM Karya Bersama",
    reg: "REG-0198",
    width: "31%",
    chip: "Perlu dipantau",
    chipBg: "#E8F0FE",
    chipColor: "#1A56DB",
  },
];

export function CriticalQuotaTable() {
  return (
    <section className="surface-card border rounded-2xl p-6 shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <h2 className="m-0 text-base font-bold text-strong">
          Kuota hampir habis
        </h2>
        <a
          href="#kapal"
          className="text-sm font-semibold text-fco-blue hover:text-fco-blue-hover"
        >
          Semua kapal
        </a>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-115">
          <div className="flex items-center py-2.5 text-xs font-semibold text-soft">
            <div className="basis-3/8">Kapal</div>
            <div className="basis-3/8">Sisa kuota</div>
            <div className="basis-2/8 text-right">Status</div>
          </div>

          {quotaRows.map((q) => (
            <div
              key={q.reg}
              className="flex items-center py-3.5 border-t border-fco-border-subtle"
            >
              <div className="basis-3/8">
                <div className="text-sm font-semibold text-strong">
                  {q.name}
                </div>
                <div className="text-xs text-soft tabular-nums">{q.reg}</div>
              </div>
              <div className="basis-3/8 pr-6">
                <ProgressBar width={q.width} showText />
              </div>
              <div className="basis-2/8 text-right">
                <StatusChip label={q.chip} bg={q.chipBg} color={q.chipColor} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
