import { useState } from "react";
import { RolesTab } from "./roles-menus/RolesTab";
import { MenusTab } from "./roles-menus/MenusTab";
import { RoleMenusTab } from "./roles-menus/RoleMenusTab";
import { AdminUsersTab } from "./roles-menus/AdminUsersTab";

type AdminTab = "roles" | "menus" | "role-menus" | "admin-users";

const tabItems: { key: AdminTab; label: string }[] = [
  { key: "roles", label: "1. Peran (Roles)" },
  { key: "menus", label: "2. Menu Frontend" },
  { key: "role-menus", label: "3. Hak Akses Menu" },
  { key: "admin-users", label: "4. Akun Admin & Regulator" },
];

export function RolesMenusPage() {
  const [tab, setTab] = useState<AdminTab>("roles");

  return (
    <div>
      <div
        className="flex gap-1.5 mb-6 p-1 surface-inset border rounded-xl w-fit flex-wrap"
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

      {tab === "roles" && <RolesTab />}
      {tab === "menus" && <MenusTab />}
      {tab === "role-menus" && <RoleMenusTab />}
      {tab === "admin-users" && <AdminUsersTab />}
    </div>
  );
}
