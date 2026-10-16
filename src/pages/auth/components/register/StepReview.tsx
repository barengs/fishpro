import { roleLabel, type Role } from "./types";

interface StepReviewProps {
  role: Role;
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  shipReg: string;
  shipName: string;
  licenseNumber: string;
  nip: string;
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
  licenseNumber,
  nip,
  agreeTerms,
  setAgreeTerms,
}: StepReviewProps) {
  return (
    <div>
      <h3 className="m-0 mb-1 text-base sm:text-lg font-extrabold text-strong">
        Cek sekali lagi
      </h3>
      <p className="m-0 mb-5 text-sm text-soft">
        Pastikan tidak ada salah ketik.
      </p>
      <dl className="m-0 mb-5 p-3.5 sm:p-5 rounded-xl surface-inset border text-xs sm:text-sm flex flex-col gap-2.5">
        <div className="flex justify-between items-center gap-2 py-1 border-b border-fco-border">
          <dt className="text-soft shrink-0">Peran</dt>
          <dd className="m-0 font-bold text-fco-blue text-right">
            {roleLabel[role]}
          </dd>
        </div>
        <div className="flex justify-between items-center gap-2 py-1 border-b border-fco-border">
          <dt className="text-soft shrink-0">Nama</dt>
          <dd className="m-0 font-semibold text-strong text-right truncate max-w-2/3">
            {fullName}
            {companyName ? ` · ${companyName}` : ""}
          </dd>
        </div>
        <div className="flex justify-between items-center gap-2 py-1 border-b border-fco-border">
          <dt className="text-soft shrink-0">Kontak</dt>
          <dd className="m-0 text-strong text-right truncate max-w-2/3">
            {email} · {phone}
          </dd>
        </div>
        {(shipReg || licenseNumber || nip) && (
          <div className="flex justify-between items-center gap-2 py-1">
            <dt className="text-soft shrink-0">
              {role === "captain"
                ? "Lisensi"
                : role === "owner"
                  ? "Kapal"
                  : "NIP"}
            </dt>
            <dd className="m-0 font-semibold text-strong text-right truncate max-w-2/3">
              {role === "captain"
                ? licenseNumber
                : role === "owner"
                  ? `${shipReg}${shipName ? ` (${shipName})` : ""}`
                  : nip}
            </dd>
          </div>
        )}
      </dl>
      <label className="flex items-start gap-2.5 text-xs sm:text-sm text-soft cursor-pointer mb-5">
        <input
          type="checkbox"
          checked={agreeTerms}
          onChange={(e) => setAgreeTerms(e.target.checked)}
          className="mt-0.5 rounded accent-fco-blue"
        />
        <span className="leading-snug">
          Data sudah benar. Laporan yang saya kirim tercatat permanen dan tidak
          bisa diubah.
        </span>
      </label>
    </div>
  );
}
