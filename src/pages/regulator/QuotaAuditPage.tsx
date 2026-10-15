import { useState } from "react";
import { PageToolbar } from "../../components/PageToolbar";
import { DataTable, type Column } from "../../components/DataTable";
import { StatusChip } from "../../components/StatusChip";
import { ProgressBar } from "../../components/ProgressBar";
import { FormField, inputCls } from "../../components/FormField";
import { CrudModal } from "../../components/CrudModal";
import { useCrudModal } from "../../components/useCrudModal";

// Regulator = CustomUser role=regulator; fokus: audit Quota (ship FK, year, quota, remaining_quota),
// verifikasi FishCatchTransaction, override manual quota, pantau Tariff & kepatuhan WPP.
interface AuditRow {
  id: number;
  ship: string;
  reg: string;
  year: string;
  quota: string;
  remaining: string;
  pct: string;
  wpp: string;
}

export function QuotaAuditPage() {
  const [rows] = useState<AuditRow[]>([
    {
      id: 1,
      ship: "KM Bahari Satu",
      reg: "REG-0087",
      year: "2026",
      quota: "15.000 kg",
      remaining: "2.100 kg",
      pct: "14%",
      wpp: "WPP 712",
    },
    {
      id: 2,
      ship: "KM Cahaya Timur",
      reg: "REG-0319",
      year: "2026",
      quota: "10.000 kg",
      remaining: "900 kg",
      pct: "9%",
      wpp: "WPP 711",
    },
    {
      id: 3,
      ship: "KM Samudra Jaya",
      reg: "REG-0412",
      year: "2026",
      quota: "12.000 kg",
      remaining: "8.400 kg",
      pct: "70%",
      wpp: "WPP 573",
    },
  ]);
  const [f, setF] = useState({
    registration_number: "",
    year: "2026",
    new_quota: "",
    reason: "",
  });
  const [toast, setToast] = useState<string | null>(null);
  const { open, openModal, closeModal } = useCrudModal();

  const cols: Column<AuditRow>[] = [
    {
      key: "ship",
      header: "Kapal / Reg",
      flex: 3,
      render: (r) => (
        <div>
          <div className="text-sm font-semibold">{r.ship}</div>
          <div className="text-xs text-soft tabular-nums">
            {r.reg} · {r.year}
          </div>
        </div>
      ),
    },
    {
      key: "quota",
      header: "Kuota (kg)",
      flex: 2,
      align: "right",
      render: (r) => <span className="text-sm tabular-nums">{r.quota}</span>,
    },
    {
      key: "rem",
      header: "Sisa",
      flex: 3,
      render: (r) => <ProgressBar width={r.pct} showText />,
    },
    {
      key: "wpp",
      header: "WPP",
      flex: 1,
      render: (r) => <span className="text-sm">{r.wpp}</span>,
    },
    {
      key: "st",
      header: "Status",
      flex: 1,
      align: "center",
      render: (r) =>
        Number.parseInt(r.pct) < 15 ? (
          <StatusChip label="Kritis" bg="#FFF1E0" color="#B54708" />
        ) : (
          <StatusChip label="Aman" />
        ),
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.registration_number || !f.new_quota) return;
    setToast(
      `Kuota ${f.registration_number} tahun ${f.year} → ${Number(f.new_quota).toLocaleString("id-ID")} kg`,
    );
    setTimeout(() => setToast(null), 4000);
    closeModal();
  };

  return (
    <div>
      <PageToolbar
        title="Audit Kuota"
        desc="Verifikasi quota + kepatuhan WPP per kapal. Override manual tercatat dengan alasan."
        searchPlaceholder="Cari registrasi kapal"
        addLabel="Override kuota"
        onAdd={openModal}
      />
      {toast && (
        <div className="p-3.5 px-4.5 rounded-xl bg-fco-blue-light text-fco-blue text-sm font-semibold mb-5 border border-fco-blue-border">
          ✓ {toast}
        </div>
      )}
      <section className="surface-card border rounded-2xl p-6 shadow-xs">
        <DataTable columns={cols} rows={rows} rowKey={(r) => String(r.id)} />
      </section>
      <CrudModal
        open={open}
        title="Override kuota manual"
        subtitle="Hak regulator: ship + year + quota baru + alasan."
        onClose={closeModal}
        onSubmit={handleSubmit}
        submitLabel="Simpan override"
      >
        <FormField label="Nomor registrasi kapal" htmlFor="ov-reg" required>
          <input
            id="ov-reg"
            required
            value={f.registration_number}
            onChange={(e) =>
              setF({ ...f, registration_number: e.target.value })
            }
            placeholder="REG-0087"
            className={inputCls}
          />
        </FormField>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Tahun" htmlFor="ov-year" required>
            <input
              id="ov-year"
              type="number"
              required
              value={f.year}
              onChange={(e) => setF({ ...f, year: e.target.value })}
              className={inputCls}
            />
          </FormField>
          <FormField label="Kuota baru (kg)" htmlFor="ov-q" required>
            <input
              id="ov-q"
              type="number"
              step="0.01"
              required
              value={f.new_quota}
              onChange={(e) => setF({ ...f, new_quota: e.target.value })}
              className={inputCls}
            />
          </FormField>
        </div>
        <FormField label="Alasan penyesuaian" htmlFor="ov-r">
          <textarea
            id="ov-r"
            rows={3}
            value={f.reason}
            onChange={(e) => setF({ ...f, reason: e.target.value })}
            className="w-full border rounded-xl p-3 text-fco-md field-input focus:outline-none focus:border-fco-blue"
          />
        </FormField>
      </CrudModal>
    </div>
  );
}
