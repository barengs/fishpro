import { SelectField, TextField } from "../../../../components/ui";
import {
  type RegisterAdminPayload,
  type Role,
} from "../../../../services/admin";

interface AdminRegisterFormProps {
  form: RegisterAdminPayload;
  onChange: (updated: RegisterAdminPayload) => void;
  disabled?: boolean;
  roles: Role[];
}

export function AdminRegisterForm({
  form,
  onChange,
  disabled = false,
  roles,
}: AdminRegisterFormProps) {
  return (
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
            disabled={disabled}
            value={form.username}
            onChange={(e) => onChange({ ...form, username: e.target.value })}
            placeholder="Contoh: admin_pusat"
          />
          <TextField
            label="Kata Sandi (Min. 6 Karakter)"
            id="ad-pass"
            type="password"
            required
            disabled={disabled}
            value={form.password}
            onChange={(e) => onChange({ ...form, password: e.target.value })}
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
            disabled={disabled}
            value={form.full_name || ""}
            onChange={(e) => onChange({ ...form, full_name: e.target.value })}
            placeholder="Nama lengkap sesuai SK"
          />
          <TextField
            label="Email Dinas KKP"
            id="ad-mail"
            type="email"
            required
            disabled={disabled}
            value={form.email || ""}
            onChange={(e) => onChange({ ...form, email: e.target.value })}
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
            disabled={disabled}
            value={form.phone || ""}
            onChange={(e) => onChange({ ...form, phone: e.target.value })}
            placeholder="Contoh: 08123456789"
          />
          <TextField
            label="Departemen / Direktorat"
            id="ad-dept"
            optional
            disabled={disabled}
            value={form.department || ""}
            onChange={(e) => onChange({ ...form, department: e.target.value })}
            placeholder="Ditjen Perikanan Tangkap"
          />
          <div className="sm:col-span-2">
            <SelectField
              label="Penugasan Peran Khusus"
              id="ad-role"
              optional
              searchable
              searchPlaceholder="Cari peran..."
              disabled={disabled || roles.length === 0}
              value={form.role || ""}
              onChange={(e) =>
                onChange({
                  ...form,
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
  );
}
