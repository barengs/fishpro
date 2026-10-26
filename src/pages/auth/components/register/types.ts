import { Anchor, ShieldCheck, Ship } from "lucide-react";

export type Role = "owner" | "captain" | "regulator";

export const roleCards: {
  key: Role;
  title: string;
  desc: string;
  Icon: typeof Ship;
  card: string;
  iconBox: string;
}[] = [
  {
    key: "owner",
    title: "Pemilik Kapal",
    desc: "Armada, kuota & PNBP",
    Icon: Ship,
    card: "bg-fco-blue hover:bg-fco-blue-hover",
    iconBox: "bg-white/20",
  },
  {
    key: "captain",
    title: "Nahkoda",
    desc: "Lapor tangkapan",
    Icon: Anchor,
    card: "bg-emerald-600 hover:bg-emerald-700",
    iconBox: "bg-white/20",
  },
  {
    key: "regulator",
    title: "Pengawas",
    desc: "Audit & verifikasi",
    Icon: ShieldCheck,
    card: "bg-amber-500 hover:bg-amber-600",
    iconBox: "bg-white/20",
  },
];

export const roleLabel: Record<Role, string> = {
  owner: "Pemilik Kapal",
  captain: "Nahkoda",
  regulator: "Pengawas",
};
