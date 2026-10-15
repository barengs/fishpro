import { useCallback, useEffect, useState } from "react";
import { PageToolbar } from "../../components/PageToolbar";
import { DataTable, type Column } from "../../components/DataTable";
import { StatusChip } from "../../components/StatusChip";
import { ProgressBar } from "../../components/ProgressBar";
import { AlertBanner } from "../../components/ui";
import { ManualQuotaModal } from "./components/ManualQuotaModal";
import { AiQuotaModal } from "./components/AiQuotaModal";
import {
  shipsService,
  type Ship,
  type PredictShipQuotaResponse,
} from "../../services/ships";
import { Brain } from "lucide-react";

export function QuotaAuditPage() {
  const [ships, setShips] = useState<Ship[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Manual Quota Override Modal
  const [isOverrideOpen, setIsOverrideOpen] = useState(false);
  const [selectedShipReg, setSelectedShipReg] = useState("");

  // AI Prediction Modal
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [selectedShipForAi, setSelectedShipForAi] = useState<Ship | null>(null);
  const [aiPredicting, setAiPredicting] = useState(false);
  const [aiResult, setAiResult] = useState<PredictShipQuotaResponse | null>(
    null,
  );
  const [aiError, setAiError] = useState<string | null>(null);

  const fetchShips = useCallback(async (query?: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await shipsService.getAll(query);
      setShips(data);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Gagal memuat data kapal",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchShips(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, fetchShips]);

  const handleOpenOverride = (ship?: Ship) => {
    setSelectedShipReg(ship ? ship.registration_number : "");
    setIsOverrideOpen(true);
  };

  const handleOverrideSave = async (data: {
    shipReg: string;
    year: number;
    newQuota: number;
    reason: string;
  }) => {
    try {
      const res = await shipsService.regulatorManualQuota({
        ship_registration_number: data.shipReg.trim(),
        year: Number(data.year) || 2026,
        quota_amount: data.newQuota,
      });

      setToast(
        res.message ||
          `Kuota ${data.shipReg} tahun ${data.year} berhasil disesuaikan menjadi ${Number(data.newQuota).toLocaleString("id-ID")} kg.`,
      );
      setTimeout(() => setToast(null), 4000);
      setIsOverrideOpen(false);
      fetchShips(search);
    } catch (err: unknown) {
      alert(
        err instanceof Error
          ? err.message
          : "Gagal menyimpan kuota manual regulator.",
      );
    }
  };

  const handleOpenAiPrediction = async (ship: Ship) => {
    setSelectedShipForAi(ship);
    setAiResult(null);
    setAiError(null);
    setIsAiOpen(true);
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
            {q
              ? `${Number(q.total_quota).toLocaleString("id-ID")} kg`
              : "12.000 kg"}
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

      <AlertBanner
        variant="success"
        message={toast || ""}
        onDismiss={() => setToast(null)}
      />
      <AlertBanner
        variant="error"
        message={errorMsg || ""}
        onDismiss={() => setErrorMsg(null)}
      />

      <section className="surface-card border rounded-2xl p-6 shadow-xs">
        <DataTable
          columns={cols}
          rows={ships}
          rowKey={(r) => String(r.id)}
          loading={loading}
          emptyText="Belum ada data kapal terdaftar di server."
        />
      </section>

      <ManualQuotaModal
        isOpen={isOverrideOpen}
        onClose={() => setIsOverrideOpen(false)}
        onSave={handleOverrideSave}
        initialShipReg={selectedShipReg}
      />

      <AiQuotaModal
        open={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        ship={selectedShipForAi}
        predicting={aiPredicting}
        result={aiResult}
        error={aiError}
        onApplyRecommendation={() => {
          setIsAiOpen(false);
          if (selectedShipForAi) {
            setSelectedShipReg(selectedShipForAi.registration_number);
            setIsOverrideOpen(true);
          }
        }}
      />
    </div>
  );
}
