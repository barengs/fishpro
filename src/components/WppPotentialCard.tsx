import { useEffect, useState } from "react";
import {
  Compass,
  Sparkles,
  TrendingUp,
  MapPin,
  Calendar,
  Fish,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  X,
  Send,
} from "lucide-react";
import { dashboardService } from "../services/dashboard";
import type { WppPotentialItem } from "../services/dashboard/types";
import { StatusChip } from "./StatusChip";

interface WppPotentialCardProps {
  initialRankings?: WppPotentialItem[];
  role?: "owner" | "captain" | "admin" | "regulator";
  shipName?: string;
  shipReg?: string;
  currentWpp?: string;
}

export function WppPotentialCard({
  initialRankings,
  role = "owner",
  shipName,
  shipReg,
  currentWpp = "WPP 712",
}: WppPotentialCardProps) {
  const [rankings, setRankings] = useState<WppPotentialItem[]>(
    initialRankings || [],
  );
  const [loading, setLoading] = useState(!initialRankings?.length);
  const [selectedRelocation, setSelectedRelocation] =
    useState<WppPotentialItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialRankings && initialRankings.length > 0) {
      return;
    }

    let ignore = false;
    async function loadRankings() {
      setLoading(true);
      try {
        const res = await dashboardService.getWppPotentialForecast();
        if (!ignore && res && res.rankings) {
          setRankings(res.rankings);
        }
      } catch {
        if (!ignore) {
          setRankings([]);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadRankings();
    return () => {
      ignore = true;
    };
  }, [initialRankings]);

  const topWpp = rankings[0];

  const handleOpenRelocation = (wpp: WppPotentialItem) => {
    setSelectedRelocation(wpp);
    setSuccessMsg(null);
  };

  const handleConfirmRelocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRelocation) return;
    setSubmitting(true);
    try {
      // Simulate submission of WPP relocation request to regulator
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSuccessMsg(
        `Permohonan mutasi kapal ke WPP ${selectedRelocation.wpp_code} (${selectedRelocation.ocean}) berhasil diajukan! Menunggu verifikasi regulator KKP.`,
      );
      setTimeout(() => {
        setSelectedRelocation(null);
        setSuccessMsg(null);
      }, 2500);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !rankings.length) {
    return (
      <div className="surface-card border rounded-2xl p-6 shadow-2xs animate-pulse">
        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-4" />
        <div className="h-28 bg-slate-100 dark:bg-slate-800 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="surface-card border border-slate-200/90 dark:border-fco-border-dark rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-400 text-white flex items-center justify-center shadow-xs shrink-0">
            <Compass size={22} className="stroke-[2.2]" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="m-0 text-base font-extrabold text-strong tracking-tight">
                Prediksi Potensi Zona Penangkapan (WPP)
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Sparkles size={11} aria-hidden="true" />
                AI Real-time
              </span>
            </div>
            <p className="m-0 text-xs text-soft mt-0.5">
              Analisis kepadatan biomassa musiman dan rekomendasi kuota perairan
              terbesar untuk kapal Anda.
            </p>
          </div>
        </div>
      </div>

      {/* Top 1 Hotspot Spotlight Card */}
      {topWpp && topWpp.score > 0 ? (
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 text-white p-4 sm:p-5 shadow-sm border border-blue-700/40">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 text-xs font-black tracking-wide uppercase shadow-2xs">
                  ★ Rekomendasi Teratas
                </span>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-200 border border-blue-400/30">
                  WPP {topWpp.wpp_code}
                </span>
                <span className="text-xs text-blue-200/90 font-medium truncate">
                  {topWpp.wpp_name} ({topWpp.ocean})
                </span>
              </div>

              <h3 className="m-0 text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>Skor Potensi Tangkapan:</span>
                <span className="text-emerald-400 font-mono">
                  {topWpp.score}%
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  {topWpp.level}
                </span>
              </h3>

              <p className="m-0 text-xs text-blue-100/80 mt-1.5 leading-relaxed line-clamp-2">
                {topWpp.recommendation_reason}
              </p>

              {/* Badges / Metrics detail */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 pt-3 border-t border-blue-800/40 text-xs">
                <div className="flex items-center gap-2 text-blue-100">
                  <Fish size={14} className="text-amber-300 shrink-0" />
                  <span className="truncate" title={topWpp.dominant_species}>
                    {topWpp.dominant_species}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-blue-100">
                  <Calendar size={14} className="text-sky-300 shrink-0" />
                  <span>Bulan Puncak: {topWpp.peak_months}</span>
                </div>
                <div className="flex items-center gap-2 text-blue-100">
                  <TrendingUp size={14} className="text-emerald-300 shrink-0" />
                  <span>~{topWpp.estimated_monthly_tonnage} Ton / bln</span>
                </div>
              </div>
            </div>

            {/* Quick Action Button */}
            {(role === "owner" || role === "captain") && (
              <div className="shrink-0 flex items-center">
                <button
                  type="button"
                  onClick={() => handleOpenRelocation(topWpp)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs tracking-wide uppercase transition-all shadow-md active:scale-95 cursor-pointer border-none"
                >
                  <span>Ajukan Pindah WPP</span>
                  <ArrowRight size={14} strokeWidth={2.6} />
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 text-xs text-soft">
          Belum ada akumulasi data tangkapan di database untuk memunculkan rekomendasi zona unggulan.
        </div>
      )}

      {/* Ranked List of Top 5 WPP Hotspots */}
      <div>
        <h4 className="m-0 mb-2.5 text-xs font-bold text-soft uppercase tracking-wider">
          Peringkat 5 Zona WPP Potensi Terbesar Saat Ini
        </h4>

        <div className="border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {rankings.slice(0, 5).map((w, idx) => (
            <div
              key={w.wpp_code}
              className="p-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 font-mono font-bold text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
                  #{idx + 1}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-strong text-sm">
                      WPP {w.wpp_code}
                    </span>
                    <span className="text-soft font-medium truncate">
                      · {w.ocean}
                    </span>
                  </div>
                  <div className="text-[11px] text-soft flex flex-wrap items-center gap-2 mt-0.5">
                    <span>Target: {w.dominant_species}</span>
                    <span>·</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      Musim Puncak: {w.peak_months}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                <div className="text-right">
                  <div className="font-mono font-extrabold text-strong text-sm">
                    {w.score}%
                  </div>
                  <div className="text-[10px] text-soft">
                    Kuota: {w.quota_utilization_pct}% terpakai
                  </div>
                </div>

                <StatusChip
                  label={w.level}
                  size="sm"
                  className={
                    w.level === "Sangat Tinggi"
                      ? "bg-emerald-600 text-white"
                      : w.level === "Tinggi"
                        ? "bg-blue-600 text-white"
                        : "bg-amber-500 text-white"
                  }
                />

                {(role === "owner" || role === "captain") && (
                  <button
                    type="button"
                    onClick={() => handleOpenRelocation(w)}
                    className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200/80 dark:border-slate-700 cursor-pointer"
                  >
                    Pilih
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Relocation Request Modal */}
      {selectedRelocation && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="surface-card border border-slate-200 dark:border-fco-border-dark rounded-2xl w-full max-w-md p-5 sm:p-6 shadow-xl relative">
            <button
              type="button"
              onClick={() => setSelectedRelocation(null)}
              className="absolute top-4 right-4 text-soft hover:text-strong p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border-none bg-transparent cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-fco-blue flex items-center justify-center shrink-0">
                <MapPin size={18} />
              </div>
              <div>
                <h3 className="m-0 text-base font-bold text-strong">
                  Permohonan Mutasi WPP
                </h3>
                <p className="m-0 text-xs text-soft">
                  Ajukan perpindahan zona tangkapan ke regulator KKP.
                </p>
              </div>
            </div>

            {successMsg ? (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-3">
                <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleConfirmRelocation} className="flex flex-col gap-3.5">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 text-xs flex flex-col gap-1.5">
                  <div className="flex justify-between">
                    <span className="text-soft">Kapal:</span>
                    <span className="font-bold text-strong">
                      {shipName || "Armada Utama"} ({shipReg || "REG-AKTIF"})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-soft">WPP Asal Saat Ini:</span>
                    <span className="font-semibold text-strong">{currentWpp}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200/60 dark:border-slate-700/60 pt-1.5">
                    <span className="text-soft">WPP Tujuan Rekomendasi:</span>
                    <span className="font-extrabold text-fco-blue">
                      WPP {selectedRelocation.wpp_code} ({selectedRelocation.ocean})
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-strong mb-1">
                    Alasan Pengajuan Pemindahan:
                  </label>
                  <textarea
                    rows={2}
                    defaultValue={`Mengoptimalkan tangkapan mengikuti musim puncak biomassa di WPP ${selectedRelocation.wpp_code} (Potensi AI: ${selectedRelocation.score}%).`}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-strong focus:outline-hidden focus:ring-1 focus:ring-fco-blue"
                  />
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/50 text-[11px] text-amber-800 dark:text-amber-300">
                  <ShieldAlert size={14} className="shrink-0" />
                  <span>
                    Permohonan akan diverifikasi oleh regulator pelabuhan sesuai
                    kuota daya dukung WPP tujuan.
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRelocation(null)}
                    className="px-3.5 py-2 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 text-soft hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer bg-transparent"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-fco-blue hover:bg-fco-blue-hover text-white cursor-pointer border-none shadow-xs disabled:opacity-50"
                  >
                    <Send size={13} />
                    <span>{submitting ? "Mengirim..." : "Kirim Permohonan"}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
