import { Brain } from "lucide-react";
import { PageToolbar } from "../../components/PageToolbar";
import { DataTable, type Column } from "../../components/DataTable";
import { DetailModal } from "../../components/DetailModal";
import { StatusChip } from "../../components/StatusChip";
import { ProgressBar } from "../../components/ProgressBar";
import { AlertBanner } from "../../components/ui";
import { ManualQuotaModal } from "./components/ManualQuotaModal";
import { AiQuotaModal } from "./components/AiQuotaModal";
import type { Ship } from "../../services/ships";
import { useQuotaAudit } from "./hooks/useQuotaAudit";

export function QuotaAuditPage() {
  const {
    ships,
    loading,
    search,
    setSearch,
    errorMsg,
    setErrorMsg,
    toast,
    setToast,
    selectedAuditShip,
    isAuditDetailOpen,
    openAuditDetail,
    closeAuditDetail,
    isOverrideOpen,
    selectedShipForOverride,
    handleOpenOverride,
    handleCloseOverride,
    handleOverrideSave,
    isAiOpen,
    selectedShipForAi,
    aiPredicting,
    aiResult,
    aiError,
    handleOpenAiPrediction,
    handleCloseAi,
    handleApplyRecommendationFromAiModal,
  } = useQuotaAudit();

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
      <PageToolbar
        title="Audit Kepatuhan Kuota"
        desc="Verifikasi batas kuota penangkapan tahunan seluruh armada kapal nasional dan pantau tingkat kepatuhan kuota."
        searchPlaceholder="Cari kapal / nomor registrasi..."
        searchValue={search}
        onSearchChange={setSearch}
        addLabel="Input Kuota Manual"
        onAdd={() => handleOpenOverride()}
      />

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
        ship={selectedShipForOverride}
        ships={ships}
        onClose={handleCloseOverride}
        onSave={handleOverrideSave}
      />

      {/* AI Quota Quick Modal */}
      <AiQuotaModal
        open={isAiOpen}
        ship={selectedShipForAi}
        predicting={aiPredicting}
        result={aiResult}
        error={aiError}
        onClose={handleCloseAi}
        onApplyRecommendation={handleApplyRecommendationFromAiModal}
      />
    </div>
  );
}
