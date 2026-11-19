import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Link2,
  Loader2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  SelectField,
  TextField,
  TextareaField,
} from "../../../../components/ui";
import {
  type SaveScaleCatchResponse,
  type ScaleReading,
} from "../../../../services/iot";
import { type Ship as ShipItem } from "../../../../services/ships";
import { type FishSpecies } from "../../../../services/fish";
import { type FishingArea } from "../../../../services/regions";

interface ScaleCatchFormProps {
  latestReading: ScaleReading | null;
  currentWeightNum: string;
  ships: ShipItem[];
  speciesList: FishSpecies[];
  areas: FishingArea[];
  selectedShipReg: string;
  onShipChange: (reg: string) => void;
  selectedSpeciesId: number;
  onSpeciesChange: (id: number) => void;
  selectedWppId?: number;
  onWppChange: (id?: number) => void;
  catchType: "pelagic" | "demersal" | "reef";
  onCatchTypeChange: (type: "pelagic" | "demersal" | "reef") => void;
  catchDate: string;
  onCatchDateChange: (date: string) => void;
  operatorNotes: string;
  onNotesChange: (notes: string) => void;
  saving: boolean;
  saveSuccess: SaveScaleCatchResponse | null;
  onSubmit: (e: React.FormEvent) => void;
}

export function ScaleCatchForm({
  latestReading,
  currentWeightNum,
  ships,
  speciesList,
  areas,
  selectedShipReg,
  onShipChange,
  selectedSpeciesId,
  onSpeciesChange,
  selectedWppId,
  onWppChange,
  catchType,
  onCatchTypeChange,
  catchDate,
  onCatchDateChange,
  operatorNotes,
  onNotesChange,
  saving,
  saveSuccess,
  onSubmit,
}: ScaleCatchFormProps) {
  const selectedShip = ships.find(
    (s) => s.registration_number === selectedShipReg,
  );
  const quota = selectedShip?.current_year_quota;
  const tareWeight = latestReading?.tare ? Number(latestReading.tare) : 0;
  const grossWeight = latestReading ? Number(latestReading.weight) : 0;
  const netWeightNum = latestReading
    ? Math.max(0, grossWeight - tareWeight)
    : 0;

  const remainingQuotaNum = quota ? Number(quota.remaining_quota) : null;
  const totalQuotaNum = quota ? Number(quota.total_quota) : null;
  const quotaPercent = quota ? Number(quota.quota_percentage) : null;

  const isQuotaExhausted = remainingQuotaNum !== null && remainingQuotaNum <= 0;
  const isQuotaInsufficient =
    remainingQuotaNum !== null &&
    !isQuotaExhausted &&
    netWeightNum > remainingQuotaNum;
  const isQuotaWarning =
    quotaPercent !== null &&
    !isQuotaExhausted &&
    !isQuotaInsufficient &&
    quotaPercent <= 15;

  return (
    <div className="flex flex-col gap-4">
      <form
        onSubmit={onSubmit}
        className="surface-card border border-fco-border-subtle rounded-xs p-6 shadow-2xs flex flex-col gap-4"
      >
        <div className="flex items-start sm:items-center justify-between gap-3 pb-3 border-b border-fco-border-subtle">
          <div>
            <h2 className="m-0 text-base font-bold text-strong">
              Simpan Laporan Tangkapan Pelabuhan
            </h2>
            <p className="m-0 text-xs text-soft mt-0.5 leading-relaxed">
              Tautkan bobot timbangan digital ke data kapal dan simpan ke
              blockchain.
            </p>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className="text-xs font-mono font-bold text-fco-blue px-2.5 py-1 rounded-xs bg-blue-500/10">
              Netto: {netWeightNum > 0 ? netWeightNum.toFixed(2) : currentWeightNum} kg
            </span>
            {tareWeight > 0 && (
              <span className="text-2xs font-mono text-soft">
                Bruto: {grossWeight.toFixed(2)} kg · Tara: {tareWeight.toFixed(2)} kg
              </span>
            )}
          </div>
        </div>

        {/* Kapal Pembongkar */}
        <div className="flex flex-col gap-2">
          <SelectField
            label="Nomor Registrasi / Kapal Pembongkar"
            id="sc-ship"
            required
            searchable
            searchPlaceholder="Cari nama kapal atau nomor registrasi..."
            value={selectedShipReg}
            onChange={(e) => onShipChange(e.target.value)}
            placeholder="— Pilih Kapal —"
            options={ships.map((s) => ({
              value: s.registration_number,
              label: `${s.name} (${s.registration_number}) · ${s.gross_tonnage || 0} GT`,
            }))}
          />

          {/* Quota Warning Threshold Indicator Card */}
          {selectedShip && quota && (
            <div
              className={`p-3.5 rounded-xs border transition-all text-xs flex flex-col gap-2 ${
                isQuotaExhausted
                  ? "bg-red-500/10 border-red-500/40 text-red-900 dark:text-red-200"
                  : isQuotaInsufficient
                    ? "bg-red-500/10 border-red-500/40 text-red-900 dark:text-red-200"
                    : isQuotaWarning
                      ? "bg-amber-500/10 border-amber-500/40 text-amber-900 dark:text-amber-200"
                      : "surface-inset border-fco-border-subtle text-strong"
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <div className="flex items-center gap-1.5">
                  {isQuotaExhausted ? (
                    <ShieldAlert size={16} className="text-red-600 dark:text-red-400" />
                  ) : isQuotaInsufficient ? (
                    <AlertCircle size={16} className="text-red-600 dark:text-red-400" />
                  ) : isQuotaWarning ? (
                    <AlertTriangle size={16} className="text-amber-600 dark:text-amber-400" />
                  ) : (
                    <ShieldCheck size={16} className="text-emerald-600 dark:text-emerald-400" />
                  )}
                  <span>
                    {isQuotaExhausted
                      ? "AMBANG BATAS KRITIS: KUOTA TANGKAPAN HABIS"
                      : isQuotaInsufficient
                        ? "SISA KUOTA TIDAK MENCUKUPI"
                        : isQuotaWarning
                          ? "PERINGATAN: AMBANG BATAS KUOTA MENIPIS (≤ 15%)"
                          : `Sisa Kuota Tangkapan Tahun ${quota.year}`}
                  </span>
                </div>
                <span className="font-mono text-2xs">
                  {quotaPercent !== null ? `${quotaPercent.toFixed(1)}%` : "0%"} tersisa
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-700/60 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isQuotaExhausted || isQuotaInsufficient
                      ? "bg-red-600"
                      : isQuotaWarning
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                  }`}
                  style={{
                    width: `${Math.min(100, Math.max(0, 100 - (quotaPercent || 0)))}%`,
                  }}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-2xs font-mono">
                <div>
                  Sisa Kuota:{" "}
                  <strong
                    className={
                      isQuotaExhausted || isQuotaInsufficient
                        ? "text-red-600 dark:text-red-400 font-extrabold"
                        : "text-strong"
                    }
                  >
                    {remainingQuotaNum?.toLocaleString("id-ID")} kg
                  </strong>{" "}
                  / Alokasi: {totalQuotaNum?.toLocaleString("id-ID")} kg
                </div>
                {netWeightNum > 0 && remainingQuotaNum !== null && (
                  <div className="text-soft">
                    Setelah timbang:{" "}
                    <span
                      className={
                        remainingQuotaNum - netWeightNum < 0
                          ? "text-red-500 font-bold"
                          : "text-strong font-semibold"
                      }
                    >
                      {Math.max(0, remainingQuotaNum - netWeightNum).toLocaleString("id-ID")} kg
                    </span>
                  </div>
                )}
              </div>

              {/* Explanatory Warning Message */}
              {isQuotaExhausted && (
                <p className="m-0 text-2xs font-medium text-red-700 dark:text-red-300">
                  Kapal ini telah mencapai batas maksimum kuota penangkapan tahunan. Penimbangan resmi diblokir hingga penyesuaian kuota diterbitkan.
                </p>
              )}
              {isQuotaInsufficient && (
                <p className="m-0 text-2xs font-medium text-red-700 dark:text-red-300">
                  Bobot bersih timbangan ({netWeightNum.toFixed(2)} kg) melebihi sisa kuota kapal yang tersedia ({remainingQuotaNum?.toLocaleString("id-ID")} kg).
                </p>
              )}
              {isQuotaWarning && (
                <p className="m-0 text-2xs font-medium text-amber-800 dark:text-amber-300">
                  Kapal mendekati kuota batas maksimal. Harap ingatkan nahkoda/pemilik kapal untuk memeriksa alokasi kuota berikutnya.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Jenis Ikan & WPP */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <SelectField
            label="Jenis / Spesies Ikan"
            id="sc-species"
            required
            searchable
            searchPlaceholder="Cari nama ikan..."
            value={selectedSpeciesId}
            onChange={(e) => onSpeciesChange(Number(e.target.value))}
            options={speciesList.map((sp) => ({
              value: sp.id,
              label: `${sp.name} ${sp.scientific_name ? `(${sp.scientific_name})` : ""}`,
            }))}
          />

          <SelectField
            label="Wilayah Penangkapan (WPP)"
            id="sc-wpp"
            searchable
            value={selectedWppId ?? ""}
            onChange={(e) => onWppChange(Number(e.target.value) || undefined)}
            options={areas.map((a) => ({
              value: a.id,
              label: `${a.code} — ${a.nama}`,
            }))}
          />
        </div>

        {/* Tanggal & Jenis Tangkapan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <TextField
            label="Tanggal Pembongkaran"
            id="sc-date"
            type="date"
            required
            value={catchDate}
            onChange={(e) => onCatchDateChange(e.target.value)}
          />

          <SelectField
            label="Kategori Tangkapan"
            id="sc-type"
            value={catchType}
            onChange={(e) =>
              onCatchTypeChange(
                e.target.value as "pelagic" | "demersal" | "reef",
              )
            }
            options={[
              { value: "pelagic", label: "Ikan Pelagis" },
              { value: "demersal", label: "Ikan Demersal" },
              { value: "reef", label: "Ikan Karang" },
            ]}
          />
        </div>

        {/* Catatan Operator */}
        <TextareaField
          label="Catatan Mutu / Pemeriksaan Petugas (Opsional)"
          id="sc-notes"
          optional
          rows={2}
          value={operatorNotes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Kondisi ikan segar ber-es, lolos uji mutu organoleptik pelabuhan..."
        />

        {/* Submit Action Button */}
        <div className="pt-2 border-t border-fco-border-subtle flex flex-col gap-2">
          <button
            type="submit"
            disabled={saving || !latestReading || isQuotaExhausted || isQuotaInsufficient}
            className={`w-full h-11 rounded-xs border-none text-white font-bold text-sm cursor-pointer transition-colors shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
              isQuotaExhausted || isQuotaInsufficient
                ? "bg-red-600 hover:bg-red-700"
                : "bg-fco-blue hover:bg-fco-blue-hover"
            }`}
          >
            {saving ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                  aria-hidden="true"
                />
                <span>Merekam ke Blockchain & Menyimpan...</span>
              </>
            ) : isQuotaExhausted ? (
              <>
                <ShieldAlert size={18} aria-hidden="true" />
                <span>Kuota Kapal Habis (Penyimpanan Diblokir)</span>
              </>
            ) : isQuotaInsufficient ? (
              <>
                <AlertCircle size={18} aria-hidden="true" />
                <span>Sisa Kuota Kurang ({remainingQuotaNum?.toLocaleString("id-ID")} kg Tersisa)</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={18} strokeWidth={2.2} aria-hidden="true" />
                <span className="hidden sm:inline">
                  Simpan Tangkapan Resmi (Potong Kuota, PNBP, & Blockchain)
                </span>
                <span className="sm:hidden">Simpan Tangkapan Resmi</span>
              </>
            )}
          </button>
          <div className="flex items-center justify-between text-2xs text-soft pt-1">
            <span className="flex items-center gap-1.5">
              <Link2 size={13} className="text-fco-blue" />
              <span>Verifikasi Blockchain SHA-256</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles size={13} className="text-fco-blue" />
              <span>Kalkulasi PNBP Otomatis</span>
            </span>
          </div>
        </div>
      </form>

      {/* Success Banner Card */}
      {saveSuccess && (
        <div className="surface-card border-2 border-emerald-500/40 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-xs p-4 sm:p-5 text-xs text-strong flex flex-col gap-3 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-300 text-sm">
            <CheckCircle2 size={18} />
            <span>{saveSuccess.message}</span>
          </div>

          {saveSuccess.quota_warning && (
            <div className="p-2.5 rounded-xs bg-amber-500/15 border border-amber-500/30 flex items-start gap-2 text-xs text-amber-800 dark:text-amber-200">
              <AlertTriangle size={15} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <span>{saveSuccess.quota_warning}</span>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-emerald-500/20 font-mono">
            <div>
              <span className="text-soft block text-2xs">ID Tangkapan</span>
              <span className="font-bold">#{saveSuccess.catch_id}</span>
            </div>
            <div>
              <span className="text-soft block text-2xs">Berat Bersih (Netto)</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {saveSuccess.weight} {saveSuccess.unit}
              </span>
            </div>
            <div>
              <span className="text-soft block text-2xs">Tagihan PNBP</span>
              <span className="font-bold text-fco-blue">
                Rp {Number(saveSuccess.pnbp || 0).toLocaleString("id-ID")}
              </span>
            </div>
            <div>
              <span className="text-soft block text-2xs">Sisa Kuota Kapal</span>
              <span className="font-bold text-strong">
                {saveSuccess.remaining_quota !== null && saveSuccess.remaining_quota !== undefined
                  ? `${Number(saveSuccess.remaining_quota).toLocaleString("id-ID")} kg`
                  : "—"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
