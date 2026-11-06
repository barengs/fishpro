import type { ReactNode } from "react";

interface StatusChipProps {
  label: string;
  bg?: string;
  color?: string;
  icon?: ReactNode;
  className?: string;
  size?: "sm" | "md";
}

const statusColorMap: Record<string, string> = {
  // Emerald / Green (Paid, Aktif, Aman, Terverifikasi)
  aktif: "bg-emerald-600 text-white",
  aman: "bg-emerald-600 text-white",
  paid: "bg-emerald-600 text-white",
  tercatat: "bg-emerald-600 text-white",
  "tercatat resmi": "bg-emerald-600 text-white",
  "tersimpan resmi": "bg-emerald-600 text-white",
  terverifikasi: "bg-emerald-600 text-white",
  online: "bg-emerald-600 text-white",
  lolos: "bg-emerald-600 text-white",
  sukses: "bg-emerald-600 text-white",

  // Crimson / Red (Pending, Nonaktif, Kritis, Bahaya)
  pending: "bg-rose-500 text-white",
  nonaktif: "bg-rose-500 text-white",
  kritis: "bg-rose-500 text-white",
  bahaya: "bg-rose-500 text-white",
  offline: "bg-rose-500 text-white",
  gagal: "bg-rose-500 text-white",
  ditolak: "bg-rose-500 text-white",
  error: "bg-rose-500 text-white",

  // Amber / Golden (Active, Menunggu, Warning)
  active: "bg-amber-500 text-white",
  menunggu: "bg-amber-500 text-white",
  "menunggu input": "bg-amber-500 text-white",
  "tanpa nahkoda": "bg-amber-500 text-white",
  waspada: "bg-amber-500 text-white",
  peringatan: "bg-amber-500 text-white",
  proses: "bg-amber-500 text-white",

  // Cyan / Sky (Paused, Dilewati, Draft)
  paused: "bg-sky-500 text-white",
  dilewati: "bg-sky-500 text-white",
  sinkron: "bg-sky-500 text-white",
  draft: "bg-sky-500 text-white",

  // Blue (Closed, Selesai, Terkirim)
  closed: "bg-blue-600 text-white",
  selesai: "bg-blue-600 text-white",
  terkirim: "bg-blue-600 text-white",

  // Slate / Neutral (Belum Diatur)
  "belum diatur": "bg-slate-500 text-white",
};

export function StatusChip({
  label,
  bg,
  color,
  icon,
  className = "",
  size = "md",
}: StatusChipProps) {
  const norm = (label || "").trim().toLowerCase();
  const mappedCls = statusColorMap[norm];

  const colorClass = mappedCls || (bg ? "" : "bg-slate-500 text-white");
  const inlineStyle = !mappedCls && bg ? { backgroundColor: bg, color: color || "#ffffff" } : undefined;

  const sizeClass =
    size === "sm"
      ? "h-6 px-2.5 text-[11px] min-w-[64px]"
      : "h-7 px-3.5 text-xs min-w-[76px]";

  return (
    <span
      className={`inline-flex items-center justify-center gap-1.5 rounded-md font-bold text-center whitespace-nowrap shadow-2xs select-none transition-all ${sizeClass} ${colorClass} ${className}`}
      style={inlineStyle}
    >
      {icon}
      <span>{label}</span>
    </span>
  );
}
