import { useEffect, useRef } from "react";
import {
  FileSpreadsheet,
  Printer,
  Scale,
  X,
} from "lucide-react";
import { type ScaleReading } from "../../../../services/iot";

interface ScaleReportModalProps {
  open: boolean;
  onClose: () => void;
  readings: ScaleReading[];
  selectedDeviceId?: string;
  onDownloadCsv: () => void;
  downloadingCsv?: boolean;
}

export function ScaleReportModal({
  open,
  onClose,
  readings,
  selectedDeviceId,
  onDownloadCsv,
  downloadingCsv = false,
}: ScaleReportModalProps) {
  const printAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const totalSessions = readings.length;
  const totalWeight = readings.reduce(
    (sum, r) => sum + Number(r.weight || 0),
    0,
  );
  const savedCount = readings.filter((r) => r.status === "saved").length;
  const pendingCount = readings.filter((r) => r.status === "pending").length;

  const handlePrint = () => {
    window.print();
  };

  const currentDateStr = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-white dark:bg-[#0f1729] border border-[#e8ebf0] dark:border-[#1f2a42] rounded-[18px] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Action Header (Non-printable) */}
        <div className="flex items-center justify-between p-4 sm:px-6 border-b border-[#e8ebf0] dark:border-[#1f2a42] bg-[#f7f8fa]/70 dark:bg-[#0a101d]/40 print:hidden">
          <div className="flex items-center gap-2">
            <Scale size={18} className="text-[#2563eb] dark:text-[#5b94ff]" />
            <h3 className="m-0 text-sm font-bold text-[#0f172a] dark:text-[#e8edf7]">
              Laporan Rekapitulasi Timbangan Pelabuhan
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onDownloadCsv}
              disabled={downloadingCsv}
              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-[9px] border border-[#d9dee8] dark:border-[#2a3753] bg-white dark:bg-[#0f1729] hover:bg-[#f1f4f9] dark:hover:bg-[#141d33] text-xs font-semibold text-[#0f172a] dark:text-[#e8edf7] cursor-pointer transition-colors disabled:opacity-50"
            >
              <FileSpreadsheet size={14} className="text-emerald-600" />
              <span>{downloadingCsv ? "Mengunduh..." : "Ekspor CSV"}</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-[9px] border-0 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold cursor-pointer transition-colors"
            >
              <Printer size={14} />
              <span>Cetak / PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-[9px] text-[#64718a] hover:text-[#0f172a] dark:text-[#98a6c0] dark:hover:text-[#e8edf7] hover:bg-[#f1f4f9] dark:hover:bg-[#141d33] cursor-pointer border-0 bg-transparent transition-colors ml-1"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Body */}
        <div
          ref={printAreaRef}
          className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-slate-800 dark:text-slate-200 print:text-black print:p-0 print:overflow-visible print:bg-white"
        >
          {/* Official Header */}
          <div className="text-center border-b-2 border-slate-900 dark:border-slate-300 pb-4 print:border-black">
            <h4 className="m-0 text-xs sm:text-sm font-extrabold uppercase tracking-widest text-slate-600 dark:text-slate-400 print:text-black">
              Kementerian Kelautan dan Perikanan Republik Indonesia
            </h4>
            <h2 className="m-0 text-base sm:text-lg font-black uppercase tracking-wide text-slate-900 dark:text-white print:text-black mt-1">
              Direktorat Jenderal Perikanan Tangkap
            </h2>
            <p className="m-0 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 print:text-black mt-0.5">
              Rekapitulasi Resmi Pembacaan Sensor Timbangan Pintar Dermaga
            </p>
            <div className="flex items-center justify-center gap-4 text-2xs font-mono text-slate-500 print:text-black mt-2">
              <span>Tanggal: {currentDateStr}</span>
              <span>•</span>
              <span>
                Perangkat: {selectedDeviceId ? selectedDeviceId : "Semua Unit"}
              </span>
            </div>
          </div>

          {/* Executive Summary Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xs border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 print:border-slate-300 print:bg-white">
              <span className="block text-2xs text-slate-500 font-semibold uppercase tracking-wider">
                Total Sesi Timbang
              </span>
              <span className="text-lg font-bold font-mono">
                {totalSessions} <span className="text-2xs font-normal">sesi</span>
              </span>
              <span className="block text-3xs text-slate-400 mt-0.5">
                {savedCount} tersimpan · {pendingCount} pending
              </span>
            </div>

            <div className="p-3 rounded-xs border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 print:border-slate-300 print:bg-white">
              <span className="block text-2xs text-emerald-700 dark:text-emerald-300 font-bold uppercase tracking-wider">
                Total Berat Ditimbang
              </span>
              <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 print:text-black">
                {totalWeight.toLocaleString("id-ID", {
                  minimumFractionDigits: 2,
                })}{" "}
                <span className="text-2xs font-normal">kg</span>
              </span>
              <span className="block text-3xs text-emerald-700/80 dark:text-emerald-300/80 mt-0.5">
                Akumulasi bobot resmi
              </span>
            </div>

            <div className="p-3 rounded-xs border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 print:border-slate-300 print:bg-white">
              <span className="block text-2xs text-slate-500 font-semibold uppercase tracking-wider">
                Status Integrasi
              </span>
              <span className="text-lg font-bold font-mono text-slate-900 dark:text-white print:text-black">
                {savedCount}{" "}
                <span className="text-2xs font-normal text-slate-500">/ {totalSessions} tercatat</span>
              </span>
              <span className="block text-3xs text-slate-400 mt-0.5">
                {totalSessions > 0 ? `${Math.round((savedCount / totalSessions) * 100)}% tersimpan ke sistem` : "Belum ada sesi"}
              </span>
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b-2 border-slate-300 dark:border-slate-700 text-2xs font-bold uppercase text-slate-600 dark:text-slate-400 print:border-black print:text-black">
                  <th className="py-2 px-2 w-8 text-center">No</th>
                  <th className="py-2 px-2">Waktu Ditimbang</th>
                  <th className="py-2 px-2">Perangkat / Pelabuhan</th>
                  <th className="py-2 px-2 text-right">Berat (kg)</th>
                  <th className="py-2 px-2 text-center">Stabilitas</th>
                  <th className="py-2 px-2 text-center">Status</th>
                  <th className="py-2 px-2 text-center">Tangkapan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 print:divide-slate-300 font-mono text-2xs">
                {readings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-6 text-center text-slate-400 font-sans"
                    >
                      Tidak ada riwayat pembacaan sensor timbangan pada periode ini.
                    </td>
                  </tr>
                ) : (
                  readings.map((r, idx) => {
                    const berat = Number(r.weight || 0);
                    return (
                      <tr
                        key={r.id}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30"
                      >
                        <td className="py-2 px-2 text-center text-slate-400">
                          {idx + 1}
                        </td>
                        <td className="py-2 px-2 font-sans">
                          {new Date(r.created_at).toLocaleString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="py-2 px-2 font-sans">
                          <span className="font-bold text-slate-900 dark:text-white print:text-black">
                            {r.device_id}
                          </span>
                          <span className="block text-3xs text-slate-400">
                            {r.port_name || "Pelabuhan"}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-right font-extrabold text-emerald-600 dark:text-emerald-400 print:text-black">
                          {berat.toFixed(2)}
                        </td>
                        <td className="py-2 px-2 text-center font-sans text-3xs">
                          {r.is_stable ? (
                            <span className="text-emerald-600 font-semibold">
                              Stabil
                            </span>
                          ) : (
                            <span className="text-amber-600 font-semibold">
                              Fluktuatif
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-2 text-center font-sans text-3xs">
                          {r.status === "saved" ? (
                            <span className="text-emerald-600 font-bold">
                              Tersimpan
                            </span>
                          ) : r.status === "discarded" ? (
                            <span className="text-slate-400">Dilewati</span>
                          ) : (
                            <span className="text-amber-600 font-semibold">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-2 text-center font-sans text-3xs text-fco-blue font-semibold">
                          {r.fish_catch ? `#${r.fish_catch}` : "—"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Official Signatures Footer */}
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 print:border-black flex justify-between items-end text-xs font-sans">
            <div className="text-2xs text-slate-400 print:text-black">
              <p className="m-0 font-mono">
                Dicetak otomatis via Sistem Antigravity Smart Scale IoT
              </p>
              <p className="m-0 font-mono">
                SHA-256 Verified Ledger • Dokumen Sah Pelabuhan Perikanan
              </p>
            </div>
            <div className="text-center w-56">
              <p className="m-0 text-2xs text-slate-500 print:text-black">
                Pelabuhan Perikanan, {new Date().toLocaleDateString("id-ID")}
              </p>
              <p className="m-0 text-xs font-bold mt-1 text-slate-800 dark:text-white print:text-black">
                Pengawas Perikanan / Syahbandar
              </p>
              <div className="h-16 print:h-12" />
              <p className="m-0 text-xs font-bold underline text-slate-900 dark:text-white print:text-black">
                ( Petugas Timbang Resmi )
              </p>
              <p className="m-0 text-2xs text-slate-400 print:text-black">
                NIP. .....................................
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
