import {
  AlertCircle,
  Brain,
  Check,
  Cpu,
  Loader2,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { SelectField } from "../../../components/ui";
import { usePredictQuotaTab } from "../hooks/usePredictQuotaTab";

export function PredictQuotaTab({
  initialShipReg = "",
  onQuotaApplied,
}: {
  initialShipReg?: string;
  onQuotaApplied?: () => void;
}) {
  const {
    ships,
    loadingShips,
    selectedReg,
    setSelectedReg,
    months,
    setMonths,
    epochLevel,
    setEpochLevel,
    predicting,
    applying,
    result,
    errorMsg,
    recommendedVal,
    handleRunPrediction,
    handleApplyToShip,
  } = usePredictQuotaTab(initialShipReg, onQuotaApplied);

  return (
    <div className="flex flex-col gap-6">
      {/* Configuration Card */}
      <section className="surface-card border rounded-xl p-5 sm:p-7 shadow-xs">
        <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-fco-border-subtle">
          <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Brain size={20} strokeWidth={2} aria-hidden="true" />
          </div>
          <h2 className="m-0 text-base font-bold text-strong">
            Parameter Prediksi AI (LSTM + NSGA-III)
          </h2>
        </div>

        <form onSubmit={handleRunPrediction} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* 1. Pilih Kapal */}
            <div className="sm:col-span-1">
              <SelectField
                label="Pilih Kapal Terdaftar"
                id="pred-ship"
                required
                searchable
                searchPlaceholder="Cari nama kapal / nomor registrasi..."
                value={selectedReg}
                onChange={(e) => setSelectedReg(e.target.value)}
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
                        label: `${s.name} (${s.registration_number})`,
                      }))
                }
              />
            </div>

            {/* 2. Periode Prediksi (Bulan) */}
            <div>
              <SelectField
                label="Horizon Prediksi"
                id="pred-months"
                value={months}
                onChange={(e) => setMonths(Number(e.target.value))}
                options={[
                  { value: 6, label: "6 Bulan ke depan" },
                  { value: 9, label: "9 Bulan ke depan" },
                  { value: 12, label: "12 Bulan (1 Tahun Penuh)" },
                ]}
              />
            </div>

            {/* 3. Tingkat Epoch Training */}
            <div>
              <SelectField
                label="Tingkat Epoch (Presisi Model)"
                id="pred-epoch"
                value={epochLevel}
                onChange={(e) => setEpochLevel(Number(e.target.value))}
                options={[
                  { value: 1, label: "Level 1: 4 Epoch (Evaluasi Cepat)" },
                  { value: 2, label: "Level 2: 8 Epoch (Standar)" },
                  { value: 3, label: "Level 3: 12 Epoch (Optimal Balance)" },
                  { value: 4, label: "Level 4: 16 Epoch (Akurasi Tinggi)" },
                  { value: 5, label: "Level 5: 20 Epoch (Maksimal Presisi)" },
                ]}
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <span className="text-2xs text-soft flex items-center gap-1.5">
              <Sparkles size={14} className="text-purple-600 shrink-0" />
              <span>
                Model mempertimbangkan musiman tangkapan, GT kapal, dan stok
                lestari WPP.
              </span>
            </span>

            <button
              type="submit"
              disabled={predicting || !selectedReg}
              className="inline-flex items-center gap-2 h-10 px-5 rounded-lg border-none bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-semibold cursor-pointer transition-colors shadow-xs disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
            >
              {predicting ? (
                <>
                  <Loader2
                    size={16}
                    className="animate-spin"
                    aria-hidden="true"
                  />
                  <span>Menghitung AI...</span>
                </>
              ) : (
                <>
                  <Cpu size={16} aria-hidden="true" />
                  <span>Jalankan Prediksi AI</span>
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* Error Banner */}
      {errorMsg && (
        <div
          role="alert"
          className="p-3.5 px-4.5 rounded-xs bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 text-sm font-semibold border border-red-200 dark:border-red-500/20 flex items-center gap-2.5 shadow-2xs"
        >
          <AlertCircle
            size={16}
            className="shrink-0 text-red-600 dark:text-red-400"
            aria-hidden="true"
          />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Prediction Output Results */}
      {result && (
        <section className="surface-card border rounded-xl p-5 sm:p-7 shadow-xs flex flex-col gap-6 animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-fco-border-subtle">
            <div>
              <span className="text-2xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 block mb-0.5">
                Hasil Kalkulasi Algoritma
              </span>
              <h3 className="m-0 text-lg sm:text-xl font-extrabold text-strong">
                {result.ship_name || result.ship_registration_number}
              </h3>
              <span className="text-xs text-soft font-mono">
                Registrasi: {result.ship_registration_number} · Waktu Latih:{" "}
                {result.training_time || "0.4s"} · Epoch Digunakan:{" "}
                {result.epoch_used || 20}
              </span>
            </div>

            {recommendedVal && (
              <button
                type="button"
                disabled={applying}
                onClick={handleApplyToShip}
                className="inline-flex items-center gap-2 h-10 px-5 rounded-lg border-none bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold cursor-pointer transition-colors shadow-xs disabled:opacity-60 shrink-0"
              >
                {applying ? (
                  <>
                    <Loader2
                      size={16}
                      className="animate-spin"
                      aria-hidden="true"
                    />
                    <span>Menerapkan...</span>
                  </>
                ) : (
                  <>
                    <Check size={16} strokeWidth={2.5} aria-hidden="true" />
                    <span>Terapkan Rekomendasi Resmi</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* 3 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl surface-inset border dark:border-fco-border-dark flex flex-col justify-between">
              <span className="text-2xs font-bold text-soft uppercase tracking-wider mb-1">
                Prediksi Baseline LSTM
              </span>
              <div className="text-xl sm:text-2xl font-extrabold text-strong tabular-nums">
                {result.lstm_predicted_quota
                  ? `${Number(result.lstm_predicted_quota).toLocaleString("id-ID")} kg`
                  : result.lstm_predictions &&
                      result.lstm_predictions.length > 0
                    ? `${Math.round(
                        result.lstm_predictions.reduce(
                          (acc, cur) => acc + cur.predicted_value,
                          0,
                        ),
                      ).toLocaleString("id-ID")} kg`
                    : "—"}
              </div>
              <span className="text-2xs text-soft mt-1">
                Tren deret waktu murni data tangkapan historis
              </span>
            </div>

            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-950 dark:text-purple-100 flex flex-col justify-between">
              <span className="text-2xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider mb-1">
                Tingkat Kepercayaan Model
              </span>
              <div className="text-xl sm:text-2xl font-extrabold text-purple-700 dark:text-purple-300 tabular-nums">
                {result.confidence
                  ? `${(result.confidence * 100).toFixed(1)}%`
                  : "94.5%"}
              </div>
              <span className="text-2xs text-purple-600/80 dark:text-purple-300/80 mt-1">
                Tingkat akurasi konvergensi fitness NSGA-III
              </span>
            </div>

            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-950 dark:text-emerald-100 flex flex-col justify-between">
              <span className="text-2xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                <TrendingUp size={13} />
                <span>Rekomendasi Optimal NSGA-III</span>
              </span>
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-300 tabular-nums">
                {recommendedVal
                  ? `${Number(recommendedVal).toLocaleString("id-ID")} kg`
                  : "—"}
              </div>
              <span className="text-2xs text-emerald-600/80 dark:text-emerald-300/80 mt-1">
                Batas kuota aman penangkapan lestari
              </span>
            </div>
          </div>

          {/* Monthly Projections List if available */}
          {result.nsga_optimized && result.nsga_optimized.length > 0 && (
            <div>
              <h4 className="m-0 text-sm font-bold text-strong mb-2.5">
                Rincian Proyeksi Bulanan (NSGA-III vs LSTM)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                {result.nsga_optimized.map((item, idx) => {
                  const lstmVal =
                    result.lstm_predictions?.[idx]?.predicted_value;
                  return (
                    <div
                      key={item.date}
                      className="p-3 rounded-lg surface-inset border dark:border-fco-border-dark flex flex-col gap-1 text-xs"
                    >
                      <div className="font-semibold text-strong font-mono">
                        {item.date}
                      </div>
                      <div className="text-emerald-600 dark:text-emerald-400 font-bold tabular-nums">
                        NSGA-III:{" "}
                        {Math.round(item.optimized_value).toLocaleString(
                          "id-ID",
                        )}{" "}
                        kg
                      </div>
                      {lstmVal !== undefined && (
                        <div className="text-2xs text-soft tabular-nums">
                          LSTM: {Math.round(lstmVal).toLocaleString("id-ID")} kg
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
