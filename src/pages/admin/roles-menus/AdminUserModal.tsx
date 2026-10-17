import { useState } from "react";
import { AlertCircle, Scale, ShieldCheck } from "lucide-react";
import { CrudModal } from "../../../components/CrudModal";
import {
  type RegisterAdminPayload,
  type RegisterRegulatorPayload,
  type Role,
} from "../../../services/admin";
import { adminUserSchema } from "../../../utils/schemas";
import { AdminRegisterForm } from "./forms/AdminRegisterForm";
import { RegulatorRegisterForm } from "./forms/RegulatorRegisterForm";

interface AdminUserModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    type: "admin" | "regulator",
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
  const [userRegisterType, setUserRegisterType] = useState<
    "admin" | "regulator"
  >("admin");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [adminForm, setAdminForm] = useState<RegisterAdminPayload>({
    username: "",
    password: "",
    email: "",
    full_name: "",
    phone: "",
    department: "KKP Pusat",
    position: "Staff Administrator",
    role: null,
  });

  const [regulatorForm, setRegulatorForm] = useState<RegisterRegulatorPayload>({
    username: "",
    email: "",
    password: "",
    full_name: "",
    phone: "",
    department: "Direktorat Pengawasan",
    position: "Pengawas Kuota Perikanan",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = userRegisterType === "admin" ? adminForm : regulatorForm;
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
      await onSubmit(userRegisterType, adminForm, regulatorForm);
      onClose();
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Gagal mendaftarkan akun petugas.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CrudModal
      open={open}
      title={
        userRegisterType === "admin"
          ? "Daftarkan Petugas Administrator"
          : "Daftarkan Inspektur Regulator"
      }
      subtitle={
        userRegisterType === "admin"
          ? "Akun staf administrator dengan akses pengelolaan data master dan sistem."
          : "Akun pengawas resmi KKP untuk audit kepatuhan kuota dan verifikasi blockchain."
      }
      onClose={onClose}
      onSubmit={handleSubmit}
      submitLabel={submitting ? "Mendaftarkan..." : "Daftarkan Petugas"}
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

      {/* Segmented Role Selector */}
      <div className="mb-5">
        <label className="block text-xs font-bold text-soft uppercase tracking-wider mb-2">
          Pilih Jenis Akun Petugas
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-1 surface-inset border dark:border-fco-border-dark rounded-xl">
          <button
            type="button"
            onClick={() => {
              setUserRegisterType("admin");
              setErrorMsg(null);
            }}
            className={`flex items-center justify-center gap-2.5 h-10 px-4 rounded-lg text-sm font-semibold transition-all cursor-pointer border-none ${
              userRegisterType === "admin"
                ? "bg-fco-blue text-white shadow-xs"
                : "bg-transparent text-soft hover:text-strong hover:surface-page"
            }`}
          >
            <ShieldCheck size={18} strokeWidth={2} aria-hidden="true" />
            <span>Administrator KKP</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setUserRegisterType("regulator");
              setErrorMsg(null);
            }}
            className={`flex items-center justify-center gap-2.5 h-10 px-4 rounded-lg text-sm font-semibold transition-all cursor-pointer border-none ${
              userRegisterType === "regulator"
                ? "bg-fco-blue text-white shadow-xs"
                : "bg-transparent text-soft hover:text-strong hover:surface-page"
            }`}
          >
            <Scale size={18} strokeWidth={2} aria-hidden="true" />
            <span>Pengawas / Regulator Kuota</span>
          </button>
        </div>
      </div>

      {userRegisterType === "admin" ? (
        <AdminRegisterForm
          form={adminForm}
          onChange={setAdminForm}
          disabled={submitting}
          roles={roles}
        />
      ) : (
        <RegulatorRegisterForm
          form={regulatorForm}
          onChange={setRegulatorForm}
          disabled={submitting}
        />
      )}
    </CrudModal>
  );
}
