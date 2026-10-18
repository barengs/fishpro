import { useState } from "react";
import { Ship as ShipIcon } from "lucide-react";
import { CrudModal } from "../../../components/CrudModal";
import { SelectField, TextField, TextareaField } from "../../../components/ui";
import { type Ship } from "../../../services/ships";

interface ManualQuotaModalProps {
  isOpen: boolean;
  onClose: () => void;
  ship?: Ship | null;
  ships?: Ship[];
  initialShipReg?: string;
  onSave: (data: {
    shipReg: string;
    year: number;
    newQuota: number;
    reason: string;
  }) => Promise<void> | void;
}

function ManualQuotaFormContent({
  ship,
  ships,
  initialShipReg,
  onClose,
  onSave,
}: {
  ship?: Ship | null;
  ships: Ship[];
  initialShipReg?: string;
  onClose: () => void;
  onSave: ManualQuotaModalProps["onSave"];
}) {
  const [selectedReg, setSelectedReg] = useState(() => {
    if (ship) return ship.registration_number;
    if (initialShipReg) return initialShipReg;
    if (ships.length > 0) return ships[0].registration_number;
    return "";
  });

  const [year, setYear] = useState(() => {
    const q = ship?.current_year_quota;
    if (q && typeof q === "object" && q.year) {
      return Number(q.year);
    }
    return 2026;
  });

  const [newQuota, setNewQuota] = useState(() => {
    const q = ship?.current_year_quota;
    if (q && typeof q === "object" && q.total_quota) {
      return String(q.total_quota);
    }
    return "";
  });

  const [reason, setReason] = useState(
    "Penyesuaian kuota berdasarkan rekomendasi optimasi NSGA-III",
  );
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Find active ship data
  const activeShip =
    ship || ships.find((s) => s.registration_number === selectedReg);
  const currentQuota = activeShip?.current_year_quota;

  const handleShipSelect = (reg: string) => {
    setSelectedReg(reg);
    const target = ships.find((s) => s.registration_number === reg);
    const q = target?.current_year_quota;
    if (q && typeof q === "object" && q.total_quota) {
      setNewQuota(String(q.total_quota));
      if (q.year) setYear(Number(q.year));
    } else {
      setNewQuota("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReg.trim()) {
      setErrorMsg("Pilih kapal yang akan disesuaikan kuotanya.");
      return;
    }
    const quotaVal = parseFloat(newQuota);
    if (isNaN(quotaVal) || quotaVal <= 0) {
      setErrorMsg(
        "Alokasi kuota baru harus berupa angka lebih besar dari 0 kg.",
      );
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);
    try {
      await onSave({
        shipReg: selectedReg.trim(),
        year: Number(year) || 2026,
        newQuota: quotaVal,
        reason: reason.trim(),
      });
      onClose();
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Gagal menyimpan penyesuaian kuota.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {errorMsg && (
        <div
          role="alert"
          className="p-3 px-4 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 text-xs font-semibold border border-red-200 dark:border-red-500/20"
        >
          ⚠ {errorMsg}
        </div>
      )}

      {/* Jika dipanggil dari baris kapal di tabel, tampilkan badge ringkasan otomatis */}
      {ship ? (
        <div className="p-3.5 rounded-xl surface-inset border dark:border-fco-border-dark flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-fco-blue-light dark:bg-fco-blue/20 text-fco-blue flex items-center justify-center shrink-0">
            <ShipIcon size={20} aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold text-strong truncate">
              {ship.name}
            </div>
            <div className="text-xs text-soft font-mono truncate">
              {ship.registration_number} · {ship.gross_tonnage || 0} GT ·{" "}
              {ship.home_port || "Pangkalan —"}
            </div>
          </div>
        </div>
      ) : (
        <SelectField
          label="Pilih Kapal Terdaftar"
          id="man-ship-pick"
          required
          searchable
          searchPlaceholder="Ketik nama kapal atau nomor registrasi..."
          value={selectedReg}
          onChange={(e) => handleShipSelect(e.target.value)}
          options={ships.map((s) => ({
            value: s.registration_number,
            label: `${s.name} (${s.registration_number}) · ${s.gross_tonnage || 0} GT`,
          }))}
        />
      )}

      {/* Status Kuota Saat Ini */}
      {activeShip && (
        <div className="p-3.5 rounded-xl surface-inset border dark:border-fco-border-dark grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div>
            <span className="text-2xs text-soft uppercase tracking-wider block">
              Total Kuota Saat Ini
            </span>
            <span className="font-bold text-strong text-sm tabular-nums">
              {currentQuota && typeof currentQuota === "object"
                ? `${Number(currentQuota.total_quota).toLocaleString("id-ID")} kg`
                : "Belum Ditetapkan"}
            </span>
          </div>
          <div>
            <span className="text-2xs text-soft uppercase tracking-wider block">
              Realisasi Terpakai
            </span>
            <span className="font-semibold text-strong text-sm tabular-nums">
              {currentQuota && typeof currentQuota === "object"
                ? `${Number(currentQuota.used_quota).toLocaleString("id-ID")} kg`
                : "0 kg"}
            </span>
          </div>
          <div>
            <span className="text-2xs text-soft uppercase tracking-wider block">
              Sisa Kuota
            </span>
            <span className="font-bold text-fco-blue text-sm tabular-nums">
              {currentQuota && typeof currentQuota === "object"
                ? `${Number(currentQuota.remaining_quota).toLocaleString("id-ID")} kg (${currentQuota.quota_percentage}%)`
                : "—"}
            </span>
          </div>
        </div>
      )}

      {/* Form Inputs: Tahun & Kuota Baru */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <TextField
          label="Tahun Kuota"
          id="man-yr"
          type="number"
          required
          disabled={submitting}
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        />

        <TextField
          label="Alokasi Kuota Baru (kg)"
          id="man-qty"
          type="number"
          step="0.01"
          required
          disabled={submitting}
          value={newQuota}
          onChange={(e) => setNewQuota(e.target.value)}
          placeholder="Contoh: 15000"
        />
      </div>

      {/* Alasan Penyesuaian */}
      <TextareaField
        label="Dasar Hukum / Alasan Penyesuaian"
        id="man-rsn"
        optional
        rows={2}
        disabled={submitting}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Rekomendasi model optimasi AI, SK perizinan KKP, dll..."
      />

      <div className="flex gap-2.5 justify-end mt-2 pt-4 border-t border-fco-border-subtle">
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="h-10 px-4 rounded-xl border border-fco-border surface-card hover:surface-page text-sm font-semibold text-strong cursor-pointer"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="h-10 px-5 rounded-xl border-none bg-fco-blue hover:bg-fco-blue-hover text-white text-sm font-semibold cursor-pointer shadow-xs disabled:opacity-60"
        >
          {submitting ? "Menyimpan..." : "Simpan Kuota"}
        </button>
      </div>
    </form>
  );
}

export function ManualQuotaModal({
  isOpen,
  onClose,
  ship,
  ships = [],
  initialShipReg,
  onSave,
}: ManualQuotaModalProps) {
  if (!isOpen) return null;

  return (
    <CrudModal
      open={isOpen}
      title="Penyesuaian Manual Kuota Kapal"
      subtitle="Kewenangan resmi pengawas KKP menetapkan alokasi kuota kapal penangkap ikan."
      onClose={onClose}
      hideFooter
    >
      <ManualQuotaFormContent
        key={ship ? String(ship.id) : initialShipReg || "new"}
        ship={ship}
        ships={ships}
        initialShipReg={initialShipReg}
        onClose={onClose}
        onSave={onSave}
      />
    </CrudModal>
  );
}
