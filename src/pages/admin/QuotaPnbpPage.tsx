import { useState } from "react";
import { Brain, Receipt, Ship } from "lucide-react";
import { ShipQuotaTab } from "./quota/ShipQuotaTab";
import { TariffConfigTab } from "./quota/TariffConfigTab";
import { PnbpAiPipelineTab } from "./quota/PnbpAiPipelineTab";

type QuotaTab = "quota" | "tariff" | "predictions";

const tabs: {
  key: QuotaTab;
  label: string;
  Icon: typeof Ship;
}[] = [
  { key: "quota", label: "Kuota Kapal", Icon: Ship },
  { key: "tariff", label: "Tarif PNBP", Icon: Receipt },
  { key: "predictions", label: "Prediksi AI (4 Model)", Icon: Brain },
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

        {/* Style 1: Underline Tab Bar (GitHub / Vercel style) */}
        <div className="border-b border-fco-border dark:border-fco-border-dark mt-6">
          <nav
            className="-mb-px flex gap-6 overflow-x-auto"
            role="tablist"
            aria-label="Manajemen Kuota dan Tarif"
          >
            {tabs.map((t) => {
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(t.key)}
                  className={`group inline-flex items-center gap-2 py-3 px-1 border-b-2 font-semibold text-sm transition-all cursor-pointer bg-transparent border-t-0 border-x-0 ${
                    active
                      ? "border-b-fco-blue text-fco-blue"
                      : "border-b-transparent text-soft hover:text-strong hover:border-b-fco-border dark:hover:border-b-fco-border-dark"
                  }`}
                >
                  <t.Icon
                    size={17}
                    className={`shrink-0 transition-colors ${
                      active
                        ? "text-fco-blue"
                        : "text-soft group-hover:text-strong"
                    }`}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                  <span className="whitespace-nowrap">{t.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {tab === "quota" && <ShipQuotaTab />}
      {tab === "tariff" && <TariffConfigTab />}
      {tab === "predictions" && <PnbpAiPipelineTab />}
    </div>
  );
}
