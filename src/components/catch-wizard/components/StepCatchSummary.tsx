import { type CatchReportFormData } from "../../catchReportTypes";

const typeLabel: Record<string, string> = {
  pelagic: "Pelagis",
  demersal: "Demersal",
  reef: "Terumbu Karang",
};

interface StepCatchSummaryProps {
  form: CatchReportFormData;
}

export function StepCatchSummary({ form }: StepCatchSummaryProps) {
  return (
    <div>
      <h3 className="m-0 mb-1 text-lg font-extrabold text-strong">
        Cek sekali lagi
      </h3>
      <p className="m-0 mb-4 text-sm text-soft">
        Laporan tercatat permanen setelah dikirim.
      </p>
      <dl className="m-0 p-4 rounded-xl surface-inset border text-sm flex flex-col gap-2.5">
        <div className="flex justify-between gap-3 py-1 border-b border-fco-border">
          <dt className="text-soft">Tanggal / Jenis</dt>
          <dd className="m-0 font-semibold text-strong text-right tabular-nums">
            {form.catch_date} · {typeLabel[form.catch_type]}
          </dd>
        </div>
        <div className="flex justify-between gap-3 py-1 border-b border-fco-border">
          <dt className="text-soft">Lokasi / WPP</dt>
          <dd className="m-0 text-strong text-right tabular-nums">
            {form.location_latitude}, {form.location_longitude} ·{" "}
            {form.wpp || "—"}
          </dd>
        </div>
        <div className="flex justify-between gap-3 py-1">
          <dt className="text-soft">Hasil</dt>
          <dd className="m-0 font-bold text-strong text-right tabular-nums">
            {form.fish_species} · {form.quantity} {form.unit}
          </dd>
        </div>
      </dl>
    </div>
  );
}
