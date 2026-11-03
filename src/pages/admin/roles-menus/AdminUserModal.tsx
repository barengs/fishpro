import { useState } from "react";
import { AlertCircle, Eye, Scale, ShieldCheck } from "lucide-react";
import { CrudModal } from "../../../components/CrudModal";
import {
  type RegisterAdminPayload,
  type RegisterRegulatorPayload,
  type Role,
} from "../../../services/admin";
import { adminUserSchema } from "../../../utils/schemas";
import { AdminRegisterForm } from "./forms/AdminRegisterForm";
import { RegulatorRegisterForm } from "./forms/RegulatorRegisterForm";

export type UserRegisterType = "staff" | "superadmin" | "regulator";

interface AdminUserModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    type: UserRegisterType,
    adminPayload: RegisterAdminPayload,
    regulatorPayload: RegisterRegulatorPayload,
  ) => Promise<void>;
  roles: Role[];
}

export function AdminUserModal({
  open,
  onClose,
  onSubmit,
  roles,
}: AdminUserModalProps) {
  const [userRegisterType, setUserRegisterType] = useState<UserRegisterType>("staff");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const adminRoleObj = roles.find((r) => r.name.toLowerCase() === "admin");
  const superadminRoleObj = roles.find((r) => r.name.toLowerCase() === "superadmin");

  const [adminForm, setAdminForm] = useState<RegisterAdminPayload>({
    username: "",
    password: "",
    email: "",
    full_name: "",
    phone: "",
    department: "Pelabuhan Perikanan",
    position: "Staf Operasional Lapangan & Timbangan IoT",
    role: adminRoleObj ? adminRoleObj.id : null,
  });

  const [regulatorForm, setRegulatorForm] = useState<RegisterRegulatorPayload>({
    username: "",
    email: "",
    password: "",
    full_name: "",
    phone: "",
    department: "Direktorat Pengawasan SDKP",
    position: "Pengawas Kuota Perikanan",
  });

  const handleTypeSelect = (nextType: UserRegisterType) => {
    setUserRegisterType(nextType);
    setErrorMsg(null);

    if (nextType === "staff") {
      setAdminForm((prev) => ({
        ...prev,
        department: prev.department || "Pelabuhan Perikanan",
        position: "Staf Operasional Lapangan & Timbangan IoT",
        role: adminRoleObj ? adminRoleObj.id : null,
      }));
    } else if (nextType === "superadmin") {
      setAdminForm((prev) => ({
        ...prev,
        department: prev.department || "Tata Kelola Sistem & IT KKP",
        position: "Super Administrator",
        role: superadminRoleObj ? superadminRoleObj.id : null,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = userRegisterType === "regulator" ? regulatorForm : adminForm;
    const parsed = adminUserSchema.safeParse(target);
    if (!parsed.success) {
      setErrorMsg(
        parsed.error.issues[0]?.message || "Input akun belum lengkap/valid.",
      );
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);
    try {
      // Ensure correct role is assigned based on chosen type
      const payloadWithRole = { ...adminForm };
      if (userRegisterType === "staff" && adminRoleObj) {
        payloadWithRole.role = adminRoleObj.id;
      } else if (userRegisterType === "superadmin" && superadminRoleObj) {
        payloadWithRole.role = superadminRoleObj.id;
      }

      await onSubmit(userRegisterType, payloadWithRole, regulatorForm);
      onClose();
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Gagal mendaftarkan akun petugas.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const modalTitle =
    userRegisterType === "staff"
      ? "Daftarkan Staf Lapangan & Kantor"
      : userRegisterType === "superadmin"
        ? "Daftarkan Super Administrator"
        : "Daftarkan Inspektur Pengawas / Regulator";

  const modalSubtitle =
    userRegisterType === "staff"
      ? "Akun personel yang bertugas di lapangan (penimbangan IoT dermaga, verifikasi kapal, laporan tangkapan)."
      : userRegisterType === "superadmin"
        ? "Akun pengelola sistem nasional dengan wewenang penuh tata kelola kuota, blockchain, dan manajemen peran."
        : "Akun pengawas resmi KKP untuk audit kepatuhan kuota perikanan dan verifikasi hasil laut.";

  return (
    <CrudModal
      open={open}
      title={modalTitle}
      subtitle={modalSubtitle}
      onClose={onClose}
      onSubmit={handleSubmit}
      submitLabel={submitting ? "Mendaftarkan..." : "Daftarkan Akun"}
      wide
    >
      {errorMsg && (
        <div
          role="alert"
          className="flex items-center gap-2 p-3.5 px-4 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 text-xs font-semibold mb-4 border border-red-200 dark:border-red-500/20"
        >
          <AlertCircle size={15} className="shrink-0" aria-hidden="true" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Segmented 3-Way Role Selector */}
      <div className="mb-5">
        <label className="block text-xs font-bold text-soft uppercase tracking-wider mb-2">
          Pilih Peran Akun yang Didaftarkan
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1 surface-inset border dark:border-fco-border-dark rounded-xl">
          <button
            type="button"
            onClick={() => handleTypeSelect("staff")}
            className={`flex items-center justify-center gap-2 h-10 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer border-none ${
              userRegisterType === "staff"
                ? "bg-fco-blue text-white shadow-xs"
                : "bg-transparent text-soft hover:text-strong hover:surface-page"
            }`}
          >
            <Scale size={16} strokeWidth={2.2} aria-hidden="true" />
            <span>Staf Lapangan</span>
          </button>
          <button
            type="button"
            onClick={() => handleTypeSelect("superadmin")}
            className={`flex items-center justify-center gap-2 h-10 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer border-none ${
              userRegisterType === "superadmin"
                ? "bg-fco-blue text-white shadow-xs"
                : "bg-transparent text-soft hover:text-strong hover:surface-page"
            }`}
          >
            <ShieldCheck size={16} strokeWidth={2.2} aria-hidden="true" />
            <span>Super Admin</span>
          </button>
          <button
            type="button"
            onClick={() => handleTypeSelect("regulator")}
            className={`flex items-center justify-center gap-2 h-10 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer border-none ${
              userRegisterType === "regulator"
                ? "bg-fco-blue text-white shadow-xs"
                : "bg-transparent text-soft hover:text-strong hover:surface-page"
            }`}
          >
            <Eye size={16} strokeWidth={2.2} aria-hidden="true" />
            <span>Regulator Kuota</span>
          </button>
        </div>
      </div>

      {userRegisterType === "regulator" ? (
        <RegulatorRegisterForm
          form={regulatorForm}
          onChange={setRegulatorForm}
          disabled={submitting}
        />
      ) : (
        <AdminRegisterForm
          form={adminForm}
          onChange={setAdminForm}
          disabled={submitting}
          roles={roles}
        />
      )}
    </CrudModal>
  );
}
