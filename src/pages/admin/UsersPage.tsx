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

        {/* Style 1: Underline Tab Bar (GitHub / Vercel style) */}
        <div className="border-b border-fco-border dark:border-fco-border-dark mt-6">
          <nav
            className="-mb-px flex gap-6 overflow-x-auto"
            role="tablist"
            aria-label="Manajemen Pengguna"
          >
            {tabs.map((t) => {
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => handleTabChange(t.key)}
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

      {tab === "owners" ? <OwnersTab /> : <CaptainsTab />}
    </div>
  );
}
