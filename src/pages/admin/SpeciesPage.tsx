import { useState } from "react";
import { SpeciesListTab } from "./species/SpeciesListTab";
import { FishListTab } from "./species/FishListTab";

type SpeciesTab = "species" | "individual";

const tabs: { key: SpeciesTab; label: string }[] = [
  { key: "species", label: "1. Spesies Ikan (FishSpecies)" },
  { key: "individual", label: "2. Ikan Individu (Fish)" },
];

export function SpeciesPage() {
  const [tab, setTab] = useState<SpeciesTab>("species");

  return (
    <div>
      <div
        className="flex gap-1.5 mb-6 p-1 surface-inset border rounded-xl w-fit"
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

      {tab === "species" ? <SpeciesListTab /> : <FishListTab />}
    </div>
  );
}
