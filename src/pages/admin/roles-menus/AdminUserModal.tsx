import { useState } from "react";
import { Scale, ShieldCheck } from "lucide-react";
import { CrudModal } from "../../../components/CrudModal";
import { SelectField, TextField } from "../../../components/ui";
import {
  type RegisterAdminPayload,
  type RegisterRegulatorPayload,
  type Role,
} from "../../../services/admin";
import { adminUserSchema } from "../../../utils/schemas";

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
          className="p-3.5 px-4 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 text-xs font-semibold mb-4 border border-red-200 dark:border-red-500/20"
        >
          ⚠ {errorMsg}
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
        <div className="flex flex-col gap-4">
          {/* Section 1: Kredensial Login */}
          <div className="p-4 rounded-xl surface-card border dark:border-fco-border-dark flex flex-col gap-3.5">
            <div className="text-xs font-bold text-soft uppercase tracking-wider border-b border-fco-border-subtle pb-2">
              1. Kredensial Akses
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <TextField
                label="Nama Pengguna (Username)"
                id="ad-user"
                required
                disabled={submitting}
                value={adminForm.username}
                onChange={(e) =>
                  setAdminForm({ ...adminForm, username: e.target.value })
                }
                placeholder="Contoh: admin_pusat"
              />
              <TextField
                label="Kata Sandi (Min. 6 Karakter)"
                id="ad-pass"
                type="password"
                required
                disabled={submitting}
                value={adminForm.password}
                onChange={(e) =>
                  setAdminForm({ ...adminForm, password: e.target.value })
                }
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Section 2: Informasi Profil & Kontak */}
          <div className="p-4 rounded-xl surface-card border dark:border-fco-border-dark flex flex-col gap-3.5">
            <div className="text-xs font-bold text-soft uppercase tracking-wider border-b border-fco-border-subtle pb-2">
              2. Data Diri & Kontak
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <TextField
                label="Nama Lengkap Petugas"
                id="ad-fn"
                required
                disabled={submitting}
                value={adminForm.full_name || ""}
                onChange={(e) =>
                  setAdminForm({ ...adminForm, full_name: e.target.value })
                }
                placeholder="Nama lengkap sesuai SK"
              />
              <TextField
                label="Email Dinas KKP"
                id="ad-mail"
                type="email"
                required
                disabled={submitting}
                value={adminForm.email || ""}
                onChange={(e) =>
                  setAdminForm({ ...adminForm, email: e.target.value })
                }
                placeholder="staf@kkp.go.id"
              />
            </div>
          </div>

          {/* Section 3: Instansi & Penugasan */}
          <div className="p-4 rounded-xl surface-card border dark:border-fco-border-dark flex flex-col gap-3.5">
            <div className="text-xs font-bold text-soft uppercase tracking-wider border-b border-fco-border-subtle pb-2">
              3. Penugasan & Satuan Kerja
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <TextField
                label="Nomor Telepon"
                id="ad-phone"
                optional
                disabled={submitting}
                value={adminForm.phone || ""}
                onChange={(e) =>
                  setAdminForm({ ...adminForm, phone: e.target.value })
                }
                placeholder="Contoh: 08123456789"
              />
              <TextField
                label="Departemen / Direktorat"
                id="ad-dept"
                optional
                disabled={submitting}
                value={adminForm.department || ""}
                onChange={(e) =>
                  setAdminForm({ ...adminForm, department: e.target.value })
                }
                placeholder="Ditjen Perikanan Tangkap"
              />
              <div className="sm:col-span-2">
                <SelectField
                  label="Penugasan Peran Khusus"
                  id="ad-role"
                  optional
                  disabled={submitting || roles.length === 0}
                  value={adminForm.role || ""}
                  onChange={(e) =>
                    setAdminForm({
                      ...adminForm,
                      role: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                  options={[
                    { value: "", label: "— Default Administrator —" },
                    ...roles.map((r) => ({ value: r.id, label: r.name })),
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Section 1: Kredensial Login */}
          <div className="p-4 rounded-xl surface-card border dark:border-fco-border-dark flex flex-col gap-3.5">
            <div className="text-xs font-bold text-soft uppercase tracking-wider border-b border-fco-border-subtle pb-2">
              1. Kredensial Akses
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <TextField
                label="Nama Pengguna (Username)"
                id="reg-user"
                required
                disabled={submitting}
                value={regulatorForm.username}
                onChange={(e) =>
                  setRegulatorForm({
                    ...regulatorForm,
                    username: e.target.value,
                  })
                }
                placeholder="Contoh: pengawas.benoa"
              />
              <TextField
                label="Kata Sandi (Min. 6 Karakter)"
                id="reg-pass"
                type="password"
                required
                disabled={submitting}
                value={regulatorForm.password}
                onChange={(e) =>
                  setRegulatorForm({
                    ...regulatorForm,
                    password: e.target.value,
                  })
                }
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Section 2: Data Diri & Kontak */}
          <div className="p-4 rounded-xl surface-card border dark:border-fco-border-dark flex flex-col gap-3.5">
            <div className="text-xs font-bold text-soft uppercase tracking-wider border-b border-fco-border-subtle pb-2">
              2. Data Diri & Kontak
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <TextField
                label="Nama Lengkap Pengawas"
                id="reg-name"
                required
                disabled={submitting}
                value={regulatorForm.full_name}
                onChange={(e) =>
                  setRegulatorForm({
                    ...regulatorForm,
                    full_name: e.target.value,
                  })
                }
                placeholder="Nama lengkap pengawas"
              />
              <TextField
                label="Email Dinas Pengawas"
                id="reg-mail"
                type="email"
                required
                disabled={submitting}
                value={regulatorForm.email}
                onChange={(e) =>
                  setRegulatorForm({ ...regulatorForm, email: e.target.value })
                }
                placeholder="pengawas@kkp.go.id"
              />
            </div>
          </div>

          {/* Section 3: Instansi & Posisi */}
          <div className="p-4 rounded-xl surface-card border dark:border-fco-border-dark flex flex-col gap-3.5">
            <div className="text-xs font-bold text-soft uppercase tracking-wider border-b border-fco-border-subtle pb-2">
              3. Satuan Kerja & Jabatan
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <TextField
                label="Nomor Telepon"
                id="reg-phone"
                optional
                disabled={submitting}
                value={regulatorForm.phone || ""}
                onChange={(e) =>
                  setRegulatorForm({ ...regulatorForm, phone: e.target.value })
                }
                placeholder="Contoh: 08123456789"
              />
              <TextField
                label="Satuan Kerja / UPT"
                id="reg-dept"
                optional
                disabled={submitting}
                value={regulatorForm.department || ""}
                onChange={(e) =>
                  setRegulatorForm({
                    ...regulatorForm,
                    department: e.target.value,
                  })
                }
                placeholder="PSDKP Pangkalan Benoa"
              />
              <div className="sm:col-span-2">
                <TextField
                  label="Jabatan / Posisi Pengawasan"
                  id="reg-pos"
                  optional
                  disabled={submitting}
                  value={regulatorForm.position || ""}
                  onChange={(e) =>
                    setRegulatorForm({
                      ...regulatorForm,
                      position: e.target.value,
                    })
                  }
                  placeholder="Pengawas Kuota & Kepatuhan Kapal"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </CrudModal>
  );
}
