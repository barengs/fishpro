import { Building2, User } from "lucide-react";
import type { Role } from "./types";

interface StepIdentityProps {
  role: Role;
  ownerType: "individual" | "company";
  setOwnerType: (type: "individual" | "company") => void;
  fullName: string;
  setFullName: (name: string) => void;
  companyName: string;
  setCompanyName: (name: string) => void;
}

const inputCls =
  "w-full h-11 border border-fco-border rounded-xl px-3.5 text-sm field-input focus:outline-none focus:border-fco-blue";
const labelCls = "block text-sm font-semibold text-strong mb-1.5";

export function StepIdentity({
  role,
  ownerType,
  setOwnerType,
  fullName,
  setFullName,
  companyName,
  setCompanyName,
}: StepIdentityProps) {
  return (
    <div>
      <h3 className="m-0 mb-1 text-base sm:text-lg font-extrabold text-strong">
        Siapa Anda?
      </h3>
      <p className="m-0 mb-5 text-sm text-soft">
        Identitas sesuai dokumen resmi.
      </p>

      <div className="flex flex-col gap-4">
        {role === "owner" && (
          <div>
            <span className={labelCls}>
              Tipe pemilik
              <span className="text-soft font-normal text-xs ml-1.5">
                (optional)
              </span>
            </span>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {[
                { key: "individual", label: "Pribadi", Icon: User },
                { key: "company", label: "Perusahaan", Icon: Building2 },
              ].map((t) => {
                const isSelected = ownerType === t.key;
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() =>
                      setOwnerType(t.key as "individual" | "company")
                    }
                    aria-pressed={isSelected}
                    className={`flex flex-col items-center justify-center gap-2.5 p-4 sm:p-5 rounded-xl border-2 cursor-pointer transition-all aspect-square max-h-36 sm:max-h-40 w-full text-center group ${
                      isSelected
                        ? "border-fco-blue bg-fco-blue-light/50 dark:bg-fco-blue/15 text-fco-blue shadow-xs"
                        : "border-fco-border surface-card text-strong hover:border-fco-blue/40"
                    }`}
                  >
                    <span
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                        isSelected
                          ? "bg-fco-blue text-white shadow-xs"
                          : "surface-inset text-soft group-hover:text-fco-blue"
                      }`}
                    >
                      <t.Icon size={24} strokeWidth={2} aria-hidden="true" />
                    </span>
                    <span className="font-extrabold text-sm sm:text-base tracking-tight">
                      {t.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <label htmlFor="rg-name" className={labelCls}>
            {role === "owner" && ownerType === "company"
              ? "Nama penanggung jawab"
              : "Nama lengkap"}
            <span className="text-soft font-normal text-xs ml-1.5">
              (optional)
            </span>
          </label>
          <input
            id="rg-name"
            type="text"
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nama sesuai KTP"
            className={inputCls}
          />
        </div>

        {role === "owner" && ownerType === "company" && (
          <div>
            <label htmlFor="rg-company" className={labelCls}>
              Nama perusahaan
              <span className="text-soft font-normal text-xs ml-1.5">
                (optional)
              </span>
            </label>
            <input
              id="rg-company"
              type="text"
              autoComplete="organization"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="PT ..."
              className={inputCls}
            />
          </div>
        )}
      </div>
    </div>
  );
}
