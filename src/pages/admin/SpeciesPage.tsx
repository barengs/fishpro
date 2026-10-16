import { useState } from "react";
import { SpeciesListTab } from "./species/SpeciesListTab";
import { FishListTab } from "./species/FishListTab";

type SpeciesTab = "species" | "individual";

const tabs: { key: SpeciesTab; label: string }[] = [
  { key: "species", label: "Katalog Spesies" },
  { key: "individual", label: "Sampel Ikan Individu" },
];

export function SpeciesPage() {
  const [tab, setTab] = useState<SpeciesTab>("species");

  return (
    <div>
      <div className="mb-6">
        <h1 className="m-0 text-2xl sm:text-3xl font-extrabold tracking-tight text-strong">
          Katalog Spesies & Ikan
        </h1>
        <p className="m-0 text-sm text-soft mt-1">
          Katalog resmi taksonomi jenis ikan tangkapan nasional dan data sampel
          spesimen individu.
        </p>

        {/* Tab Switcher */}
        <div
          className="flex gap-1.5 mt-5 p-1 surface-inset border dark:border-fco-border-dark rounded-xl w-fit flex-wrap"
          role="tablist"
          aria-label="Katalog perikanan"
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

      {tab === "species" ? <SpeciesListTab /> : <FishListTab />}
    </div>
  );
}
