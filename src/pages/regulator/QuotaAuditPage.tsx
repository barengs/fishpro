import { useCallback, useEffect, useState } from "react";
import { PageToolbar } from "../../components/PageToolbar";
import { DataTable, type Column } from "../../components/DataTable";
import { StatusChip } from "../../components/StatusChip";
import { ProgressBar } from "../../components/ProgressBar";
import { FormField, inputCls } from "../../components/FormField";
import { CrudModal } from "../../components/CrudModal";
import { useCrudModal } from "../../components/useCrudModal";
import {
  shipsService,
  type Ship,
  type PredictShipQuotaResponse,
} from "../../services/ships";
import { Brain, Loader2, Sparkles } from "lucide-react";

export function QuotaAuditPage() {
  const [ships, setShips] = useState<Ship[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Manual Quota Override Modal
  const overrideModal = useCrudModal();
  const [f, setF] = useState({
    registration_number: "",
    year: "2026",
    new_quota: "",
    reason: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // AI Prediction Modal
  const aiModal = useCrudModal();
  const [selectedShipForAi, setSelectedShipForAi] = useState<Ship | null>(null);
  const [aiPredicting, setAiPredicting] = useState(false);
  const [aiResult, setAiResult] =
    useState<PredictShipQuotaResponse | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const fetchShips = useCallback(async (query?: string) => {
    setLoading(true)
    setErrorMsg(null)
    try {
      const data = await shipsService.getAll(query)
      setShips(data)
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Gagal memuat data kapal')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchShips(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, fetchShips]);

  const handleOpenOverride = (ship?: Ship) => {
    setF({
      registration_number: ship ? ship.registration_number : "",
      year: "2026",
      new_quota: ship?.current_year_quota
        ? String(ship.current_year_quota.total_quota)
        : "15000",
      reason: "Penyesuaian batas kuota resmi berdasarkan audit regulator KKP.",
    });
    overrideModal.openModal();
  };

  const handleOverrideSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.registration_number.trim() || !f.new_quota) {
      alert("Harap isi nomor registrasi kapal dan jumlah kuota.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await shipsService.regulatorManualQuota({
        ship_registration_number: f.registration_number.trim(),
        year: Number(f.year) || 2026,
        quota_amount: parseFloat(f.new_quota),
      });

      setToast(
        res.message ||
          `Kuota ${f.registration_number} tahun ${f.year} berhasil disesuaikan menjadi ${Number(f.new_quota).toLocaleString("id-ID")} kg.`,
      );
      setTimeout(() => setToast(null), 4000);
      overrideModal.closeModal();
      fetchShips(search);
    } catch (err: unknown) {
      alert(
        err instanceof Error
          ? err.message
          : "Gagal menyimpan kuota manual regulator.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenAiPrediction = async (ship: Ship) => {
    setSelectedShipForAi(ship);
    setAiResult(null);
    setAiError(null);
    aiModal.openModal();
    setAiPredicting(true);

    try {
      const res = await shipsService.predictQuota({
        ship_registration_number: ship.registration_number,
        prediction_months: 12,
        epoch_level: 5,
      });
      setAiResult(res);
    } catch (err: unknown) {
      setAiError(
        err instanceof Error
          ? err.message
          : "Gagal menjalankan prediksi AI untuk kapal ini.",
      );
    } finally {
      setAiPredicting(false);
    }
  };

  const cols: Column<Ship>[] = [
    {
      key: "ship",
      header: "Kapal / Registrasi",
      flex: 3,
      render: (r) => (
        <div>
          <div className="text-sm font-semibold">{r.name}</div>
          <div className="text-xs text-soft tabular-nums">
            {r.registration_number} · {r.home_port || "—"}
          </div>
        </div>
      ),
    },
    {
      key: "quota",
      header: "Alokasi Kuota (kg)",
      flex: 2,
      align: "right",
      render: (r) => {
        const q = r.current_year_quota;
        return (
          <span className="text-sm tabular-nums font-semibold">
            {q ? `${Number(q.total_quota).toLocaleString("id-ID")} kg` : "12.000 kg"}
          </span>
        );
      },
    },
    {
      key: "rem",
      header: "Sisa Kuota",
      flex: 3,
      render: (r) => {
        const q = r.current_year_quota;
        const pct = q ? `${q.quota_percentage}%` : "70%";
        return <ProgressBar width={pct} showText />;
      },
    },
    {
      key: "owner",
      header: "Pemilik",
      flex: 2,
      render: (r) => (
        <span className="text-xs text-soft">{r.owner_name || "—"}</span>
      ),
    },
    {
      key: "st",
      header: "Status",
      flex: 1,
      align: "center",
      render: (r) => {
        const q = r.current_year_quota;
        const pct = q ? q.quota_percentage : 70;
        return pct < 15 ? (
          <StatusChip label="Kritis" bg="#FFF1E0" color="#B54708" />
        ) : (
          <StatusChip label="Aman" />
        );
      },
    },
    {
      key: "aksi",
      header: "Tindakan Regulator",
      flex: 3,
      align: "right",
      render: (r) => (
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={() => handleOpenAiPrediction(r)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-fco-border surface-card hover:surface-inset text-purple-600 dark:text-purple-400 text-xs font-semibold cursor-pointer transition-colors"
            title="Prediksi kuota LSTM + NSGA-III"
          >
            <Brain size={14} aria-hidden="true" />
            <span>AI Predict</span>
          </button>
          <button
            type="button"
            onClick={() => handleOpenOverride(r)}
            className="px-2.5 py-1.5 rounded-lg border border-fco-border bg-white hover:surface-page text-fco-blue text-xs font-semibold cursor-pointer transition-colors"
          >
            Sesuaikan
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageToolbar
        title="Audit & Penyesuaian Kuota Kapal"
        desc="Verifikasi batas kuota tangkapan nasional, bandingkan dengan AI LSTM + NSGA-III, dan lakukan override resmi."
        searchPlaceholder="Cari kapal / nomor registrasi..."
        searchValue={search}
        onSearchChange={setSearch}
        addLabel="Override Kuota Manual"
        onAdd={() => handleOpenOverride()}
      />

      {toast && (
        <div className="p-3.5 px-4.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-sm font-semibold mb-5 border border-emerald-200 dark:border-emerald-500/20">
          ✓ {toast}
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 px-4.5 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 text-sm font-semibold mb-5 border border-red-200 dark:border-red-500/20">
          ⚠ {errorMsg}
        </div>
      )}

      <section className="surface-card border rounded-2xl p-6 shadow-xs">
        <DataTable
          columns={cols}
          rows={ships}
          rowKey={(r) => String(r.id)}
          loading={loading}
          emptyText="Belum ada data kapal terdaftar di server."
        />
      </section>

      {/* Modal 1: Manual Quota Override */}
      <CrudModal
        open={overrideModal.open}
        title="Override Kuota Manual (Regulator)"
        subtitle="Endpoint: POST /api/ships/regulator/manual-quota/"
        onClose={overrideModal.closeModal}
        onSubmit={handleOverrideSubmit}
        submitLabel={submitting ? "Menyimpan..." : "Simpan Kuota Resmi"}
      >
        <FormField label="Nomor registrasi kapal" htmlFor="ov-reg" required>
          <input
            id="ov-reg"
            required
            disabled={submitting}
            value={f.registration_number}
            onChange={(e) =>
              setF({ ...f, registration_number: e.target.value })
            }
            placeholder="Contoh: REG-0412"
            className={inputCls}
          />
        </FormField>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Tahun kuota" htmlFor="ov-year" required>
            <input
              id="ov-year"
              type="number"
              required
              disabled={submitting}
              value={f.year}
              onChange={(e) => setF({ ...f, year: e.target.value })}
              className={inputCls}
            />
          </FormField>
          <FormField label="Jumlah kuota baru (kg)" htmlFor="ov-q" required>
            <input
              id="ov-q"
              type="number"
              step="0.01"
              required
              disabled={submitting}
              value={f.new_quota}
              onChange={(e) => setF({ ...f, new_quota: e.target.value })}
              placeholder="Contoh: 15000"
              className={inputCls}
            />
          </FormField>
        </div>
        <FormField label="Alasan penyesuaian (Audit Log)" htmlFor="ov-r">
          <textarea
            id="ov-r"
            rows={3}
            disabled={submitting}
            value={f.reason}
            onChange={(e) => setF({ ...f, reason: e.target.value })}
            placeholder="Jelaskan dasar pertimbangan regulator..."
            className="w-full border rounded-xl p-3 text-fco-md field-input focus:outline-none focus:border-fco-blue resize-none"
          />
        </FormField>
      </CrudModal>

      {/* Modal 2: AI Quota Prediction Result */}
      <CrudModal
        open={aiModal.open}
        title={`Prediksi Kuota AI: ${selectedShipForAi?.name || "Kapal"}`}
        subtitle="Endpoint: POST /api/ships/predict-quota/ (LSTM + NSGA-III Optimization)"
        onClose={aiModal.closeModal}
        hideFooter
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 p-3.5 rounded-xl bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 text-xs leading-relaxed">
            <Sparkles size={18} className="shrink-0 text-purple-600" />
            <span>
              Algoritma mengeksekusi deep learning LSTM untuk membaca tren tangkapan historis, kemudian dioptimasi menggunakan NSGA-III untuk menjaga kelestarian stok ikan.
            </span>
          </div>

          {aiPredicting ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-sm text-soft">
              <Loader2
                size={28}
                className="animate-spin text-purple-600"
                aria-hidden="true"
              />
              <span>Mengeksekusi model LSTM & NSGA-III di backend...</span>
            </div>
          ) : aiError ? (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 text-xs font-semibold border border-red-200 dark:border-red-500/20">
              ⚠ {aiError}
            </div>
          ) : aiResult ? (
            <div className="flex flex-col gap-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl surface-inset border">
                  <div className="text-xs text-soft mb-1">Hasil Prediksi LSTM</div>
                  <div className="text-lg font-bold text-strong tabular-nums">
                    {aiResult.lstm_predicted_quota
                      ? `${Number(aiResult.lstm_predicted_quota).toLocaleString("id-ID")} kg`
                      : "—"}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="text-xs text-emerald-700 dark:text-emerald-400 mb-1 font-semibold">
                    Rekomendasi Optimal NSGA-III
                  </div>
                  <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-300 tabular-nums">
                    {aiResult.nsga_optimized_quota || aiResult.predicted_quota || aiResult.optimal_quota
                      ? `${Number(aiResult.nsga_optimized_quota || aiResult.predicted_quota || aiResult.optimal_quota).toLocaleString("id-ID")} kg`
                      : "—"}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl surface-inset border text-xs font-mono max-h-48 overflow-y-auto">
                <pre>{JSON.stringify(aiResult, null, 2)}</pre>
              </div>

              <button
                type="button"
                onClick={() => {
                  const quotaVal =
                    aiResult.nsga_optimized_quota ||
                    aiResult.predicted_quota ||
                    aiResult.optimal_quota;
                  aiModal.closeModal();
                  if (selectedShipForAi && quotaVal) {
                    setF({
                      registration_number: selectedShipForAi.registration_number,
                      year: "2026",
                      new_quota: String(quotaVal),
                      reason:
                        "Penyesuaian kuota berdasarkan rekomendasi optimasi LSTM + NSGA-III AI.",
                    });
                    overrideModal.openModal();
                  }
                }}
                className="w-full h-11 rounded-xl border-none bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer transition-colors"
              >
                Terapkan Rekomendasi AI Ini ke Kuota Resmi
              </button>
            </div>
          ) : null}
        </div>
      </CrudModal>
    </div>
  );
}
