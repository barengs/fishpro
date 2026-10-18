import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Brain, FileCheck, Scale } from "lucide-react";
import { PageToolbar } from "../../components/PageToolbar";
import { DataTable, type Column } from "../../components/DataTable";
import { DetailModal } from "../../components/DetailModal";
import { useDetailModal } from "../../components/useDetailModal";
import { StatusChip } from "../../components/StatusChip";
import { ProgressBar } from "../../components/ProgressBar";
import { AlertBanner } from "../../components/ui";
import { ManualQuotaModal } from "./components/ManualQuotaModal";
import { AiQuotaModal } from "./components/AiQuotaModal";
import { PredictQuotaTab } from "./components/PredictQuotaTab";
import { ManualQuotaTab } from "./components/ManualQuotaTab";
import {
  shipsService,
  type Ship,
  type PredictShipQuotaResponse,
} from "../../services/ships";

type QuotaTabKey = "audit" | "predict" | "manual";

const tabItems = [
  {
    key: "audit" as const,
    label: "Audit Kepatuhan Kuota",
    Icon: FileCheck,
  },
  {
    key: "predict" as const,
    label: "Prediksi AI (LSTM + NSGA-III)",
    Icon: Brain,
  },
  {
    key: "manual" as const,
    label: "Input Kuota Manual",
    Icon: Scale,
  },
];

export function QuotaAuditPage({ defaultTab }: { defaultTab?: QuotaTabKey }) {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const urlTab = searchParams.get("tab") as QuotaTabKey;
  const pathTab: QuotaTabKey | null = location.pathname.includes(
    "predict-quota",
  )
    ? "predict"
    : location.pathname.includes("manual-quota")
      ? "manual"
      : null;

  const activeTab: QuotaTabKey =
    pathTab ||
    (urlTab === "predict" || urlTab === "manual"
      ? urlTab
      : defaultTab || "audit");

  const [ships, setShips] = useState<Ship[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const {
    selected: selectedAuditShip,
    open: isAuditDetailOpen,
    openDetail: openAuditDetail,
    closeDetail: closeAuditDetail,
  } = useDetailModal<Ship>();

  // Manual Quota Override Modal (Quick modal from table)
  const [isOverrideOpen, setIsOverrideOpen] = useState(false);
  const [selectedShipReg, setSelectedShipReg] = useState("");

  // AI Prediction Modal (Quick modal from table)
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [selectedShipForAi, setSelectedShipForAi] = useState<Ship | null>(null);
  const [aiPredicting, setAiPredicting] = useState(false);
  const [aiResult, setAiResult] = useState<PredictShipQuotaResponse | null>(
    null,
  );
  const [aiError, setAiError] = useState<string | null>(null);

  const handleTabChange = (key: QuotaTabKey) => {
    if (key === "audit") {
      navigate("/regulator/audit");
    } else if (key === "predict") {
      navigate("/regulator/predict-quota");
    } else if (key === "manual") {
      navigate("/regulator/manual-quota");
    }
  };

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

  const handleApplyRecommendationFromAiModal = async (quotaVal: number) => {
    if (!selectedShipForAi) return;
    try {
      await shipsService.regulatorManualQuota({
        ship_registration_number: selectedShipForAi.registration_number,
        year: 2026,
        quota_amount: quotaVal,
      });
      setIsAiOpen(false);
      setToast(
        `Rekomendasi AI ${Number(quotaVal).toLocaleString("id-ID")} kg berhasil diterapkan ke kuota resmi kapal ${selectedShipForAi.registration_number}.`,
      );
      setTimeout(() => setToast(null), 4000);
      fetchShips(search);
    } catch (err: unknown) {
      alert(
        err instanceof Error
          ? err.message
          : "Gagal menerapkan rekomendasi AI ke kuota resmi.",
      );
    }
  };

  const cols: Column<Ship>[] = [
    {
      key: "ship",
      header: "Kapal / Registrasi",
      flex: 3,
      render: (r) => {
        const q = r.current_year_quota;
        const pct = q ? q.quota_percentage : 70;
        return (
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-semibold">{r.name}</span>
              <span className="sm:hidden">
                {pct < 15 ? (
                  <StatusChip label="Kritis" bg="#FFF1E0" color="#B54708" />
                ) : (
                  <StatusChip label="Aman" />
                )}
              </span>
            </div>
            <div className="text-xs text-soft tabular-nums">
              {r.registration_number} · {r.home_port || "—"}
            </div>
          </div>
        );
      },
    },
    {
      key: "quota",
      header: "Alokasi Kuota (kg)",
      flex: 2,
      align: "right",
      hideOnMobile: true,
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
      hideOnMobile: true,
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
      hideOnMobile: true,
      render: (r) => (
        <span className="text-xs text-soft">{r.owner_name || "—"}</span>
      ),
    },
    {
      key: "st",
      header: "Status",
      flex: 1,
      align: "center",
      hideOnMobile: true,
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
        <div
          className="flex items-center gap-1.5 sm:gap-2 justify-end"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => handleOpenAiPrediction(r)}
            className="w-8 h-8 sm:w-auto sm:h-auto sm:px-2.5 sm:py-1.5 rounded-lg border border-purple-200 dark:border-purple-500/30 bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 text-xs font-semibold cursor-pointer transition-colors flex items-center justify-center gap-1.5 shrink-0"
            title="Prediksi kuota LSTM + NSGA-III"
          >
            <Brain size={15} aria-hidden="true" />
            <span className="hidden sm:inline">AI Predict</span>
          </button>
          <button
            type="button"
            onClick={() => handleOpenOverride(r)}
            className="h-8 sm:h-auto px-2.5 py-1 sm:py-1.5 rounded-lg border border-fco-border bg-white dark:bg-slate-800 hover:surface-page text-fco-blue text-xs font-semibold cursor-pointer transition-colors shrink-0"
          >
            Sesuaikan
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="m-0 text-2xl sm:text-3xl font-extrabold tracking-tight text-strong">
          Manajemen & Audit Kuota Penangkapan
        </h1>
        <p className="m-0 text-sm text-soft mt-1">
          Kewenangan regulator: Audit kepatuhan kuota tahunan kapal, proyeksi
          cerdas LSTM & NSGA-III, dan penetapan kuota resmi.
        </p>

        {/* Style 1: Underline Tab Bar */}
        <div className="border-b border-fco-border dark:border-fco-border-dark mt-6">
          <nav
            className="-mb-px flex gap-6 overflow-x-auto"
            role="tablist"
            aria-label="Tab Pengawasan Kuota"
          >
            {tabItems.map((t) => {
              const active = activeTab === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => handleTabChange(t.key)}
                  className={`group inline-flex items-center gap-2 py-3 px-1 border-b-2 font-semibold text-sm transition-all cursor-pointer bg-transparent border-t-0 border-x-0 ${
                    active
                      ? "border-b-fco-blue text-fco-blue"
                      : "border-b-transparent text-soft hover:text-strong hover:border-b-fco-border dark:hover:border-b-fco-border-dark"
                  }`}
                >
                  <t.Icon
                    size={17}
                    className={`shrink-0 transition-colors ${
                      active
                        ? "text-fco-blue"
                        : "text-soft group-hover:text-strong"
                    }`}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                  <span className="whitespace-nowrap">{t.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {toast && (
        <div className="mb-5">
          <AlertBanner
            variant="success"
            message={toast}
            onDismiss={() => setToast(null)}
          />
        </div>
      )}

      {errorMsg && (
        <div className="mb-5">
          <AlertBanner
            variant="error"
            message={errorMsg}
            onDismiss={() => setErrorMsg(null)}
          />
        </div>
      )}

      {/* Tab 1: Audit Kuota Table */}
      {activeTab === "audit" && (
        <div>
          <PageToolbar
            searchPlaceholder="Cari kapal / nomor registrasi..."
            searchValue={search}
            onSearchChange={setSearch}
            addLabel="Input Kuota Manual"
            onAdd={() => handleOpenOverride()}
          />

          <section className="surface-card border rounded-xl p-6 shadow-xs">
            <DataTable
              columns={cols}
              rows={ships}
              rowKey={(r) => String(r.id)}
              loading={loading}
              emptyText="Belum ada data kapal terdaftar di server."
              onRowClick={openAuditDetail}
            />
          </section>
        </div>
      )}

      {/* Tab 2: Prediksi Kuota AI (LSTM + NSGA-III) */}
      {activeTab === "predict" && (
        <PredictQuotaTab
          onQuotaApplied={() => {
            fetchShips();
            handleTabChange("audit");
          }}
        />
      )}

      {/* Tab 3: Input Kuota Manual */}
      {activeTab === "manual" && (
        <ManualQuotaTab
          onQuotaSaved={() => {
            fetchShips();
            handleTabChange("audit");
          }}
        />
      )}

      {/* Detail Pop-up Modal */}
      <DetailModal
        open={isAuditDetailOpen}
        title={
          selectedAuditShip
            ? `Audit Kuota: ${selectedAuditShip.name}`
            : "Detail Audit Kuota Kapal"
        }
        subtitle="Realisasi penangkapan, sisa kuota tahunan, dan status kepatuhan resmi."
        badge={
          selectedAuditShip
            ? (() => {
                const q = selectedAuditShip.current_year_quota;
                const pct =
                  typeof q === "object" && q ? q.quota_percentage : 70;
                return pct < 15 ? (
                  <StatusChip label="Kritis" bg="#FFF1E0" color="#B54708" />
                ) : (
                  <StatusChip label="Aman" />
                );
              })()
            : undefined
        }
        onClose={closeAuditDetail}
        actions={
          selectedAuditShip && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const target = selectedAuditShip;
                  closeAuditDetail();
                  handleOpenAiPrediction(target);
                }}
                className="h-9 px-3.5 rounded-lg border border-purple-200 dark:border-purple-500/30 bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-300 text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <Brain size={14} />
                <span>AI Predict</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = selectedAuditShip;
                  closeAuditDetail();
                  handleOpenOverride(target);
                }}
                className="h-9 px-3.5 rounded-lg border border-fco-border-subtle surface-inset hover:surface-page text-xs font-semibold text-fco-blue cursor-pointer transition-colors"
              >
                Sesuaikan
              </button>
            </div>
          )
        }
        fields={[
          {
            label: "Nomor Registrasi",
            value: (
              <span className="font-mono font-bold text-fco-blue">
                {selectedAuditShip?.registration_number}
              </span>
            ),
          },
          {
            label: "Pemilik Kapal",
            value: selectedAuditShip?.owner_name || "—",
          },
          {
            label: "Kuota Total Tahunan",
            value:
              selectedAuditShip?.current_year_quota &&
              typeof selectedAuditShip.current_year_quota === "object"
                ? `${Number(selectedAuditShip.current_year_quota.total_quota).toLocaleString("id-ID")} kg`
                : "—",
          },
          {
            label: "Realisasi Tangkapan",
            value:
              selectedAuditShip?.current_year_quota &&
              typeof selectedAuditShip.current_year_quota === "object"
                ? `${Number(selectedAuditShip.current_year_quota.used_quota).toLocaleString("id-ID")} kg (${selectedAuditShip.current_year_quota.quota_percentage}%)`
                : "—",
          },
          {
            label: "Sisa Kuota Resmi",
            value:
              selectedAuditShip?.current_year_quota &&
              typeof selectedAuditShip.current_year_quota === "object"
                ? `${Number(selectedAuditShip.current_year_quota.remaining_quota).toLocaleString("id-ID")} kg`
                : "—",
            fullWidth: true,
          },
        ]}
      />

      {/* Manual Quota Quick Modal */}
      <ManualQuotaModal
        isOpen={isOverrideOpen}
        initialShipReg={selectedShipReg}
        onClose={() => setIsOverrideOpen(false)}
        onSave={handleOverrideSave}
      />

      {/* AI Quota Quick Modal */}
      <AiQuotaModal
        open={isAiOpen}
        ship={selectedShipForAi}
        predicting={aiPredicting}
        result={aiResult}
        error={aiError}
        onClose={() => setIsAiOpen(false)}
        onApplyRecommendation={handleApplyRecommendationFromAiModal}
      />
    </div>
  );
}
