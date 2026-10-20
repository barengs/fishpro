import { Link } from "react-router-dom";
import { BarChart3, Check, Coins, Fish, Plus, Ship } from "lucide-react";
import { KpiCard } from "../../components/KpiCard";
import { StatusChip } from "../../components/StatusChip";
import { CrudModal } from "../../components/CrudModal";
import { CatchReportWizard } from "../../components/CatchReportWizard";
import { AlertBanner } from "../../components/ui";
import { QuotaHeroCard } from "./components/QuotaHeroCard";
import { ShipSpecsCard } from "./components/ShipSpecsCard";
import { RecentCatchesTable } from "./components/RecentCatchesTable";
import { formatRupiah, formatShortHash, formatWeight } from "../../utils";
import { useCaptainDashboard } from "./hooks/useCaptainDashboard";

export function CaptainDashboard() {
  const {
    reports,
    ship,
    hasShip,
    quota,
    blockchainStatus,
    lastBlock,
    toast,
    setToast,
    userInfo,
    dynamicSpecs,
    totalWeightKg,
    totalPnbpSum,
    isModalOpen,
    openModal,
    closeModal,
    handleReportAdded,
  } = useCaptainDashboard();

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-7">
        <div>
          <h1 className="m-0 text-3xl font-extrabold tracking-tight">
            Ringkasan Nahkoda
          </h1>
          <div className="text-sm text-soft mt-1">
            {hasShip
              ? `${ship!.name} · ${ship!.registration_number} · Pelabuhan asal ${ship!.home_port || "—"}`
              : `Akun nahkoda: ${userInfo.name} · Belum ada kapal terhubung`}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={openModal}
            className="inline-flex items-center gap-2 h-10 px-4.5 rounded-fco bg-fco-blue hover:bg-fco-blue-hover text-white text-sm font-semibold cursor-pointer transition-colors shadow-xs"
          >
            <Plus size={16} strokeWidth={2.2} aria-hidden="true" />
            Lapor tangkapan
          </button>
        </div>
      </div>

      <AlertBanner
        variant="success"
        message={toast || ""}
        onDismiss={() => setToast(null)}
      />

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <KpiCard
          label="Sisa kuota 2026"
          value={
            quota
              ? `${Number(quota.remaining_quota).toLocaleString("id-ID")} kg`
              : hasShip
                ? "—"
                : "0 kg"
          }
          delta={
            quota
              ? `${quota.quota_percentage}% dari kuota ${Number(quota.total_quota).toLocaleString("id-ID")} kg`
              : hasShip
                ? "Menunggu alokasi kuota"
                : "Belum ada kapal terhubung"
          }
          color="blue"
          Icon={BarChart3}
        />
        <KpiCard
          label="Tangkapan terlapor"
          value={formatWeight(totalWeightKg)}
          delta={
            reports.length > 0
              ? `${reports.length} laporan masuk ke sistem`
              : "Belum ada laporan tangkapan"
          }
          color="emerald"
          Icon={Fish}
        />
        <KpiCard
          label="PNBP terhitung"
          value={formatRupiah(totalPnbpSum, false)}
          delta="Berdasarkan tarif resmi KKP"
          color="purple"
          Icon={Coins}
        />
        <KpiCard
          label="Status kapal"
          value={
            hasShip
              ? ship!.active !== false
                ? "Aktif"
                : "Nonaktif"
              : "Belum Terhubung"
          }
          delta={
            hasShip
              ? `${ship!.gross_tonnage || 0} GT · SIPI berlaku`
              : "Hubungi pemilik untuk penugasan"
          }
          color="cyan"
          Icon={Ship}
        />
      </div>

      {/* Hero Quota & Blockchain Status */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4 items-stretch">
        <div className="lg:col-span-3">
          <QuotaHeroCard
            remainingKg={
              quota
                ? `${Number(quota.remaining_quota).toLocaleString("id-ID")} kg`
                : "0 kg"
            }
            totalKg={
              quota
                ? `${Number(quota.total_quota).toLocaleString("id-ID")} kg`
                : "0 kg"
            }
            percentage={quota ? quota.quota_percentage : 0}
            validUntil={quota ? "31 Des 2026" : "—"}
          />
        </div>
        <div className="lg:col-span-2">
          <section className="surface-card border rounded-xl p-6 shadow-xs flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="m-0 text-base font-bold text-strong">
                  Status blockchain
                </h2>
                <StatusChip
                  label={
                    blockchainStatus?.valid === false
                      ? "Peringatan"
                      : "Terverifikasi"
                  }
                  bg={blockchainStatus?.valid === false ? "#FFF1E0" : "#E8F0FE"}
                  color={
                    blockchainStatus?.valid === false ? "#B54708" : "#1A56DB"
                  }
                  icon={
                    <Check
                      size={14}
                      className="text-fco-blue"
                      strokeWidth={2.6}
                      aria-hidden="true"
                    />
                  }
                />
              </div>
              <p className="m-0 text-xs text-soft mb-4 leading-relaxed">
                {hasShip
                  ? `Semua laporan tangkapan ${ship!.name} disegel permanen ke buku besar blockchain terdistribusi.`
                  : "Semua laporan tangkapan kapal disegel permanen ke buku besar blockchain terdistribusi."}
              </p>
              <div className="flex flex-col divide-y divide-fco-border-subtle text-sm">
                <div className="flex justify-between py-2.5">
                  <span className="text-soft">Blok terakhir</span>
                  <span className="font-semibold tabular-nums">
                    {lastBlock ? `#${lastBlock.index}` : "—"}
                  </span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-soft">Hash verifikasi</span>
                  <span className="font-semibold tabular-nums text-fco-blue">
                    {formatShortHash(lastBlock?.hash, 4, 4)}
                  </span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-soft">Total laporan kapal</span>
                  <span className="font-semibold tabular-nums">
                    {reports.length} transaksi
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-fco-border-subtle flex items-center justify-between text-xs text-soft">
              <span>
                Integritas ledger: {blockchainStatus?.valid ? "100%" : "—"}
              </span>
              <Link
                to="/captain/catches"
                className="text-fco-blue hover:text-fco-blue-hover font-semibold no-underline"
              >
                Lihat riwayat
              </Link>
            </div>
          </section>
        </div>
      </div>

      {/* Recent Catches Table & Ship Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">
        <div className="lg:col-span-3">
          <RecentCatchesTable reports={reports} />
        </div>
        <div className="lg:col-span-2">
          <ShipSpecsCard specs={dynamicSpecs} />
        </div>
      </div>

      {/* Modal Lapor Tangkapan (Wizard) */}
      <CrudModal
        open={isModalOpen}
        title="Lapor tangkapan baru"
        subtitle="3 langkah: waktu & lokasi, hasil, cek."
        onClose={closeModal}
        hideFooter
      >
        <CatchReportWizard onSubmit={handleReportAdded} onCancel={closeModal} />
      </CrudModal>
    </div>
  );
}
