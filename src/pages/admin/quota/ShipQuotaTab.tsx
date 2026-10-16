import { useState } from "react";
import { DataTable, type Column } from "../../../components/DataTable";
import { ProgressBar } from "../../../components/ProgressBar";
import { StatusChip } from "../../../components/StatusChip";
import { PageToolbar } from "../../../components/PageToolbar";
import { CrudModal } from "../../../components/CrudModal";
import { useCrudModal } from "../../../components/useCrudModal";
import { TextField } from "../../../components/ui";

interface QuotaRow {
  id: number;
  ship: string;
  year: string;
  quota: string;
  remaining: string;
  pct: string;
}

const initialRows: QuotaRow[] = [
  {
    id: 1,
    ship: "KM Bahari Satu",
    year: "2026",
    quota: "15.000 kg",
    remaining: "2.100 kg",
    pct: "14%",
  },
  {
    id: 2,
    ship: "KM Cahaya Timur",
    year: "2026",
    quota: "10.000 kg",
    remaining: "900 kg",
    pct: "9%",
  },
  {
    id: 3,
    ship: "KM Samudra Jaya",
    year: "2026",
    quota: "12.000 kg",
    remaining: "8.400 kg",
    pct: "70%",
  },
];

export function ShipQuotaTab() {
  const [rows] = useState<QuotaRow[]>(initialRows);
  const [q, setQ] = useState({ ship: "", year: "2026", quota: "" });
  const quotaModal = useCrudModal();

  const cols: Column<QuotaRow>[] = [
    {
      key: "ship",
      header: "Kapal / Tahun",
      flex: 3,
      render: (r) => (
        <div>
          <div className="text-sm font-semibold">{r.ship}</div>
          <div className="text-xs text-soft tabular-nums">{r.year}</div>
        </div>
      ),
    },
    {
      key: "quota",
      header: "Kuota",
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

  return (
    <div>
      <PageToolbar
        searchPlaceholder="Cari kapal..."
        addLabel="Tambah Kuota"
        onAdd={quotaModal.openModal}
      />

      <section className="surface-card border rounded-xl p-6 shadow-xs">
        <DataTable columns={cols} rows={rows} rowKey={(r) => String(r.id)} />
      </section>

      <CrudModal
        open={quotaModal.open}
        title="Tambah Kuota Kapal"
        subtitle="Quota unik per kapal-tahun (ship, year, quota kg)."
        onClose={quotaModal.closeModal}
        onSubmit={(e) => {
          e.preventDefault();
          quotaModal.closeModal();
        }}
        submitLabel="Simpan Kuota"
      >
        <TextField
          label="Kapal (Nomor Registrasi / Nama)"
          id="q-ship"
          required
          value={q.ship}
          onChange={(e) => setQ({ ...q, ship: e.target.value })}
          placeholder="Contoh: KM Samudra Jaya atau REG-0412"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <TextField
            label="Tahun Kuota"
            id="q-year"
            type="number"
            required
            value={q.year}
            onChange={(e) => setQ({ ...q, year: e.target.value })}
          />
          <TextField
            label="Jumlah Kuota (kg)"
            id="q-q"
            type="number"
            step="0.01"
            required
            value={q.quota}
            onChange={(e) => setQ({ ...q, quota: e.target.value })}
            placeholder="15000"
          />
        </div>
      </CrudModal>
    </div>
  );
}
