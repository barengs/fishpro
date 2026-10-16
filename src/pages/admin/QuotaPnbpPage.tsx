import { useState } from "react";
import { ShipQuotaTab } from "./quota/ShipQuotaTab";
import { TariffConfigTab } from "./quota/TariffConfigTab";
import { PnbpAiPipelineTab } from "./quota/PnbpAiPipelineTab";

type QuotaTab = "quota" | "tariff" | "predictions";

const tabs: { key: QuotaTab; label: string }[] = [
  { key: "quota", label: "Kuota Kapal" },
  { key: "tariff", label: "Tarif PNBP" },
  { key: "predictions", label: "Prediksi AI (4 Model)" },
];

export function QuotaPnbpPage() {
  const [tab, setTab] = useState<QuotaTab>("quota");

  return (
    <div>
      <div className="mb-6">
        <h1 className="m-0 text-2xl sm:text-3xl font-extrabold tracking-tight text-strong">
          Manajemen Kuota & PNBP
        </h1>
        <p className="m-0 text-sm text-soft mt-1">
          Pengaturan kuota penangkapan tahunan kapal, konfigurasi tarif PNBP
          KKP, dan proyeksi AI multi-model.
        </p>

        {/* Tab Switcher */}
        <div
          className="flex gap-1.5 mt-5 p-1 surface-inset border dark:border-fco-border-dark rounded-xl w-fit flex-wrap"
          role="tablist"
          aria-label="Manajemen Kuota dan Tarif"
        >
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={`h-9.5 px-4.5 rounded-lg text-sm font-semibold border-none cursor-pointer transition-all ${
                tab === t.key
                  ? "bg-fco-blue text-white shadow-xs"
                  : "bg-transparent text-soft hover:text-strong hover:surface-page"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === "quota" && <ShipQuotaTab />}
      {tab === "tariff" && <TariffConfigTab />}
      {tab === "predictions" && <PnbpAiPipelineTab />}
    </div>
  );
}
