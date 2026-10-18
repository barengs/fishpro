import { Building2, Check, Ship, User, Anchor } from "lucide-react";
import type { Role } from "./types";

interface StepIdentityProps {
  role: Role;
  setRole: (role: Role) => void;
  ownerType: "individual" | "company";
  setOwnerType: (type: "individual" | "company") => void;
  fullName: string;
  setFullName: (name: string) => void;
  companyName: string;
  setCompanyName: (name: string) => void;
}

const inputCls =
  "w-full h-11 border-2 border-fco-border dark:border-fco-border-dark rounded-xl pl-10 pr-3.5 text-sm field-input focus:outline-hidden focus:border-fco-blue focus:ring-2 focus:ring-fco-blue/15 transition-all surface-card text-strong placeholder:text-soft";
const labelCls = "block text-sm font-semibold text-strong mb-1.5";

export function StepIdentity({
  role,
  setRole,
  ownerType,
  setOwnerType,
  fullName,
  setFullName,
  companyName,
  setCompanyName,
}: StepIdentityProps) {
  return (
    <div className="flex flex-col gap-5">
      {/* 1. Pemilihan Peran Pendaftaran */}
      <div>
        <label className={labelCls}>
          Daftar Sebagai <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => setRole("owner")}
            className={`flex items-center justify-between h-12 px-3.5 rounded-xl border-2 cursor-pointer transition-all text-left ${
              role === "owner"
                ? "border-fco-blue bg-fco-blue-light/50 dark:bg-fco-blue/15 text-fco-blue font-bold shadow-xs"
                : "border-fco-border dark:border-fco-border-dark surface-card text-strong hover:surface-page font-semibold"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  role === "owner"
                    ? "bg-fco-blue text-white shadow-2xs"
                    : "surface-inset border border-fco-border-subtle text-soft"
                }`}
              >
                <Ship size={19} strokeWidth={2.2} aria-hidden="true" />
              </span>
              <span className="truncate text-xs sm:text-sm font-semibold">
                Pemilik Kapal
              </span>
            </div>
            {role === "owner" && (
              <Check
                size={16}
                strokeWidth={2.5}
                className="text-fco-blue shrink-0 ml-2"
                aria-hidden="true"
              />
            )}
          </button>

          <button
            type="button"
            onClick={() => setRole("captain")}
            className={`flex items-center justify-between h-12 px-3.5 rounded-xl border-2 cursor-pointer transition-all text-left ${
              role === "captain"
                ? "border-fco-blue bg-fco-blue-light/50 dark:bg-fco-blue/15 text-fco-blue font-bold shadow-xs"
                : "border-fco-border dark:border-fco-border-dark surface-card text-strong hover:surface-page font-semibold"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  role === "captain"
                    ? "bg-fco-blue text-white shadow-2xs"
                    : "surface-inset border border-fco-border-subtle text-soft"
                }`}
              >
                <Anchor size={19} strokeWidth={2.2} aria-hidden="true" />
              </span>
              <span className="truncate text-xs sm:text-sm font-semibold">
                Nahkoda
              </span>
            </div>
            {role === "captain" && (
              <Check
                size={16}
                strokeWidth={2.5}
                className="text-fco-blue shrink-0 ml-2"
                aria-hidden="true"
              />
            )}
          </button>
        </div>
      </div>

      {/* 2. Formulir Data Diri & Entitas */}
      <div className="flex flex-col gap-4 pt-1">
        {/* Khusus Owner: Tipe Kepemilikan */}
        {role === "owner" && (
          <div>
            <span className={labelCls}>Tipe Kepemilikan</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                {
                  key: "company",
                  label: "Badan Usaha (PT / CV)",
                  Icon: Building2,
                },
                {
                  key: "individual",
                  label: "Perorangan (Pribadi)",
                  Icon: User,
                },
              ].map((t) => {
                const isSelected = ownerType === t.key;
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() =>
                      setOwnerType(t.key as "individual" | "company")
                    }
                    className={`flex items-center justify-between h-12 px-3.5 rounded-xl border-2 cursor-pointer transition-all text-left ${
                      isSelected
                        ? "border-fco-blue bg-fco-blue-light/50 dark:bg-fco-blue/15 text-fco-blue font-bold shadow-xs"
                        : "border-fco-border dark:border-fco-border-dark surface-card text-strong hover:surface-page font-semibold"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? "bg-fco-blue text-white shadow-2xs"
                            : "surface-inset border border-fco-border-subtle text-soft"
                        }`}
                      >
                        <t.Icon
                          size={19}
                          strokeWidth={2.2}
                          aria-hidden="true"
                        />
                      </span>
                      <span className="truncate text-xs sm:text-sm font-semibold">
                        {t.label}
                      </span>
                    </div>
                    {isSelected && (
                      <Check
                        size={16}
                        strokeWidth={2.5}
                        className="text-fco-blue shrink-0 ml-2"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Input Nama Lengkap */}
        <div>
          <label htmlFor="rg-name" className={labelCls}>
            {role === "owner"
              ? ownerType === "company"
                ? "Nama Penanggung Jawab"
                : "Nama Lengkap Pemilik"
              : "Nama Lengkap Nahkoda"}
            <span className="text-red-500 ml-1 font-bold">*</span>
          </label>
          <div className="relative">
            <User
              size={17}
              className="text-soft absolute left-3.5 top-3 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="rg-name"
              type="text"
              autoComplete="name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={
                role === "owner"
                  ? "Contoh: Budi Santoso"
                  : "Nama lengkap sesuai KTP / Buku Pelaut"
              }
              className={inputCls}
            />
          </div>
        </div>

        {/* Khusus Owner Perusahaan: Nama Perusahaan */}
        {role === "owner" && ownerType === "company" && (
          <div>
            <label htmlFor="rg-company" className={labelCls}>
              Nama Perusahaan (PT / CV)
              <span className="text-red-500 ml-1 font-bold">*</span>
            </label>
            <div className="relative">
              <Building2
                size={17}
                className="text-soft absolute left-3.5 top-3 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="rg-company"
                type="text"
                autoComplete="organization"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Contoh: PT Samudera Bahari Nusantara"
                className={inputCls}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
