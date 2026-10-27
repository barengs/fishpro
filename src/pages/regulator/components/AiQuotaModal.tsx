import { CrudModal } from "../../../components/CrudModal";
import type { PredictShipQuotaResponse, Ship } from "../../../services/ships";
import { AlertCircle, Loader2, Sparkles } from "lucide-react";

interface AiQuotaModalProps {
  open: boolean;
  onClose: () => void;
  ship: Ship | null;
  predicting: boolean;
  result: PredictShipQuotaResponse | null;
  error: string | null;
  onApplyRecommendation: (quotaVal: number) => void;
}

export function AiQuotaModal({
  open,
  onClose,
  ship,
  predicting,
  result,
  error,
  onApplyRecommendation,
}: AiQuotaModalProps) {
  // ponytail: sum arrays if scalar totals not provided; upgrade to backend response normalization middleware when API schema is frozen
  const lstmTotal =
    result?.lstm_predicted_quota ??
    (result?.lstm_predictions && result.lstm_predictions.length > 0
      ? Math.round(
          result.lstm_predictions.reduce(
            (acc, cur) => acc + (cur.predicted_value || 0),
            0,
          ),
        )
      : undefined);

  const nsgaTotal =
    result?.nsga_optimized_quota ??
    result?.recommended_quota ??
    result?.optimal_quota ??
    result?.predicted_quota ??
    (result?.nsga_optimized && result.nsga_optimized.length > 0
      ? Math.round(
          result.nsga_optimized.reduce(
            (acc, cur) => acc + (cur.optimized_value || 0),
            0,
          ),
        )
      : undefined);

  const quotaVal = nsgaTotal ?? lstmTotal;

  const confidencePct =
    result?.confidence !== undefined && result.confidence !== null
      ? result.confidence > 1
        ? result.confidence
        : result.confidence * 100
      : null;

  return (
    <CrudModal
      open={open}
      title={`Prediksi Kuota AI: ${ship?.name || "Kapal"}`}
      subtitle="Prediksi tren tangkapan dan optimasi kelestarian kuota perikanan."
      onClose={onClose}
      hideFooter
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 text-xs leading-relaxed">
          <Sparkles size={18} className="shrink-0 text-purple-600" />
          <span>
            Algoritma mengeksekusi deep learning LSTM untuk membaca tren
            tangkapan historis, kemudian dioptimasi menggunakan NSGA-III untuk
            menjaga kelestarian stok ikan.
          </span>
        </div>

        {predicting ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-sm text-soft">
            <Loader2
              size={28}
              className="animate-spin text-purple-600"
              aria-hidden="true"
            />
            <span>Mengeksekusi model LSTM & NSGA-III di backend...</span>
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 text-xs font-semibold border border-red-200 dark:border-red-500/20">
            <AlertCircle size={16} className="shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        ) : result ? (
          <div className="flex flex-col gap-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl surface-inset border">
                <div className="text-xs text-soft mb-1">
                  Hasil Prediksi LSTM
                </div>
                <div className="text-lg font-bold text-strong tabular-nums">
                  {lstmTotal !== undefined
                    ? `${Number(lstmTotal).toLocaleString("id-ID")} kg`
                    : "—"}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="text-xs text-emerald-700 dark:text-emerald-400 mb-1 font-semibold">
                  Rekomendasi Optimal NSGA-III
                </div>
                <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-300 tabular-nums">
                  {quotaVal !== undefined
                    ? `${Number(quotaVal).toLocaleString("id-ID")} kg`
                    : "—"}
                </div>
              </div>
            </div>

            {/* Breakdown List */}
            {result.lstm_predictions && result.lstm_predictions.length > 0 && (
              <div className="surface-inset border rounded-xl p-3.5">
                <div className="flex items-center justify-between text-xs font-semibold text-strong mb-2.5 px-0.5">
                  <span>Proyeksi Tren ({result.lstm_predictions.length} Periode)</span>
                  {confidencePct !== null && (
                    <span className="text-2xs text-purple-600 dark:text-purple-400 font-mono">
                      Akurasi: {confidencePct.toFixed(1)}%
                    </span>
                  )}
                </div>
                <div className="max-h-44 overflow-y-auto flex flex-col gap-1 pr-1">
                  {result.lstm_predictions.map((p, idx) => {
                    const nsgaItem = result.nsga_optimized?.[idx];
                    return (
                      <div
                        key={p.date || idx}
                        className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-white/70 dark:bg-slate-800/70 text-xs"
                      >
                        <span className="font-mono text-soft text-2xs sm:text-xs">{p.date}</span>
                        <div className="flex items-center gap-2.5">
                          <span className="text-strong tabular-nums text-2xs sm:text-xs">
                            LSTM: {Math.round(p.predicted_value).toLocaleString("id-ID")} kg
                          </span>
                          {nsgaItem && (
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums text-2xs sm:text-xs">
                              NSGA: {Math.round(nsgaItem.optimized_value).toLocaleString("id-ID")} kg
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Raw JSON Accordion */}
            <details className="text-2xs text-soft cursor-pointer">
              <summary className="hover:text-strong transition-colors py-1">
                Data Lengkap Payload JSON
              </summary>
              <div className="mt-2 p-3 rounded-xl surface-inset border font-mono max-h-36 overflow-y-auto">
                <pre>{JSON.stringify(result, null, 2)}</pre>
              </div>
            </details>

            {quotaVal !== undefined ? (
              <button
                type="button"
                onClick={() => onApplyRecommendation(Number(quotaVal))}
                className="w-full h-11 rounded-xl border-none bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold cursor-pointer transition-colors shadow-xs"
              >
                Terapkan Rekomendasi AI ({Number(quotaVal).toLocaleString("id-ID")} kg) ke Kuota Resmi
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </CrudModal>
  );
}
