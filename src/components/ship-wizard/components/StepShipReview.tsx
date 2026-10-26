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
  return (
    <div>
      <h3 className="m-0 mb-1 text-lg font-extrabold text-strong">
        Cek ringkasan kapal
      </h3>
      <p className="m-0 mb-4 text-sm text-soft">
        Pastikan nama dan nomor registrasi sudah benar.
      </p>
      <dl className="m-0 p-4 rounded-xl surface-inset border text-sm flex flex-col gap-2.5">
        <div className="flex justify-between gap-3 py-1 border-b border-fco-border">
          <dt className="text-soft">Kapal</dt>
          <dd className="m-0 font-bold text-strong text-right">
            {form.name} · {form.registration_number}
          </dd>
        </div>
        <div className="flex justify-between gap-3 py-1 border-b border-fco-border">
          <dt className="text-soft">Pemilik</dt>
          <dd className="m-0 text-strong text-right">{selectedOwnerName}</dd>
        </div>
        <div className="flex justify-between gap-3 py-1 border-b border-fco-border">
          <dt className="text-soft">Nahkoda</dt>
          <dd className="m-0 text-strong text-right">{selectedCaptainName}</dd>
        </div>
        <div className="flex justify-between gap-3 py-1">
          <dt className="text-soft">Dimensi / GT / Status</dt>
          <dd className="m-0 text-strong text-right tabular-nums">
            {form.length || "—"} × {form.width || "—"} m ·{" "}
            {form.gross_tonnage || "—"} GT ·{" "}
            {form.active ? "Aktif" : "Nonaktif"}
          </dd>
        </div>
      </dl>
    </div>
  );
}
