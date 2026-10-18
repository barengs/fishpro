import { useEffect, useState } from "react";
import { Check, Loader2, Scale, Ship } from "lucide-react";
import {
  AlertBanner,
  SelectField,
  TextField,
  TextareaField,
} from "../../../components/ui";
import { useToast } from "../../../components/toast";
import { shipsService, type Ship as ShipItem } from "../../../services/ships";

export function ManualQuotaTab({
  initialShipReg = "",
  onQuotaSaved,
}: {
  initialShipReg?: string;
  onQuotaSaved?: () => void;
}) {
  const [ships, setShips] = useState<ShipItem[]>([]);
  const [loadingShips, setLoadingShips] = useState(false);
  const [selectedReg, setSelectedReg] = useState(initialShipReg);
  const [year, setYear] = useState(2026);
  const [quotaAmount, setQuotaAmount] = useState("");
  const [notes, setNotes] = useState(
    "Penyesuaian batas kuota resmi berdasarkan audit kepatuhan regulator KKP",
  );

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  const toast = useToast();

  useEffect(() => {
    let ignore = false;
    async function loadShips() {
      setLoadingShips(true);
      try {
        const data = await shipsService.getAll();
        if (!ignore) {
          setShips(data);
          if (!selectedReg && data.length > 0) {
            const firstShip = data[0];
            setSelectedReg(firstShip.registration_number);
            const q = firstShip.current_year_quota;
            if (q && typeof q === "object" && q.total_quota) {
              setQuotaAmount(String(q.total_quota));
              if (q.year) setYear(Number(q.year));
            }
          }
        }
      } catch {
        // Fallback gracefully
      } finally {
        if (!ignore) setLoadingShips(false);
      }
    }
    loadShips();
    return () => {
      ignore = true;
    };
  }, [selectedReg]);

  const selectedShip = ships.find((s) => s.registration_number === selectedReg);
  const currentQuota = selectedShip?.current_year_quota;

  const handleShipChange = (reg: string) => {
    setSelectedReg(reg);
    const targetShip = ships.find((s) => s.registration_number === reg);
    const q = targetShip?.current_year_quota;
    if (q && typeof q === "object" && q.total_quota) {
      setQuotaAmount(String(q.total_quota));
      if (q.year) {
        setYear(Number(q.year));
      }
    } else {
      setQuotaAmount("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReg) {
      setErrorMsg("Pilih kapal yang akan diberikan kuota.");
      return;
    }

    const amountNum = parseFloat(quotaAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setErrorMsg("Jumlah kuota harus berupa angka lebih besar dari 0 kg.");
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);
    setSuccessInfo(null);

    try {
      const res = await shipsService.regulatorManualQuota({
        ship_registration_number: selectedReg.trim(),
        year: Number(year) || 2026,
        quota_amount: amountNum,
      });

      const successMsg =
        res.message ||
        `Kuota untuk kapal ${selectedReg} tahun ${year} berhasil disimpan sebesar ${amountNum.toLocaleString("id-ID")} kg.`;

      setSuccessInfo(successMsg);
      toast.success(successMsg);
      onQuotaSaved?.();

      // Refresh ship data
      const updatedShips = await shipsService.getAll();
      setShips(updatedShips);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Gagal menyimpan kuota manual.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-220">
      <section className="surface-card border rounded-xl p-5 sm:p-7 shadow-xs">
        <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-fco-border-subtle">
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-fco-blue flex items-center justify-center shrink-0">
            <Scale size={20} strokeWidth={2} aria-hidden="true" />
          </div>
          <div>
            <h2 className="m-0 text-base font-bold text-strong">
              Input Kuota Manual oleh Regulator
            </h2>
            <p className="m-0 text-xs text-soft mt-0.5">
              POST /api/ships/regulator/manual-quota/ — Kewenangan resmi
              pengawas KKP menetapkan kuota per kapal.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4">
            <AlertBanner
              variant="error"
              message={errorMsg}
              onDismiss={() => setErrorMsg(null)}
            />
          </div>
        )}

        {successInfo && (
          <div className="mb-4">
            <AlertBanner
              variant="success"
              message={successInfo}
              onDismiss={() => setSuccessInfo(null)}
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* 1. Pilih Kapal */}
          <SelectField
            label="Pilih Kapal Terdaftar"
            id="man-ship"
            required
            searchable
            searchPlaceholder="Ketik nama kapal atau nomor registrasi..."
            value={selectedReg}
            onChange={(e) => handleShipChange(e.target.value)}
            placeholder={
              loadingShips ? "Memuat daftar kapal..." : "— Pilih Kapal —"
            }
            options={
              ships.length === 0
                ? [
                    {
                      value: "",
                      label: "Belum ada kapal di sistem",
                      disabled: true,
                    },
                  ]
                : ships.map((s) => ({
                    value: s.registration_number,
                    label: `${s.name} (${s.registration_number}) · ${s.gross_tonnage || 0} GT`,
                  }))
            }
          />

          {/* Status Kuota Saat Ini untuk Kapal Terpilih */}
          {selectedShip && (
            <div className="p-4 rounded-xl surface-inset border dark:border-fco-border-dark flex flex-col gap-2.5 text-xs">
              <div className="flex items-center gap-2">
                <Ship size={15} className="text-fco-blue shrink-0" />
                <span className="font-bold text-strong">
                  {selectedShip.name} ({selectedShip.registration_number})
                </span>
                <span className="text-soft">
                  · GT: {selectedShip.gross_tonnage || "—"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-fco-border-subtle">
                <div>
                  <span className="text-soft block text-2xs uppercase tracking-wider">
                    Total Kuota Saat Ini
                  </span>
                  <span className="font-semibold text-strong tabular-nums text-sm">
                    {currentQuota && typeof currentQuota === "object"
                      ? `${Number(currentQuota.total_quota).toLocaleString("id-ID")} kg`
                      : "Belum Ditetapkan"}
                  </span>
                </div>
                <div>
                  <span className="text-soft block text-2xs uppercase tracking-wider">
                    Kuota Terpakai
                  </span>
                  <span className="font-semibold text-strong tabular-nums text-sm">
                    {currentQuota && typeof currentQuota === "object"
                      ? `${Number(currentQuota.used_quota).toLocaleString("id-ID")} kg`
                      : "0 kg"}
                  </span>
                </div>
                <div>
                  <span className="text-soft block text-2xs uppercase tracking-wider">
                    Sisa Kuota
                  </span>
                  <span className="font-semibold text-fco-blue tabular-nums text-sm">
                    {currentQuota && typeof currentQuota === "object"
                      ? `${Number(currentQuota.remaining_quota).toLocaleString("id-ID")} kg (${currentQuota.quota_percentage}%)`
                      : "—"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 2. Tahun & Jumlah Kuota Baru */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <TextField
              label="Tahun Kuota"
              id="man-year"
              type="number"
              required
              disabled={submitting}
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            />

            <TextField
              label="Alokasi Kuota Baru (kg)"
              id="man-amount"
              type="number"
              step="0.01"
              required
              disabled={submitting}
              value={quotaAmount}
              onChange={(e) => setQuotaAmount(e.target.value)}
              placeholder="Contoh: 15000"
            />
          </div>

          {/* 3. Catatan / Alasan Penyesuaian */}
          <TextareaField
            label="Dasar Hukum & Catatan Penyesuaian (Opsional)"
            id="man-notes"
            optional
            rows={2}
            disabled={submitting}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Nomor SK persetujuan, rekomendasi pengawas lapang, dll..."
          />

          {/* Tombol Simpan */}
          <div className="flex justify-end pt-3 border-t border-fco-border-subtle">
            <button
              type="submit"
              disabled={submitting || !selectedReg}
              className="inline-flex items-center gap-2 h-11 px-6 rounded-xl border-none bg-fco-blue hover:bg-fco-blue-hover text-white text-sm font-semibold cursor-pointer transition-colors shadow-xs disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2
                    size={16}
                    className="animate-spin"
                    aria-hidden="true"
                  />
                  <span>Menyimpan ke Server...</span>
                </>
              ) : (
                <>
                  <Check size={16} strokeWidth={2.5} aria-hidden="true" />
                  <span>Simpan & Tetapkan Kuota Resmi</span>
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
