import { useState } from "react";
import { RolesTab } from "./roles-menus/RolesTab";
import { MenusTab } from "./roles-menus/MenusTab";
import { RoleMenusTab } from "./roles-menus/RoleMenusTab";
import { AdminUsersTab } from "./roles-menus/AdminUsersTab";

type AdminTab = "roles" | "menus" | "role-menus" | "admin-users";

const tabItems: { key: AdminTab; label: string }[] = [
  { key: "roles", label: "Peran Pengguna" },
  { key: "menus", label: "Menu Navigasi" },
  { key: "role-menus", label: "Hak Akses Menu" },
  { key: "admin-users", label: "Akun Petugas" },
];

export function RolesMenusPage() {
  const [tab, setTab] = useState<AdminTab>("roles");

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

        {/* Tab Switcher */}
        <div
          className="flex gap-1.5 mt-5 p-1 surface-inset border dark:border-fco-border-dark rounded-xl w-fit flex-wrap"
          role="tablist"
          aria-label="Sub-menu peran dan administrasi"
        >
          {tabItems.map((t) => (
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

      {tab === "roles" && <RolesTab />}
      {tab === "menus" && <MenusTab />}
      {tab === "role-menus" && <RoleMenusTab />}
      {tab === "admin-users" && <AdminUsersTab />}
    </div>
  );
}
