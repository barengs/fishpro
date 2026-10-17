import { roleLabel, type Role } from "./types";

interface StepReviewProps {
  role: Role;
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  shipReg: string;
  shipName: string;
  homePort: string;
  wpp: string;
  agreeTerms: boolean;
  setAgreeTerms: (val: boolean) => void;
}

export function StepReview({
  role,
  fullName,
  companyName,
  email,
  phone,
  shipReg,
  shipName,
  homePort,
  wpp,
  agreeTerms,
  setAgreeTerms,
}: StepReviewProps) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h4 className="m-0 text-sm sm:text-base font-bold text-strong">
          Tinjau Ringkasan Data
        </h4>
        <p className="m-0 text-xs text-soft mt-0.5">
          Pastikan seluruh informasi yang Anda masukkan sudah benar sebelum
          membuat akun.
        </p>
      </div>

      {/* Clean Definition List (matching DetailModal style) */}
      <dl className="m-0 divide-y divide-fco-border-subtle surface-inset border dark:border-fco-border-dark rounded-xl px-3.5 sm:px-4 py-1 text-xs sm:text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-[140px_minmax(0,1fr)] gap-0.5 sm:gap-3 items-baseline py-2.5 sm:py-3">
          <dt className="text-soft font-medium text-2xs sm:text-xs">
            Peran Terpilih
          </dt>
          <dd className="m-0 font-bold text-fco-blue truncate">
            {roleLabel[role]}
          </dd>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[140px_minmax(0,1fr)] gap-0.5 sm:gap-3 items-baseline py-2.5 sm:py-3">
          <dt className="text-soft font-medium text-2xs sm:text-xs">
            Nama Lengkap
          </dt>
          <dd className="m-0 font-semibold text-strong truncate">
            {fullName}
            {companyName ? ` (${companyName})` : ""}
          </dd>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[140px_minmax(0,1fr)] gap-0.5 sm:gap-3 items-baseline py-2.5 sm:py-3">
          <dt className="text-soft font-medium text-2xs sm:text-xs">
            Kontak Aktif
          </dt>
          <dd className="m-0 font-medium text-strong truncate">
            {email} · {phone}
          </dd>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[140px_minmax(0,1fr)] gap-0.5 sm:gap-3 items-baseline py-2.5 sm:py-3">
          <dt className="text-soft font-medium text-2xs sm:text-xs">
            Pangkalan & WPP
          </dt>
          <dd className="m-0 font-medium text-strong truncate">
            {homePort || "Benoa"} · {wpp}
          </dd>
        </div>

        {(shipReg || shipName) && (
          <div className="grid grid-cols-1 sm:grid-cols-[140px_minmax(0,1fr)] gap-0.5 sm:gap-3 items-baseline py-2.5 sm:py-3">
            <dt className="text-soft font-medium text-2xs sm:text-xs">
              Kapal Terdaftar
            </dt>
            <dd className="m-0 font-semibold text-strong truncate">
              {shipName || "—"} {shipReg ? `(${shipReg})` : ""}
            </dd>
          </div>
        )}
      </dl>

      {/* Syarat & Ketentuan Checkbox */}
      <label className="flex items-start gap-2.5 p-3 sm:p-3.5 rounded-xl surface-inset border dark:border-fco-border-dark text-xs sm:text-sm text-soft cursor-pointer transition-colors hover:surface-card">
        <input
          type="checkbox"
          checked={agreeTerms}
          onChange={(e) => setAgreeTerms(e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded text-fco-blue accent-fco-blue cursor-pointer shrink-0"
        />
        <span className="leading-relaxed">
          Saya menyatakan data yang diisikan adalah benar dan bersedia mematuhi
          regulasi perikanan tangkap Kementerian Kelautan dan Perikanan RI.
        </span>
      </label>
    </div>
  );
}
