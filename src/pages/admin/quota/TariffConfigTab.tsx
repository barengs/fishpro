import { useState } from "react";
import { PageToolbar } from "../../../components/PageToolbar";
import { CrudModal } from "../../../components/CrudModal";
import { useCrudModal } from "../../../components/useCrudModal";
import { TextField } from "../../../components/ui";

export function TariffConfigTab() {
  const [t, setT] = useState({
    name: "Tarif Nasional 2026",
    gt_threshold: "60",
    rate_small: "0.05",
    rate_large: "0.10",
    is_active: true,
  });
  const tariffModal = useCrudModal();

  return (
    <div>
      <PageToolbar addLabel="Ubah Tarif" onAdd={tariffModal.openModal} />

      <section className="surface-card border rounded-xl p-6 shadow-xs max-w-220">
        <h2 className="m-0 mb-1 text-base font-bold">Tarif PNBP Aktif</h2>
        <p className="m-0 mb-4 text-sm text-soft">
          GT ≤ {t.gt_threshold} → {Number(t.rate_small) * 100}% · GT &gt;{" "}
          {t.gt_threshold} → {Number(t.rate_large) * 100}%
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-soft text-xs mb-1">Nama Tarif</div>
            <div className="font-semibold">{t.name}</div>
          </div>
          <div>
            <div className="text-soft text-xs mb-1">Batas GT</div>
            <div className="font-semibold tabular-nums">
              {t.gt_threshold} GT
            </div>
          </div>
          <div>
            <div className="text-soft text-xs mb-1">Tarif GT Kecil</div>
            <div className="font-semibold tabular-nums">
              {Number(t.rate_small) * 100}%
            </div>
          </div>
          <div>
            <div className="text-soft text-xs mb-1">Tarif GT Besar</div>
            <div className="font-semibold tabular-nums">
              {Number(t.rate_large) * 100}%
            </div>
          </div>
        </div>
      </section>

      <CrudModal
        open={tariffModal.open}
        title="Ubah Tarif PNBP"
        subtitle="Rumus BE: GT ≤ batas → rate_small, GT > batas → rate_large."
        onClose={tariffModal.closeModal}
        onSubmit={(e) => {
          e.preventDefault();
          tariffModal.closeModal();
        }}
        submitLabel="Simpan Tarif"
      >
        <TextField
          label="Nama Tarif (Unik)"
          id="tf-name"
          required
          value={t.name}
          onChange={(e) => setT({ ...t, name: e.target.value })}
        />
        <TextField
          label="Batas Gross Tonnage (GT)"
          id="tf-gt"
          type="number"
          step="0.01"
          required
          value={t.gt_threshold}
          onChange={(e) => setT({ ...t, gt_threshold: e.target.value })}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <TextField
            label="Tarif GT Kecil (Persentase)"
            id="tf-s"
            type="number"
            step="0.0001"
            required
            value={t.rate_small}
            onChange={(e) => setT({ ...t, rate_small: e.target.value })}
          />
          <TextField
            label="Tarif GT Besar (Persentase)"
            id="tf-l"
            type="number"
            step="0.0001"
            required
            value={t.rate_large}
            onChange={(e) => setT({ ...t, rate_large: e.target.value })}
          />
        </div>
        <div className="pt-2">
          <label className="flex items-center gap-2.5 text-sm cursor-pointer text-strong">
            <input
              type="checkbox"
              checked={t.is_active}
              onChange={(e) => setT({ ...t, is_active: e.target.checked })}
              className="w-4 h-4 rounded text-fco-blue accent-fco-blue"
            />
            Tarif Aktif Digunakan
          </label>
        </div>
      </CrudModal>
    </div>
  );
}
