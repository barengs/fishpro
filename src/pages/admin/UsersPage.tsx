import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Anchor, Building2 } from "lucide-react";
import { OwnersTab } from "./OwnersTab";
import { CaptainsTab } from "./CaptainsTab";

type UserTab = "owners" | "captains";

const tabs: {
  key: UserTab;
  label: string;
  Icon: typeof Building2;
}[] = [
  { key: "owners", label: "Pemilik Kapal", Icon: Building2 },
  { key: "captains", label: "Nahkoda", Icon: Anchor },
];

export function UsersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get("tab") as UserTab) || "owners";
  const [tab, setTab] = useState<UserTab>(
    initialTab === "captains" ? "captains" : "owners",
  );

  const handleTabChange = (nextTab: UserTab) => {
    setTab(nextTab);
    setSearchParams({ tab: nextTab });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="m-0 text-2xl sm:text-3xl font-extrabold tracking-tight text-strong">
          Manajemen Pengguna
        </h1>
        <p className="m-0 text-sm text-soft mt-1">
          Kelola data pemilik kapal armada dan nahkoda berlisensi yang terdaftar
          di sistem.
        </p>

        {/* Tab Switcher */}
        <div
          className="flex gap-1.5 mt-5 p-1 surface-inset border dark:border-fco-border-dark rounded-xl w-fit flex-wrap"
          role="tablist"
          aria-label="Manajemen Pengguna"
        >
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => handleTabChange(t.key)}
              className={`inline-flex items-center gap-2 h-9.5 px-4.5 rounded-lg text-sm font-semibold border-none cursor-pointer transition-all ${
                tab === t.key
                  ? "bg-fco-blue text-white shadow-xs"
                  : "bg-transparent text-soft hover:text-strong hover:surface-page"
              }`}
            >
              <t.Icon size={16} aria-hidden="true" />
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {tab === "owners" ? <OwnersTab /> : <CaptainsTab />}
    </div>
  );
}
