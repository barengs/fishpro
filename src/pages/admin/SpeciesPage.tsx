import { useState } from "react";
import { Fish, Tag } from "lucide-react";
import { SpeciesListTab } from "./species/SpeciesListTab";
import { FishListTab } from "./species/FishListTab";

type SpeciesTab = "species" | "individual";

const tabs: {
  key: SpeciesTab;
  label: string;
  Icon: typeof Fish;
}[] = [
  { key: "species", label: "Katalog Spesies", Icon: Fish },
  { key: "individual", label: "Sampel Ikan Individu", Icon: Tag },
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

        {/* Style 1: Underline Tab Bar (GitHub / Vercel style) */}
        <div className="border-b border-fco-border dark:border-fco-border-dark mt-6">
          <nav
            className="-mb-px flex gap-6 overflow-x-auto"
            role="tablist"
            aria-label="Katalog perikanan"
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

      {tab === "species" ? <SpeciesListTab /> : <FishListTab />}
    </div>
  );
}
