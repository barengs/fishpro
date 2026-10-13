import { useState } from "react";
import { PageToolbar } from "../../components/PageToolbar";
import { DataTable, type Column } from "../../components/DataTable";
import { CrudActions } from "../../components/FormField";
import { StatusChip } from "../../components/StatusChip";
import { ProgressBar } from "../../components/ProgressBar";
import { CrudModal } from "../../components/CrudModal";
import { useCrudModal } from "../../components/useCrudModal";
import { ShipFormWizard } from "../../components/ShipFormWizard";
import type { ShipFormData } from "../../components/shipFormTypes";

// Owner view: Ship miliknya (name, registration_number, captain FK, gross_tonnage, home_port),
// Captain miliknya (full_name, license_number, years_of_experience), Quota + PNBP per kapal.
interface FleetRow {
  id: number;
  name: string;
  reg: string;
  captain: string;
  pct: string;
  active: boolean;
}

export function FleetPage() {
  const [rows, setRows] = useState<FleetRow[]>([
    {
      id: 1,
      name: "KM Samudra Jaya",
      reg: "REG-0412",
      captain: "Budi Hartono",
      pct: "70%",
      active: true,
    },
    {
      id: 2,
      name: "KM Bahari Satu",
      reg: "REG-0087",
      captain: "Agus Salim",
      pct: "14%",
      active: true,
    },
    {
      id: 3,
      name: "KM Tirta Mas",
      reg: "REG-0450",
      captain: "Belum ditunjuk",
      pct: "81%",
      active: true,
    },
  ]);
  const { open, openModal, closeModal } = useCrudModal();

  const cols: Column<FleetRow>[] = [
    {
      key: "ship",
      header: "Kapal / Registrasi",
      flex: 3,
      render: (r) => (
        <div>
          <div className="text-sm font-semibold">{r.name}</div>
          <div className="text-xs text-soft tabular-nums">{r.reg}</div>
        </div>
      ),
    },
    {
      key: "cap",
      header: "Nahkoda",
      flex: 2,
      render: (r) => <span className="text-sm">{r.captain}</span>,
    },
    {
      key: "q",
      header: "Sisa Kuota",
      flex: 3,
      render: (r) => <ProgressBar width={r.pct} showText />,
    },
    {
      key: "st",
      header: "Status",
      flex: 1,
      align: "center",
      render: (r) =>
        r.captain === "Belum ditunjuk" ? (
          <StatusChip label="Tanpa nahkoda" bg="#EEF1F6" color="#4A5872" />
        ) : (
          <StatusChip label="Aktif" />
        ),
    },
    {
      key: "aksi",
      header: "Aksi",
      flex: 1,
      align: "right",
      render: (r) => (
        <CrudActions
          onDelete={() => setRows((p) => p.filter((x) => x.id !== r.id))}
        />
      ),
    },
  ];

  const handleSubmit = (data: ShipFormData) => {
    setRows((p) => [
      ...p,
      {
        id: Date.now(),
        name: data.name,
        reg: data.registration_number,
        captain: data.captain || "Belum ditunjuk",
        pct: "100%",
        active: data.active,
      },
    ]);
    closeModal();
  };

  return (
    <div>
      <PageToolbar
        title="Armada Kapal"
        desc="Kapal milik Anda: name, registration_number unik, captain, dimensi, GT, home_port."
        searchPlaceholder="Cari armada"
        addLabel="Tambah kapal"
        onAdd={openModal}
      />
      <section className="surface-card border rounded-2xl p-6 shadow-xs">
        <DataTable columns={cols} rows={rows} rowKey={(r) => String(r.id)} />
      </section>
      <CrudModal
        open={open}
        title="Tambah kapal"
        subtitle="3 langkah: identitas, spesifikasi, cek."
        onClose={closeModal}
        hideFooter
      >
        <ShipFormWizard onSubmit={handleSubmit} />
      </CrudModal>
    </div>
  );
}
