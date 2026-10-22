import { useSearchParams } from "react-router-dom";
import { KeyRound, Menu, ShieldCheck, UserCog } from "lucide-react";
import { RolesTab } from "./roles-menus/RolesTab";
import { MenusTab } from "./roles-menus/MenusTab";
import { RoleMenusTab } from "./roles-menus/RoleMenusTab";
import { AdminUsersTab } from "./roles-menus/AdminUsersTab";

type AdminTab = "roles" | "menus" | "role-menus" | "admin-users";

const tabItems: {
  key: AdminTab;
  label: string;
  Icon: typeof ShieldCheck;
}[] = [
  { key: "roles", label: "Peran Pengguna", Icon: ShieldCheck },
  { key: "menus", label: "Menu Navigasi", Icon: Menu },
  { key: "role-menus", label: "Hak Akses Menu", Icon: KeyRound },
  { key: "admin-users", label: "Akun Petugas", Icon: UserCog },
];

export function RolesMenusPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentTabParam = searchParams.get("tab") as AdminTab;
  const tab: AdminTab =
    currentTabParam && tabItems.some((t) => t.key === currentTabParam)
      ? currentTabParam
      : "roles";

  const handleTabChange = (nextTab: AdminTab) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("tab", nextTab);
        return next;
      },
      { replace: true },
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="m-0 text-2xl sm:text-3xl font-extrabold tracking-tight text-strong">
          Manajemen Peran & Hak Akses
        </h1>
        <p className="m-0 text-sm text-soft mt-1">
          Pengaturan peran pengguna (roles), hak akses menu dinamis, dan akun
          resmi administrator serta regulator.
        </p>

        {/* Style 1: Underline Tab Bar (GitHub / Vercel style) */}
        <div className="border-b border-fco-border dark:border-fco-border-dark mt-6">
          <nav
            className="-mb-px flex gap-6 overflow-x-auto"
            role="tablist"
            aria-label="Sub-menu peran"
          >
            {tabItems.map((t) => {
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

      {tab === "roles" && <RolesTab />}
      {tab === "menus" && <MenusTab />}
      {tab === "role-menus" && <RoleMenusTab />}
      {tab === "admin-users" && <AdminUsersTab />}
    </div>
  );
}
