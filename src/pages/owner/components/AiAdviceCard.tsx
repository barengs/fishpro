import { useEffect, useState } from "react";
import { BarChart3, AlertCircle, UserCheck } from "lucide-react";
import { shipsService } from "../../../services/ships";
import { authService } from "../../../services/auth";

interface TipItem {
  title: string;
  text: string;
  Icon: typeof BarChart3;
}

const defaultTips: TipItem[] = [
  {
    title: "Kuota armada perlu dipantau",
    text: "Dengan laju tangkapan aktif, beberapa kapal mendekati ambang batas kuota tahunan.",
    Icon: BarChart3,
  },
  {
    title: "Tunjuk nahkoda untuk kapal tanpa awak",
    text: "Kapal belum bisa mengirim laporan tangkapan sah tanpa nahkoda berlisensi.",
    Icon: UserCheck,
  },
  {
    title: "Optimalisasi kuota berbasis AI",
    text: "Gunakan model prediksi NSGA-III untuk merencanakan alokasi musim penangkapan berikutnya.",
    Icon: AlertCircle,
  },
];

export function AiAdviceCard() {
  const [tips, setTips] = useState<TipItem[]>(defaultTips);

  const currentUser = authService.getStoredUser();
  const currentOwnerKey = `${currentUser?.id || ""}-${currentUser?.profile?.name || currentUser?.profile?.full_name || currentUser?.username || ""}`;

  useEffect(() => {
    let ignore = false;
    async function loadDynamicTips() {
      try {
        const user = authService.getStoredUser();
        const ships = await shipsService
          .getFleetForOwner(user)
          .catch(() => []);

        if (ignore) return;

        const generated: TipItem[] = [];

        // Check if any ship has low quota
        const lowQuotaShip = ships.find(
          (s) => (s.current_year_quota?.quota_percentage ?? 100) < 25,
        );
        if (lowQuotaShip) {
          generated.push({
            title: `Kuota ${lowQuotaShip.name} menipis (${lowQuotaShip.current_year_quota?.quota_percentage}%)`,
            text: "Dengan laju penangkapan saat ini, kuota diperkirakan habis dalam beberapa minggu.",
            Icon: BarChart3,
          });
        }

        // Check if any ship is missing a captain
        const unassignedShip = ships.find((s) => !s.captain);
        if (unassignedShip) {
          generated.push({
            title: `Tunjuk nahkoda untuk ${unassignedShip.name}`,
            text: "Kapal belum dapat mengirim laporan tangkapan resmi sebelum memiliki nahkoda berlisensi.",
            Icon: UserCheck,
          });
        }

        // Try getting AI recommendations for this owner's ships only
        const aiRec = await shipsService
          .getAiRecommendations()
          .catch(() => null);
        const ownerShipRegs = new Set(
          ships.map((s) => s.registration_number.toLowerCase().trim()),
        );

        const ownerTopShip = aiRec?.top_ships?.find((top) =>
          ownerShipRegs.has(top.registration_number.toLowerCase().trim()),
        );

        if (ownerTopShip) {
          generated.push({
            title: `Efisiensi terbaik: ${ownerTopShip.name}`,
            text: `Rekomendasi bulan tangkapan optimal: ${ownerTopShip.best_fishing_months.slice(0, 3).join(", ")}.`,
            Icon: AlertCircle,
          });
        } else if (ships.length > 0) {
          generated.push({
            title: "Pengaturan kuota armada",
            text: "Hubungi regulator pelabuhan untuk menetapkan alokasi kuota resmi bagi armada Anda.",
            Icon: AlertCircle,
          });
        } else {
          generated.push({
            title: "Daftarkan kapal armada Anda",
            text: "Tambahkan kapal baru melalui menu Armada Kapal untuk memulai pemantauan kuota dan operasi.",
            Icon: AlertCircle,
          });
        }

        if (generated.length > 0 && !ignore) {
          setTips(generated.slice(0, 3));
        }
      } catch {
        // Fallback to default
      }
    }

    loadDynamicTips();

    return () => {
      ignore = true;
    };
  }, [currentOwnerKey]);

  return (
    <section className="surface-card border rounded-xs p-5 shadow-2xs">
      <h2 className="mt-0 mb-3 text-base font-bold text-strong">
        Rekomendasi & Wawasan AI
      </h2>
      <div className="flex flex-col gap-3">
        {tips.map((t) => (
          <div key={t.title} className="flex gap-2.5">
            <div className="w-7 h-7 rounded-xs bg-fco-blue-light dark:bg-fco-blue/20 flex items-center justify-center shrink-0">
              <t.Icon
                size={15}
                className="text-fco-blue"
                strokeWidth={2}
                aria-hidden="true"
              />
            </div>
            <div>
              <div className="text-xs font-bold mb-0.5 text-strong">
                {t.title}
              </div>
              <div className="text-2xs leading-relaxed text-soft">
                {t.text}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
