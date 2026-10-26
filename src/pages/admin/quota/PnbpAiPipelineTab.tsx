import { useEffect, useState } from "react";
import { PageToolbar } from "../../../components/PageToolbar";
import { AlertBanner } from "../../../components/ui";
import { pnbpService, type PnbpPredictionsData } from "../../../services/pnbp";
import {
  BarChart3,
  Brain,
  Cpu,
  LineChart,
  Loader2,
  Play,
  Sparkles,
} from "lucide-react";

export function PnbpAiPipelineTab() {
  const [predictionsData, setPredictionsData] =
    useState<PnbpPredictionsData | null>(null);
  const [predicting, setPredicting] = useState(false);
  const [predError, setPredError] = useState<string | null>(null);
  const [predToast, setPredToast] = useState<string | null>(null);

  useEffect(() => {
    pnbpService
      .getLatestPredictions()
      .then((res) => {
        if (res.status === "success" && res.predictions) {
          setPredictionsData(res.predictions);
        }
      })
      .catch(() => {
        // No saved prediction yet
      });
  }, []);

  const handleRunPrediction = async () => {
    setPredicting(true);
    setPredError(null);
    try {
      const res = await pnbpService.predictFuture({ use_database_data: true });
      setPredictionsData(res.predictions as PnbpPredictionsData);
      setPredToast("Pipeline prediksi 4 model AI berhasil dieksekusi!");
      setTimeout(() => setPredToast(null), 4000);
    } catch (err: unknown) {
      setPredError(
        err instanceof Error ? err.message : "Gagal menjalankan prediksi AI",
      );
    } finally {
      setPredicting(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <PageToolbar
        title="Prediksi PNBP AI (4 Model Analisis)"
        desc="Pipeline machine learning multi-metode (Linear Regression, Neural Network MLP, NSGA-III, ARIMA)."
        addLabel={predicting ? "Sedang Menghitung..." : "Jalankan Prediksi AI"}
        onAdd={handleRunPrediction}
      />

      <AlertBanner
        variant="success"
        message={predToast || ""}
        onDismiss={() => setPredToast(null)}
      />
      <AlertBanner
        variant="error"
        message={predError || ""}
        onDismiss={() => setPredError(null)}
      />

      {/* Header Action Card */}
      <div className="surface-card border rounded-xl p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={18} className="text-fco-blue" aria-hidden="true" />
            <h2 className="m-0 text-base font-bold text-strong">
              Pipeline Prediksi Masa Depan PNBP
            </h2>
          </div>
          <p className="m-0 text-xs text-soft">
            Menjalankan 4 algoritma analitis sekaligus untuk memproyeksikan
            potensi PNBP berdasarkan data tangkapan historis.
          </p>
        </div>
        <button
          type="button"
          onClick={handleRunPrediction}
          disabled={predicting}
          className="inline-flex items-center gap-2 h-11 px-5 rounded-xl border-none bg-fco-blue hover:bg-fco-blue-hover text-white text-sm font-semibold cursor-pointer transition-colors shadow-xs disabled:opacity-60"
        >
          {predicting ? (
            <>
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
              <span>Sedang Menghitung...</span>
            </>
          ) : (
            <>
              <Play size={16} aria-hidden="true" />
              <span>Jalankan Prediksi AI Sekarang</span>
            </>
          )}
        </button>
      </div>

      {/* 4 AI Models Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="surface-card border rounded-xl p-5 shadow-xs border-t-4 border-t-blue-500">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-3">
            <LineChart size={20} aria-hidden="true" />
          </div>
          <h3 className="m-0 text-base font-bold text-strong">
            1. Linear Regression
          </h3>
          <p className="m-0 text-xs text-soft mt-1 leading-relaxed">
            Pemodelan tren linear baseline proyeksi pertumbuhan nilai produksi
            ikan.
          </p>
          <div className="mt-4 pt-3 border-t border-fco-border-subtle flex justify-between text-xs">
            <span className="text-soft">Tipe Model</span>
            <span className="font-semibold text-strong">Statistik Linear</span>
          </div>
        </div>

        <div className="surface-card border rounded-xl p-5 shadow-xs border-t-4 border-t-purple-500">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center mb-3">
            <Brain size={20} aria-hidden="true" />
          </div>
          <h3 className="m-0 text-base font-bold text-strong">
            2. Neural Network (MLP)
          </h3>
          <p className="m-0 text-xs text-soft mt-1 leading-relaxed">
            Multi-Layer Perceptron untuk pola non-linear fluktuasi harga acuan
            dan volume.
          </p>
          <div className="mt-4 pt-3 border-t border-fco-border-subtle flex justify-between text-xs">
            <span className="text-soft">Tipe Model</span>
            <span className="font-semibold text-strong">Deep Learning</span>
          </div>
        </div>

        <div className="surface-card border rounded-xl p-5 shadow-xs border-t-4 border-t-emerald-500">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-3">
            <Cpu size={20} aria-hidden="true" />
          </div>
          <h3 className="m-0 text-base font-bold text-strong">
            3. NSGA-III Optimizer
          </h3>
          <p className="m-0 text-xs text-soft mt-1 leading-relaxed">
            Optimasi genetika multi-objektif keseimbangan kelestarian dan PNBP
            negara.
          </p>
          <div className="mt-4 pt-3 border-t border-fco-border-subtle flex justify-between text-xs">
            <span className="text-soft">Tipe Model</span>
            <span className="font-semibold text-strong">Genetic Algorithm</span>
          </div>
        </div>

        <div className="surface-card border rounded-xl p-5 shadow-xs border-t-4 border-t-amber-500">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-3">
            <BarChart3 size={20} aria-hidden="true" />
          </div>
          <h3 className="m-0 text-base font-bold text-strong">
            4. Time Series (ARIMA)
          </h3>
          <p className="m-0 text-xs text-soft mt-1 leading-relaxed">
            Analisis deret waktu memperhitungkan siklus musiman penangkapan laut
            Indonesia.
          </p>
          <div className="mt-4 pt-3 border-t border-fco-border-subtle flex justify-between text-xs">
            <span className="text-soft">Tipe Model</span>
            <span className="font-semibold text-strong">Autoregressive</span>
          </div>
        </div>
      </div>

      {/* Results Display */}
      <div className="surface-card border rounded-xl p-6 shadow-xs">
        <h3 className="m-0 text-base font-bold text-strong mb-2">
          Hasil Prediksi Terakhir
        </h3>
        {predictionsData ? (
          <div>
            <p className="text-xs text-soft mb-4">
              Data diproses menggunakan data tangkapan aktual dari database
              Django.
            </p>
            <div className="p-4 rounded-xl surface-inset border font-mono text-xs overflow-x-auto max-h-64">
              <pre>{JSON.stringify(predictionsData, null, 2)}</pre>
            </div>
          </div>
        ) : (
          <p className="m-0 text-sm text-soft py-4">
            Belum ada data prediksi tersimpan di server. Klik tombol
            &quot;Jalankan Prediksi AI Sekarang&quot; di atas untuk mengeksekusi
            pipeline machine learning.
          </p>
        )}
      </div>
    </div>
  );
}
