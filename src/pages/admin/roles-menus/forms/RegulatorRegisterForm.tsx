import { TextField } from "../../../../components/ui";
import { type RegisterRegulatorPayload } from "../../../../services/admin";

interface RegulatorRegisterFormProps {
  form: RegisterRegulatorPayload;
  onChange: (updated: RegisterRegulatorPayload) => void;
  disabled?: boolean;
}

export function RegulatorRegisterForm({
  form,
  onChange,
  disabled = false,
}: RegulatorRegisterFormProps) {
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
            id="reg-user"
            required
            disabled={disabled}
            value={form.username}
            onChange={(e) => onChange({ ...form, username: e.target.value })}
            placeholder="Contoh: pengawas.benoa"
          />
          <TextField
            label="Kata Sandi (Min. 6 Karakter)"
            id="reg-pass"
            type="password"
            required
            disabled={disabled}
            value={form.password}
            onChange={(e) => onChange({ ...form, password: e.target.value })}
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
            disabled={disabled}
            value={form.full_name}
            onChange={(e) => onChange({ ...form, full_name: e.target.value })}
            placeholder="Nama lengkap pengawas"
          />
          <TextField
            label="Email Dinas Pengawas"
            id="reg-mail"
            type="email"
            required
            disabled={disabled}
            value={form.email}
            onChange={(e) => onChange({ ...form, email: e.target.value })}
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
            disabled={disabled}
            value={form.phone || ""}
            onChange={(e) => onChange({ ...form, phone: e.target.value })}
            placeholder="Contoh: 08123456789"
          />
          <TextField
            label="Satuan Kerja / UPT"
            id="reg-dept"
            optional
            disabled={disabled}
            value={form.department || ""}
            onChange={(e) => onChange({ ...form, department: e.target.value })}
            placeholder="PSDKP Pangkalan Benoa"
          />
          <div className="sm:col-span-2">
            <TextField
              label="Jabatan / Posisi Pengawasan"
              id="reg-pos"
              optional
              disabled={disabled}
              value={form.position || ""}
              onChange={(e) => onChange({ ...form, position: e.target.value })}
              placeholder="Pengawas Kuota & Kepatuhan Kapal"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
