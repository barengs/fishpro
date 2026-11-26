import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, Check, Coins, Scale, Ship } from "lucide-react";
import { KpiCard } from "../../components/KpiCard";
import { StatusChip } from "../../components/StatusChip";
import { AlertBanner } from "../../components/ui";
import { QuotaHeroCard } from "./components/QuotaHeroCard";
import { ShipSpecsCard } from "./components/ShipSpecsCard";
import { RecentCatchesTable } from "./components/RecentCatchesTable";
import { WppPotentialCard } from "../../components/WppPotentialCard";
import { formatRupiah } from "../../utils";
import { useCaptainDashboard } from "./hooks/useCaptainDashboard";

export function CaptainDashboard() {
  const {
    reports,
    ship,
    hasShip,
    quota,
    toast,
    setToast,
    userInfo,
    dynamicSpecs,
    totalPnbpSum,
  } = useCaptainDashboard();

  return (
    <div>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="m-0 text-[22px] sm:text-[26px] font-bold tracking-tight text-ink dark:text-white">
          Ringkasan Nahkoda
        </h1>
        <p className="text-[13px] text-subtext dark:text-slate-400 mt-1">
          {hasShip
            ? `${ship!.name} · ${ship!.registration_number} · ${
                ship!.home_port
                  ? ship!.home_port.toLowerCase().startsWith("pelabuhan")
                    ? ship!.home_port
                    : `Pelabuhan ${ship!.home_port}`
                  : "Pelabuhan belum tercatat"
              }`
            : `Akun nahkoda: ${userInfo.name} · Belum ada kapal terhubung`}
        </p>
      </div>

      <AlertBanner
        variant="success"
        message={toast || ""}
        onDismiss={() => setToast(null)}
      />

      {/* 3 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
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
              ? `${quota.quota_percentage}% tersisa dari kuota ${Number(quota.total_quota).toLocaleString("id-ID")} kg`
              : hasShip
                ? "Menunggu alokasi kuota"
                : "Belum ada kapal terhubung"
          }
          color="blue"
          Icon={BarChart3}
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
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-5 items-stretch">
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
            usedKg={
              quota
                ? `${Number(quota.used_quota).toLocaleString("id-ID")} kg`
                : undefined
            }
            percentage={quota ? quota.quota_percentage : 0}
            validUntil={quota ? "31 Des 2026" : "—"}
          />
        </div>
        <div className="lg:col-span-2">
          <section className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-subtle flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#F9FAFB] dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 flex items-center justify-center text-charcoal dark:text-slate-300">
                    <Scale size={14} />
                  </div>
                  <h2 className="m-0 text-[15px] font-bold text-ink dark:text-white">
                    Timbangan Dermaga Terakhir
                  </h2>
                </div>
                <StatusChip
                  label="Tersegel Resmi"
                  bg="#ECFDF5"
                  color="#059669"
                  icon={
                    <Check
                      size={14}
                      className="text-emerald-600"
                      strokeWidth={2.6}
                      aria-hidden="true"
                    />
                  }
                />
              </div>

              <p className="m-0 text-xs text-subtext dark:text-slate-400 mb-4 leading-relaxed">
                {hasShip
                  ? `Catatan penimbangan resmi hasil bongkar muat kapal ${ship!.name} di dermaga pelabuhan.`
                  : "Catatan penimbangan resmi hasil bongkar muat kapal di dermaga pelabuhan."}
              </p>

              {reports.length > 0 ? (
                <div className="flex flex-col divide-y divide-[#E5E7EB] dark:divide-slate-800 text-sm">
                  <div className="flex justify-between items-center py-2.5">
                    <span className="text-subtext dark:text-slate-400 text-xs">Waktu Ditimbang</span>
                    <span className="font-medium tabular-nums text-ink dark:text-white">
                      {reports[0].date}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2.5">
                    <span className="text-subtext dark:text-slate-400 text-xs">Komoditas / Ikan</span>
                    <span className="font-semibold text-ink dark:text-white">
                      {reports[0].species}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2.5">
                    <span className="text-subtext dark:text-slate-400 text-xs">Berat Ditimbang</span>
                    <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                      {reports[0].qty}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2.5">
                    <span className="text-subtext dark:text-slate-400 text-xs">Pungutan PNBP</span>
                    <span className="font-mono font-medium text-brand-600 dark:text-brand-400">
                      {reports[0].pnbp}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[#F9FAFB] dark:bg-slate-800/60 border border-[#E5E7EB] dark:border-slate-800 text-center text-xs text-subtext dark:text-slate-400 my-2">
                  Belum ada riwayat penimbangan di dermaga. Data akan otomatis tercatat saat kapal membongkar muatan.
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-[#E5E7EB] dark:border-slate-800 flex items-center justify-between text-xs text-subtext dark:text-slate-400">
              <span>Total: {reports.length} sesi timbang tercatat</span>
              <Link
                to="/captain/catches"
                className="text-brand-600 hover:text-brand-700 dark:text-brand-400 font-semibold no-underline inline-flex items-center gap-1"
              >
                <span>Lihat semua</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </section>
        </div>
      </div>

      {/* AI WPP Potential Forecast */}
      <div className="mb-5">
        <WppPotentialCard
          role="captain"
          shipName={ship?.name}
          shipReg={ship?.registration_number}
        />
      </div>

      {/* Recent Catches Table & Ship Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-stretch">
        <div className="lg:col-span-3">
          <RecentCatchesTable reports={reports} />
        </div>
        <div className="lg:col-span-2">
          <ShipSpecsCard specs={dynamicSpecs} shipName={ship?.name} />
        </div>
      </div>
    </div>
  );
}
