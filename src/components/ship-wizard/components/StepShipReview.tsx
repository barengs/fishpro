import {
  Activity,
  Anchor,
  Building2,
  Calendar,
  FileText,
  Gauge,
  MapPin,
  Ruler,
  Ship,
} from "lucide-react";
import { type ShipFormData } from "../../shipFormTypes";

interface StepShipReviewProps {
  form: ShipFormData;
  selectedOwnerName: string;
  selectedCaptainName: string;
}

export function StepShipReview({
  form,
  selectedOwnerName,
  selectedCaptainName,
}: StepShipReviewProps) {
  const rows = [
    {
      label: "Nama Kapal",
      icon: Ship,
      value: (
        <span className="font-bold text-strong" title={form.name}>
          {form.name || "—"}
        </span>
      ),
    },
    {
      label: "Nomor Registrasi",
      icon: FileText,
      value: (
        <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 tracking-wide">
          {form.registration_number || "—"}
        </span>
      ),
    },
    {
      label: "Status Operasional",
      icon: Activity,
      value: (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
            form.active
              ? "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/50"
              : "bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/50"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              form.active ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
            }`}
          />
          {form.active ? "Aktif Berlayar" : "Nonaktif"}
        </span>
      ),
    },
    {
      label: "Pemilik Kapal (Owner)",
      icon: Building2,
      value: (
        <span className="text-strong font-medium" title={selectedOwnerName}>
          {selectedOwnerName || "—"}
        </span>
      ),
    },
    {
      label: "Nahkoda (Captain)",
      icon: Anchor,
      value: (
        <span className="text-strong font-medium" title={selectedCaptainName}>
          {selectedCaptainName || "—"}
        </span>
      ),
    },
    {
      label: "Pelabuhan Pangkalan",
      icon: MapPin,
      value: (
        <span className="text-strong" title={form.home_port}>
          {form.home_port || "—"}
        </span>
      ),
    },
    {
      label: "Panjang Kapal",
      icon: Ruler,
      value: (
        <span className="text-strong tabular-nums">
          {form.length ? `${form.length} meter` : "—"}
        </span>
      ),
    },
    {
      label: "Lebar Kapal",
      icon: Ruler,
      value: (
        <span className="text-strong tabular-nums">
          {form.width ? `${form.width} meter` : "—"}
        </span>
      ),
    },
    {
      label: "Gross Tonnage (GT)",
      icon: Gauge,
      value: (
        <span className="text-strong font-semibold tabular-nums">
          {form.gross_tonnage ? `${form.gross_tonnage} GT` : "—"}
        </span>
      ),
    },
    {
      label: "Tahun Pembuatan",
      icon: Calendar,
      value: (
        <span className="text-strong tabular-nums">
          {form.year_built || "—"}
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h3 className="m-0 mb-1 text-lg font-extrabold text-strong">
          Cek ringkasan kapal
        </h3>
        <p className="m-0 text-sm text-soft">
          Pastikan spesifikasi teknis dan legalitas kapal sudah sesuai sebelum disimpan.
        </p>
      </div>

      <div className="surface-card border border-slate-200/90 dark:border-fco-border-dark rounded-xl overflow-hidden shadow-2xs divide-y divide-slate-100 dark:divide-slate-800/80">
        {rows.map((row, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors gap-3"
          >
            <span className="text-xs font-medium text-soft flex items-center gap-2 shrink-0">
              <row.icon
                size={14}
                className="text-slate-400 dark:text-slate-500 shrink-0"
                aria-hidden="true"
              />
              <span>{row.label}</span>
            </span>
            <div className="text-xs sm:text-sm text-right min-w-0 truncate">
              {row.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
