import { useState } from "react";
import { ShipQuotaTab } from "./quota/ShipQuotaTab";
import { TariffConfigTab } from "./quota/TariffConfigTab";
import { PnbpAiPipelineTab } from "./quota/PnbpAiPipelineTab";

type QuotaTab = "quota" | "tariff" | "predictions";

const tabs: { key: QuotaTab; label: string }[] = [
  { key: "quota", label: "1. Kuota Kapal" },
  { key: "tariff", label: "2. Tarif PNBP" },
  { key: "predictions", label: "3. Prediksi AI (4 Model)" },
];

export function QuotaPnbpPage() {
  const [tab, setTab] = useState<QuotaTab>("quota");

  return (
    <div>
      <div
        className="flex gap-1.5 mb-6 p-1 surface-inset border rounded-xl w-fit flex-wrap"
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
            className={`h-9.5 px-5 rounded-lg text-sm font-semibold border-none cursor-pointer transition-all ${
              tab === t.key
                ? "bg-fco-blue text-white shadow-xs"
                : "bg-transparent text-soft hover:text-strong"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "quota" && <ShipQuotaTab />}
      {tab === "tariff" && <TariffConfigTab />}
      {tab === "predictions" && <PnbpAiPipelineTab />}
    </div>
  );
}
