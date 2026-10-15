import { useEffect, useState } from "react";
import { PageToolbar } from "../../components/PageToolbar";
import { DataTable, type Column } from "../../components/DataTable";
import { FormField, inputCls } from "../../components/FormField";
import { StatusChip } from "../../components/StatusChip";
import { ProgressBar } from "../../components/ProgressBar";
import { CrudModal } from "../../components/CrudModal";
import { useCrudModal } from "../../components/useCrudModal";
import { pnbpService, type PnbpPredictionsData } from "../../services/pnbp";
import {
  BarChart3,
  Brain,
  Cpu,
  LineChart,
  Loader2,
  Play,
  Sparkles,
} from "lucide-react";

// Quota: ship (FK), year, quota (kg), remaining_quota (kg), is_active — unique (ship, year)
// Tariff: name (unique), gt_threshold, rate_small, rate_large, is_active, effective_date
interface QuotaRow {
  id: number;
  ship: string;
  year: string;
  quota: string;
  remaining: string;
  pct: string;
}

export function QuotaPnbpPage() {
  const [tab, setTab] = useState<"quota" | "tariff" | "predictions">("quota");
  const [rows] = useState<QuotaRow[]>([
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
  ]);
  const [t, setT] = useState({
    name: "Tarif Nasional 2026",
    gt_threshold: "60",
    rate_small: "0.05",
    rate_large: "0.10",
    is_active: true,
  });
  const [q, setQ] = useState({ ship: "", year: "2026", quota: "" });
  const quotaModal = useCrudModal();
  const tariffModal = useCrudModal();

  // Prediction states
  const [predictionsData, setPredictionsData] =
    useState<PnbpPredictionsData | null>(null);
  const [predicting, setPredicting] = useState(false);
  const [predError, setPredError] = useState<string | null>(null);
  const [predToast, setPredToast] = useState<string | null>(null);

  useEffect(() => {
    if (tab === "predictions") {
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
    }
  }, [tab]);

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

  const tabActions = {
    quota: { label: "Tambah Kuota", onAdd: quotaModal.openModal },
    tariff: { label: "Ubah Tarif", onAdd: tariffModal.openModal },
    predictions: { label: "Jalankan AI", onAdd: handleRunPrediction },
  };

  return (
    <div>
      <PageToolbar
        title={
          tab === "quota"
            ? "Kuota Kapal Tahunan"
            : tab === "tariff"
              ? "Konfigurasi Tarif PNBP"
              : "Prediksi PNBP AI (4 Model Analisis)"
        }
        desc={
          tab === "quota"
            ? "Alokasi kuota penangkapan ikan per kapal per tahun."
            : tab === "tariff"
              ? "Pengaturan ambang batas GT dan tarif persentase pungutan hasil perikanan."
              : "Pipeline machine learning multi-metode (Linear Regression, Neural Network, NSGA-III, ARIMA)."
        }
        searchPlaceholder={tab === "quota" ? "Cari kapal..." : "Cari..."}
        tabs={[
          { key: "quota", label: "1. Kuota Kapal" },
          { key: "tariff", label: "2. Tarif PNBP" },
          { key: "predictions", label: "3. Prediksi AI (4 Model)" },
        ]}
        activeTab={tab}
        onTabChange={(k) => setTab(k as typeof tab)}
        addLabel={tabActions[tab].label}
        onAdd={tabActions[tab].onAdd}
      />

      {tab === "quota" && (
        <section className="surface-card border rounded-2xl p-6 shadow-xs">
          <DataTable columns={cols} rows={rows} rowKey={(r) => String(r.id)} />
        </section>
      )}

      {tab === "tariff" && (
        <section className="surface-card border rounded-2xl p-6 shadow-xs max-w-220">
          <h2 className="m-0 mb-1 text-base font-bold">Tarif PNBP aktif</h2>
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
      )}

      {tab === "predictions" && (
        <div className="flex flex-col gap-5">
          {predToast && (
            <div className="p-3.5 px-4.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-sm font-semibold border border-emerald-200 dark:border-emerald-500/20">
              ✓ {predToast}
            </div>
          )}

          {predError && (
            <div className="p-3.5 px-4.5 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 text-sm font-semibold border border-red-200 dark:border-red-500/20">
              ⚠ {predError}
            </div>
          )}

          {/* Header Action Card */}
          <div className="surface-card border rounded-2xl p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles
                  size={18}
                  className="text-fco-blue"
                  aria-hidden="true"
                />
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
                  <Loader2
                    size={16}
                    className="animate-spin"
                    aria-hidden="true"
                  />
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
            <div className="surface-card border rounded-2xl p-5 shadow-xs border-t-4 border-t-blue-500">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-3">
                <LineChart size={20} aria-hidden="true" />
              </div>
              <h3 className="m-0 text-base font-bold text-strong">
                1. Linear Regression
              </h3>
              <p className="m-0 text-xs text-soft mt-1 leading-relaxed">
                Pemodelan tren linear sederhana untuk baseline proyeksi
                pertumbuhan nilai produksi ikan.
              </p>
              <div className="mt-4 pt-3 border-t border-fco-border-subtle flex justify-between text-xs">
                <span className="text-soft">Tipe Model</span>
                <span className="font-semibold text-strong">
                  Statistik Linear
                </span>
              </div>
            </div>

            <div className="surface-card border rounded-2xl p-5 shadow-xs border-t-4 border-t-purple-500">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center mb-3">
                <Brain size={20} aria-hidden="true" />
              </div>
              <h3 className="m-0 text-base font-bold text-strong">
                2. Neural Network (MLP)
              </h3>
              <p className="m-0 text-xs text-soft mt-1 leading-relaxed">
                Multi-Layer Perceptron Regressor untuk menangkap pola non-linear
                fluktuasi harga acuan dan volume.
              </p>
              <div className="mt-4 pt-3 border-t border-fco-border-subtle flex justify-between text-xs">
                <span className="text-soft">Tipe Model</span>
                <span className="font-semibold text-strong">Deep Learning</span>
              </div>
            </div>

            <div className="surface-card border rounded-2xl p-5 shadow-xs border-t-4 border-t-emerald-500">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-3">
                <Cpu size={20} aria-hidden="true" />
              </div>
              <h3 className="m-0 text-base font-bold text-strong">
                3. NSGA-III Optimizer
              </h3>
              <p className="m-0 text-xs text-soft mt-1 leading-relaxed">
                Optimasi genetika multi-objektif untuk keseimbangan
                keberlanjutan kuota dan penerimaan negara.
              </p>
              <div className="mt-4 pt-3 border-t border-fco-border-subtle flex justify-between text-xs">
                <span className="text-soft">Tipe Model</span>
                <span className="font-semibold text-strong">
                  Genetic Algorithm
                </span>
              </div>
            </div>

            <div className="surface-card border rounded-2xl p-5 shadow-xs border-t-4 border-t-amber-500">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-3">
                <BarChart3 size={20} aria-hidden="true" />
              </div>
              <h3 className="m-0 text-base font-bold text-strong">
                4. Time Series (ARIMA)
              </h3>
              <p className="m-0 text-xs text-soft mt-1 leading-relaxed">
                Analisis deret waktu memperhitungkan siklus musiman penangkapan
                ikan di perairan Indonesia.
              </p>
              <div className="mt-4 pt-3 border-t border-fco-border-subtle flex justify-between text-xs">
                <span className="text-soft">Tipe Model</span>
                <span className="font-semibold text-strong">
                  Autoregressive
                </span>
              </div>
            </div>
          </div>

          {/* Results Display */}
          <div className="surface-card border rounded-2xl p-6 shadow-xs">
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
                &quot;Jalankan Prediksi AI Sekarang&quot; di atas untuk
                mengeksekusi pipeline machine learning.
              </p>
            )}
          </div>
        </div>
      )}

      <CrudModal
        open={quotaModal.open}
        title="Tambah kuota"
        subtitle="Quota unik per kapal-tahun (ship, year, quota kg)."
        onClose={quotaModal.closeModal}
        onSubmit={(e) => {
          e.preventDefault();
          quotaModal.closeModal();
        }}
        submitLabel="Simpan kuota"
      >
        <FormField label="Kapal (ship)" htmlFor="q-ship" required>
          <input
            id="q-ship"
            required
            value={q.ship}
            onChange={(e) => setQ({ ...q, ship: e.target.value })}
            className={inputCls}
          />
        </FormField>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Tahun" htmlFor="q-year" required>
            <input
              id="q-year"
              type="number"
              required
              value={q.year}
              onChange={(e) => setQ({ ...q, year: e.target.value })}
              className={inputCls}
            />
          </FormField>
          <FormField label="Kuota (kg)" htmlFor="q-q" required>
            <input
              id="q-q"
              type="number"
              step="0.01"
              required
              value={q.quota}
              onChange={(e) => setQ({ ...q, quota: e.target.value })}
              className={inputCls}
            />
          </FormField>
        </div>
      </CrudModal>

      <CrudModal
        open={tariffModal.open}
        title="Ubah tarif PNBP"
        subtitle="Rumus BE: GT ≤ batas → rate_small, GT > batas → rate_large."
        onClose={tariffModal.closeModal}
        onSubmit={(e) => {
          e.preventDefault();
          tariffModal.closeModal();
        }}
        submitLabel="Simpan tarif"
      >
        <FormField label="Nama tarif (unik)" htmlFor="tf-name" required>
          <input
            id="tf-name"
            required
            value={t.name}
            onChange={(e) => setT({ ...t, name: e.target.value })}
            className={inputCls}
          />
        </FormField>
        <FormField label="Batas GT" htmlFor="tf-gt" required>
          <input
            id="tf-gt"
            type="number"
            step="0.01"
            required
            value={t.gt_threshold}
            onChange={(e) => setT({ ...t, gt_threshold: e.target.value })}
            className={inputCls}
          />
        </FormField>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Tarif GT kecil" htmlFor="tf-s" required>
            <input
              id="tf-s"
              type="number"
              step="0.0001"
              required
              value={t.rate_small}
              onChange={(e) => setT({ ...t, rate_small: e.target.value })}
              className={inputCls}
            />
          </FormField>
          <FormField label="Tarif GT besar" htmlFor="tf-l" required>
            <input
              id="tf-l"
              type="number"
              step="0.0001"
              required
              value={t.rate_large}
              onChange={(e) => setT({ ...t, rate_large: e.target.value })}
              className={inputCls}
            />
          </FormField>
        </div>
        <label className="flex items-center gap-2.5 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={t.is_active}
            onChange={(e) => setT({ ...t, is_active: e.target.checked })}
            className="rounded"
          />{" "}
          Tarif aktif
        </label>
      </CrudModal>
    </div>
  );
}
