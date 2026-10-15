import { useState } from "react";
import { CrudModal } from "../../../components/CrudModal";
import { SelectField, TextField } from "../../../components/ui";
import {
  type RegisterAdminPayload,
  type RegisterRegulatorPayload,
  type Role,
} from "../../../services/admin";
import { Loader2 } from "lucide-react";

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
    setSubmitting(true);
    try {
      await onSubmit(userRegisterType, adminForm, regulatorForm);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CrudModal
      open={open}
      title={
        userRegisterType === "admin"
          ? "Daftarkan Admin Baru"
          : "Daftarkan Regulator Baru"
      }
      subtitle={
        userRegisterType === "admin"
          ? "Endpoint: POST /api/admin/admin-users/register/"
          : "Endpoint: POST /api/admin/admin-users/register_regulator/"
      }
      onClose={onClose}
      onSubmit={handleSubmit}
      submitLabel={submitting ? "Mendaftarkan..." : "Selesaikan Pendaftaran"}
      wide
    >
      <div className="flex gap-2 p-1 bg-fco-blue-light/50 dark:bg-fco-blue/15 rounded-xl mb-4 w-fit">
        <button
          type="button"
          onClick={() => setUserRegisterType("admin")}
          className={`h-9 px-4 rounded-lg text-xs sm:text-sm font-semibold border-none cursor-pointer transition-all ${
            userRegisterType === "admin"
              ? "bg-fco-blue text-white shadow-xs"
              : "bg-transparent text-soft hover:text-strong"
          }`}
        >
          Administrator KKP
        </button>
        <button
          type="button"
          onClick={() => setUserRegisterType("regulator")}
          className={`h-9 px-4 rounded-lg text-xs sm:text-sm font-semibold border-none cursor-pointer transition-all ${
            userRegisterType === "regulator"
              ? "bg-fco-blue text-white shadow-xs"
              : "bg-transparent text-soft hover:text-strong"
          }`}
        >
          Pengawas / Regulator Kuota
        </button>
      </div>

      {userRegisterType === "admin" ? (
        <div className="flex flex-col gap-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextField
              label="Nama Pengguna (Username)"
              id="ad-user"
              required
              disabled={submitting}
              value={adminForm.username}
              onChange={(e) =>
                setAdminForm({ ...adminForm, username: e.target.value })
              }
              placeholder="admin.kelautan"
            />
            <TextField
              label="Kata Sandi (Min. 8 Karakter)"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextField
              label="Nama Lengkap"
              id="ad-fn"
              optional
              disabled={submitting}
              value={adminForm.full_name || ""}
              onChange={(e) =>
                setAdminForm({ ...adminForm, full_name: e.target.value })
              }
              placeholder="Drs. H. Sulaiman"
            />
            <TextField
              label="Email"
              id="ad-mail"
              type="email"
              optional
              disabled={submitting}
              value={adminForm.email || ""}
              onChange={(e) =>
                setAdminForm({ ...adminForm, email: e.target.value })
              }
              placeholder="admin@kkp.go.id"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <TextField
              label="Telepon"
              id="ad-phone"
              optional
              disabled={submitting}
              value={adminForm.phone || ""}
              onChange={(e) =>
                setAdminForm({ ...adminForm, phone: e.target.value })
              }
              placeholder="08xxxxxxxxxx"
            />
            <TextField
              label="Departemen"
              id="ad-dept"
              optional
              disabled={submitting}
              value={adminForm.department || ""}
              onChange={(e) =>
                setAdminForm({ ...adminForm, department: e.target.value })
              }
              placeholder="Ditjen Perikanan Tangkap"
            />
            <SelectField
              label="Peran Spesifik"
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
                { value: "", label: "— Tetapkan Peran —" },
                ...roles.map((r) => ({ value: r.id, label: r.name })),
              ]}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              placeholder="pengawas.benoa"
            />
            <TextField
              label="Kata Sandi (Min. 8 Karakter)"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              placeholder="Ir. Bambang Wijaya"
            />
            <TextField
              label="Email Dinas"
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <TextField
              label="Nomor Telepon"
              id="reg-phone"
              optional
              disabled={submitting}
              value={regulatorForm.phone || ""}
              onChange={(e) =>
                setRegulatorForm({ ...regulatorForm, phone: e.target.value })
              }
              placeholder="08xxxxxxxxxx"
            />
            <TextField
              label="Satuan Kerja / Dept"
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
            <TextField
              label="Posisi / Jabatan"
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
              placeholder="Pengawas Kuota & Mutu"
            />
          </div>
        </div>
      )}

      {submitting && (
        <div className="flex items-center justify-center gap-2 text-sm text-fco-blue pt-2">
          <Loader2 size={16} className="animate-spin" aria-hidden="true" />
          <span>Mendaftarkan ke server backend...</span>
        </div>
      )}
    </CrudModal>
  );
}
