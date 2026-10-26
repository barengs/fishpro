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
  const quotaVal =
    result?.nsga_optimized_quota ||
    result?.predicted_quota ||
    result?.optimal_quota;

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
                  {result.lstm_predicted_quota
                    ? `${Number(result.lstm_predicted_quota).toLocaleString("id-ID")} kg`
                    : "—"}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="text-xs text-emerald-700 dark:text-emerald-400 mb-1 font-semibold">
                  Rekomendasi Optimal NSGA-III
                </div>
                <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-300 tabular-nums">
                  {quotaVal
                    ? `${Number(quotaVal).toLocaleString("id-ID")} kg`
                    : "—"}
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl surface-inset border text-xs font-mono max-h-48 overflow-y-auto">
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </div>

            {quotaVal ? (
              <button
                type="button"
                onClick={() => onApplyRecommendation(Number(quotaVal))}
                className="w-full h-11 rounded-xl border-none bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer transition-colors"
              >
                Terapkan Rekomendasi AI Ini ke Kuota Resmi
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </CrudModal>
  );
}
